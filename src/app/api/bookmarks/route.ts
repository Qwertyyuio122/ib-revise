import { NextRequest, NextResponse } from 'next/server';
import { and, eq, desc } from 'drizzle-orm';
import crypto from 'crypto';
import { z } from 'zod';
import { db, schema, ensureDbReady } from '@/db';
import { getCurrentUser } from '@/lib/auth';
import { ensureSeeded } from '@/db/seed';
import { parseJsonBody, validationErrorResponse } from '@/app/api/_lib/json';

const BookmarkCreateSchema = z.object({
  subjectSlug: z.enum(['bio', 'chem', 'hist', 'eng', 'fr', 'math']),
  itemType: z.enum(['question', 'topic', 'note', 'tool', 'exemplar']),
  itemId: z.string().trim().min(1).max(200),
  title: z.string().trim().min(1).max(300),
  subtitle: z.string().max(500).default(''),
  href: z
    .string()
    .trim()
    .min(1)
    .max(500)
    .refine(
      (val) => val.startsWith('/') && !val.startsWith('//'),
      'Bookmark href must be a relative app path.'
    ),
});

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ bookmarks: [] }, { status: 401 });
    }

    await ensureSeeded();
    const subjectSlug = req.nextUrl.searchParams.get('subject');

    const whereClause =
      subjectSlug && subjectSlug !== 'all'
        ? and(
            eq(schema.bookmarks.userId, user.id),
            eq(schema.bookmarks.subjectSlug, subjectSlug)
          )
        : eq(schema.bookmarks.userId, user.id);

    const items = await db
      .select()
      .from(schema.bookmarks)
      .where(whereClause)
      .orderBy(desc(schema.bookmarks.createdAt))
      .limit(100)
      .all();

    return NextResponse.json({ bookmarks: items });
  } catch {
    return NextResponse.json(
      { bookmarks: [], error: 'Unable to load bookmarks.' },
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

    const parsed = BookmarkCreateSchema.safeParse(jsonBody.data);
    if (!parsed.success) {
      return validationErrorResponse('Invalid bookmark payload', parsed.error);
    }

    const data = parsed.data;
    await ensureSeeded();

    const existing = await db
      .select()
      .from(schema.bookmarks)
      .where(
        and(
          eq(schema.bookmarks.userId, user.id),
          eq(schema.bookmarks.itemId, data.itemId)
        )
      )
      .get();

    if (existing) {
      return NextResponse.json({ bookmark: existing });
    }

    const created = {
      id: `bm-${crypto.randomUUID()}`,
      userId: user.id,
      subjectSlug: data.subjectSlug,
      itemType: data.itemType,
      itemId: data.itemId,
      title: data.title,
      subtitle: data.subtitle,
      href: data.href,
      createdAt: Date.now(),
    };

    await db.insert(schema.bookmarks).values(created).run();
    return NextResponse.json({ bookmark: created });
  } catch {
    return NextResponse.json(
      { error: 'Unable to save bookmark.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = req.nextUrl.searchParams.get('id')?.trim();
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    await ensureDbReady();

    await db
      .delete(schema.bookmarks)
      .where(and(eq(schema.bookmarks.id, id), eq(schema.bookmarks.userId, user.id)))
      .run();

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: 'Unable to delete bookmark.' },
      { status: 500 }
    );
  }
}
