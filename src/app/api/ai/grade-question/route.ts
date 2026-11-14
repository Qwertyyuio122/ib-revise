import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';
import { callGeminiStructured } from '@/lib/gemini';
import { parseJsonBody } from '@/app/api/_lib/json';

const GradeRequestSchema = z.object({
  questionId: z.string(),
  subjectSlug: z.string(),
  commandTerm: z.string(),
  stemMarkdown: z.string(),
  marks: z.number().int().min(1).max(50),
  userAnswer: z.string().max(15_000),
  markschemePoints: z.array(
    z.object({
      pointId: z.string(),
      requirement: z.string(),
      marks: z.number(),
      notes: z.string().optional(),
    })
  ),
});

const GradeResultSchema = z.object({
  awardedMarks: z.number().int().min(0),
  maxMarks: z.number().int().positive(),
  matchedPoints: z.array(z.string()),
  missedPoints: z.array(z.string()),
  examinerFeedback: z.string(),
  improvementTip: z.string(),
});

function deterministicGrade(
  input: z.infer<typeof GradeRequestSchema>
): z.infer<typeof GradeResultSchema> {
  const answerLower = input.userAnswer.toLowerCase();
  const matchedPoints: string[] = [];
  const missedPoints: string[] = [];
  let awarded = 0;

  for (const pt of input.markschemePoints) {
    const keywords = pt.requirement
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 4 && !['that', 'with', 'from', 'only', 'both', 'have', 'this', 'than'].includes(w));

    const matchCount = keywords.filter((kw) => answerLower.includes(kw)).length;
    const threshold = Math.max(1, Math.min(2, Math.floor(keywords.length * 0.3)));

    if (input.userAnswer.trim().length > 15 && matchCount >= threshold) {
      matchedPoints.push(`${pt.pointId}: ${pt.requirement}`);
      awarded += pt.marks;
    } else {
      missedPoints.push(`${pt.pointId}: ${pt.requirement}`);
    }
  }

  awarded = Math.min(input.marks, awarded);

  return {
    awardedMarks: awarded,
    maxMarks: input.marks,
    matchedPoints,
    missedPoints,
    examinerFeedback:
      awarded === input.marks
        ? 'Full marks awarded. Your response explicitly addresses all required IB markscheme points with precise terminology.'
        : awarded > 0
        ? `Partial credit (${awarded}/${input.marks} marks). You captured ${matchedPoints.length} markscheme point(s), but missed ${missedPoints.length} required point(s).`
        : '0 marks awarded so far. Review the missed markscheme requirements below and ensure you use exact IB command-term precision.',
    improvementTip:
      missedPoints.length > 0
        ? `To earn full marks on "${input.commandTerm}" questions, explicitly state: ${missedPoints[0]}`
        : 'Strong command-term execution.',
  };
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jsonBody = await parseJsonBody(req);
    if (!jsonBody.ok) return jsonBody.response;

    const parsed = GradeRequestSchema.safeParse(jsonBody.data);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid grading request' }, { status: 400 });
    }

    const input = parsed.data;
    const headerKey = req.headers.get('x-gemini-key');

    const result = await callGeminiStructured({
      currentUser: user,
      systemInstruction: `You are a senior IB Diploma examiner. Grade the student answer strictly against the provided IB markscheme points.
Return valid JSON matching:
- awardedMarks (integer between 0 and maxMarks)
- maxMarks (positive integer matching the question maxMarks)
- matchedPoints (array of strings listing satisfied markscheme points)
- missedPoints (array of strings listing missed markscheme points)
- examinerFeedback (concise string summarizing marks awarded and reasoning)
- improvementTip (concise actionable string for earning full marks)`,
      prompt: JSON.stringify({
        subject: input.subjectSlug,
        commandTerm: input.commandTerm,
        question: input.stemMarkdown,
        maxMarks: input.marks,
        markschemePoints: input.markschemePoints,
        studentAnswer: input.userAnswer,
      }),
      schema: GradeResultSchema,
      headerKey,
      fallback: () => deterministicGrade(input),
    });

    const clampedAwardedMarks = Math.max(
      0,
      Math.min(input.marks, Math.round(result.data.awardedMarks))
    );

    return NextResponse.json({
      ...result.data,
      awardedMarks: clampedAwardedMarks,
      maxMarks: input.marks,
      mode: result.mode,
      modelUsed: result.modelUsed,
      ...(result.fallbackReason ? { fallbackReason: result.fallbackReason } : {}),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Grading failed' },
      { status: 500 }
    );
  }
}
