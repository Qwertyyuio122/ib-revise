import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import katex from 'katex';
import 'katex/contrib/mhchem';
import { ALL_SUBJECT_PACKS, getAllQuestionsWithTopicMeta } from '../index';
import { QuestionItemSchema, SubjectPackSchema, type QuestionItem } from '../schemas';
import { ensureSeeded, resetSeedCacheForTests } from '@/db/seed';
import { db, resetDbForTests, schema } from '@/db';

const CANONICAL_TOOL_SLUGS = new Set([
  'bio-visualizations',
  'data-booklet',
  'calc-checker',
  'opcvl-trainer',
  'english-studio',
  'french-studio',
  'formula-booklet',
  'blurting',
  'teach-sprout',
]);

const VALID_TOOL_TABS: Record<string, Set<string>> = {
  'data-booklet': new Set([
    'constants',
    'periodic',
    'periodic-table',
    'energetics',
    'bonds',
    'enthalpies',
  ]),
  'opcvl-trainer': new Set([
    'opcvl',
    'outlines',
    'essay-builder',
    'historiography',
    'timeline',
  ]),
  'english-studio': new Set(['devices', 'global-issues', 'prl-planner', 'prl']),
  'french-studio': new Set(['text-types', 'grammar', 'grammar-lab']),
};

const VALID_SUBJECT_TABS = new Set(['resources', 'topics', 'plan', 'saved']);
const VALID_QUESTION_MODES = new Set(['practice', 'exam', 'mistakes', 'daily']);

function loadCustomQuestions(): QuestionItem[] {
  const customDir = path.join(process.cwd(), 'content', 'questions');
  if (!fs.existsSync(customDir)) return [];
  const items: QuestionItem[] = [];
  for (const file of fs.readdirSync(customDir).filter((f) => f.endsWith('.json'))) {
    const raw = JSON.parse(fs.readFileSync(path.join(customDir, file), 'utf-8'));
    const list = Array.isArray(raw) ? raw : raw.questions ?? [];
    for (const entry of list) {
      const parsed = QuestionItemSchema.safeParse(entry);
      if (!parsed.success) {
        throw new Error(
          `Custom question validation failed in ${file}: ${JSON.stringify(
            parsed.error.issues,
            null,
            2
          )}`
        );
      }
      items.push(parsed.data);
    }
  }
  return items;
}

function collectStrings(value: unknown, trail: string, out: Array<{ path: string; text: string }>) {
  if (typeof value === 'string') {
    out.push({ path: trail, text: value });
  } else if (Array.isArray(value)) {
    value.forEach((item, idx) => collectStrings(item, `${trail}[${idx}]`, out));
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      collectStrings(v, `${trail}.${k}`, out);
    }
  }
}

function assertValidKaTeXAndNoControlChars(text: string, location: string) {
  expect(text, `Unexpected control char at ${location}`).not.toMatch(/[\t\b\f\r\v]/);

  let i = 0;
  while (i < text.length) {
    if (text[i] === '$' && text[i + 1] === '$' && text[i - 1] !== '\\') {
      const close = text.indexOf('$$', i + 2);
      expect(close, `Unclosed $$ delimiter at ${location}`).toBeGreaterThan(i + 1);
      const expr = text.slice(i + 2, close);
      expect(
        () => katex.renderToString(expr, { displayMode: true, throwOnError: true, strict: false }),
        `Invalid display KaTeX at ${location}: ${expr}`
      ).not.toThrow();
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
      expect(close, `Unclosed $ delimiter at ${location}`).toBeGreaterThan(i);
      const expr = text.slice(i + 1, close);
      expect(
        () => katex.renderToString(expr, { displayMode: false, throwOnError: true, strict: false }),
        `Invalid inline KaTeX at ${location}: ${expr}`
      ).not.toThrow();
      i = close + 1;
      continue;
    }

    i++;
  }
}

