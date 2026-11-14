import { NextRequest, NextResponse } from 'next/server';
import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';

const { tempDbPath, cookieJar } = vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const nodeFs = require('fs') as typeof import('fs');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const nodeOs = require('os') as typeof import('os');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const nodePath = require('path') as typeof import('path');
  const dir = nodeFs.mkdtempSync(nodePath.join(nodeOs.tmpdir(), 'sr-api-test-'));
  const dbPath = nodePath.join(dir, 'test.db');
  process.env.SIMPLE_REVISION_DB_PATH = dbPath;
  return {
    tempDbPath: dbPath,
    cookieJar: new Map<string, string>(),
  };
});

vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) => {
      const value = cookieJar.get(name);
      return value !== undefined ? { name, value } : undefined;
    },
    set: (name: string, value: string, opts?: { maxAge?: number }) => {
      if (!value || opts?.maxAge === 0) {
        cookieJar.delete(name);
      } else {
        cookieJar.set(name, value);
      }
    },
    delete: (name: string) => {
      cookieJar.delete(name);
    },
  }),
}));

import { db, ensureDbReady, getLibsqlClient, resetDbForTests, schema } from '@/db';
import { ensureSeeded, resetSeedCacheForTests } from '@/db/seed';
import { eq } from 'drizzle-orm';
import { clearAllAuthRateLimits } from '@/lib/rate-limit';
import { POST as signupPOST } from '@/app/api/auth/signup/route';
import {
  GET as flashcardsGET,
  POST as flashcardsPOST,
  PUT as flashcardsPUT,
} from '@/app/api/flashcards/route';
import {
  GET as notificationsGET,
  PUT as notificationsPUT,
} from '@/app/api/notifications/route';
import {
  GET as bookmarksGET,
  POST as bookmarksPOST,
  DELETE as bookmarksDELETE,
} from '@/app/api/bookmarks/route';
import {
  GET as settingsGET,
  POST as settingsPOST,
  PUT as settingsPUT,
} from '@/app/api/settings/route';
import {
  GET as notesGET,
  POST as notesPOST,
  PUT as notesPUT,
  DELETE as notesDELETE,
} from '@/app/api/notes/route';
import {
  GET as plannerGET,
  POST as plannerPOST,
  PUT as plannerPUT,
  DELETE as plannerDELETE,
} from '@/app/api/planner/route';
import {
  GET as essaysGET,
  POST as essaysPOST,
  PUT as essaysPUT,
} from '@/app/api/essays/route';
import {
  GET as mistakesGET,
  POST as mistakesPOST,
  PUT as mistakesPUT,
} from '@/app/api/mistakes/route';
import {
  GET as examsGET,
  POST as examsPOST,
} from '@/app/api/exams/route';
import {
  GET as progressGET,
  PUT as progressPUT,
} from '@/app/api/progress/route';
import { GET as questionsGET } from '@/app/api/questions/route';
import { POST as attemptPOST } from '@/app/api/questions/attempt/route';
import { GET as searchGET } from '@/app/api/search/route';
import { POST as originalityPOST } from '@/app/api/ai/originality/route';
import { POST as gradeQuestionPOST } from '@/app/api/ai/grade-question/route';
import { POST as blurtingPOST } from '@/app/api/ai/blurting/route';
import { POST as teachSproutPOST } from '@/app/api/ai/teach-sprout/route';
import { POST as tutorPOST } from '@/app/api/ai/tutor/route';
import { POST as reviewEssayPOST } from '@/app/api/ai/review-essay/route';
import { POST as testKeyPOST } from '@/app/api/ai/test-key/route';

function syncCookiesFromResponse(res: NextResponse) {
  for (const cookie of res.cookies.getAll()) {
    if (!cookie.value || cookie.maxAge === 0) {
      cookieJar.delete(cookie.name);
    } else {
      cookieJar.set(cookie.name, cookie.value);
    }
  }
}

