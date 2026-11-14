import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, schema, ensureDbReady } from '@/db';
import {
  verifyPassword,
  createUserSession,
  getAuthCookieOptions,
  SESSION_COOKIE_NAME,
  GEMINI_COOKIE_NAME,
} from '@/lib/auth';
import { LoginSchema, formatZodError } from '@/lib/auth-validation';
import {
  getClientIp,
  checkAuthRateLimit,
  recordAuthAttempt,
  resetAuthRateLimit,
} from '@/lib/rate-limit';

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_EMAIL_FAILURES = 5;
const MAX_IP_FAILURES = 20;

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json().catch(() => null);
    if (!rawBody || typeof rawBody !== 'object' || Array.isArray(rawBody)) {
      return NextResponse.json(
        { error: 'Invalid login request payload.' },
        { status: 400 }
      );
    }

    if ('demoLogin' in rawBody) {
      return NextResponse.json(
        { error: 'Demo login is not supported. Please sign in with your email and password.' },
        { status: 400 }
      );
    }

    const parsed = LoginSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(formatZodError(parsed.error), { status: 400 });
    }

    const normalizedEmail = parsed.data.email.trim().toLowerCase();
    const clientIp = getClientIp(req);
    const emailKey = `login:email:${normalizedEmail}`;
    const ipKey = `login:ip:${clientIp}`;

    const emailLimit = checkAuthRateLimit(
      emailKey,
      MAX_EMAIL_FAILURES,
      LOGIN_WINDOW_MS
    );
    const ipLimit = checkAuthRateLimit(
      ipKey,
      MAX_IP_FAILURES,
      LOGIN_WINDOW_MS
    );

    if (!emailLimit.allowed || !ipLimit.allowed) {
      const retryAfterSeconds = Math.max(
        emailLimit.retryAfterSeconds,
        ipLimit.retryAfterSeconds
      );
      return NextResponse.json(
        {
          error:
            'Too many failed sign-in attempts. Please wait a few minutes before trying again.',
          retryAfterSeconds,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(retryAfterSeconds) },
        }
      );
    }

    await ensureDbReady();

    const user = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, normalizedEmail))
      .get();

    if (!user || !verifyPassword(parsed.data.password, user.passwordHash)) {
      recordAuthAttempt(emailKey, LOGIN_WINDOW_MS);
      recordAuthAttempt(ipKey, LOGIN_WINDOW_MS);
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    resetAuthRateLimit(emailKey);
    resetAuthRateLimit(ipKey);

    const { token } = await createUserSession(user);

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        hasGeminiKey: Boolean(
          user.geminiApiKey?.trim() || process.env.GEMINI_API_KEY?.trim()
        ),
        streakCount: user.streakCount,
      },
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, getAuthCookieOptions());

    if (user.geminiApiKey) {
      response.cookies.set(
        GEMINI_COOKIE_NAME,
        user.geminiApiKey,
        getAuthCookieOptions()
      );
    } else {
      response.cookies.set(GEMINI_COOKIE_NAME, '', getAuthCookieOptions(0));
    }

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Login failed' },
      { status: 500 }
    );
  }
}
