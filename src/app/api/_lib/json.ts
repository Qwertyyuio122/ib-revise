import { NextResponse } from 'next/server';
import type { z } from 'zod';

export type JsonParseResult =
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; response: NextResponse };

/**
 * Safely parse a JSON object request body, returning a 400 response instead
 * of throwing on empty or malformed JSON.
 */
export async function parseJsonBody(request: Request): Promise<JsonParseResult> {
  try {
    const raw: unknown = await request.json();
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: 'Request body must be a JSON object.' },
          { status: 400 }
        ),
      };
    }
    return { ok: true, data: raw as Record<string, unknown> };
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Invalid JSON request body.' },
        { status: 400 }
      ),
    };
  }
}

/**
 * Safely parse an optional JSON object request body (empty body -> `{}`).
 */
export async function parseOptionalJsonBody(
  request: Request
): Promise<JsonParseResult> {
  let rawText = '';
  try {
    rawText = await request.text();
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Unable to read request body.' },
        { status: 400 }
      ),
    };
  }

  if (!rawText.trim()) {
    return { ok: true, data: {} };
  }

  try {
    const raw: unknown = JSON.parse(rawText);
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: 'Request body must be a JSON object.' },
          { status: 400 }
        ),
      };
    }
    return { ok: true, data: raw as Record<string, unknown> };
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Invalid JSON request body.' },
        { status: 400 }
      ),
    };
  }
}

/**
 * Safely parse a JSON string column without throwing on corrupt or null values.
 */
export function safeJsonParse<T>(
  raw: string | null | undefined,
  fallback: T
): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Checks whether a string contains valid JSON syntax.
 */
export function isValidJsonString(raw: string): boolean {
  try {
    JSON.parse(raw);
    return true;
  } catch {
    return false;
  }
}

/**
 * Formats a Zod validation failure into a structured 400 response.
 */
export function validationErrorResponse(
  message: string,
  error: z.ZodError
): NextResponse {
  return NextResponse.json(
    {
      error: message,
      issues: error.flatten().fieldErrors,
    },
    { status: 400 }
  );
}
