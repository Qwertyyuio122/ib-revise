import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/db';
import { ensureSeeded } from '@/db/seed';
import { getCurrentUser } from '@/lib/auth';
import { parseJsonBody, validationErrorResponse } from '@/app/api/_lib/json';

const AttemptSchema = z
  .object({
    questionId: z.string().trim().min(1).max(200),
    userAnswer: z.string().max(15_000),
    awardedMarks: z.number().int().min(0),
    maxMarks: z.number().int().positive(),
    matchedPoints: z.array(z.string().max(1000)).max(50).default([]),
    missedPoints: z.array(z.string().max(1000)).max(50).default([]),
    aiFeedbackMarkdown: z.string().max(10_000).optional(),
    durationSeconds: z.number().int().min(0).max(86_400).default(0),
  })
  .refine((d) => d.awardedMarks <= d.maxMarks, {
    message: 'awardedMarks cannot exceed maxMarks.',
  });

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jsonBody = await parseJsonBody(req);
    if (!jsonBody.ok) return jsonBody.response;

    const parsed = AttemptSchema.safeParse(jsonBody.data);
    if (!parsed.success) {
      return validationErrorResponse('Invalid attempt payload', parsed.error);
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

    const attempt = {
      id: `att-${crypto.randomUUID()}`,
      userId: user.id,
      questionId: d.questionId,
      userAnswer: d.userAnswer,
      awardedMarks: d.awardedMarks,
      maxMarks: d.maxMarks,
      matchedPointsJson: JSON.stringify(d.matchedPoints),
      missedPointsJson: JSON.stringify(d.missedPoints),
      aiFeedbackMarkdown: d.aiFeedbackMarkdown ?? null,
      durationSeconds: d.durationSeconds,
      createdAt: Date.now(),
    };

    await db.insert(schema.questionAttempts).values(attempt).run();

    return NextResponse.json({ attempt });
  } catch {
    return NextResponse.json(
      { error: 'Unable to save question attempt.' },
      { status: 500 }
    );
  }
}
