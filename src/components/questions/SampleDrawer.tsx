'use client';

import React, { useState } from 'react';
import { X, RotateCcw, Eye, EyeOff, Bookmark, Check } from 'lucide-react';
import {
  DUMMY_FLASHCARDS,
  DUMMY_SAMPLE_QUESTIONS,
} from '@/data/dummy-data';
import { Subject } from '@/types/database';
import { PillButton } from '@/components/ui/PillButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cn } from '@/lib/utils';

interface SampleDrawerProps {
  subject: Subject | null;
  initialMode: 'questions' | 'flashcards';
  onClose: () => void;
}

export function SampleDrawer({
  subject,
  initialMode,
  onClose,
}: SampleDrawerProps) {
  const [mode, setMode] = useState<'questions' | 'flashcards'>(initialMode);
  const [revealedCardIds, setRevealedCardIds] = useState<Record<string, boolean>>({});
  const [revealedSchemeIds, setRevealedSchemeIds] = useState<Record<string, boolean>>({});
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({
    q_math_m23_p1_06: true,
  });
  const [ratedCardIds, setRatedCardIds] = useState<Record<string, string>>({});

  if (!subject) return null;

  const subjectCards = DUMMY_FLASHCARDS.filter(
    (c) => c.subjectCode === subject.code
  );
  const displayCards =
    subjectCards.length > 0 ? subjectCards : DUMMY_FLASHCARDS;

  const subjectQuestions = DUMMY_SAMPLE_QUESTIONS.filter(
    (q) => q.subjectCode === subject.code
  );
  const displayQuestions =
    subjectQuestions.length > 0 ? subjectQuestions : DUMMY_SAMPLE_QUESTIONS;

  const toggleCardReveal = (id: string) => {
    setRevealedCardIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleMarkScheme = (id: string) => {
    setRevealedSchemeIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/65 backdrop-blur-xs transition-opacity">
      <div
        className="relative flex h-full w-full max-w-2xl flex-col border-l border-border-subtle bg-surface-canvas text-text-primary shadow-2xl"
        role="dialog"
        aria-label={`${subject.name} Sample Study View`}
      >
        <div className="flex items-center justify-between border-b border-border-subtle px-6 py-5">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-accent-blush" />
              <h2 className="text-[18px] font-medium tracking-[-0.01em] text-text-primary">
                {subject.name}
              </h2>
              <span className="text-[13px] text-text-secondary">
                • {subject.subtitle}
              </span>
            </div>
            <p className="mt-1 text-[13px] text-text-secondary">
              Phase 1 interactive sample data preview
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full border border-border-subtle bg-surface-card p-2 text-text-secondary transition-colors hover:border-accent-blush/35 hover:text-text-primary"
            aria-label="Close sample drawer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between border-b border-border-subtle bg-surface-card/40 px-6 py-3">
          <div className="flex items-center gap-2">
            <PillButton
              size="sm"
              variant={mode === 'questions' ? 'primary' : 'secondary'}
              onClick={() => setMode('questions')}
            >
              Question Bank ({displayQuestions.length} sample)
            </PillButton>
            <PillButton
              size="sm"
              variant={mode === 'flashcards' ? 'primary' : 'secondary'}
              onClick={() => setMode('flashcards')}
            >
              Flashcards ({displayCards.length} sample)
            </PillButton>
          </div>
          <span className="text-[12px] text-text-secondary">
            FSRS v4.5 • May 2026 Syllabus
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {mode === 'questions' ? (
            displayQuestions.map((q) => {
              const isSchemeOpen = !!revealedSchemeIds[q.id];
              const isBookmarked = !!bookmarkedIds[q.id];

              return (
                <div
                  key={q.id}
                  className="rounded-2xl border border-border-subtle bg-surface-card p-6 transition-colors hover:border-accent-blush/25"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-border-subtle">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[13px] font-medium text-text-primary">
                        {q.session}
                      </span>
                      <span className="text-text-secondary">•</span>
                      <span className="text-[13px] text-text-secondary">
                        {q.topicLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge
                        label={`${q.maxMarks} marks`}
                        active={false}
                      />
                      <button
                        onClick={() => toggleBookmark(q.id)}
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] transition-colors',
                          isBookmarked
                            ? 'border-accent-blush/40 bg-accent-blush-glow text-accent-rose-hover'
                            : 'border-border-subtle bg-surface-raised text-text-secondary hover:text-text-primary'
                        )}
                      >
                        <Bookmark className="h-3 w-3" />
                        {isBookmarked ? 'Saved' : 'Bookmark'}
                      </button>
                    </div>
                  </div>

                  <p className="mt-4 text-[15px] leading-[24px] text-text-primary">
                    {q.promptMarkdown}
                  </p>

                  <div className="mt-5 flex items-center justify-between pt-4 border-t border-border-subtle">
                    <span className="text-[12px] text-text-secondary">
                      Paper {q.paper} • Difficulty {q.difficulty}/7
                    </span>
                    <PillButton
                      size="sm"
                      variant="secondary"
                      onClick={() => toggleMarkScheme(q.id)}
                    >
                      {isSchemeOpen ? (
                        <>
                          <EyeOff className="h-3.5 w-3.5" />
                          Hide Mark Scheme
                        </>
                      ) : (
                        <>
                          <Eye className="h-3.5 w-3.5" />
                          Peek Mark Scheme
                        </>
                      )}
                    </PillButton>
                  </div>

                  {isSchemeOpen && (
                    <div className="mt-4 border-t border-border-subtle pt-4 text-[14px] leading-[22px] text-text-secondary space-y-1.5">
                      <div className="text-[12px] font-medium uppercase tracking-wider text-accent-blush mb-2">
                        Official Examiner Mark Scheme Notes
                      </div>
                      {q.markSchemeMarkdown.split('\n').map((line, idx) => (
                        <p key={idx} className="text-text-primary/90">
                          {line.replace(/^- /, '• ')}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            displayCards.map((card) => {
              const isRevealed = !!revealedCardIds[card.id];
              const rating = ratedCardIds[card.id];

              return (
                <div
                  key={card.id}
                  className="rounded-2xl border border-border-subtle bg-surface-card p-6 transition-colors hover:border-accent-blush/25"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                    <span className="text-[13px] text-text-secondary">
                      {card.topicLabel}
                    </span>
                    <span className="text-[12px] font-medium text-accent-blush">
                      {rating ? `Scheduled (${rating})` : card.nextReviewLabel}
                    </span>
                  </div>

                  <div className="py-5">
                    <p className="text-[16px] font-medium leading-[25px] text-text-primary">
                      {card.frontPrompt}
                    </p>

                    {isRevealed && (
                      <div className="mt-4 border-t border-border-subtle pt-4">
                        <p className="text-[15px] leading-[24px] text-text-secondary">
                          {card.backAnswer}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {card.keyTerms.map((term) => (
                            <span
                              key={term}
                              className="rounded-full border border-border-subtle bg-surface-raised px-2.5 py-0.5 text-[12px] text-text-secondary"
                            >
                              {term}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border-subtle">
                    <PillButton
                      size="sm"
                      variant="secondary"
                      onClick={() => toggleCardReveal(card.id)}
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      {isRevealed ? 'Hide Answer' : 'Reveal Answer'}
                    </PillButton>

                    {isRevealed && (
                      <div className="flex items-center gap-1.5">
                        {(['Again', 'Hard', 'Good', 'Easy'] as const).map(
                          (intervalLabel) => (
                            <button
                              key={intervalLabel}
                              onClick={() =>
                                setRatedCardIds((prev) => ({
                                  ...prev,
                                  [card.id]: intervalLabel,
                                }))
                              }
                              className={cn(
                                'rounded-full border px-3 py-1 text-[12px] font-medium transition-colors',
                                rating === intervalLabel
                                  ? 'border-accent-blush bg-accent-blush text-surface-canvas'
                                  : 'border-border-subtle bg-surface-raised text-text-secondary hover:border-accent-blush/35 hover:text-text-primary'
                              )}
                            >
                              {rating === intervalLabel && (
                                <Check className="mr-1 inline h-3 w-3" />
                              )}
                              {intervalLabel}
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