describe('6-Subject Curriculum Packs & Seed Pipeline', () => {
  const originalDbPath = process.env.SIMPLE_REVISION_DB_PATH;
  let tempDir = '';

  beforeAll(async () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sr-curriculum-seed-'));
    process.env.SIMPLE_REVISION_DB_PATH = path.join(tempDir, 'seed-test.db');
    resetSeedCacheForTests();
    await resetDbForTests();
  });

  afterAll(async () => {
    resetSeedCacheForTests();
    await resetDbForTests();
    if (originalDbPath === undefined) {
      delete process.env.SIMPLE_REVISION_DB_PATH;
    } else {
      process.env.SIMPLE_REVISION_DB_PATH = originalDbPath;
    }
    if (tempDir) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
  it('validates all 6 canonical subject packs against SubjectPackSchema', () => {
    expect(ALL_SUBJECT_PACKS).toHaveLength(6);
    const slugs = ALL_SUBJECT_PACKS.map((p) => p.subject.slug);
    expect(slugs).toEqual(['bio', 'chem', 'hist', 'eng', 'fr', 'math']);

    for (const pack of ALL_SUBJECT_PACKS) {
      const parsed = SubjectPackSchema.safeParse(pack);
      if (!parsed.success) {
        throw new Error(
          `Validation failed for ${pack.subject.slug}: ${JSON.stringify(
            parsed.error.issues,
            null,
            2
          )}`
        );
      }
      expect(parsed.success).toBe(true);
    }
  });

  it('enforces Chemistry SL strictly (never HL) and avoids HL-only 2025 topic leaks', () => {
    const chem = ALL_SUBJECT_PACKS.find((p) => p.subject.slug === 'chem');
    expect(chem).toBeDefined();
    expect(chem?.subject.level).toBe('SL');
    for (const topic of chem?.topics ?? []) {
      expect(topic.levelScope).toBe('SL/Core');
    }

    const customChem = loadCustomQuestions().filter((q) => q.subjectSlug === 'chem');
    const serializedChem = JSON.stringify({ chem, customChem });
    expect(serializedChem).toContain('22.7');
    expect(serializedChem).toContain('273.15');
    expect(serializedChem).not.toMatch(/(?:=|\\times|x|\*|\/|÷)\s*22\.4\b/i);
    expect(serializedChem).not.toMatch(/chem-ref-ir-nmr|1H NMR|IR & NMR|Al < Mg|S < P|H_f\^|H_c\^|\bEntropy\b|\bGibbs\b/i);
  });

  it('validates custom drop-in JSON questions and cross-pack ID uniqueness', () => {
    const customQuestions = loadCustomQuestions();
    expect(customQuestions.length).toBeGreaterThanOrEqual(1);

    const topicById = new Map<string, string>();
    const questionIds = new Set<string>();
    const refIds = new Set<string>();
    const deckIds = new Set<string>();
    const cardIds = new Set<string>();

    for (const pack of ALL_SUBJECT_PACKS) {
      for (const topic of pack.topics) {
        expect(topicById.has(topic.id), `Duplicate topic id ${topic.id}`).toBe(false);
        topicById.set(topic.id, pack.subject.slug);
      }
      for (const q of pack.questions) {
        expect(questionIds.has(q.id), `Duplicate question id ${q.id}`).toBe(false);
        questionIds.add(q.id);
      }
      for (const ref of pack.referenceItems) {
        expect(refIds.has(ref.id), `Duplicate reference id ${ref.id}`).toBe(false);
        refIds.add(ref.id);
      }
      for (const deck of pack.flashcardDecks) {
        expect(deckIds.has(deck.id), `Duplicate deck id ${deck.id}`).toBe(false);
        deckIds.add(deck.id);
        for (const card of deck.cards) {
          expect(cardIds.has(card.id), `Duplicate card id ${card.id}`).toBe(false);
          cardIds.add(card.id);
        }
      }
    }

    for (const q of customQuestions) {
      expect(questionIds.has(q.id), `Custom question id collides: ${q.id}`).toBe(false);
      questionIds.add(q.id);
      expect(topicById.get(q.topicId)).toBe(q.subjectSlug);
    }
  });

  it('keeps all subject tool/question links valid (including ?tab= and ?mode=) and ensures KaTeX integrity', () => {
    for (const pack of ALL_SUBJECT_PACKS) {
      const hrefs = [
        ...pack.subject.spotlight.pills.map((p) => p.href),
        ...pack.subject.practiceTools.map((t) => t.href),
        ...pack.subject.learnTools.map((t) => t.href),
      ];
      for (const href of hrefs) {
        expect(href).not.toMatch(/\/tools\/opcvl(\?|$)/);
        expect(href).not.toContain('/tools/literary-devices');
        expect(href).not.toContain('tab=mistakes');
        expect(href).not.toContain('mode=walkthrough');

        const url = new URL(href, 'https://simplerevision.local');
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts[0] === 'tools' && parts[1]) {
          expect(CANONICAL_TOOL_SLUGS.has(parts[1]), `Invalid tool slug in ${href}`).toBe(true);
          const tab = url.searchParams.get('tab');
          if (tab) {
            const allowedTabs = VALID_TOOL_TABS[parts[1]];
            expect(allowedTabs?.has(tab), `Invalid ?tab=${tab} for /tools/${parts[1]}`).toBe(true);
          }
        }
        if (parts[0] === 'subjects' && parts[1]) {
          const tab = url.searchParams.get('tab');
          if (tab) {
            expect(VALID_SUBJECT_TABS.has(tab), `Invalid subject ?tab=${tab} in ${href}`).toBe(true);
          }
        }
        if (parts[0] === 'questions') {
          const mode = url.searchParams.get('mode');
          if (mode) {
            expect(VALID_QUESTION_MODES.has(mode), `Invalid question ?mode=${mode} in ${href}`).toBe(true);
          }
        }
      }

      const strings: Array<{ path: string; text: string }> = [];
      collectStrings(pack, pack.subject.slug, strings);
      for (const item of strings) {
        assertValidKaTeXAndNoControlChars(item.text, item.path);
      }
    }

    const customStrings: Array<{ path: string; text: string }> = [];
    collectStrings(loadCustomQuestions(), 'custom-questions', customStrings);
    for (const item of customStrings) {
      assertValidKaTeXAndNoControlChars(item.text, item.path);
    }

    const math = ALL_SUBJECT_PACKS.find((p) => p.subject.slug === 'math');
    const serializedMath = JSON.stringify(math);
    expect(serializedMath).not.toContain('定义的');
    const qStats = math?.questions.find((q) => q.id === 'math-q4-p2-stats');
    expect(JSON.stringify(qStats)).toContain('0.470');
    expect(JSON.stringify(qStats)).not.toContain('0.462');
    const qKin = math?.questions.find((q) => q.id === 'math-q6-p2-kinematics');
    expect(JSON.stringify(qKin)).toContain('2.44');
    expect(JSON.stringify(qKin)).toContain('-15.7');
    expect(JSON.stringify(qKin)).toContain('29.8');

    const eng = ALL_SUBJECT_PACKS.find((p) => p.subject.slug === 'eng');
    const serializedEng = JSON.stringify(eng);
    expect(serializedEng).not.toContain('knowthen');
    expect(serializedEng).not.toContain('Fortwenty-three');
    expect(serializedEng).not.toContain('jenny-greenteeth');
    const qPoem = eng?.questions.find((q) => q.id === 'eng-q1-p1-poetry');
    expect(qPoem?.stimulusMarkdown).not.toContain('Seamus Heaney');

    const hist = ALL_SUBJECT_PACKS.find((p) => p.subject.slug === 'hist');
    const serializedHist = JSON.stringify(hist);
    expect(serializedHist).not.toContain('Richard Timpe');
    expect(serializedHist).not.toContain('Amau / New Order');

    const fr = ALL_SUBJECT_PACKS.find((p) => p.subject.slug === 'fr');
    const serializedFr = JSON.stringify(fr);
    expect(serializedFr).not.toContain('ils ne ____________');

    const bio = ALL_SUBJECT_PACKS.find((p) => p.subject.slug === 'bio');
    expect(JSON.stringify(bio)).not.toContain('2,438 items');
    const qBio = bio?.questions.find((q) => q.id === 'bio-d1-q005');
    expect(qBio?.commandTerm).toBe('Outline');
  });

  it('seeds SQLite database idempotently and populates all 6 subjects & questions', async () => {
    const summary = await ensureSeeded(true);
    expect(summary.subjectsCount).toBe(6);
    expect(summary.topicsCount).toBeGreaterThanOrEqual(36);
    expect(summary.questionsCount).toBeGreaterThanOrEqual(36);

    const secondSummary = await ensureSeeded(false);
    expect(secondSummary.subjectsCount).toBe(6);
    expect(secondSummary.topicsCount).toBe(summary.topicsCount);
    expect(secondSummary.questionsCount).toBe(summary.questionsCount);

    const dbSubjects = await db.select().from(schema.subjects).all();
    expect(dbSubjects).toHaveLength(6);

    const allMetaQuestions = getAllQuestionsWithTopicMeta();
    expect(allMetaQuestions.length).toBeGreaterThanOrEqual(36);
  });
});
