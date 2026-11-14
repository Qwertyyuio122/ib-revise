import type { NextRequest } from 'next/server';

const globalForRateLimit = globalThis as unknown as {
  authRateLimitStore?: Map<string, number[]>;
};

function getStore(): Map<string, number[]> {
  if (!globalForRateLimit.authRateLimitStore) {
    globalForRateLimit.authRateLimitStore = new Map<string, number[]>();
  }
  return globalForRateLimit.authRateLimitStore;
}

export interface RateLimitDecision {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/** Extracts the best-effort client IP from reverse-proxy headers. */
export function getClientIp(req: Request | NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  const realIp = req.headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;
  return 'unknown';
}

function pruneWindow(
  timestamps: number[],
  windowMs: number,
  now: number
): number[] {
  const cutoff = now - windowMs;
  return timestamps.filter((ts) => ts > cutoff);
}

/** Checks whether a sliding window key is currently within its allowed budget. */
export function checkAuthRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now = Date.now()
): RateLimitDecision {
  const store = getStore();
  const recent = pruneWindow(store.get(key) ?? [], windowMs, now);

  if (recent.length === 0) {
    store.delete(key);
  } else {
    store.set(key, recent);
  }

  if (recent.length >= limit) {
    const oldest = recent[0] ?? now;
    const retryAfterMs = Math.max(1000, oldest + windowMs - now);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
    };
  }

  return {
    allowed: true,
    remaining: Math.max(0, limit - recent.length),
    retryAfterSeconds: 0,
  };
}

/** Records a failed auth attempt or rate-limited event in the sliding window. */
export function recordAuthAttempt(
  key: string,
  windowMs: number,
  now = Date.now()
): void {
  const store = getStore();
  const recent = pruneWindow(store.get(key) ?? [], windowMs, now);
  recent.push(now);
  store.set(key, recent);

  if (store.size > 5_000) {
    for (const [entryKey, timestamps] of store.entries()) {
      const active = pruneWindow(timestamps, windowMs, now);
      if (active.length === 0) {
        store.delete(entryKey);
      } else if (active.length !== timestamps.length) {
        store.set(entryKey, active);
      }
    }
  }
}

/** Clears rate limit history for a specific key (e.g., on successful login). */
export function resetAuthRateLimit(key: string): void {
  getStore().delete(key);
}

/** Clears all stored auth rate limit state (intended for tests). */
export function clearAllAuthRateLimits(): void {
  getStore().clear();
}
