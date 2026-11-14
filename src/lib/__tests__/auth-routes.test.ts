import { NextRequest, NextResponse } from 'next/server';
import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';

const { tempDbPath, cookieJar } = vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const nodeFs = require('fs') as typeof import('fs');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const nodeOs = require('os') as typeof import('os');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const nodePath = require('path') as typeof import('path');
  const dir = nodeFs.mkdtempSync(nodePath.join(nodeOs.tmpdir(), 'sr-auth-test-'));
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
import { eq } from 'drizzle-orm';
import {
  getCurrentUser,
  signSessionToken,
  SESSION_COOKIE_NAME,
  GEMINI_COOKIE_NAME,
} from '@/lib/auth';
import { clearAllAuthRateLimits } from '@/lib/rate-limit';
import { middleware } from '@/middleware';
import { POST as signupPOST } from '@/app/api/auth/signup/route';
import { POST as loginPOST } from '@/app/api/auth/login/route';
import { POST as logoutPOST } from '@/app/api/auth/logout/route';
import { GET as meGET } from '@/app/api/auth/me/route';
import {
  GET as settingsGET,
  PUT as settingsPUT,
  POST as settingsPOST,
} from '@/app/api/settings/route';
import {
  GET as essaysGET,
  POST as essaysPOST,
  PUT as essaysPUT,
} from '@/app/api/essays/route';
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
  GET as flashcardsGET,
  POST as flashcardsPOST,
  PUT as flashcardsPUT,
} from '@/app/api/flashcards/route';
import { GET as searchGET } from '@/app/api/search/route';
import { GET as questionsGET } from '@/app/api/questions/route';
import { POST as originalityPOST } from '@/app/api/ai/originality/route';
import { POST as testKeyPOST } from '@/app/api/ai/test-key/route';
import { POST as blurtingPOST } from '@/app/api/ai/blurting/route';
import { POST as gradeQuestionPOST } from '@/app/api/ai/grade-question/route';
import { POST as reviewEssayPOST } from '@/app/api/ai/review-essay/route';
import { POST as teachSproutPOST } from '@/app/api/ai/teach-sprout/route';
import { POST as tutorPOST } from '@/app/api/ai/tutor/route';

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

