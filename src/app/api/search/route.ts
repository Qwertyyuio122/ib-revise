import { NextRequest, NextResponse } from 'next/server';
import { and, eq, like, or } from 'drizzle-orm';
import { db, schema } from '@/db';
import { ensureSeeded } from '@/db/seed';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureSeeded();
    const q = (req.nextUrl.searchParams.get('q') ?? '').trim().slice(0, 80);

    const topicProjection = {
      id: schema.syllabusTopics.id,
      subjectSlug: schema.syllabusTopics.subjectSlug,
      code: schema.syllabusTopics.code,
      title: schema.syllabusTopics.title,
      unitCode: schema.syllabusTopics.unitCode,
      levelScope: schema.syllabusTopics.levelScope,
    };

    const questionProjection = {
      id: schema.questions.id,
      subjectSlug: schema.questions.subjectSlug,
      commandTerm: schema.questions.commandTerm,
      stemMarkdown: schema.questions.stemMarkdown,
      paper: schema.questions.paper,
      marks: schema.questions.marks,
    };

    const noteProjection = {
      id: schema.notes.id,
      subjectSlug: schema.notes.subjectSlug,
      title: schema.notes.title,
      excerpt: schema.notes.excerpt,
    };

    if (!q) {
      const topTopics = await db
        .select(topicProjection)
        .from(schema.syllabusTopics)
        .limit(8)
        .all();
      const topQuestions = await db
        .select(questionProjection)
        .from(schema.questions)
        .limit(6)
        .all();
      return NextResponse.json({
        results: [
          ...topTopics.map((t) => ({
            id: t.id,
            type: 'topic' as const,
            subjectSlug: t.subjectSlug,
            title: `${t.code} · ${t.title}`,
            subtitle: `${t.unitCode} · ${t.levelScope}`,
            href: `/study-guides?subject=${t.subjectSlug}&topic=${t.id}`,
          })),
          ...topQuestions.map((qu) => ({
            id: qu.id,
            type: 'question' as const,
            subjectSlug: qu.subjectSlug,
            title: `${qu.commandTerm}: ${qu.stemMarkdown.slice(0, 80)}...`,
            subtitle: `${qu.paper} · ${qu.marks} Marks`,
            href: `/questions?subject=${qu.subjectSlug}&questionId=${qu.id}`,
          })),
        ],
      });
    }

    const pattern = `%${q}%`;
    const matchedTopics = await db
      .select(topicProjection)
      .from(schema.syllabusTopics)
      .where(
        or(
          like(schema.syllabusTopics.title, pattern),
          like(schema.syllabusTopics.code, pattern),
          like(schema.syllabusTopics.studyGuideMarkdown, pattern)
        )
      )
      .limit(10)
      .all();

    const matchedQuestions = await db
      .select(questionProjection)
      .from(schema.questions)
      .where(
        or(
          like(schema.questions.stemMarkdown, pattern),
          like(schema.questions.commandTerm, pattern)
        )
      )
      .limit(10)
      .all();

    const matchedNotes = await db
      .select(noteProjection)
      .from(schema.notes)
      .where(
        and(
          eq(schema.notes.userId, user.id),
          or(
            like(schema.notes.title, pattern),
            like(schema.notes.contentMarkdown, pattern)
          )
        )
      )
      .limit(6)
      .all();

    return NextResponse.json({
      results: [
        ...matchedTopics.map((t) => ({
          id: t.id,
          type: 'topic' as const,
          subjectSlug: t.subjectSlug,
          title: `${t.code} · ${t.title}`,
          subtitle: `${t.unitCode} · ${t.levelScope}`,
          href: `/study-guides?subject=${t.subjectSlug}&topic=${t.id}`,
        })),
        ...matchedQuestions.map((qu) => ({
          id: qu.id,
          type: 'question' as const,
          subjectSlug: qu.subjectSlug,
          title: `${qu.commandTerm}: ${qu.stemMarkdown.slice(0, 85)}`,
          subtitle: `${qu.paper} · ${qu.marks} Marks`,
          href: `/questions?subject=${qu.subjectSlug}&questionId=${qu.id}`,
        })),
        ...matchedNotes.map((n) => ({
          id: n.id,
          type: 'note' as const,
          subjectSlug: n.subjectSlug,
          title: n.title,
          subtitle: n.excerpt,
          href: `/notes?noteId=${n.id}`,
        })),
      ],
    });
  } catch {
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
