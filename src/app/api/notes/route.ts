import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { and, eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import { db, ensureDbReady, schema } from '@/db';
import { ensureSeeded } from '@/db/seed';
import { getCurrentUser } from '@/lib/auth';
import { parseJsonBody, validationErrorResponse } from '@/app/api/_lib/json';

const CreateNoteSchema = z.object({
  subjectSlug: z.enum(['bio', 'chem', 'hist', 'eng', 'fr', 'math']).default('bio'),
  topicId: z.string().trim().max(200).optional().nullable(),
  title: z.string().trim().min(1).max(300),
  contentMarkdown: z.string().max(100_000),
  isPinned: z.boolean().optional(),
});

const UpdateNoteSchema = z.object({
  id: z.string().trim().min(1).max(200),
  subjectSlug: z.enum(['bio', 'chem', 'hist', 'eng', 'fr', 'math']).optional(),
  title: z.string().trim().min(1).max(300).optional(),
  contentMarkdown: z.string().max(100_000).optional(),
  isPinned: z.boolean().optional(),
});

const DeleteNoteSchema = z.object({
  id: z.string().trim().min(1).max(200),
});

function makeExcerpt(markdown: string): string {
  return markdown
    .replace(/#+\s*/g, '')
    .replace(/\*\*|\*/g, '')
    .replace(/\$\$[\s\S]+?\$\$/g, '[Formula]')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 140);
}

async function ensureSubjectsSeeded() {
  await ensureSeeded();
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await ensureSubjectsSeeded();
    const userNotes = await db
      .select()
      .from(schema.notes)
      .where(eq(schema.notes.userId, user.id))
      .orderBy(desc(schema.notes.updatedAt))
      .all();

    return NextResponse.json({ notes: userNotes });
  } catch {
    return NextResponse.json(
      { error: 'Unable to load notes.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jsonBody = await parseJsonBody(request);
    if (!jsonBody.ok) return jsonBody.response;

    const parsed = CreateNoteSchema.safeParse(jsonBody.data);
    if (!parsed.success) {
      return validationErrorResponse('Invalid note payload.', parsed.error);
    }

    const now = Date.now();
    const noteId = `note-${crypto.randomUUID()}`;
    const noteRecord = {
      id: noteId,
      userId: user.id,
      subjectSlug: parsed.data.subjectSlug,
      topicId: parsed.data.topicId || null,
      title: parsed.data.title,
      contentMarkdown: parsed.data.contentMarkdown,
      excerpt: makeExcerpt(parsed.data.contentMarkdown),
      isPinned: parsed.data.isPinned ? 1 : 0,
      updatedAt: now,
    };

    await ensureSubjectsSeeded();
    await db.insert(schema.notes).values(noteRecord).run();

    return NextResponse.json({ note: noteRecord });
  } catch {
    return NextResponse.json(
      { error: 'Unable to create note.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jsonBody = await parseJsonBody(request);
    if (!jsonBody.ok) return jsonBody.response;

    const parsed = UpdateNoteSchema.safeParse(jsonBody.data);
    if (!parsed.success) {
      return validationErrorResponse(
        'Invalid note update payload.',
        parsed.error
      );
    }

    const now = Date.now();
    await ensureSubjectsSeeded();

    const existing = await db
      .select()
      .from(schema.notes)
      .where(
        and(
          eq(schema.notes.id, parsed.data.id),
          eq(schema.notes.userId, user.id)
        )
      )
      .get();

    if (!existing) {
      return NextResponse.json({ error: 'Note not found.' }, { status: 404 });
    }

    const nextTitle = parsed.data.title?.trim() ?? existing.title;
    const nextContent =
      parsed.data.contentMarkdown ?? existing.contentMarkdown;
    const nextSubject = parsed.data.subjectSlug ?? existing.subjectSlug;
    const nextPinned =
      parsed.data.isPinned !== undefined
        ? parsed.data.isPinned
          ? 1
          : 0
        : existing.isPinned;

    await db
      .update(schema.notes)
      .set({
        title: nextTitle,
        contentMarkdown: nextContent,
        excerpt: makeExcerpt(nextContent),
        subjectSlug: nextSubject,
        isPinned: nextPinned,
        updatedAt: now,
      })
      .where(
        and(
          eq(schema.notes.id, parsed.data.id),
          eq(schema.notes.userId, user.id)
        )
      )
      .run();

    return NextResponse.json({ ok: true, updatedAt: now });
  } catch {
    return NextResponse.json(
      { error: 'Unable to update note.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jsonBody = await parseJsonBody(request);
    if (!jsonBody.ok) return jsonBody.response;

    const parsed = DeleteNoteSchema.safeParse(jsonBody.data);
    if (!parsed.success) {
      return validationErrorResponse(
        'Invalid note delete payload.',
        parsed.error
      );
    }

    await ensureDbReady();
    await db
      .delete(schema.notes)
      .where(
        and(
          eq(schema.notes.id, parsed.data.id),
          eq(schema.notes.userId, user.id)
        )
      )
      .run();

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: 'Unable to delete note.' },
      { status: 500 }
    );
  }
}
