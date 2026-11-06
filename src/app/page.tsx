import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Layers, BookOpen, Lightbulb } from 'lucide-react';
import {
  DUMMY_SUBJECTS,
  DUMMY_FLASHCARDS,
  DUMMY_SAMPLE_QUESTIONS,
  DUMMY_IB_CORE_ITEMS,
} from '@/data/dummy-data';
import { PillButton } from '@/components/ui/PillButton';

const SYLLABI_DOT_COLORS = [
  'bg-accent-blush',
  'bg-amber-300/80',
  'bg-sky-300/80',
  'bg-indigo-300/80',
  'bg-emerald-300/80',
  'bg-rose-300/80',
];

export default function LandingPage() {
  const featuredCard = DUMMY_FLASHCARDS[0];
  const featuredQuestion = DUMMY_SAMPLE_QUESTIONS[0];

  return (
    <div className="min-h-screen bg-surface-canvas text-text-primary flex flex-col">
      <header className="border-b border-border-subtle/80">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[18px] font-semibold tracking-[-0.02em] text-text-primary"
          >
            <span>ib revise</span>
            <span className="h-2 w-2 rounded-full bg-accent-blush" />
          </Link>

          <nav
            aria-label="Landing Navigation"
            className="hidden md:flex items-center gap-8 text-[13px] text-text-secondary"
          >
            <a href="#overview" className="transition-colors hover:text-text-primary">
              Overview
            </a>
            <a href="#syllabi" className="transition-colors hover:text-text-primary">
              Subjects
            </a>
            <a href="#methodology" className="transition-colors hover:text-text-primary">
              Methodology
            </a>
          </nav>

          <PillButton href="/dashboard" variant="secondary" size="sm">
            <span>Enter App</span>
            <ArrowRight className="h-3.5 w-3.5 text-accent-blush" />
          </PillButton>
        </div>
      </header>

      <main className="flex-1">
        <section
          id="overview"
          className="mx-auto max-w-[1280px] px-6 pt-24 pb-20 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-card px-4 py-1.5 text-[12px] text-text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-blush" />
            <span>Calm Revision for the International Baccalaureate</span>
          </div>

          <h1 className="mx-auto mt-7 max-w-3xl text-[36px] sm:text-[44px] font-semibold leading-[44px] sm:leading-[52px] tracking-[-0.025em] text-text-primary">
            Revision without the noise.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-[24px] text-text-secondary">
            Distraction-free active recall flashcards, comprehensive question
            banks, and calm tracking for TOK, EE, and IAs.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
            <PillButton href="/dashboard" variant="primary" size="lg">
              <span>Begin Studying</span>
              <ArrowRight className="h-4 w-4" />
            </PillButton>
            <PillButton href="#syllabi" variant="secondary" size="lg">
              <span>Browse 6 Subjects</span>
            </PillButton>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-[12px] text-text-secondary">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-accent-blush" />
              Zero algorithmic gamification
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-accent-blush" />
              FSRS Spaced Repetition
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-accent-blush" />
              May &amp; Nov Specification
            </span>
          </div>
        </section>

        <section
          id="syllabi"
          className="border-y border-border-subtle bg-surface-canvas/60 py-8"
        >
          <div className="mx-auto max-w-[1280px] px-6">
            <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.08em] text-text-secondary mb-4">
              <span>Core Diploma Syllabi</span>
              <span>Standard &amp; Higher Level</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {DUMMY_SUBJECTS.map((subject, idx) => (
                <Link
                  key={subject.id}
                  href={`/dashboard?subject=${subject.code}`}
                  className="inline-flex items-center gap-3 rounded-full border border-border-subtle bg-surface-card px-4 py-2 text-[13px] transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-blush/35 hover:bg-surface-raised"
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      SYLLABI_DOT_COLORS[idx % SYLLABI_DOT_COLORS.length]
                    }`}
                  />
                  <span className="font-medium text-text-primary">
                    {subject.name}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] ${
                      subject.dueCardsCount > 0
                        ? 'bg-accent-blush-glow text-accent-blush'
                        : 'bg-surface-raised text-text-secondary'
                    }`}
                  >
                    {subject.dueCardsCount > 0
                      ? `${subject.dueCardsCount} due`
                      : 'Up to date'}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section
          id="methodology"
          className="mx-auto max-w-[1280px] px-6 py-24"
        >
          <div className="text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-accent-blush">
              Quiet Precision
            </p>
            <h2 className="mt-2.5 text-[24px] font-semibold leading-[32px] tracking-[-0.015em] text-text-primary">
              Designed for sustained human focus.
            </h2>
            <p className="mx-auto mt-2.5 max-w-lg text-[14px] leading-[22px] text-text-secondary">
              Every tool is stripped of streaks, notifications, and competitive
              charts. Only clear recall and deep learning remain.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="flex flex-col justify-between rounded-2xl border border-border-subtle bg-surface-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-blush/30">
              <div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-surface-raised text-accent-blush">
                  <Layers className="h-4 w-4" />
                </div>
                <h3 className="mt-5 text-[18px] font-medium leading-[26px] tracking-[-0.01em] text-text-primary">
                  Active Recall Flashcards
                </h3>
                <p className="mt-2 text-[14px] leading-[22px] text-text-secondary">
                  Spaced repetition engine calibrated to optimal decay
                  intervals. Smooth self-rating with zero punishment or stress
                  triggers.
                </p>
              </div>

              <div className="mt-7 rounded-xl border border-border-subtle bg-surface-canvas p-4">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-text-secondary">
                    {featuredCard.topicLabel}
                  </span>
                  <span className="text-accent-blush font-medium">
                    {featuredCard.nextReviewLabel}
                  </span>
                </div>
                <p className="mt-2.5 text-[13px] font-medium leading-[20px] text-text-primary">
                  {featuredCard.frontPrompt}
                </p>
                <div className="mt-3.5 flex items-center gap-2 pt-3 border-t border-border-subtle">
                  <span className="rounded-full border border-border-subtle bg-surface-card px-2.5 py-0.5 text-[11px] text-text-secondary">
                    Gentle feedback
                  </span>
                  <span className="rounded-full bg-accent-blush-glow px-2.5 py-0.5 text-[11px] text-accent-blush">
                    FSRS v4.5
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-border-subtle bg-surface-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-blush/30">
              <div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-surface-raised text-accent-blush">
                  <BookOpen className="h-4 w-4" />
                </div>
                <h3 className="mt-5 text-[18px] font-medium leading-[26px] tracking-[-0.01em] text-text-primary">
                  30,000+ Question Bank
                </h3>
                <p className="mt-2 text-[14px] leading-[22px] text-text-secondary">
                  Comprehensive past-paper problem repository accurately tagged
                  by syllabus criteria, paper code, and official markschemes.
                </p>
              </div>

              <div className="mt-7 rounded-xl border border-border-subtle bg-surface-canvas p-4">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-text-secondary">
                    {featuredQuestion.session}
                  </span>
                  <span className="rounded-full border border-border-subtle bg-surface-card px-2 py-0.5 text-text-secondary">
                    {featuredQuestion.maxMarks} marks
                  </span>
                </div>
                <p className="mt-2.5 text-[13px] font-medium leading-[20px] text-text-primary">
                  Definite integral substitution with analytical boundary
                  limits.
                </p>
                <div className="mt-3.5 flex items-center justify-between pt-3 border-t border-border-subtle text-[11px]">
                  <span className="text-text-secondary">
                    Instant mark scheme peek
                  </span>
                  <span className="text-accent-blush font-medium">
                    Verified
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-border-subtle bg-surface-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-blush/30">
              <div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-surface-raised text-accent-blush">
                  <Lightbulb className="h-4 w-4" />
                </div>
                <h3 className="mt-5 text-[18px] font-medium leading-[26px] tracking-[-0.01em] text-text-primary">
                  IB Core Companion
                </h3>
                <p className="mt-2 text-[14px] leading-[22px] text-text-secondary">
                  Serene milestones for the Theory of Knowledge Essay,
                  4,000-word Extended Essay, and subject Internal Assessments.
                </p>
              </div>

              <div className="mt-7 rounded-xl border border-border-subtle bg-surface-canvas p-4 space-y-2.5 text-[12px]">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">
                    TOK Essay Draft Outline
                  </span>
                  <span className="text-accent-blush font-medium">
                    Exhibition Passed
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-border-subtle/70 pt-2">
                  <span className="text-text-secondary">
                    EE First Draft (4,000w)
                  </span>
                  <span className="text-text-primary">
                    {DUMMY_IB_CORE_ITEMS[1].highlightNote}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-border-subtle/70 pt-2">
                  <span className="text-text-secondary">
                    Internal Assessments
                  </span>
                  <span className="text-text-primary">
                    {DUMMY_IB_CORE_ITEMS[2].highlightNote}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-2xl rounded-2xl border border-border-subtle bg-surface-card/60 px-8 py-7 text-center">
            <p className="text-[15px] italic leading-[24px] text-text-primary/90">
              “Revision is not a frantic sprint before exams; it is a quiet,
              steady dialogue with ideas.”
            </p>
            <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.12em] text-text-secondary">
              May 2026 Session Philosophy
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] border-t border-border-subtle px-6 py-20 text-center">
          <h2 className="text-[22px] font-semibold tracking-[-0.015em] text-text-primary">
            Begin your peaceful revision session.
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[13px] leading-[20px] text-text-secondary">
            No accounts required for basic drills. Open the question bank or
            review due cards in seconds.
          </p>
          <div className="mt-7">
            <PillButton href="/dashboard" variant="primary" size="lg">
              <span>Open ib revise</span>
              <ArrowRight className="h-4 w-4" />
            </PillButton>
          </div>
        </section>
      </main>

      <footer className="border-t border-border-subtle py-6 text-[12px] text-text-secondary">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-2">
            <span className="text-text-primary font-medium">© 2026 ib revise</span>
            <span className="h-1 w-1 rounded-full bg-accent-blush" />
            <span>Gentle rigor for the International Baccalaureate</span>
          </div>

          <div className="rounded-full border border-border-subtle bg-surface-card px-3.5 py-1 text-[11px]">
            Press <kbd className="rounded border border-border-subtle bg-surface-raised px-1.5 py-0.5 text-text-primary">⌘K</kbd> to search syllabus
          </div>

          <div className="flex items-center gap-5">
            <Link href="/dashboard" className="hover:text-text-primary">
              Documentation
            </Link>
            <Link href="/dashboard" className="hover:text-text-primary">
              Privacy Protocol
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
