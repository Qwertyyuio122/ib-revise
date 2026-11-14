import katex from 'katex';
import 'katex/contrib/mhchem';
import {
  QuestionItemSchema,
  type MathDiagramSpec,
  type QuestionItem,
} from '../../src/content/schemas';
import { evaluateMathExpr } from '../../src/lib/math-eval';
import { SUBJECT_QUOTAS } from './blueprints';

export interface ValidationFailure {
  id: string;
  reason: string;
}

const CHEM_FORBIDDEN_RE =
  /chem-ref-ir-nmr|1H\s*NMR|IR\s*&\s*NMR|Al\s*<\s*Mg|S\s*<\s*P|H_f\^|H_c\^|\bEntropy\b|\bGibbs\b|\bBorn-Haber\b|\bLigand field\b/i;
const CHEM_LEGACY_STP_RE = /22\.4\s*(?:\\text\{\s*)?(?:dm|L\b)/i;
const MATH_HL_FORBIDDEN_RE =
  /\bAHL\b|L'H[oô]pital|\bMaclaurin\b|\bDe Moivre\b|\bArgand\b|\bBayes'\s*theorem\b|\bVoronoi\b|\bMarkov\b|\bcross product\b|\bintegration by parts\b|\bpartial fractions\b/i;

function collectAllStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') {
    out.push(value);
  } else if (Array.isArray(value)) {
    for (const item of value) collectAllStrings(item, out);
  } else if (value && typeof value === 'object') {
    for (const v of Object.values(value)) collectAllStrings(v, out);
  }
  return out;
}

export function validateKaTeXAndControls(text: string): string | null {
  if (/[\t\b\f\r\v]/.test(text)) {
    return 'Contains raw control character';
  }
  let i = 0;
  while (i < text.length) {
    if (text[i] === '$' && text[i + 1] === '$' && text[i - 1] !== '\\') {
      const close = text.indexOf('$$', i + 2);
      if (close <= i + 1) return 'Unclosed $$ delimiter';
      const expr = text.slice(i + 2, close);
      try {
        katex.renderToString(expr, {
          displayMode: true,
          throwOnError: true,
          strict: false,
        });
      } catch (err) {
        return `Invalid display KaTeX: ${err instanceof Error ? err.message : String(err)}`;
      }
      i = close + 2;
      continue;
    }
    if (text[i] === '\\' && text[i + 1] === '$') {
      i += 2;
      continue;
    }
    if (text[i] === '$' && text[i + 1] !== '$') {
      let close = -1;
      for (let j = i + 1; j < text.length; j++) {
        if (text[j] === '\n') break;
        if (text[j] === '$' && text[j - 1] !== '\\' && text[j + 1] !== '$') {
          close = j;
          break;
        }
      }
      if (close <= i) return 'Unclosed $ delimiter';
      const expr = text.slice(i + 1, close);
      try {
        katex.renderToString(expr, {
          displayMode: false,
          throwOnError: true,
          strict: false,
        });
      } catch (err) {
        return `Invalid inline KaTeX: ${err instanceof Error ? err.message : String(err)}`;
      }
      i = close + 1;
      continue;
    }
    i++;
  }
  return null;
}

