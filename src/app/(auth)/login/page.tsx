'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { PillButton } from '@/components/ui/PillButton';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="flex min-h-screen flex-col justify-between bg-surface-canvas px-6 py-8 text-text-primary">
      <header className="mx-auto flex w-full max-w-[1280px] items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[18px] font-semibold tracking-[-0.02em] text-text-primary"
        >
          <span>ib revise</span>
          <span className="h-2 w-2 rounded-full bg-accent-blush" />
        </Link>
        <PillButton href="/signup" variant="secondary" size="sm">
          Create Student Account
        </PillButton>
      </header>

      <main className="mx-auto my-12 w-full max-w-[420px]">
        <div className="rounded-2xl border border-border-subtle bg-surface-card p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-canvas px-3 py-1 text-[11px] text-text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-blush" />
            <span>Private Student Session</span>
          </div>

          <h1 className="mt-5 text-[24px] font-semibold leading-[32px] tracking-[-0.015em] text-text-primary">
            Welcome back.
          </h1>
          <p className="mt-1.5 text-[14px] leading-[22px] text-text-secondary">
            Sign in to resume your FSRS flashcards, question bank bookmarks, and
            IB Core milestones.
          </p>

          <form onSubmit={handleSignIn} className="mt-7 space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-[12px] font-medium text-text-secondary mb-1.5"
              >
                Candidate Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@ibstudent.org"
                  className="w-full rounded-xl border border-border-subtle bg-surface-canvas pl-10 pr-4 py-2.5 text-[14px] text-text-primary placeholder:text-text-secondary/60 focus:border-accent-blush/50 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-[12px] font-medium text-text-secondary mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border-subtle bg-surface-canvas pl-10 pr-4 py-2.5 text-[14px] text-text-primary placeholder:text-text-secondary/60 focus:border-accent-blush/50 focus:outline-none"
                />
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-xl border border-accent-blush/35 bg-accent-blush-glow px-4 py-3 text-[13px] text-accent-rose-hover">
                {errorMessage}
              </div>
            )}

            <div className="pt-2">
              <PillButton
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                className="w-full"
              >
                <span>{loading ? 'Signing in...' : 'Sign in to Session'}</span>
                <ArrowRight className="h-4 w-4" />
              </PillButton>
            </div>
          </form>

          <div className="my-6 border-t border-border-subtle" />

          <div className="space-y-3 text-center">
            <PillButton
              href="/dashboard"
              variant="secondary"
              size="md"
              className="w-full"
            >
              Continue in Guest Preview
            </PillButton>
            <p className="text-[12px] text-text-secondary">
              New to ib revise?{' '}
              <Link
                href="/signup"
                className="font-medium text-accent-blush hover:underline"
              >
                Create your candidate profile
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="mx-auto w-full max-w-[1280px] text-center text-[12px] text-text-secondary">
        Protected by Supabase Row-Level Security • Zero cross-account data
        sharing
      </footer>
    </div>
  );
}
