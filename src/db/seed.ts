import type { Client } from '@libsql/client';
import { isNull } from 'drizzle-orm';
import type { BatchItem } from 'drizzle-orm/batch';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import zlib from 'zlib';
import { db, ensureDbReady, getLibsqlClient, schema } from './index';
import { ALL_SUBJECT_PACKS } from '@/content';
import {
  QuestionItemSchema,
  SubjectPackSchema,
  type QuestionItem,
} from '@/content/schemas';

export interface SeedSummary {
  subjectsCount: number;
  topicsCount: number;
  questionsCount: number;
  referenceCount: number;
  flashcardsCount: number;
}

const globalForSeed = globalThis as unknown as {
  hasSeeded?: boolean;
  seedSummary?: SeedSummary;
  seededClient?: Client;
  seedPromise?: Promise<SeedSummary>;
};

export function resetSeedCacheForTests(): void {
  globalForSeed.hasSeeded = false;
  globalForSeed.seedSummary = undefined;
  globalForSeed.seededClient = undefined;
  globalForSeed.seedPromise = undefined;
}

export async function ensureSeeded(force = false): Promise<SeedSummary> {
  const client = getLibsqlClient();
  if (
    !force &&
    globalForSeed.hasSeeded &&
    globalForSeed.seedSummary &&
    globalForSeed.seededClient === client
  ) {
    return globalForSeed.seedSummary;
  }

  while (
    globalForSeed.seedPromise &&
    globalForSeed.seededClient === getLibsqlClient()
  ) {
    if (!force) {
      return globalForSeed.seedPromise;
    }
    await globalForSeed.seedPromise.catch(() => undefined);
  }

  const activeClient = getLibsqlClient();
  const runPromise = runSeed(force, activeClient).finally(() => {
    if (globalForSeed.seedPromise === runPromise) {
      globalForSeed.seedPromise = undefined;
    }
  });

  globalForSeed.seededClient = activeClient;
  globalForSeed.seedPromise = runPromise;

  return runPromise;
}

function toQuestionUpsertStatement(q: QuestionItem): BatchItem<'sqlite'> {
  const optionsJson = q.options ? JSON.stringify(q.options) : null;
  const markschemePointsJson = JSON.stringify(q.markschemePoints);
  const walkthroughStepsJson = JSON.stringify(q.walkthroughSteps);
  const commonPitfallsJson = JSON.stringify(q.commonPitfalls);
  const diagramSpecJson = q.diagramSpec ? JSON.stringify(q.diagramSpec) : null;
  const isDailyEligible = q.isDailyEligible ? 1 : 0;

  return db
    .insert(schema.questions)
    .values({
      id: q.id,
      subjectSlug: q.subjectSlug,
      topicId: q.topicId,
      subtopicCode: q.subtopicCode ?? null,
      paper: q.paper,
      questionType: q.questionType,
      calculatorPolicy: q.calculatorPolicy,
      difficulty: q.difficulty,
      marks: q.marks,
      commandTerm: q.commandTerm,
      stemMarkdown: q.stemMarkdown,
      stimulusMarkdown: q.stimulusMarkdown ?? null,
      diagramSpecJson,
      optionsJson,
      correctOptionId: q.correctOptionId ?? null,
      markschemePointsJson,
      walkthroughStepsJson,
      commonPitfallsJson,
      isDailyEligible,
    })
    .onConflictDoUpdate({
      target: schema.questions.id,
      set: {
        subjectSlug: q.subjectSlug,
        topicId: q.topicId,
        subtopicCode: q.subtopicCode ?? null,
        paper: q.paper,
        questionType: q.questionType,
        calculatorPolicy: q.calculatorPolicy,
        difficulty: q.difficulty,
        marks: q.marks,
        commandTerm: q.commandTerm,
        stemMarkdown: q.stemMarkdown,
        stimulusMarkdown: q.stimulusMarkdown ?? null,
        diagramSpecJson,
        optionsJson,
        correctOptionId: q.correctOptionId ?? null,
        markschemePointsJson,
        walkthroughStepsJson,
        commonPitfallsJson,
        isDailyEligible,
      },
    });
}