function makeJsonReq(
  url: string,
  method: string,
  body?: unknown,
  headers: Record<string, string> = {}
) {
  const cookieHeader = Array.from(cookieJar.entries())
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');
  return new NextRequest(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

function makeMalformedReq(url: string, method: string, rawBody = '{bad-json') {
  const cookieHeader = Array.from(cookieJar.entries())
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');
  return new NextRequest(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    body: rawBody,
  });
}

async function signupAs(name: string, email: string, ip = '10.1.0.1') {
  cookieJar.clear();
  const res = await signupPOST(
    makeJsonReq(
      'http://localhost/api/auth/signup',
      'POST',
      { name, email, password: 'IBStudy2026!' },
      { 'x-forwarded-for': ip }
    )
  );
  expect(res.status).toBe(201);
  syncCookiesFromResponse(res);
  const body = await res.json();
  return body.user as { id: string; email: string; name: string; streakCount: number };
}

describe('API Blank-Slate Defaults, Flashcard Isolation & Validation', () => {
  beforeEach(async () => {
    cookieJar.clear();
    clearAllAuthRateLimits();
    resetSeedCacheForTests();
    await ensureDbReady();
    const client = getLibsqlClient();
    await client.executeMultiple(`
      DELETE FROM sessions;
      DELETE FROM essay_documents;
      DELETE FROM notes;
      DELETE FROM study_tasks;
      DELETE FROM bookmarks;
      DELETE FROM notifications;
      DELETE FROM mistakes_log;
      DELETE FROM exam_sessions;
      DELETE FROM question_attempts;
      DELETE FROM topic_progress;
      DELETE FROM flashcards WHERE user_id IS NOT NULL;
      DELETE FROM flashcard_decks WHERE user_id IS NOT NULL;
      DELETE FROM users;
    `);
  });

  afterAll(async () => {
    resetSeedCacheForTests();
    await resetDbForTests();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const nodeFs = require('fs') as typeof import('fs');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const nodePath = require('path') as typeof import('path');
    nodeFs.rmSync(nodePath.dirname(tempDbPath), { recursive: true, force: true });
  });

  it('starts every new user with streakCount 0 and empty workspace GET endpoints without auto-seeding', async () => {
    const user = await signupAs('Blank User', 'blank@example.com', '10.1.0.2');
    expect(user.streakCount).toBe(0);

    const [notifsRes, bookmarksRes, settingsRes, notesRes, plannerRes, essaysRes] =
      await Promise.all([
        notificationsGET(),
        bookmarksGET(new NextRequest('http://localhost/api/bookmarks')),
        settingsGET(),
        notesGET(),
        plannerGET(),
        essaysGET(),
      ]);

    expect(notifsRes.status).toBe(200);
    expect((await notifsRes.json()).notifications).toEqual([]);

    expect(bookmarksRes.status).toBe(200);
    expect((await bookmarksRes.json()).bookmarks).toEqual([]);

    expect(settingsRes.status).toBe(200);
    const settingsBody = await settingsRes.json();
    expect(settingsBody.streakCount).toBe(0);
    expect(settingsBody.bookmarks).toEqual([]);

    expect(notesRes.status).toBe(200);
    expect((await notesRes.json()).notes).toEqual([]);

    expect(plannerRes.status).toBe(200);
    expect((await plannerRes.json()).tasks).toEqual([]);

    expect(essaysRes.status).toBe(200);
    expect((await essaysRes.json()).essays).toEqual([]);

    // Creating a new essay draft defaults estimatedScore to 0 and criteria/annotations/originality empty/null
    const essayCreateRes = await essaysPOST(
      makeJsonReq('http://localhost/api/essays', 'POST', {
        subjectSlug: 'bio',
        title: 'Blank Draft',
        researchQuestion: '',
        plainText: '',
      })
    );
    expect(essayCreateRes.status).toBe(200);
    const createdEssay = (await essayCreateRes.json()).essay;
    expect(createdEssay.estimatedScore).toBe(0);
    expect(createdEssay.criteriaScores).toEqual([]);
    expect(createdEssay.annotations).toEqual([]);
    expect(createdEssay.originalitySignal).toBeNull();

    // Explicit planner generation yields incomplete tasks and zero HL-only Chemistry topics
    const genPlanRes = await plannerPOST(
      makeJsonReq('http://localhost/api/planner', 'POST', {
        generateSchedule: true,
      })
    );
    expect(genPlanRes.status).toBe(200);
    const genTasks = (await genPlanRes.json()).tasks as Array<{
      completed: number;
      subjectSlug: string;
      title: string;
    }>;
    expect(genTasks.length).toBeGreaterThan(0);
    expect(genTasks.every((t) => t.completed === 0)).toBe(true);
    const chemTitles = genTasks
      .filter((t) => t.subjectSlug === 'chem')
      .map((t) => t.title)
      .join(' ');
    expect(chemTitles).not.toMatch(/Gibbs|Entropy|Hybridization/i);
  });

  it('isolates per-user SM-2 state when rating seeded flashcards without mutating shared rows or other users', async () => {
    const userA = await signupAs('User A', 'flash-a@example.com', '10.1.0.3');
    const jarA = new Map(cookieJar);

    const getARes1 = await flashcardsGET();
    expect(getARes1.status).toBe(200);
    const getABody1 = await getARes1.json();
    const targetCard = (getABody1.cards as Array<{
      id: string;
      userId: string | null;
      easeFactor: number;
      intervalDays: number;
      repetitions: number;
    }>).find((c) => c.userId === null);
    expect(targetCard).toBeDefined();
    const cardId = targetCard!.id;
    expect(targetCard!.easeFactor).toBe(2.5);
    expect(targetCard!.repetitions).toBe(0);

    // User A rates seeded card -> 'good' (reps: 1, intervalDays: 4)
    const rateA1 = await flashcardsPUT(
      makeJsonReq('http://localhost/api/flashcards', 'PUT', {
        cardId,
        rating: 'good',
      })
    );
    expect(rateA1.status).toBe(200);
    const rateA1Body = await rateA1.json();
    expect(rateA1Body.cardId).toBe(cardId);
    expect(rateA1Body.repetitions).toBe(1);
    expect(rateA1Body.intervalDays).toBe(4);

    // User A rates same seeded card a second time -> 'easy' (should advance from User A's override, reps: 2)
    const rateA2 = await flashcardsPUT(
      makeJsonReq('http://localhost/api/flashcards', 'PUT', {
        cardId,
        rating: 'easy',
      })
    );
    expect(rateA2.status).toBe(200);
    const rateA2Body = await rateA2.json();
    expect(rateA2Body.repetitions).toBe(2);
    expect(rateA2Body.easeFactor).toBe(2.65);
    expect(rateA2Body.intervalDays).toBe(11);

    // Seeded row in DB remains completely untouched
    const rawSeeded = await db
      .select()
      .from(schema.flashcards)
      .where(eq(schema.flashcards.id, cardId))
      .get();
    expect(rawSeeded?.userId).toBeNull();
    expect(rawSeeded?.easeFactor).toBe(2.5);
    expect(rawSeeded?.intervalDays).toBe(0);
    expect(rawSeeded?.repetitions).toBe(0);

    // User A GET overlays override onto canonical id and hides `${userA.id}::${cardId}`
    const getARes2 = await flashcardsGET();
    const getABody2 = await getARes2.json();
    const cardsA = getABody2.cards as Array<{
      id: string;
      repetitions: number;
      easeFactor: number;
      intervalDays: number;
    }>;
    expect(cardsA.some((c) => c.id === `${userA.id}::${cardId}`)).toBe(false);
    const overlaidA = cardsA.find((c) => c.id === cardId);
    expect(overlaidA?.repetitions).toBe(2);
    expect(overlaidA?.easeFactor).toBe(2.65);
    expect(overlaidA?.intervalDays).toBe(11);

    // User B signs up and sees untouched default SM-2 state for the exact same seeded card
    const userB = await signupAs('User B', 'flash-b@example.com', '10.1.0.4');
    const getBRes1 = await flashcardsGET();
    expect(getBRes1.status).toBe(200);
    const cardsB = (await getBRes1.json()).cards as Array<{
      id: string;
      repetitions: number;
      easeFactor: number;
      intervalDays: number;
    }>;
    expect(cardsB.some((c) => c.id.includes('::'))).toBe(false);
    const cardForB = cardsB.find((c) => c.id === cardId);
    expect(cardForB?.repetitions).toBe(0);
    expect(cardForB?.easeFactor).toBe(2.5);
    expect(cardForB?.intervalDays).toBe(0);

    // User B rates the seeded card 'again' -> independent override for User B
    const rateB1 = await flashcardsPUT(
      makeJsonReq('http://localhost/api/flashcards', 'PUT', {
        cardId,
        rating: 'again',
      })
    );
    expect(rateB1.status).toBe(200);
    const rateB1Body = await rateB1.json();
    expect(rateB1Body.easeFactor).toBe(2.3);
    expect(rateB1Body.repetitions).toBe(0);

    // Switch back to User A: User A's override is still intact, and User A cannot rate User B's override row
    cookieJar.clear();
    for (const [k, v] of jarA.entries()) cookieJar.set(k, v);
    const getARes3 = await flashcardsGET();
    const cardsAAfterB = (await getARes3.json()).cards as Array<{
      id: string;
      repetitions: number;
      easeFactor: number;
      intervalDays: number;
    }>;
    const stillA = cardsAAfterB.find((c) => c.id === cardId);
    expect(stillA?.repetitions).toBe(2);
    expect(stillA?.easeFactor).toBe(2.65);
    expect(stillA?.intervalDays).toBe(11);

    const crossRateRes = await flashcardsPUT(
      makeJsonReq('http://localhost/api/flashcards', 'PUT', {
        cardId: `${userB.id}::${cardId}`,
        rating: 'easy',
      })
    );
    expect(crossRateRes.status).toBe(404);
  });

  it('handles POST /api/settings without double body-stream read crash and validates bookmark actions', async () => {
    const user = await signupAs('Settings User', 'settings-post@example.com', '10.1.0.5');

    const postSettingsRes = await settingsPOST(
      makeJsonReq('http://localhost/api/settings', 'POST', {
        name: 'Updated Name',
        preferredGeminiModel: 'gemini-3.5-flash',
      })
    );
    expect(postSettingsRes.status).toBe(200);
    const postSettingsBody = await postSettingsRes.json();
    expect(postSettingsBody.ok).toBe(true);
    expect(postSettingsBody.name).toBe('Updated Name');
    expect(postSettingsBody.preferredGeminiModel).toBe('gemini-3.5-flash');

    const dbUser = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, user.id))
      .get();
    expect(dbUser?.name).toBe('Updated Name');
    expect(dbUser?.preferredGeminiModel).toBe('gemini-3.5-flash');

    // Invalid bookmark action is rejected with 400 rather than falling through
    const badActionRes = await settingsPOST(
      makeJsonReq('http://localhost/api/settings', 'POST', {
        action: 'not_a_real_action',
      })
    );
    expect(badActionRes.status).toBe(400);

    // Malformed JSON returns 400 on both POST and PUT
    const malformedPost = await settingsPOST(
      makeMalformedReq('http://localhost/api/settings', 'POST')
    );
    const malformedPut = await settingsPUT(
      makeMalformedReq('http://localhost/api/settings', 'PUT')
    );
    expect(malformedPost.status).toBe(400);
    expect(malformedPut.status).toBe(400);
  });

  it('enforces Zod validation on PUT /api/mistakes and PUT /api/notifications, returns 400 on malformed JSON across routes, and excludes HL Chem from SL tutor', async () => {
    const user = await signupAs('Validation User', 'validate@example.com', '10.1.0.6');
    await ensureSeeded();

    // PUT /api/mistakes validation & execution
    const invalidMistakeRes = await mistakesPUT(
      makeJsonReq('http://localhost/api/mistakes', 'PUT', { resolved: true })
    );
    expect(invalidMistakeRes.status).toBe(400);

    const emptyUpdateMistakeRes = await mistakesPUT(
      makeJsonReq('http://localhost/api/mistakes', 'PUT', { id: 'm-1' })
    );
    expect(emptyUpdateMistakeRes.status).toBe(400);

    const seededQuestion = await db.select().from(schema.questions).limit(1).get();
    const createMistakeRes = await mistakesPOST(
      makeJsonReq('http://localhost/api/mistakes', 'POST', {
        questionId: seededQuestion!.id,
        userAnswer: 'Incomplete',
        missedConcepts: ['Key point'],
      })
    );
    expect(createMistakeRes.status).toBe(200);
    const mistakeId = (await createMistakeRes.json()).mistake.id as string;

    const validMistakePut = await mistakesPUT(
      makeJsonReq('http://localhost/api/mistakes', 'PUT', {
        id: mistakeId,
        resolved: true,
        userReflection: 'Reviewed units.',
      })
    );
    expect(validMistakePut.status).toBe(200);

    const mistakesList = (await (
      await mistakesGET(new NextRequest('http://localhost/api/mistakes'))
    ).json()).mistakes as Array<{ id: string; resolved: number; userReflection: string | null }>;
    expect(mistakesList.find((m) => m.id === mistakeId)?.resolved).toBe(1);
    expect(mistakesList.find((m) => m.id === mistakeId)?.userReflection).toBe(
      'Reviewed units.'
    );

    // PUT /api/notifications validation & execution
    const invalidNotifRes = await notificationsPUT(
      makeJsonReq('http://localhost/api/notifications', 'PUT', {})
    );
    expect(invalidNotifRes.status).toBe(400);

    const falseMarkAllRes = await notificationsPUT(
      makeJsonReq('http://localhost/api/notifications', 'PUT', {
        markAllRead: false,
      })
    );
    expect(falseMarkAllRes.status).toBe(400);

    await db
      .insert(schema.notifications)
      .values({
        id: 'notif-val-1',
        userId: user.id,
        title: 'Test alert',
        body: 'Body',
        href: '/questions',
        isRead: 0,
        createdAt: Date.now(),
      })
      .run();

    const validNotifPut = await notificationsPUT(
      makeJsonReq('http://localhost/api/notifications', 'PUT', {
        id: 'notif-val-1',
      })
    );
    expect(validNotifPut.status).toBe(200);
    const notifAfter = await db
      .select()
      .from(schema.notifications)
      .where(eq(schema.notifications.id, 'notif-val-1'))
      .get();
    expect(notifAfter?.isRead).toBe(1);

    // Malformed JSON across protected API routes returns 400 instead of 500
    const malformedChecks = await Promise.all([
      flashcardsPOST(makeMalformedReq('http://localhost/api/flashcards', 'POST')),
      flashcardsPUT(makeMalformedReq('http://localhost/api/flashcards', 'PUT')),
      bookmarksPOST(makeMalformedReq('http://localhost/api/bookmarks', 'POST')),
      mistakesPOST(makeMalformedReq('http://localhost/api/mistakes', 'POST')),
      mistakesPUT(makeMalformedReq('http://localhost/api/mistakes', 'PUT')),
      notificationsPUT(makeMalformedReq('http://localhost/api/notifications', 'PUT')),
      notesPOST(makeMalformedReq('http://localhost/api/notes', 'POST')),
      notesPUT(makeMalformedReq('http://localhost/api/notes', 'PUT')),
      notesDELETE(makeMalformedReq('http://localhost/api/notes', 'DELETE')),
      plannerPOST(makeMalformedReq('http://localhost/api/planner', 'POST')),
      plannerPUT(makeMalformedReq('http://localhost/api/planner', 'PUT')),
      plannerDELETE(makeMalformedReq('http://localhost/api/planner', 'DELETE')),
      essaysPOST(makeMalformedReq('http://localhost/api/essays', 'POST')),
      essaysPUT(makeMalformedReq('http://localhost/api/essays', 'PUT')),
      examsPOST(makeMalformedReq('http://localhost/api/exams', 'POST')),
      progressPUT(makeMalformedReq('http://localhost/api/progress', 'PUT')),
      attemptPOST(makeMalformedReq('http://localhost/api/questions/attempt', 'POST')),
      originalityPOST(makeMalformedReq('http://localhost/api/ai/originality', 'POST')),
      gradeQuestionPOST(makeMalformedReq('http://localhost/api/ai/grade-question', 'POST')),
      blurtingPOST(makeMalformedReq('http://localhost/api/ai/blurting', 'POST')),
      teachSproutPOST(makeMalformedReq('http://localhost/api/ai/teach-sprout', 'POST')),
      tutorPOST(makeMalformedReq('http://localhost/api/ai/tutor', 'POST')),
      reviewEssayPOST(makeMalformedReq('http://localhost/api/ai/review-essay', 'POST')),
      testKeyPOST(makeMalformedReq('http://localhost/api/ai/test-key', 'POST')),
    ]);
    for (const res of malformedChecks) {
      expect(res.status).toBe(400);
    }

    // Tutor Chemistry SL fallback avoids HL-only Entropy/Gibbs
    const prevKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;
    try {
      const tutorRes = await tutorPOST(
        makeJsonReq('http://localhost/api/ai/tutor', 'POST', {
          subjectSlug: 'chem',
          message: 'How do I solve calorimetry enthalpy calculations?',
        })
      );
      expect(tutorRes.status).toBe(200);
      const tutorBody = await tutorRes.json();
      const combined = `${tutorBody.reply} ${(tutorBody.keyTakeaways ?? []).join(' ')} ${tutorBody.followUpQuestion}`;
      expect(combined).not.toMatch(/Gibbs|Entropy|\\Delta G|\\Delta S/i);
      expect(combined).toContain('22.7');
    } finally {
      if (prevKey !== undefined) {
        process.env.GEMINI_API_KEY = prevKey;
      }
    }
  });

  it('rejects unauthenticated callers with 401 across every route and HTTP method', async () => {
    cookieJar.clear();
    const unauthCalls = await Promise.all([
      bookmarksGET(new NextRequest('http://localhost/api/bookmarks')),
      bookmarksPOST(makeJsonReq('http://localhost/api/bookmarks', 'POST', {})),
      bookmarksDELETE(new NextRequest('http://localhost/api/bookmarks?id=bm-1', { method: 'DELETE' })),
      essaysGET(),
      essaysPOST(makeJsonReq('http://localhost/api/essays', 'POST', {})),
      essaysPUT(makeJsonReq('http://localhost/api/essays', 'PUT', {})),
      examsGET(),
      examsPOST(makeJsonReq('http://localhost/api/exams', 'POST', {})),
      flashcardsGET(),
      flashcardsPOST(makeJsonReq('http://localhost/api/flashcards', 'POST', {})),
      flashcardsPUT(makeJsonReq('http://localhost/api/flashcards', 'PUT', {})),
      mistakesGET(new NextRequest('http://localhost/api/mistakes')),
      mistakesPOST(makeJsonReq('http://localhost/api/mistakes', 'POST', {})),
      mistakesPUT(makeJsonReq('http://localhost/api/mistakes', 'PUT', {})),
      notesGET(),
      notesPOST(makeJsonReq('http://localhost/api/notes', 'POST', {})),
      notesPUT(makeJsonReq('http://localhost/api/notes', 'PUT', {})),
      notesDELETE(makeJsonReq('http://localhost/api/notes', 'DELETE', {})),
      notificationsGET(),
      notificationsPUT(makeJsonReq('http://localhost/api/notifications', 'PUT', {})),
      plannerGET(),
      plannerPOST(makeJsonReq('http://localhost/api/planner', 'POST', {})),
      plannerPUT(makeJsonReq('http://localhost/api/planner', 'PUT', {})),
      plannerDELETE(makeJsonReq('http://localhost/api/planner', 'DELETE', {})),
      progressGET(),
      progressPUT(makeJsonReq('http://localhost/api/progress', 'PUT', {})),
      questionsGET(new NextRequest('http://localhost/api/questions')),
      attemptPOST(makeJsonReq('http://localhost/api/questions/attempt', 'POST', {})),
      searchGET(new NextRequest('http://localhost/api/search?q=bio')),
    ]);

    for (const res of unauthCalls) {
      expect(res.status).toBe(401);
    }
  });

  it('auto-seeds on direct write endpoints and enforces Zod/FK/JSON validation (400/404, never 500)', async () => {
    // Wipe seeded subjects too so we prove direct POST/PUT routes self-seed before FK inserts
    const client = getLibsqlClient();
    await client.executeMultiple('DELETE FROM subjects;');
    resetSeedCacheForTests();

    await signupAs('Fresh Writer', 'fresh@example.com', '10.1.0.7');

    // Direct POST /api/bookmarks works without calling GET first
    const bmRes = await bookmarksPOST(
      makeJsonReq('http://localhost/api/bookmarks', 'POST', {
        subjectSlug: 'bio',
        itemType: 'tool',
        itemId: 'bio-visualizations',
        title: 'Bio Visualizations',
        href: '/tools/bio-visualizations',
      })
    );
    expect(bmRes.status).toBe(200);

    // Direct PUT /api/progress with a seeded topic works on fresh DB
    const topicRow = await db.select().from(schema.syllabusTopics).limit(1).get();
    expect(topicRow).toBeDefined();
    const progRes = await progressPUT(
      makeJsonReq('http://localhost/api/progress', 'PUT', {
        topicId: topicRow!.id,
        status: 'practicing',
      })
    );
    expect(progRes.status).toBe(200);

    // Direct POST /api/questions/attempt with a seeded question works on fresh DB
    const questionRow = await db.select().from(schema.questions).limit(1).get();
    expect(questionRow).toBeDefined();
    const attemptRes = await attemptPOST(
      makeJsonReq('http://localhost/api/questions/attempt', 'POST', {
        questionId: questionRow!.id,
        userAnswer: 'Sample answer',
        awardedMarks: 1,
        maxMarks: questionRow!.marks,
      })
    );
    expect(attemptRes.status).toBe(200);

    // Reject non-object JSON arrays with 400
    const arrayBodyRes = await bookmarksPOST(
      makeMalformedReq('http://localhost/api/bookmarks', 'POST', '["not-an-object"]')
    );
    expect(arrayBodyRes.status).toBe(400);

    // Reject unsafe bookmark href and whitespace-only titles
    const badHrefRes = await bookmarksPOST(
      makeJsonReq('http://localhost/api/bookmarks', 'POST', {
        subjectSlug: 'bio',
        itemType: 'tool',
        itemId: 'xss-item',
        title: 'Bad Link',
        href: 'javascript:alert(1)',
      })
    );
    expect(badHrefRes.status).toBe(400);

    const blankBookmarkTitle = await bookmarksPOST(
      makeJsonReq('http://localhost/api/bookmarks', 'POST', {
        subjectSlug: 'bio',
        itemType: 'tool',
        itemId: 'blank-title',
        title: '   ',
        href: '/tools/bio-visualizations',
      })
    );
    expect(blankBookmarkTitle.status).toBe(400);

    // Reject invalid essay JSON strings and empty id
    const badEssayJsonRes = await essaysPUT(
      makeJsonReq('http://localhost/api/essays', 'PUT', {
        subjectSlug: 'hist',
        title: 'Essay Title',
        plainText: 'Body',
        contentJson: '{not-valid-json',
      })
    );
    expect(badEssayJsonRes.status).toBe(400);

    const emptyEssayIdRes = await essaysPUT(
      makeJsonReq('http://localhost/api/essays', 'PUT', {
        id: '   ',
        subjectSlug: 'hist',
        title: 'Essay Title',
        plainText: 'Body',
      })
    );
    expect(emptyEssayIdRes.status).toBe(400);

    // Reject invalid planner date/time format
    const badPlannerDateRes = await plannerPOST(
      makeJsonReq('http://localhost/api/planner', 'POST', {
        subjectSlug: 'math',
        title: 'Calc Practice',
        scheduledDate: 'not-a-date',
      })
    );
    expect(badPlannerDateRes.status).toBe(400);

    // Reject whitespace flashcard front/back and unknown deckId
    const blankCardRes = await flashcardsPOST(
      makeJsonReq('http://localhost/api/flashcards', 'POST', {
        deckId: 'bio-deck-core',
        frontMarkdown: '   ',
        backMarkdown: 'Valid',
      })
    );
    expect(blankCardRes.status).toBe(400);

    const missingDeckRes = await flashcardsPOST(
      makeJsonReq('http://localhost/api/flashcards', 'POST', {
        deckId: 'nonexistent-deck-id',
        frontMarkdown: 'Front',
        backMarkdown: 'Back',
      })
    );
    expect(missingDeckRes.status).toBe(404);

    // Reject awardedMarks > maxMarks (400) and nonexistent FK IDs (404, not 500)
    const overMarksRes = await attemptPOST(
      makeJsonReq('http://localhost/api/questions/attempt', 'POST', {
        questionId: questionRow!.id,
        userAnswer: 'Answer',
        awardedMarks: 10,
        maxMarks: 2,
      })
    );
    expect(overMarksRes.status).toBe(400);

    const missingQuestionAttemptRes = await attemptPOST(
      makeJsonReq('http://localhost/api/questions/attempt', 'POST', {
        questionId: 'does-not-exist-q',
        userAnswer: 'Answer',
        awardedMarks: 1,
        maxMarks: 2,
      })
    );
    expect(missingQuestionAttemptRes.status).toBe(404);

    const missingTopicProgRes = await progressPUT(
      makeJsonReq('http://localhost/api/progress', 'PUT', {
        topicId: 'does-not-exist-topic',
        status: 'mastered',
      })
    );
    expect(missingTopicProgRes.status).toBe(404);

    const missingQuestionMistakeRes = await mistakesPOST(
      makeJsonReq('http://localhost/api/mistakes', 'POST', {
        questionId: 'does-not-exist-q',
        userAnswer: 'Wrong',
      })
    );
    expect(missingQuestionMistakeRes.status).toBe(404);

    const badExamQuestionsRes = await examsPOST(
      makeJsonReq('http://localhost/api/exams', 'POST', {
        subjectSlug: 'chem',
        title: 'Bad Exam',
        questionIds: ['does-not-exist-q'],
      })
    );
    expect(badExamQuestionsRes.status).toBe(400);
  });

  it('supports full CRUD and filtering across bookmarks, notes, planner, progress, exams, questions, and search', async () => {
    await signupAs('CRUD User', 'crud@example.com', '10.1.0.8');
    await ensureSeeded();

    // Questions GET filtering & enriched arrays
    const qRes = await questionsGET(
      new NextRequest('http://localhost/api/questions?subject=chem&mode=daily')
    );
    expect(qRes.status).toBe(200);
    const qBody = await qRes.json();
    expect(qBody.questions.length).toBeGreaterThan(0);
    expect(qBody.questions.length).toBeLessThanOrEqual(5);
    expect(qBody.questions.every((q: { subjectSlug: string }) => q.subjectSlug === 'chem')).toBe(true);
    expect(Array.isArray(qBody.questions[0].markschemePoints)).toBe(true);
    const sampleQId = qBody.questions[0].id as string;

    // Paginated GET /api/questions metadata and limit bounds
    const pagedRes = await questionsGET(
      new NextRequest('http://localhost/api/questions?page=1&limit=4')
    );
    expect(pagedRes.status).toBe(200);
    const pagedBody = await pagedRes.json();
    expect(pagedBody.questions).toHaveLength(4);
    expect(pagedBody.totalCount).toBeGreaterThanOrEqual(30);
    expect(pagedBody.totalPages).toBeGreaterThanOrEqual(8);

    // Exams POST & GET
    const examPostRes = await examsPOST(
      makeJsonReq('http://localhost/api/exams', 'POST', {
        subjectSlug: 'chem',
        title: 'Chem SL Timed Check',
        paperFilter: 'Paper 1',
        timeLimitMinutes: 30,
        questionIds: [sampleQId],
      })
    );
    expect(examPostRes.status).toBe(200);
    const examPostBody = await examPostRes.json();
    expect(examPostBody.exam.questionIds).toEqual([sampleQId]);

    const examGetRes = await examsGET();
    expect(examGetRes.status).toBe(200);
    const examGetBody = await examGetRes.json();
    expect(examGetBody.exams).toHaveLength(1);
    expect(examGetBody.exams[0].questionIds).toEqual([sampleQId]);

    // Bookmarks POST (deduplicated) -> GET -> DELETE
    const bmCreate1 = await bookmarksPOST(
      makeJsonReq('http://localhost/api/bookmarks', 'POST', {
        subjectSlug: 'math',
        itemType: 'tool',
        itemId: 'formula-booklet',
        title: 'Math Formula Booklet',
        href: '/tools/formula-booklet',
      })
    );
    expect(bmCreate1.status).toBe(200);
    const bmId = (await bmCreate1.json()).bookmark.id as string;

    const bmCreateDup = await bookmarksPOST(
      makeJsonReq('http://localhost/api/bookmarks', 'POST', {
        subjectSlug: 'math',
        itemType: 'tool',
        itemId: 'formula-booklet',
        title: 'Math Formula Booklet',
        href: '/tools/formula-booklet',
      })
    );
    expect((await bmCreateDup.json()).bookmark.id).toBe(bmId);

    const bmGetMath = await bookmarksGET(
      new NextRequest('http://localhost/api/bookmarks?subject=math')
    );
    expect((await bmGetMath.json()).bookmarks).toHaveLength(1);

    const bmDel = await bookmarksDELETE(
      new NextRequest(`http://localhost/api/bookmarks?id=${encodeURIComponent(bmId)}`, {
        method: 'DELETE',
      })
    );
    expect(bmDel.status).toBe(200);
    const bmAfterDel = await bookmarksGET(
      new NextRequest('http://localhost/api/bookmarks')
    );
    expect((await bmAfterDel.json()).bookmarks).toEqual([]);

    // Notes POST -> Search GET -> PUT -> DELETE
    const noteCreate = await notesPOST(
      makeJsonReq('http://localhost/api/notes', 'POST', {
        subjectSlug: 'bio',
        title: 'UniqueZygoteSearchToken',
        contentMarkdown: '## Notes\nRuBisCO fixes carbon.',
        isPinned: true,
      })
    );
    expect(noteCreate.status).toBe(200);
    const noteId = (await noteCreate.json()).note.id as string;

    const searchWithNote = await searchGET(
      new NextRequest('http://localhost/api/search?q=UniqueZygoteSearchToken')
    );
    expect(searchWithNote.status).toBe(200);
    const searchResults = (await searchWithNote.json()).results as Array<{
      id: string;
      type: string;
    }>;
    expect(searchResults.some((r) => r.type === 'note' && r.id === noteId)).toBe(true);

    const notePut = await notesPUT(
      makeJsonReq('http://localhost/api/notes', 'PUT', {
        id: noteId,
        title: 'Updated Note Title',
        isPinned: false,
      })
    );
    expect(notePut.status).toBe(200);
    const notesAfterPut = (await (await notesGET()).json()).notes as Array<{
      id: string;
      title: string;
      isPinned: number;
    }>;
    expect(notesAfterPut[0].title).toBe('Updated Note Title');
    expect(notesAfterPut[0].isPinned).toBe(0);

    const noteDel = await notesDELETE(
      makeJsonReq('http://localhost/api/notes', 'DELETE', { id: noteId })
    );
    expect(noteDel.status).toBe(200);
    expect((await (await notesGET()).json()).notes).toEqual([]);

    // Planner POST -> PUT -> DELETE
    const taskCreate = await plannerPOST(
      makeJsonReq('http://localhost/api/planner', 'POST', {
        subjectSlug: 'fr',
        title: 'Practice Subjonctif',
        scheduledDate: '2026-11-12',
        startTime: '18:00',
        durationMinutes: 30,
        taskType: 'flashcards',
      })
    );
    expect(taskCreate.status).toBe(200);
    const taskId = (await taskCreate.json()).task.id as string;

    const taskPut = await plannerPUT(
      makeJsonReq('http://localhost/api/planner', 'PUT', {
        id: taskId,
        completed: true,
      })
    );
    expect(taskPut.status).toBe(200);
    const tasksAfterPut = (await (await plannerGET()).json()).tasks as Array<{
      id: string;
      completed: number;
    }>;
    expect(tasksAfterPut.find((t) => t.id === taskId)?.completed).toBe(1);

    const taskDel = await plannerDELETE(
      makeJsonReq('http://localhost/api/planner', 'DELETE', { id: taskId })
    );
    expect(taskDel.status).toBe(200);
    expect((await (await plannerGET()).json()).tasks).toEqual([]);

    // Progress PUT -> GET
    const topicRow = await db.select().from(schema.syllabusTopics).limit(1).get();
    await progressPUT(
      makeJsonReq('http://localhost/api/progress', 'PUT', {
        topicId: topicRow!.id,
        status: 'confident',
      })
    );
    await progressPUT(
      makeJsonReq('http://localhost/api/progress', 'PUT', {
        topicId: topicRow!.id,
        status: 'mastered',
      })
    );
    const progGet = await progressGET();
    expect(progGet.status).toBe(200);
    expect((await progGet.json()).progress[topicRow!.id]).toBe('mastered');
  });

  it('enforces strict cross-user ownership and rejects userId spoofing across all user-scoped tables', async () => {
    const userA = await signupAs('Owner A', 'owner-a@example.com', '10.1.0.9');
    await ensureSeeded();

    const topicRow = await db.select().from(schema.syllabusTopics).limit(1).get();
    const questionRow = await db.select().from(schema.questions).limit(1).get();

    // Seed User A private deck, custom card, bookmark, note, task, mistake, notification, exam, progress, essay
    const privateDeckA = `deck-private-${userA.id}`;
    await db
      .insert(schema.flashcardDecks)
      .values({
        id: privateDeckA,
        userId: userA.id,
        subjectSlug: 'bio',
        topicId: topicRow!.id,
        title: 'User A Private Deck',
        description: 'Private only to User A',
      })
      .run();

    const cardARes = await flashcardsPOST(
      makeJsonReq('http://localhost/api/flashcards', 'POST', {
        deckId: privateDeckA,
        frontMarkdown: 'User A Secret Front',
        backMarkdown: 'User A Secret Back',
      })
    );
    expect(cardARes.status).toBe(200);
    const cardAId = (await cardARes.json()).card.id as string;

    const bmAId = (
      await (
        await bookmarksPOST(
          makeJsonReq('http://localhost/api/bookmarks', 'POST', {
            subjectSlug: 'bio',
            itemType: 'topic',
            itemId: topicRow!.id,
            title: 'User A Bookmark',
            href: `/study-guides?subject=bio&topic=${topicRow!.id}`,
          })
        )
      ).json()
    ).bookmark.id as string;

    const noteAId = (
      await (
        await notesPOST(
          makeJsonReq('http://localhost/api/notes', 'POST', {
            subjectSlug: 'bio',
            title: 'SecretUserANote991',
            contentMarkdown: 'ConfidentialUserAContent991',
          })
        )
      ).json()
    ).note.id as string;

    const taskAId = (
      await (
        await plannerPOST(
          makeJsonReq('http://localhost/api/planner', 'POST', {
            subjectSlug: 'bio',
            title: 'User A Private Task',
          })
        )
      ).json()
    ).task.id as string;

    const mistakeAId = (
      await (
        await mistakesPOST(
          makeJsonReq('http://localhost/api/mistakes', 'POST', {
            questionId: questionRow!.id,
            userAnswer: 'User A answer',
            missedConcepts: ['Point A'],
          })
        )
      ).json()
    ).mistake.id as string;

    const notifAId = `notif-a-${userA.id}`;
    await db
      .insert(schema.notifications)
      .values({
        id: notifAId,
        userId: userA.id,
        title: 'User A Alert',
        body: 'Private alert',
        href: '/planner',
        isRead: 0,
        createdAt: Date.now(),
      })
      .run();

    await progressPUT(
      makeJsonReq('http://localhost/api/progress', 'PUT', {
        topicId: topicRow!.id,
        status: 'mastered',
      })
    );

    await examsPOST(
      makeJsonReq('http://localhost/api/exams', 'POST', {
        subjectSlug: 'bio',
        title: 'User A Exam',
        questionIds: [questionRow!.id],
      })
    );

    const essayAId = (
      await (
        await essaysPOST(
          makeJsonReq('http://localhost/api/essays', 'POST', {
            id: `essay-a-${userA.id}`,
            subjectSlug: 'hist',
            title: 'User A Essay',
            researchQuestion: 'RQ A',
            plainText: 'User A content',
          })
        )
      ).json()
    ).essay.id as string;

    // Switch to User B
    const userB = await signupAs('Attacker B', 'attacker-b@example.com', '10.1.0.10');

    // User B GETs see NONE of User A's private records
    expect((await (await bookmarksGET(new NextRequest('http://localhost/api/bookmarks'))).json()).bookmarks).toEqual([]);
    expect((await (await notesGET()).json()).notes).toEqual([]);
    expect((await (await plannerGET()).json()).tasks).toEqual([]);
    expect((await (await mistakesGET(new NextRequest('http://localhost/api/mistakes'))).json()).mistakes).toEqual([]);
    expect((await (await notificationsGET()).json()).notifications).toEqual([]);
    expect((await (await progressGET()).json()).progress).toEqual({});
    expect((await (await examsGET()).json()).exams).toEqual([]);
    expect((await (await essaysGET()).json()).essays).toEqual([]);

    const flashB = await (await flashcardsGET()).json();
    expect(
      (flashB.decks as Array<{ id: string }>).some((d) => d.id === privateDeckA)
    ).toBe(false);
    expect(
      (flashB.cards as Array<{ id: string }>).some((c) => c.id === cardAId)
    ).toBe(false);

    // Search does not leak User A's notes to User B
    const searchB = await (
      await searchGET(new NextRequest('http://localhost/api/search?q=SecretUserANote991'))
    ).json();
    expect(
      (searchB.results as Array<{ type: string; id: string }>).some(
        (r) => r.type === 'note' || r.id === noteAId
      )
    ).toBe(false);

    // User B cannot create cards in User A's private deck or rate User A's custom card
    const crossDeckPost = await flashcardsPOST(
      makeJsonReq('http://localhost/api/flashcards', 'POST', {
        deckId: privateDeckA,
        frontMarkdown: 'Injected',
        backMarkdown: 'Card',
      })
    );
    expect(crossDeckPost.status).toBe(404);

    const crossCardPut = await flashcardsPUT(
      makeJsonReq('http://localhost/api/flashcards', 'PUT', {
        cardId: cardAId,
        rating: 'easy',
      })
    );
    expect(crossCardPut.status).toBe(404);

    // User B cannot modify or delete User A's records
    expect(
      (
        await notesPUT(
          makeJsonReq('http://localhost/api/notes', 'PUT', {
            id: noteAId,
            title: 'Hacked',
          })
        )
      ).status
    ).toBe(404);

    await notesDELETE(
      makeJsonReq('http://localhost/api/notes', 'DELETE', { id: noteAId })
    );
    expect(
      (
        await db
          .select()
          .from(schema.notes)
          .where(eq(schema.notes.id, noteAId))
          .get()
      )?.title
    ).toBe('SecretUserANote991');

    await bookmarksDELETE(
      new NextRequest(`http://localhost/api/bookmarks?id=${encodeURIComponent(bmAId)}`, {
        method: 'DELETE',
      })
    );
    expect(
      await db
        .select()
        .from(schema.bookmarks)
        .where(eq(schema.bookmarks.id, bmAId))
        .get()
    ).toBeDefined();

    expect(
      (
        await plannerPUT(
          makeJsonReq('http://localhost/api/planner', 'PUT', {
            id: taskAId,
            completed: true,
          })
        )
      ).status
    ).toBe(404);

    await plannerDELETE(
      makeJsonReq('http://localhost/api/planner', 'DELETE', { id: taskAId })
    );
    expect(
      (
        await db
          .select()
          .from(schema.studyTasks)
          .where(eq(schema.studyTasks.id, taskAId))
          .get()
      )?.completed
    ).toBe(0);

    expect(
      (
        await mistakesPUT(
          makeJsonReq('http://localhost/api/mistakes', 'PUT', {
            id: mistakeAId,
            resolved: true,
          })
        )
      ).status
    ).toBe(404);
    expect(
      (
        await db
          .select()
          .from(schema.mistakesLog)
          .where(eq(schema.mistakesLog.id, mistakeAId))
          .get()
      )?.resolved
    ).toBe(0);

    expect(
      (
        await notificationsPUT(
          makeJsonReq('http://localhost/api/notifications', 'PUT', {
            id: notifAId,
          })
        )
      ).status
    ).toBe(404);
    await notificationsPUT(
      makeJsonReq('http://localhost/api/notifications', 'PUT', {
        markAllRead: true,
      })
    );
    expect(
      (
        await db
          .select()
          .from(schema.notifications)
          .where(eq(schema.notifications.id, notifAId))
          .get()
      )?.isRead
    ).toBe(0);

    expect(
      (
        await essaysPUT(
          makeJsonReq('http://localhost/api/essays', 'PUT', {
            id: essayAId,
            subjectSlug: 'hist',
            title: 'Hijacked',
            plainText: 'Hijacked',
          })
        )
      ).status
    ).toBe(403);

    // Client-supplied userId in POST body is always ignored in favor of authenticated user.id
    const spoofNoteRes = await notesPOST(
      makeJsonReq('http://localhost/api/notes', 'POST', {
        userId: userA.id,
        subjectSlug: 'bio',
        title: 'Spoof Attempt',
        contentMarkdown: 'Should belong to B',
      })
    );
    expect(spoofNoteRes.status).toBe(200);
    expect((await spoofNoteRes.json()).note.userId).toBe(userB.id);
  });
});
