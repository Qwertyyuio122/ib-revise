import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db, schema } from '@/db';
import { ensureSeeded } from '@/db/seed';
import { getCurrentUser } from '@/lib/auth';
import { callGeminiStructured } from '@/lib/gemini';
import { parseJsonBody } from '@/app/api/_lib/json';

const BlurtingRequestSchema = z.object({
  subjectSlug: z.enum(['bio', 'chem', 'hist', 'eng', 'fr', 'math']).default('bio'),
  topicId: z.string().default('general-topic'),
  topicTitle: z.string().default('IB Core Topic'),
  userBlurtText: z
    .string()
    .min(1)
    .max(10_000)
    .refine((v) => v.trim().length >= 1, 'Recall blurt cannot be empty.'),
  checklist: z.array(z.string()).min(1).max(50),
});

const BlurtingResponseSchema = z.object({
  scorePercent: z.number().min(0).max(100),
  coveredPoints: z.array(z.string()),
  missedPoints: z.array(z.string()),
  coachingTip: z.string(),
});

function evaluateDeterministicBlurt(
  userBlurtText: string,
  checklist: string[]
): z.infer<typeof BlurtingResponseSchema> {
  const normalizedBlurt = userBlurtText.toLowerCase();
  const coveredPoints: string[] = [];
  const missedPoints: string[] = [];

  for (const point of checklist) {
    const tokens = point
      .toLowerCase()
      .replace(/[^a-z0-9àâçéèêëîïôûùüÿñæœ\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 4 && !['with', 'from', 'that', 'this', 'into', 'between', 'during', 'through'].includes(w));

    const matchedCount = tokens.filter((t) =>
      normalizedBlurt.includes(t.slice(0, Math.max(4, t.length - 2)))
    ).length;

    const threshold = Math.max(1, Math.ceil(tokens.length * 0.35));
    if (matchedCount >= threshold) {
      coveredPoints.push(point);
    } else {
      missedPoints.push(point);
    }
  }

  const scorePercent =
    checklist.length > 0
      ? Math.round((coveredPoints.length / checklist.length) * 100)
      : 0;

  const coachingTip =
    scorePercent >= 80
      ? 'Strong active recall! You captured most of the high-yield IB markscheme points from memory. Consolidate the remaining edge cases into flashcards.'
      : scorePercent >= 50
      ? 'Solid foundation. On your next 3-minute blurt, focus on writing the exact technical terminology and formulas listed in the Missed Concepts column.'
      : 'Good first pass! Active recall exposes gaps early—read the Missed Concepts aloud, close the checklist, and try a second 2-minute recall sprint.';

  return {
    scorePercent,
    coveredPoints,
    missedPoints,
    coachingTip,
  };
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jsonBody = await parseJsonBody(request);
    if (!jsonBody.ok) return jsonBody.response;

    const parsed = BlurtingRequestSchema.safeParse(jsonBody.data);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid blurting request payload.' },
        { status: 400 }
      );
    }

    const { subjectSlug, topicId, topicTitle, userBlurtText, checklist } =
      parsed.data;
    const headerKey = request.headers.get('x-gemini-key');

    const result = await callGeminiStructured({
      headerKey,
      currentUser: user,
      schema: BlurtingResponseSchema,
      systemInstruction: `You are an IB Diploma Active Recall Evaluator.
Compare the student's free-recall blurt against the official IB markscheme checklist.
Classify each checklist item into either coveredPoints (if the student expressed the concept or equivalent meaning) or missedPoints.
Compute scorePercent (0 to 100) and provide a concise coachingTip.`,
      prompt: `Subject: ${subjectSlug.toUpperCase()}
Topic: ${topicTitle}
Official IB Checklist:
${checklist.map((item, idx) => `${idx + 1}. ${item}`).join('\n')}

Student's Blank-Page Recall Blurt:
"""
${userBlurtText}
"""`,
      fallback: () => evaluateDeterministicBlurt(userBlurtText, checklist),
    });

    const normalizedScore = Math.max(
      0,
      Math.min(100, Math.round(result.data.scorePercent))
    );
    const responsePayload = {
      ...result.data,
      scorePercent: normalizedScore,
    };

    try {
      await ensureSeeded();
      await db
        .insert(schema.recallSessions)
        .values({
          id: `blurt-${crypto.randomUUID()}`,
          userId: user.id,
          subjectSlug,
          topicId,
          mode: 'blurting',
          transcriptOrBlurtJson: JSON.stringify({
            topicTitle,
            userBlurtText,
            checklist,
          }),
          scorePercent: normalizedScore,
          feedbackJson: JSON.stringify(responsePayload),
          createdAt: Date.now(),
        })
        .run();
    } catch {
      // Non-blocking persistence
    }

    return NextResponse.json({
      ...responsePayload,
      mode: result.mode,
      modelUsed: result.modelUsed,
      ...(result.fallbackReason ? { fallbackReason: result.fallbackReason } : {}),
    });
  } catch {
    return NextResponse.json(
      { error: 'Unable to evaluate active recall blurt.' },
      { status: 500 }
    );
  }
}
