import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import { db, schema, ensureDbReady } from '@/db';
import {
  hashPassword,
  createUserSession,
  getAuthCookieOptions,
  SESSION_COOKIE_NAME,
  GEMINI_COOKIE_NAME,
} from '@/lib/auth';
import { SignupSchema, formatZodError } from '@/lib/auth-validation';
import {
  getClientIp,
  checkAuthRateLimit,
  recordAuthAttempt,
} from '@/lib/rate-limit';

const SIGNUP_WINDOW_MS = 15 * 60 * 1000;
const MAX_SIGNUPS_PER_IP = 10;

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const ipKey = `signup:ip:${clientIp}`;
    const rateCheck = checkAuthRateLimit(
      ipKey,
      MAX_SIGNUPS_PER_IP,
      SIGNUP_WINDOW_MS
    );

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: 'Too many sign-up attempts. Please try again later.',
          retryAfterSeconds: rateCheck.retryAfterSeconds,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) },
        }
      );
    }

    const rawBody = await req.json().catch(() => null);
    if (!rawBody || typeof rawBody !== 'object' || Array.isArray(rawBody)) {
      return NextResponse.json(
        { error: 'Invalid sign-up request payload.' },
        { status: 400 }
      );
    }

    const parsed = SignupSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(formatZodError(parsed.error), { status: 400 });
    }

    const { name, email, password, geminiApiKey } = parsed.data;
    const normalizedEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    recordAuthAttempt(ipKey, SIGNUP_WINDOW_MS);

    await ensureDbReady();

    const existing = await db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.email, normalizedEmail))
      .get();

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in.' },
        { status: 409 }
      );
    }

    const now = Date.now();
    const today = new Date().toISOString().slice(0, 10);
    const userId = `user-${crypto.randomUUID()}`;
    const cleanKey = geminiApiKey?.trim() || null;

    await db.insert(schema.users)
      .values({
        id: userId,
        email: normalizedEmail,
        name: cleanName,
        passwordHash: hashPassword(password),
        geminiApiKey: cleanKey,
        preferredGeminiModel: 'gemini-3-flash-preview',
        streakCount: 0,
        lastActiveDate: today,
        createdAt: now,
        updatedAt: now,
      })
      .run();

    const { token } = await createUserSession({
      id: userId,
      email: normalizedEmail,
      name: cleanName,
      preferredGeminiModel: 'gemini-3-flash-preview',
      streakCount: 0,
    });

    const response = NextResponse.json(
      {
        user: {
          id: userId,
          email: normalizedEmail,
          name: cleanName,
          hasGeminiKey: Boolean(cleanKey || process.env.GEMINI_API_KEY?.trim()),
          streakCount: 0,
        },
      },
      { status: 201 }
    );

    response.cookies.set(SESSION_COOKIE_NAME, token, getAuthCookieOptions());

    if (cleanKey) {
      response.cookies.set(
        GEMINI_COOKIE_NAME,
        cleanKey,
        getAuthCookieOptions()
      );
    } else {
      response.cookies.set(GEMINI_COOKIE_NAME, '', getAuthCookieOptions(0));
    }

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Sign-up failed' },
      { status: 500 }
    );
  }
}
