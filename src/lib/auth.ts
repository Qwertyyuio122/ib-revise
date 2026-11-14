import crypto from 'crypto';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { and, eq, gt } from 'drizzle-orm';
import { db, ensureDbReady, schema } from '@/db';
import { getSessionSecretBytes } from './auth-secret';

export const SESSION_COOKIE_NAME = 'sr_session';
export const GEMINI_COOKIE_NAME = 'sr_gemini';
export const SESSION_DURATION_SECONDS = 30 * 24 * 60 * 60;
export const SESSION_DURATION_MS = SESSION_DURATION_SECONDS * 1000;

export function getAuthCookieOptions(maxAge = SESSION_DURATION_SECONDS) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  };
}

export interface SessionPayload {
  sessionId: string;
  userId: string;
  email: string;
  name: string;
  preferredGeminiModel?: string;
  streakCount?: number;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  const [salt, key] = parts;
  if (!salt || !key) return false;
  const derived = crypto.scryptSync(password, salt, 64);
  const keyBuf = Buffer.from(key, 'hex');
  if (derived.length !== keyBuf.length) return false;
  return crypto.timingSafeEqual(derived, keyBuf);
}

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(getSessionSecretBytes());
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSessionSecretBytes());
    if (
      typeof payload.sessionId === 'string' &&
      payload.sessionId.length > 0 &&
      typeof payload.userId === 'string' &&
      payload.userId.length > 0 &&
      typeof payload.email === 'string' &&
      typeof payload.name === 'string'
    ) {
      return {
        sessionId: payload.sessionId,
        userId: payload.userId,
        email: payload.email,
        name: payload.name,
        preferredGeminiModel:
          typeof payload.preferredGeminiModel === 'string'
            ? payload.preferredGeminiModel
            : 'gemini-3-flash-preview',
        streakCount:
          typeof payload.streakCount === 'number' ? payload.streakCount : 0,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function createUserSession(user: {
  id: string;
  email: string;
  name: string;
  preferredGeminiModel: string;
  streakCount: number;
}): Promise<{ sessionId: string; token: string }> {
  await ensureDbReady();
  const now = Date.now();
  const sessionId = `sess-${crypto.randomUUID()}`;

  await db
    .insert(schema.sessions)
    .values({
      id: sessionId,
      userId: user.id,
      expiresAt: now + SESSION_DURATION_MS,
    })
    .run();

  const token = await signSessionToken({
    sessionId,
    userId: user.id,
    email: user.email,
    name: user.name,
    preferredGeminiModel: user.preferredGeminiModel,
    streakCount: user.streakCount,
  });

  return { sessionId, token };
}

export async function revokeSessionByToken(token: string): Promise<void> {
  const payload = await verifySessionToken(token);
  if (!payload) return;

  await ensureDbReady();
  await db
    .delete(schema.sessions)
    .where(
      and(
        eq(schema.sessions.id, payload.sessionId),
        eq(schema.sessions.userId, payload.userId)
      )
    )
    .run();
}

export async function getCurrentSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifySessionToken(token);
    if (!payload) return null;

    await ensureDbReady();
    const now = Date.now();
    const activeSession = await db
      .select()
      .from(schema.sessions)
      .where(
        and(
          eq(schema.sessions.id, payload.sessionId),
          eq(schema.sessions.userId, payload.userId),
          gt(schema.sessions.expiresAt, now)
        )
      )
      .get();

    if (!activeSession) {
      return null;
    }

    const user = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, payload.userId))
      .get();

    if (!user) {
      return null;
    }

    return {
      user,
      sessionId: activeSession.id,
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user ?? null;
}
