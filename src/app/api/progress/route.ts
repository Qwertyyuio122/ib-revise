import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema, ensureDbReady } from '@/db';
import { ensureSeeded } from '@/db/seed';
import { getCurrentUser } from '@/lib/auth';
import { parseJsonBody, validationErrorResponse } from '@/app/api/_lib/json';

const ProgressUpdateSchema = z.object({
  topicId: z.string().trim().min(1).max(200),
  status: z.enum([
    'mastered',
    'confident',
    'practicing',
    'review_needed',
    'struggling',
    'unseen',
  ]),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ progress: {} }, { status: 401 });
    }

    await ensureDbReady();

    const rows = await db
      .select({
        topicId: schema.topicProgress.topicId,
        status: schema.topicProgress.status,
      })
      .from(schema.topicProgress)
      .where(eq(schema.topicProgress.userId, user.id))
      .all();

    const map: Record<string, string> = {};
    for (const r of rows) {
      map[r.topicId] = r.status;
    }
    return NextResponse.json({ progress: map });
  } catch {
    return NextResponse.json(
      { progress: {}, error: 'Unable to load topic progress.' },
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

    const parsed = ProgressUpdateSchema.safeParse(jsonBody.data);
    if (!parsed.success) {
      return validationErrorResponse('Invalid progress payload', parsed.error);
    }

    const { topicId, status } = parsed.data;
    await ensureSeeded();

    const topic = await db
      .select({ id: schema.syllabusTopics.id })
      .from(schema.syllabusTopics)
      .where(eq(schema.syllabusTopics.id, topicId))
      .get();

    if (!topic) {
      return NextResponse.json(
        { error: 'Syllabus topic not found.' },
        { status: 404 }
      );
    }

    const id = `${user.id}:${topicId}`;
    const now = Date.now();

    await db
      .insert(schema.topicProgress)
      .values({
        id,
        userId: user.id,
        topicId,
        status,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: schema.topicProgress.id,
        setWhere: eq(schema.topicProgress.userId, user.id),
        set: { status, updatedAt: now },
      })
      .run();

    return NextResponse.json({ ok: true, topicId, status });
  } catch {
    return NextResponse.json(
      { error: 'Unable to update topic progress.' },
      { status: 500 }
    );
  }
}
