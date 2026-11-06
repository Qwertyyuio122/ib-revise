'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail, User, Calendar } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { PillButton } from '@/components/ui/PillButton';

const EXAM_SESSIONS = [
  'May 2026 Session',
  'Nov 2026 Session',
  'May 2027 Session',
];

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [examSession, setExamSession] = useState(EXAM_SESSIONS[0]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim() || 'IB Candidate',
          exam_session: examSession,
        },
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    if (data.user && data.session) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: fullName.trim() || 'IB Candidate',
        exam_session: examSession,
      });

      await supabase.from('ib_core_items').insert([
        {
          user_id: data.user.id,
          type: 'TOK_ESSAY',
          title: 'TOK Exhibition & Prescribed Essay Outline',
          draft_status: 'OUTLINE',
          word_count: 0,
          target_word_count: 1600,
        },
        {
          user_id: data.user.id,
          type: 'EXTENDED_ESSAY',
          title: 'Extended Essay Research & First Draft (4,000w)',
          draft_status: 'OUTLINE',
          word_count: 0,
          target_word_count: 4000,
        },
        {
          user_id: data.user.id,
          type: 'IA',
          title: 'Subject Internal Assessments (6 Subjects)',
          draft_status: 'OUTLINE',
          word_count: 0,
          target_word_count: 3000,
        },
      ]);

      router.push('/dashboard');
      router.refresh();
      return;
    }

    setConfirmationSent(true);
    setLoading(false);
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
        <PillButton href="/login" variant="secondary" size="sm">
          Sign In
        </PillButton>
      </header>

      <main className="mx-auto my-10 w-full max-w-[440px]">
        <div className="rounded-2xl border border-border-subtle bg-surface-card p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-canvas px-3 py-1 text-[11px] text-text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-blush" />
            <span>IB Diploma Candidate Setup</span>
          </div>

          <h1 className="mt-5 text-[24px] font-semibold leading-[32px] tracking-[-0.015em] text-text-primary">
            Begin your calm workspace.
          </h1>
          <p className="mt-1.5 text-[14px] leading-[22px] text-text-secondary">
            Your flashcard review intervals, question bookmarks, and TOK/EE/IA
            milestones are isolated to your account.
          </p>

          {confirmationSent ? (
            <div className="mt-6 space-y-4 rounded-xl border border-accent-blush/35 bg-surface-canvas p-5">
              <p className="text-[14px] font-medium text-text-primary">
                Check your inbox to confirm your email
              </p>
              <p className="text-[13px] leading-[20px] text-text-secondary">
                We sent a verification link to{' '}
                <span className="text-text-primary font-medium">{email}</span>.
                Once confirmed, you can sign right into your workspace.
              </p>
              <PillButton
                href="/login"
                variant="primary"
                size="md"
                className="w-full"
              >
                Go to Sign In
              </PillButton>
            </div>
          ) : (
            <form onSubmit={handleSignUp} className="mt-7 space-y-4">
              <div>
                <label
                  htmlFor="signup-name"
                  className="block text-[12px] font-medium text-text-secondary mb-1.5"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                  <input
                    id="signup-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex M."
                    className="w-full rounded-xl border border-border-subtle bg-surface-canvas pl-10 pr-4 py-2.5 text-[14px] text-text-primary placeholder:text-text-secondary/60 focus:border-accent-blush/50 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-session"
                  className="block text-[12px] font-medium text-text-secondary mb-1.5"
                >
                  Diploma Exam Session
                </label>
                <div className="relative">
                  <Calendar className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                  <select
                    id="signup-session"
                    value={examSession}
                    onChange={(e) => setExamSession(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-border-subtle bg-surface-canvas pl-10 pr-4 py-2.5 text-[14px] text-text-primary focus:border-accent-blush/50 focus:outline-none"
                  >
                    {EXAM_SESSIONS.map((session) => (
                      <option key={session} value={session}>
                        {session}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-email"
                  className="block text-[12px] font-medium text-text-secondary mb-1.5"
                >
                  Candidate Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                  <input
                    id="signup-email"
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
                  htmlFor="signup-password"
                  className="block text-[12px] font-medium text-text-secondary mb-1.5"
                >
                  Password (minimum 6 characters)
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                  <input
                    id="signup-password"
                    type="password"
                    required
                    minLength={6}
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
                  <span>
                    {loading ? 'Creating workspace...' : 'Create Candidate Account'}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </PillButton>
              </div>
            </form>
          )}

          <div className="my-6 border-t border-border-subtle" />

          <p className="text-center text-[12px] text-text-secondary">
            Already registered?{' '}
            <Link
              href="/login"
              className="font-medium text-accent-blush hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </main>

      <footer className="mx-auto w-full max-w-[1280px] text-center text-[12px] text-text-secondary">
        Protected by Supabase Row-Level Security • 6 Core Subjects + IB Core
      </footer>
    </div>
  );
}
