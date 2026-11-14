import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { and, eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema, ensureDbReady } from '@/db';
import { ensureSeeded } from '@/db/seed';
import {
  getCurrentSession,
  getAuthCookieOptions,
  signSessionToken,
  SESSION_COOKIE_NAME,
  GEMINI_COOKIE_NAME,
  SESSION_DURATION_MS,
} from '@/lib/auth';
import {
  SUPPORTED_GEMINI_MODELS,
  normalizeGeminiModel,
} from '@/lib/gemini';
import { sanitizeRedirectPath } from '@/lib/auth-validation';
import { parseJsonBody } from '@/app/api/_lib/json';

const UpdateSettingsSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  geminiApiKey: z.string().max(256).optional().nullable(),
  preferredGeminiModel: z
    .enum([...SUPPORTED_GEMINI_MODELS, 'gemini-2.5-flash', 'gemini-2.5-pro'])
    .optional(),
});

const BookmarkActionSchema = z.object({
  action: z.enum(['add_bookmark', 'remove_bookmark']),
  id: z.string().optional(),
  subjectSlug: z.enum(['bio', 'chem', 'hist', 'eng', 'fr', 'math']).optional(),
  itemType: z.string().optional(),
  itemId: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  href: z.string().optional(),
});

function maskApiKey(key: string | null | undefined): string | null {
  if (!key || !key.trim()) return null;
  const trimmed = key.trim();
  if (trimmed.length <= 8) return '••••••••';
  return `${trimmed.slice(0, 6)}••••••••${trimmed.slice(-4)}`;
}

async function ensureSubjectsSeeded() {
  await ensureSeeded();
}

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { user } = session;

  let userBookmarks: Array<{
    id: string;
    subjectSlug: string;
    itemType: string;
    itemId: string;
    title: string;
    subtitle: string;
    href: string;
    createdAt: number;
  }> = [];

  try {
    await ensureSubjectsSeeded();
    userBookmarks = await db
      .select()
      .from(schema.bookmarks)
      .where(eq(schema.bookmarks.userId, user.id))
      .orderBy(desc(schema.bookmarks.createdAt))
      .all();
  } catch {
    return NextResponse.json(
      { error: 'Unable to load settings.' },
      { status: 500 }
    );
  }

  const hasPersonalKey = Boolean(user.geminiApiKey?.trim());
  const hasServerKey = Boolean(process.env.GEMINI_API_KEY?.trim());

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    hasGeminiKey: hasPersonalKey || hasServerKey,
    hasPersonalKey,
    hasServerKey,
    maskedKey: maskApiKey(user.geminiApiKey),
    preferredGeminiModel: normalizeGeminiModel(user.preferredGeminiModel),
    streakCount: user.streakCount,
    bookmarks: userBookmarks,
  });
}

type AuthenticatedSession = NonNullable<
  Awaited<ReturnType<typeof getCurrentSession>>
>;

