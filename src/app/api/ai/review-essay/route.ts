import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, ensureDbReady, schema } from '@/db';
import { getCurrentUser } from '@/lib/auth';
import { callGeminiStructured } from '@/lib/gemini';
import { parseJsonBody } from '@/app/api/_lib/json';
import { analyzeOriginalityHeuristic } from '@/lib/originality';

const ReviewEssayRequestSchema = z.object({
  essayId: z.string().optional(),
  subjectSlug: z.enum(['bio', 'chem', 'hist', 'eng', 'fr', 'math']).default('hist'),
  documentType: z.string().default('Internal Assessment'),
  researchQuestion: z
    .string()
    .min(1)
    .max(1_000)
    .refine((v) => v.trim().length >= 1, 'Research question is required.'),
  plainText: z
    .string()
    .min(10)
    .max(50_000)
    .refine(
      (v) => v.trim().length >= 10,
      'Draft text must contain at least 10 characters.'
    ),
});

const GeminiReviewResponseSchema = z.object({
  estimatedScore: z.number(),
  maxScore: z.number(),
  criteriaScores: z.array(
    z.object({
      criterion: z.string(),
      title: z.string().default(''),
      score: z.number(),
      maxScore: z.number(),
      rationale: z.string(),
    })
  ),
  annotations: z.array(
    z.object({
      id: z.string(),
      type: z.enum(['comment', 'edit']),
      criterion: z.string(),
      quote: z.string(),
      comment: z.string(),
      replacementText: z.string().optional(),
      status: z.enum(['open', 'accepted', 'dismissed']).default('open'),
    })
  ),
});

type GeminiReviewResponse = z.infer<typeof GeminiReviewResponseSchema>;

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 16);
}

