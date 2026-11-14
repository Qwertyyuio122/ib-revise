import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { and, eq, isNull, or } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '@/db';
import { ensureSeeded } from '@/db/seed';
import { getCurrentUser } from '@/lib/auth';
import { parseJsonBody, safeJsonParse, validationErrorResponse } from '@/app/api/_lib/json';

function parseTags(tagsJson: string): string[] {
  const parsed = safeJsonParse<unknown>(tagsJson, []);
  return Array.isArray(parsed)
    ? parsed.filter((t): t is string => typeof t === 'string')
    : [];
}

const CreateCardSchema = z.object({
  deckId: z.string().trim().min(1).max(200),
  subjectSlug: z.enum(['bio', 'chem', 'hist', 'eng', 'fr', 'math']).optional(),
  frontMarkdown: z.string().trim().min(1).max(10_000),
  backMarkdown: z.string().trim().min(1).max(10_000),
  tags: z.array(z.string().trim().min(1).max(60)).max(20).optional(),
});

const RateCardSchema = z.object({
  cardId: z.string().trim().min(1).max(200),
  rating: z.enum(['again', 'hard', 'good', 'easy']),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await ensureSeeded();

    const deckScope = or(
      isNull(schema.flashcardDecks.userId),
      eq(schema.flashcardDecks.userId, user.id)
    );
    const cardScope = or(
      isNull(schema.flashcards.userId),
      eq(schema.flashcards.userId, user.id)
    );

    const decks = await db.select().from(schema.flashcardDecks).where(deckScope).all();
    const cards = await db.select().from(schema.flashcards).where(cardScope).all();

    const overridePrefix = `${user.id}::`;
    const overrideBySeedId = new Map<string, (typeof cards)[number]>();
    for (const c of cards) {
      if (c.userId === user.id && c.id.startsWith(overridePrefix)) {
        overrideBySeedId.set(c.id.slice(overridePrefix.length), c);
      }
    }

    const visibleCards = cards
      .filter((c) => !(c.userId === user.id && c.id.startsWith(overridePrefix)))
      .map((c) => {
        const override = c.userId === null ? overrideBySeedId.get(c.id) : undefined;
        const effective = override
          ? {
              ...c,
              easeFactor: override.easeFactor,
              intervalDays: override.intervalDays,
              repetitions: override.repetitions,
              dueAt: override.dueAt,
            }
          : c;
        return {
          ...effective,
          tags: parseTags(effective.tagsJson),
        };
      });

    return NextResponse.json({
      decks,
      cards: visibleCards,
    });
  } catch {
    return NextResponse.json({ decks: [], cards: [] }, { status: 500 });
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

    const parsed = CreateCardSchema.safeParse(jsonBody.data);
    if (!parsed.success) {
      return validationErrorResponse(
        'Please provide both front and back text for the flashcard.',
        parsed.error
      );
    }

    await ensureSeeded();

    const deckScope = or(
      isNull(schema.flashcardDecks.userId),
      eq(schema.flashcardDecks.userId, user.id)
    );
    const targetDeck = await db
      .select({ id: schema.flashcardDecks.id })
      .from(schema.flashcardDecks)
      .where(and(eq(schema.flashcardDecks.id, parsed.data.deckId), deckScope))
      .get();

    if (!targetDeck) {
      return NextResponse.json(
        { error: 'Flashcard deck not found.' },
        { status: 404 }
      );
    }

    const cardId = `card-${crypto.randomUUID()}`;
    const tags = parsed.data.tags ?? ['Custom Card'];
    const now = Date.now();

    const newCard = {
      id: cardId,
      deckId: targetDeck.id,
      userId: user.id,
      frontMarkdown: parsed.data.frontMarkdown.trim(),
      backMarkdown: parsed.data.backMarkdown.trim(),
      tagsJson: JSON.stringify(tags),
      easeFactor: 2.5,
      intervalDays: 0,
      repetitions: 0,
      dueAt: now,
    };

    await db.insert(schema.flashcards).values(newCard).run();

    return NextResponse.json({
      card: {
        ...newCard,
        tags,
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create flashcard.' },
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

    const parsed = RateCardSchema.safeParse(jsonBody.data);
    if (!parsed.success) {
      return validationErrorResponse('Invalid rating payload.', parsed.error);
    }

    await ensureSeeded();
    const { cardId, rating } = parsed.data;

    const cardScope = or(
      isNull(schema.flashcards.userId),
      eq(schema.flashcards.userId, user.id)
    );

    const existing = await db
      .select()
      .from(schema.flashcards)
      .where(and(eq(schema.flashcards.id, cardId), cardScope))
      .get();

    if (!existing) {
      return NextResponse.json({ error: 'Flashcard not found' }, { status: 404 });
    }

    const isSeededCard = existing.userId === null;
    const overrideId = `${user.id}::${existing.id}`;
    const existingOverride = isSeededCard
      ? await db
          .select()
          .from(schema.flashcards)
          .where(
            and(
              eq(schema.flashcards.id, overrideId),
              eq(schema.flashcards.userId, user.id)
            )
          )
          .get()
      : undefined;

    const sm2Source = existingOverride ?? existing;
    const prevEase = sm2Source.easeFactor ?? 2.5;
    const prevReps = sm2Source.repetitions ?? 0;
    const prevInterval = sm2Source.intervalDays ?? 0;

    let nextEase = prevEase;
    let nextInterval = 1;
    let nextReps = prevReps + 1;
    const now = Date.now();
    let dueAt = now;

    if (rating === 'again') {
      nextEase = Math.max(1.3, prevEase - 0.2);
      nextInterval = 0;
      nextReps = 0;
      dueAt = now + 60 * 1000; // 1 minute
    } else if (rating === 'hard') {
      nextEase = Math.max(1.3, prevEase - 0.15);
      nextInterval = 1;
      dueAt = now + 24 * 3600 * 1000; // 1 day
    } else if (rating === 'good') {
      nextInterval = prevReps === 0 ? 4 : Math.max(4, Math.round((prevInterval || 2) * prevEase));
      dueAt = now + nextInterval * 24 * 3600 * 1000;
    } else if (rating === 'easy') {
      nextEase = Math.min(3.2, prevEase + 0.15);
      nextInterval = prevReps === 0 ? 7 : Math.max(7, Math.round((prevInterval || 4) * nextEase));
      dueAt = now + nextInterval * 24 * 3600 * 1000;
    }

    if (isSeededCard) {
      await db
        .insert(schema.flashcards)
        .values({
          id: overrideId,
          deckId: existing.deckId,
          userId: user.id,
          frontMarkdown: existing.frontMarkdown,
          backMarkdown: existing.backMarkdown,
          tagsJson: existing.tagsJson,
          easeFactor: nextEase,
          intervalDays: nextInterval,
          repetitions: nextReps,
          dueAt,
        })
        .onConflictDoUpdate({
          target: schema.flashcards.id,
          setWhere: eq(schema.flashcards.userId, user.id),
          set: {
            deckId: existing.deckId,
            frontMarkdown: existing.frontMarkdown,
            backMarkdown: existing.backMarkdown,
            tagsJson: existing.tagsJson,
            easeFactor: nextEase,
            intervalDays: nextInterval,
            repetitions: nextReps,
            dueAt,
          },
        })
        .run();
    } else {
      await db
        .update(schema.flashcards)
        .set({
          easeFactor: nextEase,
          intervalDays: nextInterval,
          repetitions: nextReps,
          dueAt,
        })
        .where(
          and(
            eq(schema.flashcards.id, existing.id),
            eq(schema.flashcards.userId, user.id)
          )
        )
        .run();
    }

    return NextResponse.json({
      ok: true,
      cardId: existing.id,
      easeFactor: nextEase,
      intervalDays: nextInterval,
      repetitions: nextReps,
      dueAt,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to update SM-2 card state.' },
      { status: 500 }
    );
  }
}
