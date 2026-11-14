import { NextResponse } from 'next/server';
import { and, desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/db';
import { ensureSeeded } from '@/db/seed';
import { getCurrentUser } from '@/lib/auth';
import type { OriginalitySignal } from '@/lib/originality';
import {
  isValidJsonString,
  parseJsonBody,
  safeJsonParse,
  validationErrorResponse,
} from '@/app/api/_lib/json';

export interface EssayAnnotation {
  id: string;
  type: 'comment' | 'edit';
  criterion: string;
  quote: string;
  comment: string;
  replacementText?: string;
  status: 'open' | 'accepted' | 'dismissed';
}

export interface CriterionScoreItem {
  criterion: string;
  title: string;
  score: number;
  maxScore: number;
  rationale: string;
}

const AnnotationSchema = z.object({
  id: z.string(),
  type: z.enum(['comment', 'edit']),
  criterion: z.string(),
  quote: z.string(),
  comment: z.string(),
  replacementText: z.string().optional(),
  status: z.enum(['open', 'accepted', 'dismissed']).default('open'),
});

const CriterionScoreSchema = z.object({
  criterion: z.string(),
  title: z.string().default(''),
  score: z.number(),
  maxScore: z.number(),
  rationale: z.string(),
});

const EssayUpsertSchema = z.object({
  id: z.string().trim().min(1).max(200).optional(),
  subjectSlug: z.enum(['bio', 'chem', 'hist', 'eng', 'fr', 'math']).default('hist'),
  documentType: z.string().trim().min(1).max(100).default('Internal Assessment'),
  currentStep: z.number().int().min(1).max(3).default(3),
  title: z.string().trim().min(1).max(300),
  researchQuestion: z.string().max(1000).default(''),
  plainText: z.string(),
  contentJson: z
    .string()
    .refine(isValidJsonString, 'contentJson must be valid JSON.')
    .optional(),
  annotations: z.array(AnnotationSchema).optional(),
  annotationsJson: z
    .string()
    .refine(isValidJsonString, 'annotationsJson must be valid JSON.')
    .optional(),
  criteriaScores: z.array(CriterionScoreSchema).optional(),
  criteriaScoresJson: z
    .string()
    .refine(isValidJsonString, 'criteriaScoresJson must be valid JSON.')
    .optional(),
  originalitySignal: z.record(z.unknown()).nullable().optional(),
  originalitySignalJson: z
    .string()
    .refine(isValidJsonString, 'originalitySignalJson must be valid JSON.')
    .nullable()
    .optional(),
  estimatedScore: z.number().min(0).max(100).nullable().optional(),
  maxScore: z.number().int().positive().max(100).optional(),
});

async function ensureSubjectsReady() {
  await ensureSeeded();
}

function serializeEssayRow(row: typeof schema.essayDocuments.$inferSelect) {
  const parsedCriteria = safeJsonParse<unknown>(row.criteriaScoresJson, []);
  const criteriaScores: CriterionScoreItem[] = Array.isArray(parsedCriteria)
    ? (parsedCriteria as CriterionScoreItem[])
    : [];

  const parsedAnnotations = safeJsonParse<unknown>(row.annotationsJson, []);
  const annotations: EssayAnnotation[] = Array.isArray(parsedAnnotations)
    ? (parsedAnnotations as EssayAnnotation[])
    : [];

  const parsedSignal = safeJsonParse<unknown>(row.originalitySignalJson, null);
  const originalitySignal: OriginalitySignal | null =
    parsedSignal &&
    typeof parsedSignal === 'object' &&
    !Array.isArray(parsedSignal) &&
    Object.keys(parsedSignal).length > 0
      ? (parsedSignal as OriginalitySignal)
      : null;

  return {
    ...row,
    criteriaScores,
    annotations,
    originalitySignal,
  };
}

async function resolveAuthenticatedUser() {
  const user = await getCurrentUser();
  if (!user) return null;
  await ensureSubjectsReady();
  return user;
}

export async function GET() {
  try {
    const user = await resolveAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = user.id;

    const rows = await db
      .select()
      .from(schema.essayDocuments)
      .where(eq(schema.essayDocuments.userId, userId))
      .orderBy(desc(schema.essayDocuments.updatedAt))
      .all();

    return NextResponse.json({
      essays: rows.map(serializeEssayRow),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to load essay documents',
      },
      { status: 500 }
    );
  }
}

async function handleUpsert(request: Request) {
  try {
    const user = await resolveAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = user.id;

    const jsonBody = await parseJsonBody(request);
    if (!jsonBody.ok) return jsonBody.response;

    const parsed = EssayUpsertSchema.safeParse(jsonBody.data);

    if (!parsed.success) {
      return validationErrorResponse('Invalid essay payload', parsed.error);
    }

    const payload = parsed.data;
    const now = Date.now();
    const essayId = payload.id || `essay-${payload.subjectSlug}-${now}`;

    const contentJson =
      payload.contentJson ??
      JSON.stringify({
        type: 'doc',
        content: payload.plainText
          .split(/\n\n+/)
          .filter(Boolean)
          .map((p) => ({
            type: 'paragraph',
            content: [{ type: 'text', text: p }],
          })),
      });

    const existing = await db
      .select()
      .from(schema.essayDocuments)
      .where(eq(schema.essayDocuments.id, essayId))
      .get();

    if (existing) {
      if (existing.userId !== userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      const annotationsJson =
        payload.annotationsJson ??
        (payload.annotations !== undefined
          ? JSON.stringify(payload.annotations)
          : existing.annotationsJson);
      const criteriaScoresJson =
        payload.criteriaScoresJson ??
        (payload.criteriaScores !== undefined
          ? JSON.stringify(payload.criteriaScores)
          : existing.criteriaScoresJson);
      const originalitySignalJson =
        payload.originalitySignalJson !== undefined
          ? (payload.originalitySignalJson ?? 'null')
          : payload.originalitySignal !== undefined
            ? JSON.stringify(payload.originalitySignal)
            : existing.originalitySignalJson;

      await db
        .update(schema.essayDocuments)
        .set({
          subjectSlug: payload.subjectSlug,
          documentType: payload.documentType,
          currentStep: payload.currentStep,
          title: payload.title,
          researchQuestion: payload.researchQuestion,
          plainText: payload.plainText,
          contentJson,
          annotationsJson,
          criteriaScoresJson,
          originalitySignalJson,
          estimatedScore:
            payload.estimatedScore !== undefined
              ? payload.estimatedScore
              : existing.estimatedScore,
          maxScore: payload.maxScore ?? existing.maxScore,
          updatedAt: now,
        })
        .where(
          and(
            eq(schema.essayDocuments.id, essayId),
            eq(schema.essayDocuments.userId, userId)
          )
        )
        .run();
    } else {
      const annotationsJson =
        payload.annotationsJson ?? JSON.stringify(payload.annotations ?? []);
      const criteriaScoresJson =
        payload.criteriaScoresJson ?? JSON.stringify(payload.criteriaScores ?? []);
      const originalitySignalJson =
        payload.originalitySignalJson !== undefined
          ? (payload.originalitySignalJson ?? 'null')
          : payload.originalitySignal !== undefined
            ? JSON.stringify(payload.originalitySignal)
            : 'null';

      await db
        .insert(schema.essayDocuments)
        .values({
          id: essayId,
          userId,
          subjectSlug: payload.subjectSlug,
          documentType: payload.documentType,
          currentStep: payload.currentStep,
          title: payload.title,
          researchQuestion: payload.researchQuestion,
          plainText: payload.plainText,
          contentJson,
          annotationsJson,
          criteriaScoresJson,
          originalitySignalJson,
          estimatedScore: payload.estimatedScore ?? 0,
          maxScore: payload.maxScore ?? 25,
          updatedAt: now,
        })
        .run();
    }

    const updatedRow = await db
      .select()
      .from(schema.essayDocuments)
      .where(
        and(
          eq(schema.essayDocuments.id, essayId),
          eq(schema.essayDocuments.userId, userId)
        )
      )
      .get();

    return NextResponse.json({
      essay: updatedRow ? serializeEssayRow(updatedRow) : null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to save essay document',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return handleUpsert(request);
}

export async function PUT(request: Request) {
  return handleUpsert(request);
}
