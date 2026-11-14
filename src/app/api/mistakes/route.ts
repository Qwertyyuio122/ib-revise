import { NextRequest, NextResponse } from 'next/server';
import { and, eq, desc, inArray } from 'drizzle-orm';
import crypto from 'crypto';
import { z } from 'zod';
import { db, ensureDbReady, schema } from '@/db';
import { getCurrentUser } from '@/lib/auth';
import { ensureSeeded } from '@/db/seed';
import {
  parseJsonBody,
  safeJsonParse,
  validationErrorResponse,
} from '@/app/api/_lib/json';

const MistakeCreateSchema = z.object({
  questionId: z.string().trim().min(1).max(200),
  userAnswer: z.string().max(15_000).default(''),
  missedConcepts: z.array(z.string().max(1000)).max(50).default([]),
  userReflection: z.string().max(5000).optional(),
});

const MistakeUpdateSchema = z
  .object({
    id: z.string().trim().min(1).max(200),
    resolved: z.union([z.boolean(), z.literal(0), z.literal(1)]).optional(),
    userReflection: z.string().max(5000).nullable().optional(),
  })
  .refine(
    (d) => d.resolved !== undefined || d.userReflection !== undefined,
    { message: 'Provide resolved or userReflection to update.' }
  );

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ mistakes: [] }, { status: 401 });
    }
    await ensureSeeded();

    const subjectSlug = req.nextUrl.searchParams.get('subject');
    const rows = await db
      .select()
      .from(schema.mistakesLog)
      .where(eq(schema.mistakesLog.userId, user.id))
      .orderBy(desc(schema.mistakesLog.createdAt))
      .all();

    if (rows.length === 0) {
      return NextResponse.json({ mistakes: [] });
    }

    const questionIds = Array.from(new Set(rows.map((r) => r.questionId)));
    const matchedQuestions = await db
      .select()
      .from(schema.questions)
      .where(inArray(schema.questions.id, questionIds))
      .all();
    const qMap = new Map(matchedQuestions.map((q) => [q.id, q]));

    const topicIds = Array.from(new Set(matchedQuestions.map((q) => q.topicId)));
    const matchedTopics =
      topicIds.length > 0
        ? await db
            .select()
            .from(schema.syllabusTopics)
            .where(inArray(schema.syllabusTopics.id, topicIds))
            .all()
        : [];
    const topicMap = new Map(matchedTopics.map((t) => [t.id, t]));

    let enriched = rows
      .map((m) => {
        const q = qMap.get(m.questionId);
        if (!q) return null;
        const topic = topicMap.get(q.topicId);
        return {
          ...m,
          missedConcepts: safeJsonParse<string[]>(m.missedConceptsJson, []),
          question: {
            ...q,
            topicCode: topic?.code ?? '',
            topicTitle: topic?.title ?? '',
            unitCode: topic?.unitCode ?? '',
            levelScope: topic?.levelScope ?? 'SL/Core',
            diagramSpec: q.diagramSpecJson
              ? safeJsonParse(q.diagramSpecJson, null)
              : null,
            options: q.optionsJson ? safeJsonParse(q.optionsJson, null) : null,
            markschemePoints: safeJsonParse(q.markschemePointsJson, []),
            walkthroughSteps: safeJsonParse(q.walkthroughStepsJson, []),
            commonPitfalls: safeJsonParse(q.commonPitfallsJson, []),
          },
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    if (subjectSlug && subjectSlug !== 'all') {
      enriched = enriched.filter((m) => m.question.subjectSlug === subjectSlug);
    }

    return NextResponse.json({ mistakes: enriched });
  } catch {
    return NextResponse.json(
      { mistakes: [], error: 'Unable to load mistakes log.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jsonBody = await parseJsonBody(req);
    if (!jsonBody.ok) return jsonBody.response;

    const parsed = MistakeCreateSchema.safeParse(jsonBody.data);
    if (!parsed.success) {
      return validationErrorResponse('Invalid mistake payload', parsed.error);
    }

    const d = parsed.data;
    await ensureSeeded();

    const question = await db
      .select({ id: schema.questions.id })
      .from(schema.questions)
      .where(eq(schema.questions.id, d.questionId))
      .get();

    if (!question) {
      return NextResponse.json({ error: 'Question not found.' }, { status: 404 });
    }

    const created = {
      id: `mistake-${crypto.randomUUID()}`,
      userId: user.id,
      questionId: d.questionId,
      userAnswer: d.userAnswer,
      missedConceptsJson: JSON.stringify(d.missedConcepts),
      userReflection: d.userReflection ?? null,
      resolved: 0,
      createdAt: Date.now(),
    };

    await db.insert(schema.mistakesLog).values(created).run();
    return NextResponse.json({ mistake: created });
  } catch {
    return NextResponse.json(
      { error: 'Unable to log mistake.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jsonBody = await parseJsonBody(req);
    if (!jsonBody.ok) return jsonBody.response;

    const parsed = MistakeUpdateSchema.safeParse(jsonBody.data);
    if (!parsed.success) {
      return validationErrorResponse(
        'Invalid mistake update payload.',
        parsed.error
      );
    }

    await ensureDbReady();
    const existing = await db
      .select({ id: schema.mistakesLog.id })
      .from(schema.mistakesLog)
      .where(
        and(
          eq(schema.mistakesLog.id, parsed.data.id),
          eq(schema.mistakesLog.userId, user.id)
        )
      )
      .get();

    if (!existing) {
      return NextResponse.json(
        { error: 'Mistake entry not found.' },
        { status: 404 }
      );
    }

    const updateValues: Partial<{ resolved: number; userReflection: string | null }> = {};
    if (parsed.data.resolved !== undefined) {
      updateValues.resolved =
        parsed.data.resolved === true || parsed.data.resolved === 1 ? 1 : 0;
    }
    if (parsed.data.userReflection !== undefined) {
      updateValues.userReflection = parsed.data.userReflection;
    }

    await db
      .update(schema.mistakesLog)
      .set(updateValues)
      .where(
        and(
          eq(schema.mistakesLog.id, parsed.data.id),
          eq(schema.mistakesLog.userId, user.id)
        )
      )
      .run();

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: 'Unable to update mistake entry.' },
      { status: 500 }
    );
  }
}
