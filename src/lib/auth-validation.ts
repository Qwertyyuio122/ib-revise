import { z } from 'zod';

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

export const PasswordSchema = z
  .string()
  .min(
    PASSWORD_MIN_LENGTH,
    `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`
  )
  .max(
    PASSWORD_MAX_LENGTH,
    `Password must be at most ${PASSWORD_MAX_LENGTH} characters long.`
  )
  .regex(/[A-Za-z]/, 'Password must include at least one letter.')
  .regex(/\d/, 'Password must include at least one number.');

export const SignupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required.')
    .max(60, 'Name must be 60 characters or fewer.'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address.'),
  password: PasswordSchema,
  geminiApiKey: z.string().max(256, 'Gemini API key is too long.').optional(),
});

export const LoginSchema = z
  .object({
    email: z.string().trim().email('Please enter a valid email address.'),
    password: z
      .string()
      .min(1, 'Password is required.')
      .max(PASSWORD_MAX_LENGTH, 'Password is too long.'),
  })
  .strict();

export interface PasswordChecks {
  minLength: boolean;
  maxLength: boolean;
  hasLetter: boolean;
  hasNumber: boolean;
  isValid: boolean;
}

/** Evaluates password strength rules consistently across client UI and tests. */
export function getPasswordChecks(password: string): PasswordChecks {
  const minLength = password.length >= PASSWORD_MIN_LENGTH;
  const maxLength = password.length <= PASSWORD_MAX_LENGTH;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  return {
    minLength,
    maxLength,
    hasLetter,
    hasNumber,
    isValid: minLength && maxLength && hasLetter && hasNumber,
  };
}

/** Formats Zod validation issues into a consistent API error payload. */
export function formatZodError(error: z.ZodError) {
  const fieldErrors = error.flatten().fieldErrors;
  const issues = error.issues.map((issue) => ({
    field: issue.path.join('.') || 'form',
    message: issue.message,
  }));
  const firstMessage =
    issues[0]?.message ?? 'Please check your submitted details.';

  return {
    error: firstMessage,
    fieldErrors,
    issues,
  };
}

/**
 * Validates a post-auth redirect target so it is strictly a safe relative app path.
 * Rejects external origins, protocol-relative URLs, backslashes, control chars, and auth loops.
 */
export function sanitizeRedirectPath(raw: string | null | undefined): string {
  if (!raw || typeof raw !== 'string') {
    return '/';
  }

  // Reject control characters, surrounding whitespace, or backslashes (which some browsers treat as '/')
  if (/[\x00-\x1f\x7f\\]/.test(raw) || raw.trim() !== raw) {
    return '/';
  }

  if (!raw.startsWith('/') || raw.startsWith('//')) {
    return '/';
  }

  try {
    const parsed = new URL(raw, 'http://localhost');
    if (parsed.origin !== 'http://localhost') {
      return '/';
    }
    if (!parsed.pathname.startsWith('/') || parsed.pathname.startsWith('//')) {
      return '/';
    }
    if (
      parsed.pathname === '/login' ||
      parsed.pathname === '/signup' ||
      parsed.pathname.startsWith('/api/')
    ) {
      return '/';
    }
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return '/';
  }
}