async function handleSettingsUpdate(
  session: AuthenticatedSession,
  rawBody: Record<string, unknown>
): Promise<NextResponse> {
  const { user, sessionId } = session;
  const parsed = UpdateSettingsSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid settings payload.' },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();
  const updatedName = parsed.data.name?.trim() || user.name;
  const updatedModel = normalizeGeminiModel(
    parsed.data.preferredGeminiModel || user.preferredGeminiModel
  );

  let nextApiKey = user.geminiApiKey ?? null;
  if (parsed.data.geminiApiKey !== undefined) {
    nextApiKey = parsed.data.geminiApiKey?.trim() || null;
  }

  await ensureDbReady();

  const now = Date.now();
  await db.update(schema.users)
    .set({
      name: updatedName,
      geminiApiKey: nextApiKey,
      preferredGeminiModel: updatedModel,
      updatedAt: now,
    })
    .where(eq(schema.users.id, user.id))
    .run();

  await db.update(schema.sessions)
    .set({ expiresAt: now + SESSION_DURATION_MS })
    .where(
      and(
        eq(schema.sessions.id, sessionId),
        eq(schema.sessions.userId, user.id)
      )
    )
    .run();

  const newSessionToken = await signSessionToken({
    sessionId,
    userId: user.id,
    email: user.email,
    name: updatedName,
    preferredGeminiModel: updatedModel,
    streakCount: user.streakCount,
  });

  cookieStore.set(SESSION_COOKIE_NAME, newSessionToken, getAuthCookieOptions());

  if (nextApiKey) {
    cookieStore.set(GEMINI_COOKIE_NAME, nextApiKey, getAuthCookieOptions());
  } else if (parsed.data.geminiApiKey !== undefined) {
    cookieStore.set(GEMINI_COOKIE_NAME, '', getAuthCookieOptions(0));
  }

  const hasPersonalKey = Boolean(nextApiKey);
  const hasServerKey = Boolean(process.env.GEMINI_API_KEY?.trim());

  return NextResponse.json({
    ok: true,
    name: updatedName,
    email: user.email,
    hasGeminiKey: hasPersonalKey || hasServerKey,
    hasPersonalKey,
    hasServerKey,
    maskedKey: maskApiKey(nextApiKey),
    preferredGeminiModel: updatedModel,
    streakCount: user.streakCount,
  });
}

export async function PUT(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jsonBody = await parseJsonBody(request);
    if (!jsonBody.ok) return jsonBody.response;

    return await handleSettingsUpdate(session, jsonBody.data);
  } catch {
    return NextResponse.json(
      { error: 'Unable to update settings.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { user } = session;

    const jsonBody = await parseJsonBody(request);
    if (!jsonBody.ok) return jsonBody.response;

    const body = jsonBody.data;
    if ('action' in body) {
      const bookmarkParsed = BookmarkActionSchema.safeParse(body);
      if (!bookmarkParsed.success) {
        return NextResponse.json(
          { error: 'Invalid bookmark action payload.' },
          { status: 400 }
        );
      }

      await ensureSubjectsSeeded();
      if (bookmarkParsed.data.action === 'remove_bookmark' && bookmarkParsed.data.id) {
        await db.delete(schema.bookmarks)
          .where(
            and(
              eq(schema.bookmarks.id, bookmarkParsed.data.id),
              eq(schema.bookmarks.userId, user.id)
            )
          )
          .run();
        return NextResponse.json({ ok: true });
      }

      if (bookmarkParsed.data.action === 'add_bookmark') {
        const newId = bookmarkParsed.data.id ?? `bm-${crypto.randomUUID()}`;
        if (bookmarkParsed.data.id) {
          const existingBookmark = await db
            .select({ id: schema.bookmarks.id, userId: schema.bookmarks.userId })
            .from(schema.bookmarks)
            .where(eq(schema.bookmarks.id, bookmarkParsed.data.id))
            .get();
          if (existingBookmark) {
            if (existingBookmark.userId !== user.id) {
              return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
            return NextResponse.json({ ok: true, id: existingBookmark.id });
          }
        }
        const safeHref = bookmarkParsed.data.href
          ? sanitizeRedirectPath(bookmarkParsed.data.href)
          : '/notes';
        await db.insert(schema.bookmarks)
          .values({
            id: newId,
            userId: user.id,
            subjectSlug: bookmarkParsed.data.subjectSlug ?? 'bio',
            itemType: (bookmarkParsed.data.itemType ?? 'note').toLowerCase(),
            itemId: bookmarkParsed.data.itemId ?? newId,
            title: bookmarkParsed.data.title ?? 'Saved Study Item',
            subtitle: bookmarkParsed.data.subtitle ?? 'IB Diploma Revision',
            href: safeHref,
            createdAt: Date.now(),
          })
          .onConflictDoNothing()
          .run();
        return NextResponse.json({ ok: true, id: newId });
      }

      return NextResponse.json(
        { error: 'Invalid bookmark action payload.' },
        { status: 400 }
      );
    }

    return await handleSettingsUpdate(session, body);
  } catch {
    return NextResponse.json(
      { error: 'Unable to process settings request.' },
      { status: 500 }
    );
  }
}
