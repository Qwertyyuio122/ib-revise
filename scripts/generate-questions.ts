import type { QuestionItem, SubjectSlug } from '../src/content/schemas';
import { ORDERED_SUBJECT_SLUGS, SUBJECT_QUOTAS } from './pipeline/blueprints';
import { runGeminiEnrichmentBatch } from './pipeline/gemini-enrich';
import { generateBiologyQuestions } from './pipeline/generators/biology-hl';
import { generateChemistryQuestions } from './pipeline/generators/chemistry-sl';
import { generateEnglishQuestions } from './pipeline/generators/english-lit-hl';
import { generateFrenchQuestions } from './pipeline/generators/french-b-sl';
import { generateHistoryQuestions } from './pipeline/generators/history-hl';
import { generateMathQuestions } from './pipeline/generators/math-aa-sl';
import { writeShardedQuestionPacks } from './pipeline/shard-writer';
import {
  normalizeQuestionFingerprint,
  validateGeneratedQuestion,
} from './pipeline/validators';

function parseArg(flag: string): string | undefined {
  const prefix = `--${flag}=`;
  const found = process.argv.find((a) => a.startsWith(prefix));
  return found ? found.slice(prefix.length) : undefined;
}

const GENERATORS: Record<
  SubjectSlug,
  (count: number, seed?: number) => QuestionItem[]
> = {
  math: generateMathQuestions,
  chem: generateChemistryQuestions,
  bio: generateBiologyQuestions,
  fr: generateFrenchQuestions,
  hist: generateHistoryQuestions,
  eng: generateEnglishQuestions,
};

async function collectSubjectQuestions(options: {
  slug: SubjectSlug;
  targetCount: number;
  skipGemini: boolean;
  geminiBudgetPerSubject: number;
  seenIds: Set<string>;
  seenFingerprints: Set<string>;
}): Promise<QuestionItem[]> {
  const accepted: QuestionItem[] = [];

  const tryPush = (candidate: QuestionItem, overrideId?: string): boolean => {
    const withId = overrideId ? { ...candidate, id: overrideId } : candidate;
    const res = validateGeneratedQuestion(withId);
    if (!res.ok) return false;
    const q = res.data;
    if (options.seenIds.has(q.id)) return false;
    const fp = normalizeQuestionFingerprint(q);
    if (options.seenFingerprints.has(fp)) return false;
    options.seenIds.add(q.id);
    options.seenFingerprints.add(fp);
    accepted.push(q);
    return true;
  };

  if (!options.skipGemini && options.geminiBudgetPerSubject > 0) {
    const llm = await runGeminiEnrichmentBatch({
      slug: options.slug,
      maxRequests: options.geminiBudgetPerSubject,
      batchSize: 8,
    });
    for (const item of llm.items) {
      if (accepted.length >= options.targetCount) break;
      tryPush(item);
    }
    console.log(
      `[Pipeline:${options.slug}] Gemini enrichment yielded ${accepted.length} verified questions${llm.quotaExhausted ? ' (quota cap reached, continuing with verified local synthesis)' : ''}.`
    );
  }

  let pass = 0;
  let seqIndex = 1;
  while (accepted.length < options.targetCount && pass < 16) {
    const remaining = options.targetCount - accepted.length;
    const requestBatch = Math.ceil(remaining * 1.45) + 120;
    const rawBatch = GENERATORS[options.slug](
      requestBatch,
      100003 + pass * 7919 + options.slug.charCodeAt(0) * 131
    );

    let addedThisPass = 0;
    for (const item of rawBatch) {
      if (accepted.length >= options.targetCount) break;
      const cleanId = `${options.slug}-gen-${String(seqIndex).padStart(5, '0')}`;
      if (tryPush(item, cleanId)) {
        seqIndex++;
        addedThisPass++;
      }
    }
    if (addedThisPass === 0) break;
    pass++;
  }

  return accepted;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const skipGemini = process.argv.includes('--skip-gemini');
  const subjectFilter = parseArg('subject') as SubjectSlug | undefined;
  const limitArg = Number.parseInt(parseArg('limit') ?? '0', 10);
  const geminiBudget = Number.parseInt(parseArg('gemini-requests') ?? '2', 10);

  const slugs = subjectFilter
    ? ORDERED_SUBJECT_SLUGS.filter((s) => s === subjectFilter)
    : ORDERED_SUBJECT_SLUGS;

  const seenIds = new Set<string>();
  const seenFingerprints = new Set<string>();
  const bySubject = {} as Record<SubjectSlug, QuestionItem[]>;

  for (const slug of ORDERED_SUBJECT_SLUGS) {
    bySubject[slug] = [];
  }

  const t0 = Date.now();
  for (const slug of slugs) {
    const quota = SUBJECT_QUOTAS[slug];
    const target =
      Number.isFinite(limitArg) && limitArg > 0
        ? Math.min(limitArg, quota.targetCount)
        : quota.targetCount;

    const items = await collectSubjectQuestions({
      slug,
      targetCount: target,
      skipGemini,
      geminiBudgetPerSubject: geminiBudget,
      seenIds,
      seenFingerprints,
    });

    bySubject[slug] = items;
    const diagCount = items.filter((q) => Boolean(q.diagramSpec)).length;
    console.log(
      `[Pipeline] ${slug.toUpperCase()}: ${items.length}/${target} verified unique questions (${diagCount} interactive diagrams).`
    );

    if (items.length < target) {
      throw new Error(
        `Subject "${slug}" produced ${items.length} unique questions, below target ${target}.`
      );
    }
  }

  if (dryRun) {
    const total = Object.values(bySubject).reduce((s, a) => s + a.length, 0);
    console.log(
      `[Pipeline] Dry run verified ${total} unique questions in ${Date.now() - t0}ms (no files written).`
    );
    return;
  }

  const manifest = writeShardedQuestionPacks(bySubject, 'hybrid');
  console.log(
    `[Pipeline] Wrote ${manifest.totalQuestions} questions (${manifest.totalDiagrams} interactive math diagrams) across ${manifest.shards.length} compressed shards in ${Date.now() - t0}ms.`
  );
}

main().catch((err) => {
  console.error('[Pipeline] Generation failed:', err);
  process.exit(1);
});