export function validateDiagramGeometry(spec: MathDiagramSpec): string | null {
  if (spec.kind === 'function_graph') {
    const [xMin, xMax] = spec.xRange;
    const [yMin, yMax] = spec.yRange;
    if (xMin >= xMax || yMin >= yMax) {
      return 'Invalid graph axis range';
    }
    const midX = (xMin + xMax) / 2;
    for (const fn of spec.functions) {
      try {
        // Test evaluation across domain samples (avoid single-point pole issues)
        let finiteCount = 0;
        for (let k = 0; k <= 6; k++) {
          const sampleX = xMin + ((xMax - xMin) * (k + 0.37)) / 7;
          const v = evaluateMathExpr(fn.expr, sampleX);
          if (Number.isFinite(v)) finiteCount++;
        }
        if (finiteCount === 0 && !Number.isFinite(evaluateMathExpr(fn.expr, midX))) {
          return `Function expression "${fn.expr}" produced no finite values on [${xMin}, ${xMax}]`;
        }
      } catch (err) {
        return `Invalid function expr "${fn.expr}": ${err instanceof Error ? err.message : String(err)}`;
      }
    }
  } else if (spec.kind === 'geometry_figure') {
    const ids = new Set(spec.vertices.map((v) => v.id));
    for (const seg of spec.segments) {
      if (!ids.has(seg.from) || !ids.has(seg.to)) {
        return `Segment references unknown vertex (${seg.from} -> ${seg.to})`;
      }
    }
    for (const arc of spec.angleArcs ?? []) {
      if (!ids.has(arc.vertex) || !ids.has(arc.armA) || !ids.has(arc.armB)) {
        return 'Angle arc references unknown vertex';
      }
    }
    for (const ra of spec.rightAngles ?? []) {
      if (!ids.has(ra.vertex) || !ids.has(ra.armA) || !ids.has(ra.armB)) {
        return 'Right angle references unknown vertex';
      }
    }
  } else if (spec.kind === 'stats_plot' && spec.subtype === 'box_plot' && spec.boxSummary) {
    const b = spec.boxSummary;
    if (!(b.min <= b.q1 && b.q1 <= b.median && b.median <= b.q3 && b.q3 <= b.max)) {
      return 'Box plot quartiles violate min <= q1 <= median <= q3 <= max';
    }
  }
  return null;
}

export function normalizeQuestionFingerprint(q: QuestionItem): string {
  const normStem = q.stemMarkdown
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
  const normStim = (q.stimulusMarkdown ?? '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120);
  return `${q.subjectSlug}|${q.topicId}|${normStem}|${normStim}`;
}

export function validateGeneratedQuestion(
  raw: unknown
): { ok: true; data: QuestionItem } | { ok: false; reason: string } {
  const parsed = QuestionItemSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      reason: parsed.error.issues[0]?.message ?? 'Schema validation failed',
    };
  }
  const q = parsed.data;

  const validTopics = SUBJECT_QUOTAS[q.subjectSlug]?.topicIds;
  if (!validTopics || !validTopics.includes(q.topicId)) {
    return {
      ok: false,
      reason: `TopicId "${q.topicId}" is invalid for subject "${q.subjectSlug}"`,
    };
  }

  if (q.questionType === 'mcq' && q.options) {
    const distinct = new Set(
      q.options.map((o) => o.text.trim().toLowerCase().replace(/\s+/g, ' '))
    );
    if (distinct.size !== 4) {
      return { ok: false, reason: 'MCQ options must all be distinct' };
    }
  }

  if (q.diagramSpec) {
    const diagErr = validateDiagramGeometry(q.diagramSpec);
    if (diagErr) {
      return { ok: false, reason: diagErr };
    }
  }

  const allStrings = collectAllStrings(q);
  for (const text of allStrings) {
    const kErr = validateKaTeXAndControls(text);
    if (kErr) {
      return { ok: false, reason: kErr };
    }
  }

  const joined = allStrings.join('\n');
  if (q.subjectSlug === 'chem') {
    if (CHEM_FORBIDDEN_RE.test(joined) || CHEM_LEGACY_STP_RE.test(joined)) {
      return {
        ok: false,
        reason: 'Chemistry SL syllabus quarantine violation (HL topic or 22.4 STP)',
      };
    }
  } else if (q.subjectSlug === 'math') {
    if (MATH_HL_FORBIDDEN_RE.test(joined)) {
      return {
        ok: false,
        reason: 'Math AA SL syllabus quarantine violation (AHL/AI topic)',
      };
    }
  }

  return { ok: true, data: q };
}
