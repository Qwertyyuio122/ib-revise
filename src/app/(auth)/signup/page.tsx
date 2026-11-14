'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, Check, Loader2 } from 'lucide-react';
import type { ScreenState } from '@/types/fsm';
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  getPasswordChecks,
  sanitizeRedirectPath,
} from '@/lib/auth-validation';
import { AuthCardShell, AuthCardSkeleton } from '@/components/auth/AuthCardShell';
import { PasswordField } from '@/components/auth/PasswordField';

const INPUT_CLASS_NAME =
  'w-full px-3.5 py-2.5 rounded-[10px] border border-[#E4E4E7] bg-[#FAFAFA] text-[13.5px] text-[#18181B] placeholder:text-[#A1A1AA] hover:border-[#D4D4D8] focus:bg-[#FFFFFF] focus:border-[#18181B] focus:outline-none focus:ring-[3px] focus:ring-[#18181B]/10 transition-[background-color,border-color,box-shadow] duration-150';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [formState, setFormState] = useState<ScreenState<{ ok: boolean }>>({
    status: 'idle',
  });

  const rawNext = searchParams.get('next') ?? searchParams.get('callbackUrl');
  const redirectTarget = sanitizeRedirectPath(rawNext);
  const loginHref =
    redirectTarget !== '/'
      ? `/login?next=${encodeURIComponent(redirectTarget)}`
      : '/login';

  const checks = getPasswordChecks(password);
  const passwordsMismatch =
    confirmPassword.length > 0 && confirmPassword !== password;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!checks.isValid) {
      setFormState({
        status: 'error',
        message:
          'Password must be 8–128 characters and include at least one letter and one number.',
      });
      return;
    }

    if (password !== confirmPassword) {
      setFormState({
        status: 'error',
        message: 'Passwords do not match.',
      });
      return;
    }

    setFormState({ status: 'loading' });
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          geminiApiKey: geminiApiKey.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFormState({
          status: 'error',
          message: data.error ?? 'Could not create account.',
        });
        return;
      }
      setFormState({ status: 'success', data: { ok: true } });
      router.push(redirectTarget);
      router.refresh();
    } catch {
      setFormState({
        status: 'error',
        message: 'Network error while creating account.',
      });
    }
  }

  return (
    <AuthCardShell
      maxWidthClass="max-w-[440px]"
      title="Create your study account"
      subtitle="Save your IB revision progress, mistakes log, flashcards, notes, and essay drafts in your personal workspace."
      footer={
        <>
          <span>Already have an account?</span>
          <Link
            href={loginHref}
            className="sr-auth-link inline-flex items-center gap-1 font-semibold text-[#18181B] hover:text-[#065F46] hover:underline rounded-md px-1.5 py-0.5 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
          >
            <span>Sign in</span>
            <span aria-hidden="true" className="sr-auth-link-arrow">
              →
            </span>
          </Link>
        </>
      }
    >
      {formState.status === 'error' && (
        <div
          role="alert"
          className="sr-auth-alert mb-4 flex items-start gap-2.5 p-3 rounded-[10px] bg-[#FEF2F2] border border-[#FECACA] text-[12.5px] leading-[1.45] text-[#DC2626]"
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-[1px]" aria-hidden="true" />
          <span>{formState.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-[12px] font-semibold text-[#3F3F46] mb-1.5"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={60}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={INPUT_CLASS_NAME}
            placeholder="Your name"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-[12px] font-semibold text-[#3F3F46] mb-1.5"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={INPUT_CLASS_NAME}
            placeholder="student@example.com"
          />
        </div>

        <div>
          <PasswordField
            id="password"
            name="password"
            label="Password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            required
            minLength={PASSWORD_MIN_LENGTH}
            maxLength={PASSWORD_MAX_LENGTH}
            placeholder="At least 8 characters"
            describedBy="password-requirements"
          />
          <ul
            id="password-requirements"
            className="mt-2 flex flex-wrap gap-1.5 sm:grid sm:grid-cols-3 text-[11.5px]"
          >
            {[
              { ok: checks.minLength && checks.maxLength, label: '8+ characters' },
              { ok: checks.hasLetter, label: 'One letter' },
              { ok: checks.hasNumber, label: 'One number' },
            ].map((req) => (
              <li
                key={req.label}
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-[7px] border transition-[color,background-color,border-color] duration-150 ${
                  req.ok
                    ? 'border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46] font-medium'
                    : 'border-[#E4E4E7] bg-[#FAFAFA] text-[#71717A]'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,color] duration-150 ${
                    req.ok
                      ? 'border-[#059669] bg-[#FFFFFF] text-[#059669]'
                      : 'border-[#D4D4D8] bg-white text-transparent'
                  }`}
                >
                  <Check className="h-2.5 w-2.5" />
                </span>
                <span>{req.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <PasswordField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            autoComplete="new-password"
            required
            minLength={PASSWORD_MIN_LENGTH}
            maxLength={PASSWORD_MAX_LENGTH}
            placeholder="Re-enter your password"
            showLabel="Show confirm password"
            hideLabel="Hide confirm password"
            describedBy={passwordsMismatch ? 'confirm-password-error' : undefined}
            hasError={passwordsMismatch}
          />
          {passwordsMismatch && (
            <p
              id="confirm-password-error"
              className="sr-auth-alert mt-1.5 flex items-center gap-1.5 text-[11.5px] text-[#DC2626]"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>Passwords do not match.</span>
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-[#F4F4F5]">
          <PasswordField
            id="geminiKey"
            name="geminiApiKey"
            label={
              <>
                Gemini API Key{' '}
                <span className="font-normal text-[#71717A]">
                  (Optional — can also add later in Settings)
                </span>
              </>
            }
            value={geminiApiKey}
            onChange={setGeminiApiKey}
            autoComplete="off"
            placeholder="AIzaSy..."
            inputClassName="font-mono text-[12.5px]"
            showLabel="Show Gemini API key"
            hideLabel="Hide Gemini API key"
          />
        </div>

        <button
          type="submit"
          disabled={formState.status === 'loading'}
          className="w-full py-2.5 px-4 rounded-[10px] bg-[#18181B] hover:bg-[#27272A] active:scale-[0.985] active:bg-[#09090B] motion-reduce:active:scale-100 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 text-white font-semibold text-[13px] transition-[background-color,opacity,transform,box-shadow] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] focus-visible:ring-offset-2 cursor-pointer inline-flex items-center justify-center gap-2"
        >
          {formState.status === 'loading' && (
            <Loader2
              className="h-3.5 w-3.5 animate-spin motion-reduce:animate-none"
              aria-hidden="true"
            />
          )}
          <span>
            {formState.status === 'loading'
              ? 'Creating Account...'
              : 'Create Account'}
          </span>
        </button>
      </form>
    </AuthCardShell>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<AuthCardSkeleton maxWidthClass="max-w-[440px]" />}>
      <SignupForm />
    </Suspense>
  );
}
