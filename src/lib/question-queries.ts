import {
  and,
  asc,
  eq,
  isNotNull,
  like,
  or,
  sql,
  type SQL,
} from 'drizzle-orm';
import { db, schema } from '@/db';
import { ensureSeeded } from '@/db/seed';
import { safeJsonParse } from '@/app/api/_lib/json';
import type { MathDiagramSpec } from '@/content/schemas';
import type { QuestionRunnerItem } from '@/components/questions/QuestionRunnerClient';

export interface TopicSummaryItem {
  id: string;
  subjectSlug: string;
  unitCode: string;
  unitTitle: string;
  code: string;
  title: string;
  levelScope: string;
}

export interface QuestionQueryOptions {
  subject?: string | null;
  topicId?: string | null;
  paper?: string | null;
  questionType?: string | null;
  difficulty?: string | null;
  calculatorPolicy?: string | null;
  hasDiagram?: boolean;
  q?: string | null;
  mode?: string | null;
  questionId?: string | null;
  page?: number;
  limit?: number;
  shuffle?: boolean;
}

export interface QuestionQueryResult {
  questions: QuestionRunnerItem[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  topics: TopicSummaryItem[];
}

function getDailySeedInt(): number {
  const isoDay = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < isoDay.length; i++) {
    hash = (hash * 31 + isoDay.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function buildWhereClause(opts: QuestionQueryOptions): SQL | undefined {
  const conditions: SQL[] = [];

  if (opts.subject && opts.subject !== 'all') {
    conditions.push(eq(schema.questions.subjectSlug, opts.subject));
  }
  if (opts.topicId && opts.topicId !== 'all') {
    conditions.push(eq(schema.questions.topicId, opts.topicId));
  }
  if (opts.paper && opts.paper !== 'all') {
    conditions.push(like(schema.questions.paper, `%${opts.paper}%`));
  }
  if (opts.questionType && opts.questionType !== 'all') {
    conditions.push(eq(schema.questions.questionType, opts.questionType));
  }
  if (opts.difficulty && opts.difficulty !== 'all') {
    conditions.push(eq(schema.questions.difficulty, opts.difficulty));
  }
  if (opts.calculatorPolicy && opts.calculatorPolicy !== 'all') {
    conditions.push(eq(schema.questions.calculatorPolicy, opts.calculatorPolicy));
  }
  if (opts.hasDiagram) {
    conditions.push(isNotNull(schema.questions.diagramSpecJson));
  }
  const search = opts.q?.trim();
  if (search) {
    const pattern = `%${search.slice(0, 80)}%`;
    const searchCond = or(
      like(schema.questions.stemMarkdown, pattern),
      like(schema.questions.stimulusMarkdown, pattern),
      like(schema.questions.commandTerm, pattern),
      like(schema.questions.subtopicCode, pattern)
    );
    if (searchCond) {
      conditions.push(searchCond);
    }
  }
  if (opts.mode === 'daily') {
    conditions.push(eq(schema.questions.isDailyEligible, 1));
  }

  return conditions.length > 0 ? and(...conditions) : undefined;
}

function enrichQuestionRow(
  q: typeof schema.questions.$inferSelect,
  topicMap: Map<string, TopicSummaryItem>
): QuestionRunnerItem {
  const topic = topicMap.get(q.topicId);
  return {
    id: q.id,
    subjectSlug: q.subjectSlug,
    topicId: q.topicId,
    subtopicCode: q.subtopicCode ?? null,
    topicCode: topic?.code ?? '',
    topicTitle: topic?.title ?? '',
    unitCode: topic?.unitCode ?? '',
    levelScope: topic?.levelScope ?? 'SL/Core',
    paper: q.paper,
    questionType: q.questionType,
    calculatorPolicy: q.calculatorPolicy,
    difficulty: q.difficulty,
    marks: q.marks,
    commandTerm: q.commandTerm,
    stemMarkdown: q.stemMarkdown,
    stimulusMarkdown: q.stimulusMarkdown ?? null,
    diagramSpec: q.diagramSpecJson
      ? safeJsonParse<MathDiagramSpec | null>(q.diagramSpecJson, null)
      : null,
    options: q.optionsJson
      ? safeJsonParse<QuestionRunnerItem['options']>(q.optionsJson, null)
      : null,
    correctOptionId:
      (q.correctOptionId as QuestionRunnerItem['correctOptionId']) ?? null,
    markschemePoints: safeJsonParse<QuestionRunnerItem['markschemePoints']>(
      q.markschemePointsJson,
      []
    ),
    walkthroughSteps: safeJsonParse<QuestionRunnerItem['walkthroughSteps']>(
      q.walkthroughStepsJson,
      []
    ),
    commonPitfalls: safeJsonParse<string[]>(q.commonPitfallsJson, []),
    isDailyEligible: q.isDailyEligible !== 0,
  };
}

export async function queryQuestionsPage(
  opts: QuestionQueryOptions = {}
): Promise<QuestionQueryResult> {
  await ensureSeeded();

  const allTopics = await db
    .select({
      id: schema.syllabusTopics.id,
      subjectSlug: schema.syllabusTopics.subjectSlug,
      unitCode: schema.syllabusTopics.unitCode,
      unitTitle: schema.syllabusTopics.unitTitle,
      code: schema.syllabusTopics.code,
      title: schema.syllabusTopics.title,
      levelScope: schema.syllabusTopics.levelScope,
    })
    .from(schema.syllabusTopics)
    .orderBy(asc(schema.syllabusTopics.subjectSlug), asc(schema.syllabusTopics.code))
    .all();

  const topicMap = new Map(allTopics.map((t) => [t.id, t]));
  const scopedTopics =
    opts.subject && opts.subject !== 'all'
      ? allTopics.filter((t) => t.subjectSlug === opts.subject)
      : allTopics;

  if (opts.questionId?.trim()) {
    const exactRows = await db
      .select()
      .from(schema.questions)
      .where(eq(schema.questions.id, opts.questionId.trim()))
      .limit(1)
      .all();

    if (exactRows.length > 0) {
      return {
        questions: exactRows.map((row) => enrichQuestionRow(row, topicMap)),
        totalCount: 1,
        page: 1,
        limit: 1,
        totalPages: 1,
        topics: scopedTopics,
      };
    }
  }

  const limit = Math.max(1, Math.min(100, Math.floor(opts.limit ?? 25)));
  const whereClause = buildWhereClause(opts);

  if (opts.mode === 'daily') {
    const dailySeed = getDailySeedInt();
    const subjectFilter = opts.subject && opts.subject !== 'all' ? opts.subject : null;

    if (subjectFilter) {
      const countRow = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(schema.questions)
        .where(whereClause)
        .get();
      const total = Number(countRow?.count ?? 0);
      const maxOffset = Math.max(0, total - 5);
      const offset = maxOffset > 0 ? dailySeed % (maxOffset + 1) : 0;

      const rows = await db
        .select()
        .from(schema.questions)
        .where(whereClause)
        .orderBy(asc(schema.questions.id))
        .limit(5)
        .offset(offset)
        .all();

      return {
        questions: rows.map((row) => enrichQuestionRow(row, topicMap)),
        totalCount: rows.length,
        page: 1,
        limit: 5,
        totalPages: 1,
        topics: scopedTopics,
      };
    }

    // Cross-subject Sprout Daily 5-question mix rotated deterministically by UTC date
    const prioritySubjects = ['math', 'chem', 'fr', 'bio', 'hist', 'eng'];
    const pickedRows: Array<typeof schema.questions.$inferSelect> = [];
    for (let sIdx = 0; sIdx < prioritySubjects.length && pickedRows.length < 5; sIdx++) {
      const slug = prioritySubjects[(dailySeed + sIdx) % prioritySubjects.length];
      const cond = buildWhereClause({ ...opts, subject: slug });
      const countRow = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(schema.questions)
        .where(cond)
        .get();
      const totalForSubj = Number(countRow?.count ?? 0);
      if (totalForSubj === 0) continue;
      const offset = (dailySeed + sIdx * 17) % totalForSubj;
      const row = await db
        .select()
        .from(schema.questions)
        .where(cond)
        .orderBy(asc(schema.questions.id))
        .limit(1)
        .offset(offset)
        .get();
      if (row) pickedRows.push(row);
    }

    return {
      questions: pickedRows.map((row) => enrichQuestionRow(row, topicMap)),
      totalCount: pickedRows.length,
      page: 1,
      limit: 5,
      totalPages: 1,
      topics: scopedTopics,
    };
  }

  const countRow = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(schema.questions)
    .where(whereClause)
    .get();
  const totalCount = Number(countRow?.count ?? 0);

  if (opts.mode === 'exam' || opts.shuffle) {
    const sampleLimit = Math.min(limit, 40);
    const rows = await db
      .select()
      .from(schema.questions)
      .where(whereClause)
      .orderBy(sql`RANDOM()`)
      .limit(sampleLimit)
      .all();

    return {
      questions: rows.map((row) => enrichQuestionRow(row, topicMap)),
      totalCount,
      page: 1,
      limit: sampleLimit,
      totalPages: Math.max(1, Math.ceil(totalCount / sampleLimit)),
      topics: scopedTopics,
    };
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const page = Math.max(1, Math.min(totalPages, Math.floor(opts.page ?? 1)));
  const offset = (page - 1) * limit;

  const rows = await db
    .select()
    .from(schema.questions)
    .where(whereClause)
    .orderBy(asc(schema.questions.id))
    .limit(limit)
    .offset(offset)
    .all();

  return {
    questions: rows.map((row) => enrichQuestionRow(row, topicMap)),
    totalCount,
    page,
    limit,
    totalPages,
    topics: scopedTopics,
  };
}
