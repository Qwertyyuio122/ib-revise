import { NextRequest, NextResponse } from 'next/server';
import { getSessionSecretString } from '@/lib/auth-secret';
import { sanitizeRedirectPath } from '@/lib/auth-validation';

const SESSION_COOKIE_NAME = 'sr_session';

const PUBLIC_PATHS = [
  '/login',
  '/signup',
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/logout',
];
const STATIC_FILE_REGEX =
  /\.(?:ico|png|jpg|jpeg|svg|css|js|woff|woff2|webp|ttf|map|txt)$/i;

let cachedSecretState: { secret: string; key: CryptoKey } | null = null;

async function getHmacKey(): Promise<CryptoKey> {
  const secret = getSessionSecretString();
  if (!cachedSecretState || cachedSecretState.secret !== secret) {
    const keyBytes = Uint8Array.from(new TextEncoder().encode(secret));
    const key = await crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    cachedSecretState = { secret, key };
  }
  return cachedSecretState.key;
}

function base64UrlToUint8Array(base64Url: string): Uint8Array<ArrayBuffer> {
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    '='
  );
  const binary = atob(padded);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function verifySessionEdge(token: string): Promise<boolean> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const [headerB64, payloadB64, signatureB64] = parts;
    if (!headerB64 || !payloadB64 || !signatureB64) return false;

    const key = await getHmacKey();

    const signatureBytes = base64UrlToUint8Array(signatureB64);
    const signingInput = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      signingInput
    );
    if (!isValid) return false;

    const payloadJson = new TextDecoder().decode(
      base64UrlToUint8Array(payloadB64)
    );
    const payload = JSON.parse(payloadJson) as {
      exp?: number;
      userId?: string;
      sessionId?: string;
    };
    if (typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now()) {
      return false;
    }
    return (
      typeof payload.userId === 'string' &&
      payload.userId.length > 0 &&
      typeof payload.sessionId === 'string' &&
      payload.sessionId.length > 0
    );
  } catch {
    return false;
  }
}

function buildLoginRedirect(request: NextRequest, clearCookie = false): NextResponse {
  const loginUrl = new URL('/login', request.url);
  const requestedTarget = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  const safeNext = sanitizeRedirectPath(requestedTarget);
  if (safeNext !== '/') {
    loginUrl.searchParams.set('next', safeNext);
  }
  const response = NextResponse.redirect(loginUrl);
  if (clearCookie) {
    response.cookies.delete(SESSION_COOKIE_NAME);
  }
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    (!pathname.startsWith('/api/') && STATIC_FILE_REGEX.test(pathname)) ||
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    return buildLoginRedirect(request);
  }

  const valid = await verifySessionEdge(token);
  if (!valid) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }
    return buildLoginRedirect(request, true);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
