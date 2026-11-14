import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db, schema } from '@/db';
import { ensureSeeded } from '@/db/seed';
import { getCurrentUser } from '@/lib/auth';
import { callGeminiStructured } from '@/lib/gemini';
import { parseJsonBody } from '@/app/api/_lib/json';

const TeachSproutRequestSchema = z.object({
  subjectSlug: z.enum(['bio', 'chem', 'hist', 'eng', 'fr', 'math']).default('bio'),
  topicTitle: z
    .string()
    .min(1)
    .max(200)
    .refine((v) => v.trim().length >= 1, 'Topic title is required.'),
  studentExplanation: z
    .string()
    .min(1)
    .max(10_000)
    .refine((v) => v.trim().length >= 1, 'Explanation is required.'),
  turnNumber: z.number().int().min(1).default(1),
  language: z.enum(['en', 'fr']).optional(),
});

const TeachSproutResponseSchema = z.object({
  sproutQuestion: z.string(),
  clarityScore: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  gapsToClarify: z.array(z.string()),
});

function buildFeynmanFallback({
  subjectSlug,
  topicTitle,
  studentExplanation,
  turnNumber,
  language,
}: z.infer<typeof TeachSproutRequestSchema>): z.infer<typeof TeachSproutResponseSchema> {
  const isFrench = language === 'fr' || subjectSlug === 'fr';
  const wordCount = studentExplanation.trim().split(/\s+/).filter(Boolean).length;
  const hasAnalogy = /like|imagine|think of|example|because|therefore|means|comme|exemple|parce que|c'est-à-dire/i.test(
    studentExplanation
  );
  const hasCauseEffect = /causes|leads to|results in|gradient|energy|rate|équilibre|énergie|conséquence/i.test(
    studentExplanation
  );

  const baseScore = Math.min(
    96,
    Math.max(
      42,
      45 +
        Math.min(30, Math.round(wordCount * 0.7)) +
        (hasAnalogy ? 12 : 0) +
        (hasCauseEffect ? 9 : 0)
    )
  );

  if (isFrench) {
    return {
      clarityScore: baseScore,
      sproutQuestion:
        turnNumber === 1
          ? `Oh, je commence à comprendre **${topicTitle}** ! Mais en tant que petit Sprout curieux : pourquoi ce phénomène se produit-il ainsi, et peux-tu me donner un exemple concret dans un pays francophone ?`
          : `Merci ! C'est beaucoup plus clair maintenant. Une dernière question de bébé Sprout : que se passerait-il si la condition principale de **${topicTitle}** changeait soudainement ?`,
      strengths: [
        hasAnalogy
          ? 'Tu as utilisé des connecteurs explicatifs clairs (« parce que », « comme ») faciles à suivre.'
          : 'Ton explication va droit au but avec un vocabulaire pertinent.',
        'La progression logique de ton explication aide à visualiser le concept.',
      ],
      gapsToClarify: [
        'Ajoute une analogie simple du quotidien pour expliquer le terme le plus abstrait.',
        'Utilise une structure au subjonctif (*bien que ce soit...*) pour nuancer ton propos.',
      ],
    };
  }

  const subjectFollowUps: Record<string, string> = {
    bio: `Wait—I see what happens during **${topicTitle}**, but *why* don't the molecules just stop moving once they cross? What physical force or gradient keeps pushing them, and what happens at dynamic equilibrium?`,
    chem: `Ooh, that makes sense! But if I shrink down to the size of a single molecule during **${topicTitle}**, why do some collisions bounce off with no reaction while others break bonds?`,
    hist: `Hmm, I get the timeline of **${topicTitle}**, but why couldn't the leaders just compromise earlier? Was one deep structural problem more important than the final trigger?`,
    eng: `I see what the author is saying in **${topicTitle}**, but why did they choose *that* specific structure or tone instead of stating the idea plainly? How does it make the reader feel?`,
    math: `Okay, I see the formula for **${topicTitle}**, but if I draw it as a graph, what does that number actually *look like* geometrically—a slope, an area, or a turning point?`,
  };

  return {
    clarityScore: baseScore,
    sproutQuestion:
      subjectFollowUps[subjectSlug] ??
      `I think I follow the big picture of **${topicTitle}**! But can you explain the most technical term in your answer using a simple everyday analogy so a 12-year-old Sprout never forgets it?`,
    strengths: [
      hasAnalogy
        ? 'Great use of intuitive causal connectors ("because", "therefore", or an analogy) to anchor the mechanism.'
        : 'Clear core definition that identifies the main variables of the topic.',
      wordCount >= 25
        ? 'Sufficient depth to trace step-by-step cause and effect.'
        : 'Concise summary without unnecessary filler.',
    ],
    gapsToClarify: [
      hasAnalogy
        ? 'Explicitly state the limiting case or boundary condition (what happens at extreme values).'
        : 'Replace at least one memorized textbook term with a plain-English analogy.',
      'Connect the intuitive explanation back to the exact IB markscheme formula or key phrase.',
    ],
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

    const parsed = TeachSproutRequestSchema.safeParse(jsonBody.data);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid Teach Sprout request payload.' },
        { status: 400 }
      );
    }

    const input = parsed.data;
    const isFrench = input.language === 'fr' || input.subjectSlug === 'fr';
    const headerKey = request.headers.get('x-gemini-key');

    const result = await callGeminiStructured({
      headerKey,
      currentUser: user,
      schema: TeachSproutResponseSchema,
      systemInstruction: `You are "Baby Sprout", a curious, bright student learning via the Feynman Technique.
The user is an IB Diploma student teaching you "${input.topicTitle}" (${input.subjectSlug.toUpperCase()}).
${isFrench ? 'Respond ENTIRELY in French (français).' : 'Respond in clear English.'}
Evaluate whether the student truly understands the mechanism in plain intuition or is hiding behind unexplained jargon.
Return JSON with:
- sproutQuestion (a curious follow-up question poking at any unexplained jargon or asking "why?")
- clarityScore (0 to 100 integer)
- strengths (array of 2 strings praising clear intuition)
- gapsToClarify (array of 2 strings pointing out jargon or missing steps)`,
      prompt: `Topic: ${input.topicTitle} (${input.subjectSlug.toUpperCase()})
Turn: ${input.turnNumber}
Student's Explanation to Baby Sprout:
"""
${input.studentExplanation}
"""`,
      fallback: () => buildFeynmanFallback(input),
    });

    const normalizedScore = Math.max(
      0,
      Math.min(100, Math.round(result.data.clarityScore))
    );
    const responsePayload = {
      ...result.data,
      clarityScore: normalizedScore,
    };

    try {
      await ensureSeeded();
      await db
        .insert(schema.recallSessions)
        .values({
          id: `feynman-${crypto.randomUUID()}`,
          userId: user.id,
          subjectSlug: input.subjectSlug,
          topicId: input.topicTitle.toLowerCase().replace(/\s+/g, '-').slice(0, 48),
          mode: 'feynman',
          transcriptOrBlurtJson: JSON.stringify(input),
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
      { error: 'Unable to process Feynman explanation.' },
      { status: 500 }
    );
  }
}