async function runSeed(force: boolean, client: Client): Promise<SeedSummary> {
  await ensureDbReady();

  if (!force) {
    const [existingSubjects, existingQuestions] = await Promise.all([
      db
        .select({
          slug: schema.subjects.slug,
          practiceToolsJson: schema.subjects.practiceToolsJson,
        })
        .from(schema.subjects)
        .all(),
      db.select({ id: schema.questions.id }).from(schema.questions).limit(1).all(),
    ]);

    if (
      existingSubjects.length === 6 &&
      existingSubjects.every((s) => s.practiceToolsJson !== '[]') &&
      existingQuestions.length > 0
    ) {
      const summary: SeedSummary = {
        subjectsCount: existingSubjects.length,
        topicsCount: 0,
        questionsCount: 0,
        referenceCount: 0,
        flashcardsCount: 0,
      };
      globalForSeed.hasSeeded = true;
      globalForSeed.seedSummary = summary;
      globalForSeed.seededClient = client;
      return summary;
    }
  }

  let subjectsCount = 0;
  let topicsCount = 0;
  let questionsCount = 0;
  let referenceCount = 0;
  let flashcardsCount = 0;
  const now = Date.now();
  const statements: BatchItem<'sqlite'>[] = [];

  for (const rawPack of ALL_SUBJECT_PACKS) {
    const parsedPack = SubjectPackSchema.safeParse(rawPack);
    const pack = parsedPack.success ? parsedPack.data : rawPack;
    const s = pack.subject;

    const themeTokensJson = JSON.stringify(s.themeTokens);
    const iaConfigJson = JSON.stringify(s.iaConfig);
    const spotlightJson = JSON.stringify(s.spotlight);
    const practiceToolsJson = JSON.stringify(s.practiceTools);
    const learnToolsJson = JSON.stringify(s.learnTools);

    statements.push(
      db
        .insert(schema.subjects)
        .values({
          slug: s.slug,
          name: s.name,
          level: s.level,
          syllabusFirstAssessment: s.syllabusFirstAssessment,
          themeTokensJson,
          iaConfigJson,
          spotlightJson,
          practiceToolsJson,
          learnToolsJson,
        })
        .onConflictDoUpdate({
          target: schema.subjects.slug,
          set: {
            name: s.name,
            level: s.level,
            syllabusFirstAssessment: s.syllabusFirstAssessment,
            themeTokensJson,
            iaConfigJson,
            spotlightJson,
            practiceToolsJson,
            learnToolsJson,
          },
        })
    );
    subjectsCount++;

    for (const t of pack.topics) {
      const guidingQuestionsJson = JSON.stringify(t.guidingQuestions);
      const understandingsJson = JSON.stringify(t.understandings);
      const blurtChecklistJson = JSON.stringify(t.blurtChecklist);

      statements.push(
        db
          .insert(schema.syllabusTopics)
          .values({
            id: t.id,
            subjectSlug: t.subjectSlug,
            unitCode: t.unitCode,
            unitTitle: t.unitTitle,
            code: t.code,
            title: t.title,
            levelScope: t.levelScope,
            recommendedHours: t.recommendedHours,
            guidingQuestionsJson,
            understandingsJson,
            studyGuideMarkdown: t.studyGuideMarkdown,
            cheatsheetMarkdown: t.cheatsheetMarkdown,
            blurtChecklistJson,
          })
          .onConflictDoUpdate({
            target: schema.syllabusTopics.id,
            set: {
              subjectSlug: t.subjectSlug,
              unitCode: t.unitCode,
              unitTitle: t.unitTitle,
              code: t.code,
              title: t.title,
              levelScope: t.levelScope,
              recommendedHours: t.recommendedHours,
              guidingQuestionsJson,
              understandingsJson,
              studyGuideMarkdown: t.studyGuideMarkdown,
              cheatsheetMarkdown: t.cheatsheetMarkdown,
              blurtChecklistJson,
            },
          })
      );
      topicsCount++;
    }

    for (const q of pack.questions) {
      statements.push(toQuestionUpsertStatement(q));
      questionsCount++;
    }

    for (const ref of pack.referenceItems) {
      const payloadJson = JSON.stringify(ref.payload);
      statements.push(
        db
          .insert(schema.subjectReferenceItems)
          .values({
            id: ref.id,
            subjectSlug: ref.subjectSlug,
            toolType: ref.toolType,
            category: ref.category,
            title: ref.title,
            codeOrSymbol: ref.codeOrSymbol ?? null,
            payloadJson,
          })
          .onConflictDoUpdate({
            target: schema.subjectReferenceItems.id,
            set: {
              subjectSlug: ref.subjectSlug,
              toolType: ref.toolType,
              category: ref.category,
              title: ref.title,
              codeOrSymbol: ref.codeOrSymbol ?? null,
              payloadJson,
            },
          })
      );
      referenceCount++;
    }

    for (const deck of pack.flashcardDecks) {
      const deckInsert = db.insert(schema.flashcardDecks).values({
        id: deck.id,
        userId: null,
        subjectSlug: deck.subjectSlug,
        topicId: deck.topicId ?? null,
        title: deck.title,
        description: deck.description,
      });
      statements.push(
        force
          ? deckInsert.onConflictDoUpdate({
              target: schema.flashcardDecks.id,
              setWhere: isNull(schema.flashcardDecks.userId),
              set: {
                subjectSlug: deck.subjectSlug,
                topicId: deck.topicId ?? null,
                title: deck.title,
                description: deck.description,
              },
            })
          : deckInsert.onConflictDoNothing()
      );

      for (const card of deck.cards) {
        const tagsJson = JSON.stringify(card.tags ?? []);
        const cardInsert = db.insert(schema.flashcards).values({
          id: card.id,
          deckId: deck.id,
          userId: null,
          frontMarkdown: card.frontMarkdown,
          backMarkdown: card.backMarkdown,
          tagsJson,
          easeFactor: 2.5,
          intervalDays: 0,
          repetitions: 0,
          dueAt: now,
        });
        statements.push(
          force
            ? cardInsert.onConflictDoUpdate({
                target: schema.flashcards.id,
                setWhere: isNull(schema.flashcards.userId),
                set: {
                  deckId: deck.id,
                  frontMarkdown: card.frontMarkdown,
                  backMarkdown: card.backMarkdown,
                  tagsJson,
                },
              })
            : cardInsert.onConflictDoNothing()
        );
        flashcardsCount++;
      }
    }
  }

  const SEED_BATCH_CHUNK_SIZE = 250;
  async function flushPendingStatements(): Promise<void> {
    while (statements.length >= SEED_BATCH_CHUNK_SIZE) {
      const chunk = statements.splice(0, SEED_BATCH_CHUNK_SIZE);
      await db.batch(
        chunk as [BatchItem<'sqlite'>, ...BatchItem<'sqlite'>[]]
      );
    }
  }

  // Stage 2: Custom JSON drop-in question packs in content/questions/*.json
  const customDir = path.join(process.cwd(), 'content', 'questions');
  if (fs.existsSync(customDir)) {
    const files = fs
      .readdirSync(customDir)
      .filter((f) => f.endsWith('.json'))
      .sort();
    for (const file of files) {
      try {
        const raw = JSON.parse(
          fs.readFileSync(path.join(customDir, file), 'utf-8')
        );
        const items = Array.isArray(raw) ? raw : raw.questions ?? [];
        for (const item of items) {
          const parsed = QuestionItemSchema.safeParse(item);
          if (parsed.success) {
            statements.push(toQuestionUpsertStatement(parsed.data));
            questionsCount++;
            if (statements.length >= SEED_BATCH_CHUNK_SIZE) {
              await flushPendingStatements();
            }
          }
        }
      } catch {
        // Ignore malformed drop-in files
      }
    }
  }

  // Stage 3: Streamed sharded question packs in content/questions/generated/*.jsonl(.gz)
  const shouldLoadGenerated =
    !process.env.VITEST || process.env.INCLUDE_GENERATED_PACKS === '1';
  const generatedDir = path.join(customDir, 'generated');
  if (shouldLoadGenerated && fs.existsSync(generatedDir)) {
    const genFiles = fs
      .readdirSync(generatedDir)
      .filter(
        (f) =>
          (f.endsWith('.jsonl') ||
            f.endsWith('.jsonl.gz') ||
            (f.endsWith('.json') && f !== 'manifest.json'))
      )
      .sort();

    for (const file of genFiles) {
      const fullPath = path.join(generatedDir, file);
      if (file.endsWith('.json')) {
        try {
          const raw = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
          const items = Array.isArray(raw) ? raw : raw.questions ?? [];
          for (const item of items) {
            const parsed = QuestionItemSchema.safeParse(item);
            if (parsed.success) {
              statements.push(toQuestionUpsertStatement(parsed.data));
              questionsCount++;
              if (statements.length >= SEED_BATCH_CHUNK_SIZE) {
                await flushPendingStatements();
              }
            }
          }
        } catch {
          // Ignore malformed shard file
        }
        continue;
      }

      const fileStream = fs.createReadStream(fullPath);
      const textStream = file.endsWith('.gz')
        ? fileStream.pipe(zlib.createGunzip())
        : fileStream;
      const rl = readline.createInterface({
        input: textStream,
        crlfDelay: Infinity,
      });

      for await (const line of rl) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        try {
          const rawItem = JSON.parse(trimmed);
          const parsed = QuestionItemSchema.safeParse(rawItem);
          if (parsed.success) {
            statements.push(toQuestionUpsertStatement(parsed.data));
            questionsCount++;
            if (statements.length >= SEED_BATCH_CHUNK_SIZE) {
              await flushPendingStatements();
            }
          }
        } catch {
          // Ignore malformed line
        }
      }
    }
  }

  await flushPendingStatements();
  if (statements.length > 0) {
    await db.batch(
      statements as [BatchItem<'sqlite'>, ...BatchItem<'sqlite'>[]]
    );
    statements.length = 0;
  }

  const summary: SeedSummary = {
    subjectsCount,
    topicsCount,
    questionsCount,
    referenceCount,
    flashcardsCount,
  };
  globalForSeed.hasSeeded = true;
  globalForSeed.seedSummary = summary;
  globalForSeed.seededClient = client;
  return summary;
}
