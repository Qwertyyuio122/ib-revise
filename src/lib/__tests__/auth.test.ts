import { describe, it, expect, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { SignJWT } from 'jose';
import {
  hashPassword,
  verifyPassword,
  signSessionToken,
  verifySessionToken,
} from '../auth';
import {
  PasswordSchema,
  getPasswordChecks,
  sanitizeRedirectPath,
} from '../auth-validation';
import { getSessionSecretBytes, getSessionSecretString } from '../auth-secret';
import {
  checkAuthRateLimit,
  recordAuthAttempt,
  resetAuthRateLimit,
  clearAllAuthRateLimits,
} from '../rate-limit';
import { extractJsonFromResponse } from '../gemini';
import { verifySessionEdge } from '@/middleware';
import { ensureDbReady, getLibsqlClient, resetDbForTests } from '@/db';

describe('Auth & Database Bootstrap', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    clearAllAuthRateLimits();
  });

  it('hashes and verifies passwords accurately with scrypt', () => {
    const hash = hashPassword('IBDiploma2026!');
    expect(verifyPassword('IBDiploma2026!', hash)).toBe(true);
    expect(verifyPassword('WrongPassword', hash)).toBe(false);
  });

  it('signs and verifies JWT session tokens in both Node and Edge Web Crypto', async () => {
    const token = await signSessionToken({
      sessionId: 'sess-test-1',
      userId: 'user-test-1',
      email: 'student@example.com',
      name: 'Student',
      preferredGeminiModel: 'gemini-2.5-flash',
      streakCount: 3,
    });
    const verified = await verifySessionToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.sessionId).toBe('sess-test-1');
    expect(verified?.userId).toBe('user-test-1');
    expect(verified?.name).toBe('Student');

    const edgeVerified = await verifySessionEdge(token);
    expect(edgeVerified).toBe(true);
    expect(await verifySessionEdge(`${token}tampered`)).toBe(false);
    expect(await verifySessionEdge('..')).toBe(false);
    expect(await verifySessionEdge('a.b')).toBe(false);

    const expiredToken = await new SignJWT({
      sessionId: 'sess-expired',
      userId: 'user-expired',
      email: 'expired@example.com',
      name: 'Expired',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('-5s')
      .sign(getSessionSecretBytes());
    expect(await verifySessionToken(expiredToken)).toBeNull();
    expect(await verifySessionEdge(expiredToken)).toBe(false);

    // Fallback streakCount defaults to 0 when omitted from token payload
    const noStreakToken = await signSessionToken({
      sessionId: 'sess-test-2',
      userId: 'user-test-2',
      email: 'blank@example.com',
      name: 'Blank',
      preferredGeminiModel: 'gemini-3-flash-preview',
    });
    const verifiedNoStreak = await verifySessionToken(noStreakToken);
    expect(verifiedNoStreak?.streakCount).toBe(0);
  });

  it('enforces strong password policy (8-128 chars, letter + number)', () => {
    expect(PasswordSchema.safeParse('short1A').success).toBe(false);
    expect(PasswordSchema.safeParse('12345678').success).toBe(false);
    expect(PasswordSchema.safeParse('abcdefgh').success).toBe(false);
    expect(PasswordSchema.safeParse(`${'a'.repeat(128)}1`).success).toBe(false);
    expect(PasswordSchema.safeParse('StudyIB2026!').success).toBe(true);

    expect(getPasswordChecks('abc1')).toEqual({
      minLength: false,
      maxLength: true,
      hasLetter: true,
      hasNumber: true,
      isValid: false,
    });
    expect(getPasswordChecks('StudyIB2026').isValid).toBe(true);
  });

  it('sanitizes post-login redirect targets against open redirects', () => {
    expect(sanitizeRedirectPath('/subjects/bio?tab=notes')).toBe(
      '/subjects/bio?tab=notes'
    );
    expect(sanitizeRedirectPath('/planner')).toBe('/planner');
    expect(sanitizeRedirectPath('//evil.com')).toBe('/');
    expect(sanitizeRedirectPath('https://evil.com/phish')).toBe('/');
    expect(sanitizeRedirectPath('/\\evil.com')).toBe('/');
    expect(sanitizeRedirectPath('javascript:alert(1)')).toBe('/');
    expect(sanitizeRedirectPath('/login')).toBe('/');
    expect(sanitizeRedirectPath('/signup')).toBe('/');
    expect(sanitizeRedirectPath('/api/auth/me')).toBe('/');
    expect(sanitizeRedirectPath(null)).toBe('/');
  });

  it('handles SESSION_SECRET safely in dev/build/test and fails closed in deployed production', () => {
    delete process.env.SESSION_SECRET;
    process.env.VERCEL_ENV = 'production';
    delete process.env.NEXT_PHASE;
    expect(() => getSessionSecretString()).toThrow(/SESSION_SECRET/);

    process.env.NEXT_PHASE = 'phase-production-build';
    expect(getSessionSecretString().length).toBeGreaterThan(16);

    delete process.env.NEXT_PHASE;
    process.env.SESSION_SECRET = 'custom-test-session-secret-0123456789';
    expect(getSessionSecretString()).toBe('custom-test-session-secret-0123456789');
  });

  it('enforces sliding-window rate limits and resets cleanly', () => {
    const windowMs = 60_000;
    const key = 'login:email:student@example.com';

    for (let i = 0; i < 5; i++) {
      expect(checkAuthRateLimit(key, 5, windowMs, 1_000 + i).allowed).toBe(true);
      recordAuthAttempt(key, windowMs, 1_000 + i);
    }

    const blocked = checkAuthRateLimit(key, 5, windowMs, 2_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);

    // After window passes, attempts expire
    expect(checkAuthRateLimit(key, 5, windowMs, 65_000).allowed).toBe(true);

    // Explicit reset clears counter immediately
    recordAuthAttempt(key, windowMs, 70_000);
    resetAuthRateLimit(key);
    expect(checkAuthRateLimit(key, 5, windowMs, 70_001).remaining).toBe(5);
  });

  it('bootstraps all 18 SQLite tables and secondary indexes cleanly', async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sr-auth-bootstrap-'));
    process.env.SIMPLE_REVISION_DB_PATH = path.join(tempDir, 'bootstrap.db');
    await resetDbForTests();

    try {
      await ensureDbReady();
      const client = getLibsqlClient();
      const tables = await client.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
      );
      const tableNames = tables.rows.map((t) => String(t.name));
      expect(tableNames).toHaveLength(18);
      expect(tableNames).toContain('users');
      expect(tableNames).toContain('sessions');
      expect(tableNames).toContain('subjects');
      expect(tableNames).toContain('syllabus_topics');
      expect(tableNames).toContain('questions');
      expect(tableNames).toContain('essay_documents');
      expect(tableNames).toContain('flashcards');

      const indexes = await client.execute(
        "SELECT name FROM sqlite_master WHERE type='index'"
      );
      const indexNames = indexes.rows.map((i) => String(i.name));
      expect(indexNames).toContain('idx_questions_subject_topic');
      expect(indexNames).toContain('idx_mistakes_log_user_created');
    } finally {
      await resetDbForTests();
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('safely extracts JSON from raw text, markdown fences, and conversational wrappers', () => {
    expect(extractJsonFromResponse('{"score": 95}')).toEqual({ score: 95 });
    expect(extractJsonFromResponse('```json\n{"score": 95}\n```')).toEqual({
      score: 95,
    });
    expect(
      extractJsonFromResponse(
        'Examiner assessment output:\n{"score": 88, "tip": "Great work"}\nEnd of response.'
      )
    ).toEqual({ score: 88, tip: 'Great work' });
    expect(
      extractJsonFromResponse('Here are your points: [{"point": "A"}, {"point": "B"}]')
    ).toEqual([{ point: 'A' }, { point: 'B' }]);
    expect(() => extractJsonFromResponse('Not a json at all')).toThrow();
  });
});
