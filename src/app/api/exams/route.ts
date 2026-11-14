import { NextRequest, NextResponse } from 'next/server';
import { eq, desc, inArray } from 'drizzle-orm';
import crypto from 'crypto';
import { z } from 'zod';
import { db, schema } from '@/db';
import { getCurrentUser } from '@/lib/auth';
import { ensureSeeded } from '@/db/seed';
import {
  parseJsonBody,
  safeJsonParse,
  validationErrorResponse,
} from '@/app/api/_lib/json';

const ExamCreateSchema = z.object({
  subjectSlug: z.enum(['bio', 'chem', 'hist', 'eng', 'fr', 'math']),
  title: z.string().trim().min(1).max(200),
  paperFilter: z.string().trim().min(1).max(100).default('All Papers'),
  timeLimitMinutes: z.number().int().positive().max(600).default(45),
  questionIds: z.array(z.string().trim().min(1)).min(1).max(200),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ exams: [] }, { status: 401 });
    }
    await ensureSeeded();

    const exams = await db
      .select()
      .from(schema.examSessions)
      .where(eq(schema.examSessions.userId, user.id))
      .orderBy(desc(schema.examSessions.createdAt))
      .all();

    return NextResponse.json({
      exams: exams.map((e) => ({
        ...e,
        questionIds: safeJsonParse<string[]>(e.questionIdsJson, []),
        answers: safeJsonParse<Record<string, string>>(e.answersJson, {}),
        scores: safeJsonParse<Record<string, number>>(e.scoresJson, {}),
      })),
    });
  } catch {
    return NextResponse.json({ exams: [] }, { status: 500 });
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

    const parsed = ExamCreateSchema.safeParse(jsonBody.data);
    if (!parsed.success) {
      return validationErrorResponse('Invalid exam payload', parsed.error);
    }

    const d = parsed.data;
    await ensureSeeded();

    const uniqueIds = Array.from(new Set(d.questionIds));
    const foundQuestions = await db
      .select({ id: schema.questions.id })
      .from(schema.questions)
      .where(inArray(schema.questions.id, uniqueIds))
      .all();

    if (foundQuestions.length !== uniqueIds.length) {
      return NextResponse.json(
        { error: 'One or more questionIds do not exist.' },
        { status: 400 }
      );
    }

    const created = {
      id: `exam-${crypto.randomUUID()}`,
      userId: user.id,
      subjectSlug: d.subjectSlug,
      title: d.title,
      paperFilter: d.paperFilter,
      timeLimitMinutes: d.timeLimitMinutes,
      questionIdsJson: JSON.stringify(d.questionIds),
      answersJson: JSON.stringify({}),
      scoresJson: JSON.stringify({}),
      status: 'in_progress',
      createdAt: Date.now(),
      completedAt: null,
    };

    await db.insert(schema.examSessions).values(created).run();
    return NextResponse.json({
      exam: {
        ...created,
        questionIds: d.questionIds,
        answers: {},
        scores: {},
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Unable to create exam session.' },
      { status: 500 }
    );
  }
}
