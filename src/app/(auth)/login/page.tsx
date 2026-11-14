'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, Loader2 } from 'lucide-react';
import type { ScreenState } from '@/types/fsm';
import { sanitizeRedirectPath } from '@/lib/auth-validation';
import { AuthCardShell, AuthCardSkeleton } from '@/components/auth/AuthCardShell';
import { PasswordField } from '@/components/auth/PasswordField';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formState, setFormState] = useState<ScreenState<{ ok: boolean }>>({
    status: 'idle',
  });

  const rawNext = searchParams.get('next') ?? searchParams.get('callbackUrl');
  const redirectTarget = sanitizeRedirectPath(rawNext);
  const signupHref =
    redirectTarget !== '/'
      ? `/signup?next=${encodeURIComponent(redirectTarget)}`
      : '/signup';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormState({ status: 'loading' });
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFormState({
          status: 'error',
          message: data.error ?? 'Could not sign in.',
        });
        return;
      }
      setFormState({ status: 'success', data: { ok: true } });
      router.push(redirectTarget);
      router.refresh();
    } catch {
      setFormState({
        status: 'error',
        message: 'Network error while signing in.',
      });
    }
  }

  return (
    <AuthCardShell
      title="Sign in to your workspace"
      subtitle="Your progress, mistakes log, flashcards, notes, and essay drafts sync to your account."
      footer={
        <>
          <span>New to Simple Revision?</span>
          <Link
            href={signupHref}
            className="sr-auth-link inline-flex items-center gap-1 font-semibold text-[#18181B] hover:text-[#065F46] hover:underline rounded-md px-1.5 py-0.5 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
          >
            <span>Create account</span>
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
            className="w-full px-3.5 py-2.5 rounded-[10px] border border-[#E4E4E7] bg-[#FAFAFA] text-[13.5px] text-[#18181B] placeholder:text-[#A1A1AA] hover:border-[#D4D4D8] focus:bg-[#FFFFFF] focus:border-[#18181B] focus:outline-none focus:ring-[3px] focus:ring-[#18181B]/10 transition-[background-color,border-color,box-shadow] duration-150"
            placeholder="student@example.com"
          />
        </div>

        <PasswordField
          id="password"
          name="password"
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          required
        />

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
          <span>{formState.status === 'loading' ? 'Signing in...' : 'Sign In'}</span>
        </button>
      </form>
    </AuthCardShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthCardSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}
