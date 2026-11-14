import { NextRequest, NextResponse } from 'next/server';
import { and, eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema, ensureDbReady } from '@/db';
import { getCurrentUser } from '@/lib/auth';
import { parseJsonBody, validationErrorResponse } from '@/app/api/_lib/json';

const NotificationUpdateSchema = z
  .object({
    markAllRead: z.boolean().optional(),
    id: z.string().trim().min(1).max(200).optional(),
  })
  .refine((d) => d.markAllRead === true || typeof d.id === 'string', {
    message: 'Provide markAllRead: true or a notification id.',
  });

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ notifications: [] }, { status: 401 });
    }

    await ensureDbReady();

    const items = await db
      .select()
      .from(schema.notifications)
      .where(eq(schema.notifications.userId, user.id))
      .orderBy(desc(schema.notifications.createdAt))
      .all();

    return NextResponse.json({ notifications: items });
  } catch {
    return NextResponse.json(
      { notifications: [], error: 'Unable to load notifications.' },
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

    const parsed = NotificationUpdateSchema.safeParse(jsonBody.data);
    if (!parsed.success) {
      return validationErrorResponse(
        'Invalid notification update payload.',
        parsed.error
      );
    }

    await ensureDbReady();
    if (parsed.data.markAllRead) {
      await db
        .update(schema.notifications)
        .set({ isRead: 1 })
        .where(eq(schema.notifications.userId, user.id))
        .run();
    } else if (parsed.data.id) {
      const existing = await db
        .select({ id: schema.notifications.id })
        .from(schema.notifications)
        .where(
          and(
            eq(schema.notifications.id, parsed.data.id),
            eq(schema.notifications.userId, user.id)
          )
        )
        .get();

      if (!existing) {
        return NextResponse.json(
          { error: 'Notification not found.' },
          { status: 404 }
        );
      }

      await db
        .update(schema.notifications)
        .set({ isRead: 1 })
        .where(
          and(
            eq(schema.notifications.id, parsed.data.id),
            eq(schema.notifications.userId, user.id)
          )
        )
        .run();
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: 'Unable to update notifications.' },
      { status: 500 }
    );
  }
}
