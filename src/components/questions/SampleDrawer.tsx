'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  RotateCcw,
  Eye,
  EyeOff,
  Bookmark,
  Check,
  Search,
} from 'lucide-react';
import {
  DUMMY_FLASHCARDS,
  DUMMY_SAMPLE_QUESTIONS,
} from '@/data/dummy-data';
import { Subject, SampleQuestion } from '@/types/database';
import { createClient } from '@/lib/supabase/client';
import { PillButton } from '@/components/ui/PillButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cn } from '@/lib/utils';

interface SampleDrawerProps {
  subject: Subject | null;
  initialMode: 'questions' | 'flashcards';
  userId?: string | null;
  onClose: () => void;
}

export function SampleDrawer({
  subject,
  initialMode,
  userId,
  onClose,
}: SampleDrawerProps) {
  const [mode, setMode] = useState<'questions' | 'flashcards'>(initialMode);
  const [paperFilter, setPaperFilter] = useState<'ALL' | 'P1' | 'P2' | 'P3'>(
    'ALL'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [liveQuestions, setLiveQuestions] = useState<SampleQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const [revealedCardIds, setRevealedCardIds] = useState<
    Record<string, boolean>
  >({});
  const [revealedSchemeIds, setRevealedSchemeIds] = useState<
    Record<string, boolean>
  >({});
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({
    q_math_m23_p1_06: true,
  });
  const [ratedCardIds, setRatedCardIds] = useState<Record<string, string>>({});

  useEffect(() => {
    setMode(initialMode);
    setPaperFilter('ALL');
    setSearchQuery('');
  }, [initialMode, subject]);

  useEffect(() => {
    if (!subject) return;

    let cancelled = false;
    setLoadingQuestions(true);

    const params = new URLSearchParams();
    params.set('subject', subject.code);
    params.set('limit', '20');
    if (paperFilter !== 'ALL') {
      params.set('paper', paperFilter);
    }
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }

    fetch(`/api/questions?${params.toString()}`)
      .then((res) => res.json())
      .then((payload) => {
        if (cancelled) return;
        if (Array.isArray(payload.questions) && payload.questions.length > 0) {
          setLiveQuestions(payload.questions);
        } else {
          const fallback = DUMMY_SAMPLE_QUESTIONS.filter(
            (q) => q.subjectCode === subject.code
          );
          setLiveQuestions(
            fallback.length > 0 ? fallback : DUMMY_SAMPLE_QUESTIONS
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLiveQuestions(DUMMY_SAMPLE_QUESTIONS);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingQuestions(false);
      });

    return () => {
      cancelled = true;
    };
  }, [subject, paperFilter, searchQuery]);

  useEffect(() => {
    if (!userId) return;
    const supabase = createClient();
    supabase
      .from('user_question_activity')
      .select('question_id, status')
      .eq('user_id', userId)
      .then(({ data }) => {
        if (data && data.length > 0) {
          const map: Record<string, boolean> = {};
          data.forEach((row) => {
            if (row.status === 'BOOKMARKED') {
              map[row.question_id] = true;
            }
          });
          setBookmarkedIds(map);
        }
      });
  }, [userId]);

  if (!subject) return null;

  const subjectCards = DUMMY_FLASHCARDS.filter(
    (c) => c.subjectCode === subject.code
  );
  const displayCards =
    subjectCards.length > 0 ? subjectCards : DUMMY_FLASHCARDS;

  const displayQuestions =
    liveQuestions.length > 0 ? liveQuestions : DUMMY_SAMPLE_QUESTIONS;

  const toggleCardReveal = (id: string) => {
    setRevealedCardIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleMarkScheme = (id: string) => {
    setRevealedSchemeIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleBookmark = async (id: string) => {
    const nextState = !bookmarkedIds[id];
    setBookmarkedIds((prev) => ({ ...prev, [id]: nextState }));

    if (userId) {
      const supabase = createClient();
      if (nextState) {
        await supabase.from('user_question_activity').upsert({
          user_id: userId,
          question_id: id,
          status: 'BOOKMARKED',
          last_practiced_at: new Date().toISOString(),
        });
      } else {
        await supabase
          .from('user_question_activity')
          .delete()
          .eq('user_id', userId)
          .eq('question_id', id);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/65 backdrop-blur-xs transition-opacity">
      <div
        className="relative flex h-full w-full max-w-2xl flex-col border-l border-border-subtle bg-surface-canvas text-text-primary shadow-2xl"
        role="dialog"
        aria-label={`${subject.name} Study View`}
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
              {userId
                ? 'Synced with your private Supabase session • PostgreSQL FTS active'
                : 'Guest preview mode • PostgreSQL Full-Text Search active'}
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

        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle bg-surface-card/40 px-6 py-3">
          <div className="flex items-center gap-2">
            <PillButton
              size="sm"
              variant={mode === 'questions' ? 'primary' : 'secondary'}
              onClick={() => setMode('questions')}
            >
              Question Bank ({displayQuestions.length})
            </PillButton>
            <PillButton
              size="sm"
              variant={mode === 'flashcards' ? 'primary' : 'secondary'}
              onClick={() => setMode('flashcards')}
            >
              Flashcards ({displayCards.length})
            </PillButton>
          </div>
          <span className="text-[12px] text-text-secondary">
            Cursor limit: 20 • FSRS v4.5
          </span>
        </div>

        {mode === 'questions' && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle bg-surface-canvas px-6 py-3">
            <div className="flex items-center gap-1.5">
              {(['ALL', 'P1', 'P2', 'P3'] as const).map((paper) => (
                <button
                  key={paper}
                  onClick={() => setPaperFilter(paper)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-[12px] font-medium transition-colors',
                    paperFilter === paper
                      ? 'border-accent-blush bg-accent-blush-glow text-accent-rose-hover'
                      : 'border-border-subtle bg-surface-card text-text-secondary hover:text-text-primary'
                  )}
                >
                  {paper === 'ALL' ? 'All Papers' : `Paper ${paper.slice(1)}`}
                </button>
              ))}
            </div>

            <div className="relative flex-1 min-w-[180px] max-w-[240px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search prompt or markscheme..."
                className="w-full rounded-full border border-border-subtle bg-surface-card pl-8 pr-3 py-1 text-[12px] text-text-primary placeholder:text-text-secondary focus:border-accent-blush/40 focus:outline-none"
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {mode === 'questions' ? (
            loadingQuestions ? (
              <div className="rounded-2xl border border-border-subtle bg-surface-card p-6 text-center text-[13px] text-text-secondary">
                Querying indexed question bank...
              </div>
            ) : (
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
            )
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