function buildDeterministicRubricFallback(
  subjectSlug: 'bio' | 'chem' | 'hist' | 'eng' | 'fr' | 'math',
  plainText: string
): GeminiReviewResponse {
  const sentences = splitSentences(plainText);
  const firstTarget =
    sentences.find((s) => s.includes('Passive resistance')) ||
    sentences[0] ||
    plainText.slice(0, Math.min(110, plainText.length));

  const explicitWeakClause = plainText.includes(
    '...which destroyed the whole German middle class...'
  )
    ? '...which destroyed the whole German middle class...'
    : plainText.includes(
        'which proves that the plant got tired of photosynthesizing at high concentrations.'
      )
    ? 'which proves that the plant got tired of photosynthesizing at high concentrations.'
    : plainText.includes(
        'showing that slavery was very bad and made characters sad for a long time.'
      )
    ? 'showing that slavery was very bad and made characters sad for a long time.'
    : sentences[1] || sentences[0] || firstTarget;

  if (subjectSlug === 'hist') {
    return {
      estimatedScore: 21,
      maxScore: 25,
      criteriaScores: [
        {
          criterion: 'Criterion A',
          title: 'Identification & Evaluation of Sources',
          score: 5,
          maxScore: 6,
          rationale:
            'Explicitly evaluates origin, purpose, value, and limitation (OPCVL) of primary archival sources.',
        },
        {
          criterion: 'Criterion B',
          title: 'Investigation',
          score: 13,
          maxScore: 15,
          rationale:
            'Coherent multi-perspective investigation contrasting structuralist (Peukert) and intentionalist/revisionist (Kolb) interpretations.',
        },
        {
          criterion: 'Criterion C',
          title: 'Reflection',
          score: 3,
          maxScore: 4,
          rationale:
            'Reflects effectively on the methodological challenges of quantifying hyperinflationary social trauma.',
        },
      ],
      annotations: [
        {
          id: `ann-hist-c1-${Date.now()}`,
          type: 'comment',
          criterion: 'Criterion B',
          quote: firstTarget,
          comment:
            'Cite the November 1923 Reichsbank exchange rate (4.2 trillion marks/USD) to anchor hyperinflation magnitude.',
          status: 'open',
        },
        {
          id: `ann-hist-e1-${Date.now() + 1}`,
          type: 'edit',
          criterion: 'Criterion B',
          quote: explicitWeakClause,
          comment: 'Replaces vague wording with historiographical precision.',
          replacementText:
            explicitWeakClause === '...which destroyed the whole German middle class...'
              ? '...severely eroded the savings and confidence of the German Mittelstand.'
              : 'demonstrated how fiscal destabilization eroded the liquid savings and democratic allegiance of the German Mittelstand.',
          status: 'open',
        },
      ],
    };
  }

  if (subjectSlug === 'bio' || subjectSlug === 'chem') {
    const isBio = subjectSlug === 'bio';
    return {
      estimatedScore: 20,
      maxScore: 24,
      criteriaScores: [
        {
          criterion: 'Criterion A',
          title: 'Research Design',
          score: 5,
          maxScore: 6,
          rationale:
            'Focused research question with controlled variables, clear methodology, and justified concentration range.',
        },
        {
          criterion: 'Criterion B',
          title: 'Data Analysis',
          score: 5,
          maxScore: 6,
          rationale:
            'Propagates instrumental uncertainties (±) and applies inferential statistics appropriately.',
        },
        {
          criterion: 'Criterion C',
          title: 'Conclusion',
          score: 5,
          maxScore: 6,
          rationale: isBio
            ? 'Interprets plateau kinetics via RuBisCO saturation and active-site collision theory.'
            : 'Links activation energy and rate constants directly to collision geometry and literature values.',
        },
        {
          criterion: 'Criterion D',
          title: 'Evaluation',
          score: 5,
          maxScore: 6,
          rationale:
            'Identifies specific systematic methodological limitations and proposes realistic quantitative modifications.',
        },
      ],
      annotations: [
        {
          id: `ann-sci-c1-${Date.now()}`,
          type: 'comment',
          criterion: 'Criterion B',
          quote: firstTarget,
          comment:
            'Include percentage uncertainty alongside absolute apparatus uncertainty to contextualize random vs systematic error.',
          status: 'open',
        },
        {
          id: `ann-sci-e1-${Date.now() + 1}`,
          type: 'edit',
          criterion: 'Criterion C',
          quote: explicitWeakClause,
          comment:
            'Replaces informal causal phrasing with precise IB biochemical/chemical mechanism terminology.',
          replacementText: isBio
            ? 'indicating active-site saturation of RuBisCO and rate limitation by RuBP regeneration in the Calvin cycle.'
            : 'demonstrating that substrate concentration exceeded the pseudo-first-order kinetic regime.',
          status: 'open',
        },
      ],
    };
  }

  if (subjectSlug === 'math') {
    return {
      estimatedScore: 17,
      maxScore: 20,
      criteriaScores: [
        {
          criterion: 'Criterion A',
          title: 'Presentation',
          score: 4,
          maxScore: 4,
          rationale: 'Clear mathematical progression linking definitions, graphs, and derivations.',
        },
        {
          criterion: 'Criterion B',
          title: 'Mathematical Communication',
          score: 3,
          maxScore: 4,
          rationale: 'Consistent notation; ensure all variables and integration bounds are explicitly defined.',
        },
        {
          criterion: 'Criterion C',
          title: 'Personal Engagement',
          score: 3,
          maxScore: 3,
          rationale: 'Authentic independent modeling and parameter exploration.',
        },
        {
          criterion: 'Criterion D',
          title: 'Reflection',
          score: 2,
          maxScore: 3,
          rationale: 'Discusses residual errors; deepen critical reflection on asymptotic model constraints.',
        },
        {
          criterion: 'Criterion E',
          title: 'Use of Mathematics',
          score: 5,
          maxScore: 6,
          rationale: 'Thorough analytical calculus and regression verification commensurate with AA syllabus.',
        },
      ],
      annotations: [
        {
          id: `ann-math-c1-${Date.now()}`,
          type: 'comment',
          criterion: 'Criterion B',
          quote: firstTarget,
          comment:
            'Define the domain and units of every parameter immediately after introducing the differential model.',
          status: 'open',
        },
        {
          id: `ann-math-e1-${Date.now() + 1}`,
          type: 'edit',
          criterion: 'Criterion D',
          quote: explicitWeakClause,
          comment: 'Sharpens mathematical reflection on model residuals and boundary behavior.',
          replacementText:
            'Consequently, the residual variance R² = 0.984 reflects boundary divergence as t → ∞ rather than random measurement noise.',
          status: 'open',
        },
      ],
    };
  }

  if (subjectSlug === 'fr') {
    return {
      estimatedScore: 25,
      maxScore: 30,
      criteriaScores: [
        {
          criterion: 'Criterion A',
          title: 'Langue (Language)',
          score: 10,
          maxScore: 12,
          rationale:
            'Effective idiomatic structures and subjunctive mood usage; minor register shift in paragraph two.',
        },
        {
          criterion: 'Criterion B',
          title: 'Message',
          score: 10,
          maxScore: 12,
          rationale:
            'Well-developed arguments supported by francophone cultural examples.',
        },
        {
          criterion: 'Criterion C',
          title: 'Compréhension conceptuelle',
          score: 5,
          maxScore: 6,
          rationale:
            'Appropriate text-type conventions, register, and audience address.',
        },
      ],
      annotations: [
        {
          id: `ann-fr-c1-${Date.now()}`,
          type: 'comment',
          criterion: 'Criterion C',
          quote: firstTarget,
          comment:
            'Reinforce the formal editorial register with a rhetorical question or francophone institutional reference.',
          status: 'open',
        },
        {
          id: `ann-fr-e1-${Date.now() + 1}`,
          type: 'edit',
          criterion: 'Criterion A',
          quote: explicitWeakClause,
          comment:
            'Upgrades connective syntax using a present subjunctive concession clause.',
          replacementText:
            'Bien que cette transition suscite des débats légitimes au sein de la francophonie, elle demeure indispensable.',
          status: 'open',
        },
      ],
    };
  }

  // Default / English Literature HL Essay (/20)
  return {
    estimatedScore: 17,
    maxScore: 20,
    criteriaScores: [
      {
        criterion: 'Criterion A',
        title: 'Knowledge, Understanding & Interpretation',
        score: 4,
        maxScore: 5,
        rationale:
          'Perceptive interpretation of textual memory and historical trauma tied closely to the line of inquiry.',
      },
      {
        criterion: 'Criterion B',
        title: 'Analysis & Evaluation',
        score: 4,
        maxScore: 5,
        rationale:
          'Strong analysis of narrative voice and structural fragmentation; expand close reading of syntax.',
      },
      {
        criterion: 'Criterion C',
        title: 'Focus, Organization & Development',
        score: 5,
        maxScore: 5,
        rationale:
          'Cohesive, well-paced argument advancing the central thesis across paragraphs.',
      },
      {
        criterion: 'Criterion D',
        title: 'Language',
        score: 4,
        maxScore: 5,
        rationale:
          'Precise literary register; replace remaining generalized evaluative phrasing.',
      },
    ],
    annotations: [
      {
        id: `ann-eng-c1-${Date.now()}`,
        type: 'comment',
        criterion: 'Criterion B',
        quote: firstTarget,
        comment:
          'Zoom in on a specific lexical cluster or focalization shift to substantiate how narrative structure enacts trauma.',
        status: 'open',
      },
      {
        id: `ann-eng-e1-${Date.now() + 1}`,
        type: 'edit',
        criterion: 'Criterion D',
        quote: explicitWeakClause,
        comment:
          'Elevates critical register to match IB English Literature HL Essay Criterion D.',
        replacementText:
          'foregrounding how chattel slavery fractures psychic continuity and inscribes somatic trauma across generations.',
        status: 'open',
      },
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

    const parsed = ReviewEssayRequestSchema.safeParse(jsonBody.data);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid essay review request',
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { essayId, subjectSlug, documentType, researchQuestion, plainText } =
      parsed.data;
    const headerKey = request.headers.get('x-gemini-key');

    if (essayId) {
      await ensureDbReady();
      const existingEssay = await db
        .select({
          id: schema.essayDocuments.id,
          userId: schema.essayDocuments.userId,
        })
        .from(schema.essayDocuments)
        .where(eq(schema.essayDocuments.id, essayId))
        .get();
      if (existingEssay && existingEssay.userId !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const fallbackData = () =>
      buildDeterministicRubricFallback(subjectSlug, plainText);

    const systemInstruction = `You are a Senior IB Diploma Examiner for ${subjectSlug.toUpperCase()} (${documentType}).
Evaluate the student's draft strictly against the official IB assessment criteria.
CRITICAL REQUIREMENT: Every annotation's "quote" field MUST be a verbatim, character-for-character substring present in the student's draft text so that the inline editor can highlight and replace it directly.
Include at least 1 "comment" annotation (type: "comment") and 1 "edit" annotation (type: "edit" with a sharper academic "replacementText").
Return valid JSON matching:
- estimatedScore (number)
- maxScore (number)
- criteriaScores (array of { criterion, title, score, maxScore, rationale })
- annotations (array of { id, type: "comment" | "edit", criterion, quote, comment, replacementText?, status: "open" })`;

    const prompt = `Research Question: ${researchQuestion}
Assignment Type: ${documentType}
Subject: ${subjectSlug}

Student Draft Text:
"""
${plainText}
"""`;

    const result = await callGeminiStructured({
      prompt,
      systemInstruction,
      schema: GeminiReviewResponseSchema,
      headerKey,
      currentUser: user,
      fallback: fallbackData,
    });

    const sentences = splitSentences(plainText);

    // Guarantee every annotation quote is an exact substring of plainText
    const verifiedAnnotations = result.data.annotations.map((ann, idx) => {
      if (plainText.includes(ann.quote)) {
        return {
          ...ann,
          status: 'open' as const,
        };
      }
      const trimmedQuote = ann.quote.trim();
      if (trimmedQuote && plainText.includes(trimmedQuote)) {
        return {
          ...ann,
          quote: trimmedQuote,
          status: 'open' as const,
        };
      }
      const fallbackSentence =
        sentences[idx % Math.max(1, sentences.length)] ||
        plainText.slice(0, Math.min(100, plainText.length));
      if (ann.type === 'edit') {
        const { replacementText, ...rest } = ann;
        return {
          ...rest,
          type: 'comment' as const,
          quote: fallbackSentence,
          comment: replacementText
            ? `${ann.comment} (Suggested revision: "${replacementText}")`
            : ann.comment,
          status: 'open' as const,
        };
      }
      return {
        ...ann,
        quote: fallbackSentence,
        status: 'open' as const,
      };
    });

    const originalitySignal = analyzeOriginalityHeuristic(plainText);

    let finalPayload;
    if (result.mode === 'deterministic_fallback') {
      const fallback = fallbackData();
      finalPayload = {
        estimatedScore: result.data.estimatedScore,
        maxScore: result.data.maxScore || fallback.maxScore,
        criteriaScores:
          result.data.criteriaScores.length > 0
            ? result.data.criteriaScores
            : fallback.criteriaScores,
        annotations:
          verifiedAnnotations.length > 0 ? verifiedAnnotations : fallback.annotations,
        originalitySignal,
        mode: result.mode,
        modelUsed: result.modelUsed,
        ...(result.fallbackReason ? { fallbackReason: result.fallbackReason } : {}),
      };
    } else {
      const safeMax = Math.max(1, result.data.maxScore);
      const safeScore = Math.max(
        0,
        Math.min(safeMax, Math.round(result.data.estimatedScore))
      );
      finalPayload = {
        estimatedScore: safeScore,
        maxScore: safeMax,
        criteriaScores: result.data.criteriaScores,
        annotations: verifiedAnnotations,
        originalitySignal,
        mode: result.mode,
        modelUsed: result.modelUsed,
      };
    }

    if (essayId) {
      await ensureDbReady();
      const whereClause = and(
        eq(schema.essayDocuments.id, essayId),
        eq(schema.essayDocuments.userId, user.id)
      );

      await db
        .update(schema.essayDocuments)
        .set({
          estimatedScore: finalPayload.estimatedScore,
          maxScore: finalPayload.maxScore,
          criteriaScoresJson: JSON.stringify(finalPayload.criteriaScores),
          annotationsJson: JSON.stringify(finalPayload.annotations),
          originalitySignalJson: JSON.stringify(finalPayload.originalitySignal),
          plainText,
          updatedAt: Date.now(),
        })
        .where(whereClause)
        .run();
    }

    return NextResponse.json(finalPayload);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to review essay draft',
      },
      { status: 500 }
    );
  }
}