describe('Auth Route Hardening & Protected Endpoint Enforcement', () => {
  beforeEach(async () => {
    cookieJar.clear();
    clearAllAuthRateLimits();
    await ensureDbReady();
    const client = getLibsqlClient();
    await client.executeMultiple(`
      DELETE FROM sessions;
      DELETE FROM recall_sessions;
      DELETE FROM essay_documents;
      DELETE FROM notes;
      DELETE FROM study_tasks;
      DELETE FROM bookmarks;
      DELETE FROM notifications;
      DELETE FROM users;
    `);
  });

  afterAll(async () => {
    await resetDbForTests();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const nodeFs = require('fs') as typeof import('fs');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const nodePath = require('path') as typeof import('path');
    nodeFs.rmSync(nodePath.dirname(tempDbPath), { recursive: true, force: true });
  });

  it('rejects weak passwords on signup with structured Zod feedback and succeeds with strong credentials', async () => {
    const weakRes = await signupPOST(
      makeJsonReq(
        'http://localhost/api/auth/signup',
        'POST',
        {
          name: 'Maya',
          email: 'maya@example.com',
          password: 'weak',
        },
        { 'x-forwarded-for': '10.0.0.1' }
      )
    );
    expect(weakRes.status).toBe(400);
    const weakBody = await weakRes.json();
    expect(weakBody.fieldErrors?.password?.length).toBeGreaterThan(0);
    expect(weakBody.issues?.length).toBeGreaterThan(0);

    const noNumberRes = await signupPOST(
      makeJsonReq(
        'http://localhost/api/auth/signup',
        'POST',
        {
          name: 'Maya',
          email: 'maya@example.com',
          password: 'OnlyLettersPassword',
        },
        { 'x-forwarded-for': '10.0.0.1' }
      )
    );
    expect(noNumberRes.status).toBe(400);

    const okRes = await signupPOST(
      makeJsonReq(
        'http://localhost/api/auth/signup',
        'POST',
        {
          name: 'Maya Lin',
          email: 'maya@example.com',
          password: 'IBStudy2026!',
        },
        { 'x-forwarded-for': '10.0.0.1' }
      )
    );
    expect(okRes.status).toBe(201);
    syncCookiesFromResponse(okRes);

    expect(cookieJar.get(SESSION_COOKIE_NAME)).toBeTruthy();
    const meRes = await meGET();
    expect(meRes.status).toBe(200);
    const meBody = await meRes.json();
    expect(meBody.user.email).toBe('maya@example.com');
    expect(meBody.user.name).toBe('Maya Lin');
    expect(meBody.user.streakCount).toBe(0);
  });

  it('rejects demoLogin and empty/invalid credentials on login', async () => {
    const demoOnlyRes = await loginPOST(
      makeJsonReq('http://localhost/api/auth/login', 'POST', {
        demoLogin: true,
      })
    );
    expect(demoOnlyRes.status).toBe(400);

    const demoWithCredsRes = await loginPOST(
      makeJsonReq('http://localhost/api/auth/login', 'POST', {
        email: 'maya@example.com',
        password: 'IBStudy2026!',
        demoLogin: true,
      })
    );
    expect(demoWithCredsRes.status).toBe(400);

    const emptyRes = await loginPOST(
      makeJsonReq('http://localhost/api/auth/login', 'POST', {
        email: '',
        password: '',
      })
    );
    expect(emptyRes.status).toBe(400);

    const wrongRes = await loginPOST(
      makeJsonReq('http://localhost/api/auth/login', 'POST', {
        email: 'nobody@example.com',
        password: 'WrongPassword1',
      })
    );
    expect(wrongRes.status).toBe(401);
  });

  it('enforces per-email and per-IP sliding-window rate limits (429) and resets on successful login', async () => {
    const signupRes = await signupPOST(
      makeJsonReq(
        'http://localhost/api/auth/signup',
        'POST',
        {
          name: 'Alex',
          email: 'alex@example.com',
          password: 'ValidPass2026',
        },
        { 'x-forwarded-for': '10.0.0.2' }
      )
    );
    expect(signupRes.status).toBe(201);
    cookieJar.clear();

    for (let i = 0; i < 4; i++) {
      const failRes = await loginPOST(
        makeJsonReq(
          'http://localhost/api/auth/login',
          'POST',
          { email: 'alex@example.com', password: 'WrongPassword9' },
          { 'x-forwarded-for': '10.0.0.2' }
        )
      );
      expect(failRes.status).toBe(401);
    }

    // Successful login resets the failure window
    const successRes = await loginPOST(
      makeJsonReq(
        'http://localhost/api/auth/login',
        'POST',
        { email: 'alex@example.com', password: 'ValidPass2026' },
        { 'x-forwarded-for': '10.0.0.2' }
      )
    );
    expect(successRes.status).toBe(200);
    cookieJar.clear();

    // Now 5 consecutive failures trigger 429 on the 6th
    for (let i = 0; i < 5; i++) {
      const failRes = await loginPOST(
        makeJsonReq(
          'http://localhost/api/auth/login',
          'POST',
          { email: 'alex@example.com', password: 'WrongPassword9' },
          { 'x-forwarded-for': '10.0.0.2' }
        )
      );
      expect(failRes.status).toBe(401);
    }

    const rateLimitedRes = await loginPOST(
      makeJsonReq(
        'http://localhost/api/auth/login',
        'POST',
        { email: 'alex@example.com', password: 'ValidPass2026' },
        { 'x-forwarded-for': '10.0.0.2' }
      )
    );
    expect(rateLimitedRes.status).toBe(429);
    expect(rateLimitedRes.headers.get('Retry-After')).toBeTruthy();
  });

  it('revokes session in SQLite on logout, preserves session on settings PUT, and never auto-rehydrates deleted users', async () => {
    const signupRes = await signupPOST(
      makeJsonReq(
        'http://localhost/api/auth/signup',
        'POST',
        {
          name: 'Jordan',
          email: 'jordan@example.com',
          password: 'SecurePass2026!',
        },
        { 'x-forwarded-for': '10.0.0.3' }
      )
    );
    expect(signupRes.status).toBe(201);
    syncCookiesFromResponse(signupRes);
    const issuedToken = cookieJar.get(SESSION_COOKIE_NAME)!;

    // Updating settings preserves the active session in schema.sessions
    const settingsRes = await settingsPUT(
      makeJsonReq('http://localhost/api/settings', 'PUT', {
        name: 'Jordan K.',
        preferredGeminiModel: 'gemini-2.5-pro',
      })
    );
    expect(settingsRes.status).toBe(200);
    expect((await meGET()).status).toBe(200);

    // Logout revokes the session row from schema.sessions
    const logoutRes = await logoutPOST(
      makeJsonReq('http://localhost/api/auth/logout', 'POST')
    );
    expect(logoutRes.status).toBe(200);
    syncCookiesFromResponse(logoutRes);
    expect(cookieJar.has(SESSION_COOKIE_NAME)).toBe(false);

    // Replaying the old JWT cookie fails because schema.sessions row was deleted
    cookieJar.set(SESSION_COOKIE_NAME, issuedToken);
    expect(await getCurrentUser()).toBeNull();
    expect((await meGET()).status).toBe(401);

    // Deleting user row does NOT auto-rehydrate from JWT claims
    const loginRes = await loginPOST(
      makeJsonReq(
        'http://localhost/api/auth/login',
        'POST',
        { email: 'jordan@example.com', password: 'SecurePass2026!' },
        { 'x-forwarded-for': '10.0.0.3' }
      )
    );
    expect(loginRes.status).toBe(200);
    syncCookiesFromResponse(loginRes);
    const userRow = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, 'jordan@example.com'))
      .get();
    expect(userRow).toBeDefined();

    await db.delete(schema.users).where(eq(schema.users.id, userRow!.id)).run();
    expect(await getCurrentUser()).toBeNull();

    // Even a manually signed JWT for a non-existent user/session cannot auto-rehydrate
    const forgedOrDeletedToken = await signSessionToken({
      sessionId: 'sess-missing',
      userId: 'user-missing',
      email: 'ghost@example.com',
      name: 'Ghost',
    });
    cookieJar.set(SESSION_COOKIE_NAME, forgedOrDeletedToken);
    expect(await getCurrentUser()).toBeNull();
    expect(await db.select().from(schema.users).all()).toHaveLength(0);
    expect(cookieJar.has(GEMINI_COOKIE_NAME)).toBe(false);
  });

  it('enforces authentication in middleware and across all protected API routes', async () => {
    // Middleware redirects unauthenticated page requests with safe `next` query param
    const pageRedirect = await middleware(
      new NextRequest('http://localhost/subjects/bio?tab=overview')
    );
    expect(pageRedirect.status).toBe(307);
    const location = pageRedirect.headers.get('location');
    expect(location).toBe(
      'http://localhost/login?next=%2Fsubjects%2Fbio%3Ftab%3Doverview'
    );

    // Middleware returns 401 JSON for unauthenticated API calls
    const apiBlocked = await middleware(
      new NextRequest('http://localhost/api/notes')
    );
    expect(apiBlocked.status).toBe(401);

    // Every protected route handler independently enforces authentication (returns 401)
    const checks: Array<Promise<Response>> = [
      meGET(),
      settingsGET(),
      settingsPUT(makeJsonReq('http://localhost/api/settings', 'PUT', { name: 'X' })),
      settingsPOST(makeJsonReq('http://localhost/api/settings', 'POST', { name: 'X' })),
      essaysGET(),
      essaysPOST(makeJsonReq('http://localhost/api/essays', 'POST', {})),
      essaysPUT(makeJsonReq('http://localhost/api/essays', 'PUT', {})),
      notesGET(),
      notesPOST(makeJsonReq('http://localhost/api/notes', 'POST', {})),
      notesPUT(makeJsonReq('http://localhost/api/notes', 'PUT', {})),
      notesDELETE(makeJsonReq('http://localhost/api/notes', 'DELETE', {})),
      plannerGET(),
      plannerPOST(makeJsonReq('http://localhost/api/planner', 'POST', {})),
      plannerPUT(makeJsonReq('http://localhost/api/planner', 'PUT', {})),
      plannerDELETE(makeJsonReq('http://localhost/api/planner', 'DELETE', {})),
      flashcardsGET(),
      flashcardsPOST(makeJsonReq('http://localhost/api/flashcards', 'POST', {})),
      flashcardsPUT(makeJsonReq('http://localhost/api/flashcards', 'PUT', {})),
      searchGET(new NextRequest('http://localhost/api/search?q=bio')),
      questionsGET(new NextRequest('http://localhost/api/questions')),
      originalityPOST(makeJsonReq('http://localhost/api/ai/originality', 'POST', { text: 'test' })),
      testKeyPOST(makeJsonReq('http://localhost/api/ai/test-key', 'POST', {})),
      blurtingPOST(makeJsonReq('http://localhost/api/ai/blurting', 'POST', {})),
      gradeQuestionPOST(makeJsonReq('http://localhost/api/ai/grade-question', 'POST', {})),
      reviewEssayPOST(makeJsonReq('http://localhost/api/ai/review-essay', 'POST', {})),
      teachSproutPOST(makeJsonReq('http://localhost/api/ai/teach-sprout', 'POST', {})),
      tutorPOST(makeJsonReq('http://localhost/api/ai/tutor', 'POST', {})),
    ];

    const responses = await Promise.all(checks);
    for (const res of responses) {
      expect(res.status).toBe(401);
    }
  });

  it('prevents cross-user essay modification via ownership check', async () => {
    const userARes = await signupPOST(
      makeJsonReq(
        'http://localhost/api/auth/signup',
        'POST',
        { name: 'User A', email: 'a@example.com', password: 'PasswordA1' },
        { 'x-forwarded-for': '10.0.0.10' }
      )
    );
    expect(userARes.status).toBe(201);
    syncCookiesFromResponse(userARes);

    const createEssayRes = await essaysPOST(
      makeJsonReq('http://localhost/api/essays', 'POST', {
        id: 'essay-owned-by-a',
        subjectSlug: 'hist',
        title: 'User A Essay',
        researchQuestion: 'RQ A',
        plainText: 'User A draft text.',
      })
    );
    expect(createEssayRes.status).toBe(200);

    // Switch to User B
    cookieJar.clear();
    const userBRes = await signupPOST(
      makeJsonReq(
        'http://localhost/api/auth/signup',
        'POST',
        { name: 'User B', email: 'b@example.com', password: 'PasswordB1' },
        { 'x-forwarded-for': '10.0.0.11' }
      )
    );
    expect(userBRes.status).toBe(201);
    syncCookiesFromResponse(userBRes);

    const hijackRes = await essaysPUT(
      makeJsonReq('http://localhost/api/essays', 'PUT', {
        id: 'essay-owned-by-a',
        subjectSlug: 'hist',
        title: 'Hijacked',
        researchQuestion: 'Hijacked',
        plainText: 'Overwritten',
      })
    );
    expect(hijackRes.status).toBe(403);
  });

  it('does not bypass middleware auth on /api/* extension paths and hardens settings key masking, cookie clearing, and bookmark ownership', async () => {
    const apiStaticLike = await middleware(
      new NextRequest('http://localhost/api/notes/probe.png')
    );
    expect(apiStaticLike.status).toBe(401);

    const userARes = await signupPOST(
      makeJsonReq(
        'http://localhost/api/auth/signup',
        'POST',
        {
          name: 'Settings A',
          email: 'settings-a@example.com',
          password: 'PasswordA1',
          geminiApiKey: 'AIzaSySecretTestKey123456',
        },
        { 'x-forwarded-for': '10.0.0.20' }
      )
    );
    expect(userARes.status).toBe(201);
    syncCookiesFromResponse(userARes);
    expect(cookieJar.get(GEMINI_COOKIE_NAME)).toBe('AIzaSySecretTestKey123456');

    const getRes = await settingsGET();
    expect(getRes.status).toBe(200);
    const getBody = await getRes.json();
    expect(getBody.hasPersonalKey).toBe(true);
    expect(getBody.maskedKey).toBe('AIzaSy••••••••3456');
    expect(JSON.stringify(getBody)).not.toContain('AIzaSySecretTestKey123456');

    // Whitespace-only geminiApiKey clears both DB key and sr_gemini cookie
    const clearKeyRes = await settingsPUT(
      makeJsonReq('http://localhost/api/settings', 'PUT', {
        geminiApiKey: '   ',
      })
    );
    expect(clearKeyRes.status).toBe(200);
    const clearKeyBody = await clearKeyRes.json();
    expect(clearKeyBody.hasPersonalKey).toBe(false);
    expect(clearKeyBody.maskedKey).toBeNull();
    expect(cookieJar.has(GEMINI_COOKIE_NAME)).toBe(false);

    // Bookmark creation sanitizes unsafe hrefs and prevents cross-user ID hijacking
    const addBmRes = await settingsPOST(
      makeJsonReq('http://localhost/api/settings', 'POST', {
        action: 'add_bookmark',
        id: 'bm-shared-probe',
        subjectSlug: 'hist',
        title: 'OPCVL Practice',
        href: 'javascript:alert(1)',
      })
    );
    expect(addBmRes.status).toBe(200);
    const savedBm = await db
      .select()
      .from(schema.bookmarks)
      .where(eq(schema.bookmarks.id, 'bm-shared-probe'))
      .get();
    expect(savedBm?.href).toBe('/');

    cookieJar.clear();
    const userBRes = await signupPOST(
      makeJsonReq(
        'http://localhost/api/auth/signup',
        'POST',
        {
          name: 'Settings B',
          email: 'settings-b@example.com',
          password: 'PasswordB1',
        },
        { 'x-forwarded-for': '10.0.0.21' }
      )
    );
    expect(userBRes.status).toBe(201);
    syncCookiesFromResponse(userBRes);

    const hijackBmRes = await settingsPOST(
      makeJsonReq('http://localhost/api/settings', 'POST', {
        action: 'add_bookmark',
        id: 'bm-shared-probe',
        subjectSlug: 'hist',
        title: 'Overwrite Attempt',
        href: '/tools/opcvl-trainer',
      })
    );
    expect(hijackBmRes.status).toBe(403);
  });

  it('enforces AI payload validation, cross-user essayId isolation, advisory originality, and recall persistence', async () => {
    const prevKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    try {
      const userARes = await signupPOST(
        makeJsonReq(
          'http://localhost/api/auth/signup',
          'POST',
          {
            name: 'AI User A',
            email: 'ai-a@example.com',
            password: 'PasswordA1',
          },
          { 'x-forwarded-for': '10.0.0.30' }
        )
      );
      expect(userARes.status).toBe(201);
      syncCookiesFromResponse(userARes);

      const createEssayRes = await essaysPOST(
        makeJsonReq('http://localhost/api/essays', 'POST', {
          id: 'essay-ai-a',
          subjectSlug: 'hist',
          title: 'Weimar Essay',
          researchQuestion: 'To what extent did 1923 hyperinflation destabilize Weimar?',
          plainText:
            'Passive resistance in the Ruhr accelerated fiscal instability across Germany in 1923.',
        })
      );
      expect(createEssayRes.status).toBe(200);

      // Originality returns advisory-only wording
      const origRes = await originalityPOST(
        makeJsonReq('http://localhost/api/ai/originality', 'POST', {
          text: 'Furthermore, this essay explores Weimar economic turmoil. Moreover, it is important to note the political impact.',
        })
      );
      expect(origRes.status).toBe(200);
      const origBody = await origRes.json();
      expect(origBody.advisoryNote).toMatch(/advisory/i);
      expect(origBody.advisoryNote).toMatch(/not definitive proof/i);

      // Blurting and Teach Sprout persist recall_sessions under user A with deterministic fallback
      const blurtRes = await blurtingPOST(
        makeJsonReq('http://localhost/api/ai/blurting', 'POST', {
          subjectSlug: 'bio',
          topicId: 'bio-b2-membranes',
          topicTitle: 'Membranes',
          userBlurtText: 'Phospholipid bilayer with hydrophilic heads and hydrophobic tails.',
          checklist: ['Phospholipid bilayer structure'],
        })
      );
      expect(blurtRes.status).toBe(200);
      const blurtBody = await blurtRes.json();
      expect(blurtBody.mode).toBe('deterministic_fallback');
      expect(Number.isInteger(blurtBody.scorePercent)).toBe(true);

      const teachRes = await teachSproutPOST(
        makeJsonReq('http://localhost/api/ai/teach-sprout', 'POST', {
          subjectSlug: 'chem',
          topicTitle: 'Collision Theory',
          studentExplanation:
            'Increasing temperature raises average kinetic energy so more collisions exceed activation energy.',
          turnNumber: 1,
        })
      );
      expect(teachRes.status).toBe(200);
      const teachBody = await teachRes.json();
      expect(teachBody.mode).toBe('deterministic_fallback');
      expect(Number.isInteger(teachBody.clarityScore)).toBe(true);

      // Whitespace-only essay draft rejected with 400
      const blankDraftRes = await reviewEssayPOST(
        makeJsonReq('http://localhost/api/ai/review-essay', 'POST', {
          subjectSlug: 'hist',
          researchQuestion: 'Valid question',
          plainText: '            ',
        })
      );
      expect(blankDraftRes.status).toBe(400);

      // Switch to User B: cannot run review-essay targeting User A's essayId
      cookieJar.clear();
      const userBRes = await signupPOST(
        makeJsonReq(
          'http://localhost/api/auth/signup',
          'POST',
          {
            name: 'AI User B',
            email: 'ai-b@example.com',
            password: 'PasswordB1',
          },
          { 'x-forwarded-for': '10.0.0.31' }
        )
      );
      expect(userBRes.status).toBe(201);
      syncCookiesFromResponse(userBRes);

      const crossReviewRes = await reviewEssayPOST(
        makeJsonReq('http://localhost/api/ai/review-essay', 'POST', {
          essayId: 'essay-ai-a',
          subjectSlug: 'hist',
          researchQuestion: 'Attempted overwrite',
          plainText:
            'Passive resistance in the Ruhr accelerated fiscal instability across Germany in 1923.',
        })
      );
      expect(crossReviewRes.status).toBe(403);
    } finally {
      if (prevKey !== undefined) {
        process.env.GEMINI_API_KEY = prevKey;
      }
    }
  });
});
