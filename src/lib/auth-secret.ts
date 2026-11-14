const DEV_FALLBACK_SESSION_SECRET =
  'simple-revision-ib-diploma-local-secret-key-2026';

let hasWarnedMissingSecret = false;

/**
 * Resolves the HMAC secret used to sign and verify session JWTs across Node and Edge runtimes.
 * Fails closed in deployed production runtime if SESSION_SECRET is unset, while preserving
 * local dev, vitest, and next build compatibility.
 */
export function getSessionSecretString(): string {
  const configured = process.env.SESSION_SECRET?.trim();
  if (configured) {
    if (
      configured.length < 32 &&
      process.env.NODE_ENV === 'production' &&
      process.env.NEXT_PHASE !== 'phase-production-build' &&
      !hasWarnedMissingSecret
    ) {
      hasWarnedMissingSecret = true;
      console.warn(
        '[Simple Revision] SESSION_SECRET is shorter than 32 characters; use a high-entropy secret in production.'
      );
    }
    return configured;
  }

  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';
  const isDeployedProduction =
    process.env.VERCEL_ENV === 'production' && !isBuildPhase;

  if (isDeployedProduction) {
    throw new Error(
      'SESSION_SECRET environment variable must be configured in production.'
    );
  }

  if (
    process.env.NODE_ENV === 'production' &&
    !isBuildPhase &&
    !hasWarnedMissingSecret
  ) {
    hasWarnedMissingSecret = true;
    console.warn(
      '[Simple Revision] SESSION_SECRET is not set; using local fallback secret. Set SESSION_SECRET in .env.local or deployment environment variables.'
    );
  }

  return DEV_FALLBACK_SESSION_SECRET;
}

export function getSessionSecretBytes(): Uint8Array {
  return Uint8Array.from(new TextEncoder().encode(getSessionSecretString()));
}
