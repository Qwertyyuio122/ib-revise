import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  SESSION_COOKIE_NAME,
  GEMINI_COOKIE_NAME,
  getAuthCookieOptions,
  revokeSessionByToken,
} from '@/lib/auth';

export async function POST(req: NextRequest) {
  let token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    } catch {
      // Ignore outside Next request context
    }
  }

  if (token) {
    await revokeSessionByToken(token).catch(() => {});
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, '', getAuthCookieOptions(0));
  response.cookies.set(GEMINI_COOKIE_NAME, '', getAuthCookieOptions(0));
  return response;
}
