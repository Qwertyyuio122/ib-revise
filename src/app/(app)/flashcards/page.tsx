'use client';

import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
  Suspense,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ScreenState, SubjectSlug } from '@/types/fsm';
import { SproutMascot } from '@/components/mascot/SproutMascot';
import { KaTeXText } from '@/components/math/KaTeXText';
import {
  Plus,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Layers,
  Keyboard,
  X,
  AlertCircle,
} from 'lucide-react';

interface FlashcardDeck {
  id: string;
  subjectSlug: SubjectSlug;
  topicId: string | null;
  title: string;
  description: string;
}

interface FlashcardItem {
  id: string;
  deckId: string;
  frontMarkdown: string;
  backMarkdown: string;
  tags: string[];
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  dueAt: number;
}

interface FlashcardsPayload {
  decks: FlashcardDeck[];
  cards: FlashcardItem[];
}

type ModalStatus = 'closed' | 'open' | 'submitting';
type CardSide = 'front' | 'back';

const SUBJECT_TABS: Array<{
  slug: 'all' | SubjectSlug;
  label: string;
}> = [
  { slug: 'all', label: 'All 6 Subjects' },
  { slug: 'bio', label: 'Biology HL' },
  { slug: 'chem', label: 'Chemistry SL' },
  { slug: 'hist', label: 'History HL' },
  { slug: 'eng', label: 'English Lit HL' },
  { slug: 'fr', label: 'French B SL' },
  { slug: 'math', label: 'Math AA SL' },
];

const VALID_SUBJECTS: SubjectSlug[] = ['bio', 'chem', 'hist', 'eng', 'fr', 'math'];

function parseSubjectFilter(raw: string | null): 'all' | SubjectSlug {
  if (raw && VALID_SUBJECTS.includes(raw as SubjectSlug)) {
    return raw as SubjectSlug;
  }
  return 'all';
}

function FlashcardsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramSubject = parseSubjectFilter(searchParams.get('subject'));

  const [screen, setScreen] = useState<ScreenState<FlashcardsPayload>>({
    status: 'loading',
  });
  const [activeSubject, setActiveSubject] = useState<'all' | SubjectSlug>(
    () => paramSubject
  );
  const [selectedDeckId, setSelectedDeckId] = useState<string>('all');
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [cardSide, setCardSide] = useState<CardSide>('front');
  const [reviewedCount, setReviewedCount] = useState<number>(0);
  const [modalStatus, setModalStatus] = useState<ModalStatus>('closed');
  const [modalError, setModalError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const isRatingRef = useRef(false);
  const controllerRef = useRef<AbortController | null>(null);
  const paramSubjectRef = useRef(paramSubject);
  paramSubjectRef.current = paramSubject;
  const routerRef = useRef(router);
  routerRef.current = router;

  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [newDeckId, setNewDeckId] = useState('deck-bio-membranes-energetics');
  const [newTagInput, setNewTagInput] = useState('Paper 2, Active Recall');

  const loadFlashcards = useCallback(() => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setScreen({ status: 'loading' });
    setActionError(null);
    fetch('/api/flashcards', { signal: controller.signal })
      .then(async (res) => {
        if (res.status === 401) {
          routerRef.current.push('/login');
          return null;
        }
        if (!res.ok) {
          throw new Error('Unable to load SM-2 flashcard decks.');
        }
        return (await res.json()) as FlashcardsPayload;
      })
      .then((data) => {
        if (!data) return;
        setScreen({ status: 'success', data });
        if (data.decks.length > 0) {
          const currentParamSubject = paramSubjectRef.current;
          const matchingDeck =
            currentParamSubject !== 'all'
              ? data.decks.find((d) => d.subjectSlug === currentParamSubject)
              : undefined;
          setNewDeckId((matchingDeck ?? data.decks[0]).id);
        }
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return;
        setScreen({
          status: 'error',
          message: 'Unable to load SM-2 flashcard decks.',
        });
      });
  }, []);

  useEffect(() => {
    loadFlashcards();
    return () => controllerRef.current?.abort();
  }, [loadFlashcards]);

  useEffect(() => {
    setActiveSubject(paramSubject);
    setSelectedDeckId('all');
    setCardIndex(0);
    setCardSide('front');
  }, [paramSubject]);

  useEffect(() => {
    if (screen.status === 'success' && paramSubject !== 'all') {
      const matchingDeck = screen.data.decks.find(
        (d) => d.subjectSlug === paramSubject
      );
      if (matchingDeck) {
        setNewDeckId(matchingDeck.id);
      }
    }
  }, [paramSubject, screen]);

  const filteredDecks = useMemo(() => {
    if (screen.status !== 'success') return [];
    if (activeSubject === 'all') return screen.data.decks;
    return screen.data.decks.filter((d) => d.subjectSlug === activeSubject);
  }, [screen, activeSubject]);

  const filteredCards = useMemo(() => {
    if (screen.status !== 'success') return [];
    const allowedDeckIds = new Set(filteredDecks.map((d) => d.id));
    return screen.data.cards.filter((c) => {
      if (!allowedDeckIds.has(c.deckId)) return false;
      if (selectedDeckId !== 'all' && c.deckId !== selectedDeckId) return false;
      return true;
    });
  }, [screen, filteredDecks, selectedDeckId]);

  const currentCard = filteredCards[cardIndex] ?? filteredCards[0] ?? null;

  const handleFlip = useCallback(() => {
    setCardSide((prev) => (prev === 'front' ? 'back' : 'front'));
  }, []);

  const handleRateCard = useCallback(
    async (rating: 'again' | 'hard' | 'good' | 'easy') => {
      if (!currentCard || screen.status !== 'success' || isRatingRef.current) return;
      isRatingRef.current = true;
      setActionError(null);

      const ratedCardId = currentCard.id;
      setReviewedCount((c) => c + 1);
      setCardSide('front');
      setCardIndex((idx) =>
        filteredCards.length > 1 ? (idx + 1) % filteredCards.length : 0
      );

      try {
        const res = await fetch('/api/flashcards', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cardId: ratedCardId, rating }),
        });
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        if (!res.ok) {
          throw new Error('Could not save SM-2 rating.');
        }
        const updated = await res.json();
        setScreen((prev) => {
          if (prev.status !== 'success') return prev;
          return {
            status: 'success',
            data: {
              ...prev.data,
              cards: prev.data.cards.map((c) =>
                c.id === ratedCardId
                  ? {
                      ...c,
                      easeFactor: updated.easeFactor ?? c.easeFactor,
                      intervalDays: updated.intervalDays ?? c.intervalDays,
                      repetitions: updated.repetitions ?? c.repetitions,
                      dueAt: updated.dueAt ?? c.dueAt,
                    }
                  : c
              ),
            },
          };
        });
      } catch {
        setActionError('Could not save SM-2 interval update. Please retry.');
      } finally {
        isRatingRef.current = false;
      }
    },
    [currentCard, filteredCards.length, router, screen.status]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (modalStatus !== 'closed') {
        if (e.key === 'Escape' && modalStatus === 'open') {
          e.preventDefault();
          setModalStatus('closed');
          setModalError(null);
        }
        return;
      }
      if (
        e.defaultPrevented ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        e.target instanceof HTMLButtonElement ||
        (e.target instanceof HTMLElement &&
          e.target.getAttribute('role') === 'button')
      ) {
        return;
      }
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        handleFlip();
      } else if (e.key === '1') {
        handleRateCard('again');
      } else if (e.key === '2') {
        handleRateCard('hard');
      } else if (e.key === '3') {
        handleRateCard('good');
      } else if (e.key === '4') {
        handleRateCard('easy');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleFlip, handleRateCard, modalStatus]);

  async function handleCreateFlashcard(e: React.FormEvent) {
    e.preventDefault();
    if (!newFront.trim() || !newBack.trim() || screen.status !== 'success') return;

    setModalStatus('submitting');
    setModalError(null);
    const tags = newTagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deckId: newDeckId,
          frontMarkdown: newFront,
          backMarkdown: newBack,
          tags,
        }),
      });
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.card) {
        setModalError(
          json.error || 'Could not create flashcard. Please check your input.'
        );
        setModalStatus('open');
        return;
      }
      const createdDeck = screen.data.decks.find((d) => d.id === newDeckId);
      setScreen((prev) => {
        if (prev.status !== 'success') return prev;
        return {
          status: 'success',
          data: {
            ...prev.data,
            cards: [json.card, ...prev.data.cards],
          },
        };
      });
      if (createdDeck && activeSubject !== 'all' && createdDeck.subjectSlug !== activeSubject) {
        setActiveSubject(createdDeck.subjectSlug);
      }
      if (selectedDeckId !== 'all' && selectedDeckId !== newDeckId) {
        setSelectedDeckId(newDeckId);
      }
      setNewFront('');
      setNewBack('');
      setCardIndex(0);
      setCardSide('front');
      setModalError(null);
      setModalStatus('closed');
    } catch {
      setModalError('Network error while saving flashcard. Please retry.');
      setModalStatus('open');
    }
  }

  const currentDeck = useMemo(() => {
    if (screen.status !== 'success' || !currentCard) return null;
    return screen.data.decks.find((d) => d.id === currentCard.deckId) ?? null;
  }, [screen, currentCard]);

  return (
    <div className="main-pad !pt-[26px]">
      <div className="col-center">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#E4E4E7] pb-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#A7F3D0] bg-[#ECFDF5]">
              <SproutMascot pose="guide" size={38} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1
                  className="h-title !text-[24px]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  SM-2 Spaced Repetition Flashcards
                </h1>
                <span className="rounded-full border border-[#A7F3D0] bg-[#ECFDF5] px-2.5 py-0.5 text-xs font-semibold text-[#065F46]">
                  KaTeX Ready
                </span>
              </div>
              <p className="text-[13px] text-[#71717A] mt-0.5">
                Active recall across all 6 IB subjects with SuperMemo-2 interval scheduling.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 rounded-full border border-[#E4E4E7] bg-white px-3 py-1.5 text-xs font-medium text-[#3F3F46]">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#059669]" />
              <span>Reviewed today: {reviewedCount}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setModalError(null);
                setModalStatus('open');
              }}
              className="pill-btn-dark"
            >
              <Plus className="h-4 w-4" />
              <span>Add Flashcard</span>
            </button>
          </div>
        </div>

        {/* Subject Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter flashcards by subject"
          className="mt-5 flex flex-wrap items-center gap-2"
        >
          {SUBJECT_TABS.map((tab) => {
            const isSelected = activeSubject === tab.slug;
            return (
              <button
                key={tab.slug}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  setActiveSubject(tab.slug);
                  setSelectedDeckId('all');
                  setCardIndex(0);
                  setCardSide('front');
                  if (screen.status === 'success' && tab.slug !== 'all') {
                    const match = screen.data.decks.find(
                      (d) => d.subjectSlug === tab.slug
                    );
                    if (match) setNewDeckId(match.id);
                  }
                }}
                className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] ${
                  isSelected
                    ? 'border-[#18181B] bg-[#18181B] text-white'
                    : 'border-[#E4E4E7] bg-white text-[#3F3F46] hover:bg-[#F4F4F5]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {actionError && (
          <div
            role="alert"
            className="mt-4 flex items-center justify-between gap-3 rounded-[12px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[12.5px] font-medium text-[#B91C1C]"
          >
            <span>{actionError}</span>
            <button
              type="button"
              onClick={() => setActionError(null)}
              className="pill-btn !text-[11px] !py-1 !px-2.5"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Deck Selector Bar */}
        {screen.status === 'success' && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-[#E4E4E7] bg-white p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#71717A]">
                <Layers className="h-3.5 w-3.5" />
                Deck:
              </span>
              <button
                type="button"
                aria-pressed={selectedDeckId === 'all'}
                onClick={() => {
                  setSelectedDeckId('all');
                  setCardIndex(0);
                  setCardSide('front');
                }}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] ${
                  selectedDeckId === 'all'
                    ? 'bg-[#18181B] text-white'
                    : 'bg-[#F4F4F5] text-[#3F3F46] hover:bg-[#E4E4E7]'
                }`}
              >
                All Matching Decks ({filteredCards.length})
              </button>
              {filteredDecks.map((deck) => (
                <button
                  key={deck.id}
                  type="button"
                  aria-pressed={selectedDeckId === deck.id}
                  onClick={() => {
                    setSelectedDeckId(deck.id);
                    setCardIndex(0);
                    setCardSide('front');
                  }}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] ${
                    selectedDeckId === deck.id
                      ? 'bg-[#18181B] text-white'
                      : 'bg-[#F4F4F5] text-[#3F3F46] hover:bg-[#E4E4E7]'
                  }`}
                >
                  {deck.title}
                </button>
              ))}
            </div>

            <div className="hidden items-center gap-2 text-xs text-[#71717A] md:flex">
              <Keyboard className="h-3.5 w-3.5" />
              <span>
                <kbd className="rounded border border-[#E4E4E7] bg-[#FAFAFA] px-1.5 py-0.5 font-mono text-[11px]">
                  Space
                </kbd>{' '}
                Flip ·{' '}
                <kbd className="rounded border border-[#E4E4E7] bg-[#FAFAFA] px-1.5 py-0.5 font-mono text-[11px]">
                  1–4
                </kbd>{' '}
                Rate
              </span>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        {screen.status === 'loading' && (
          <div className="mt-6 space-y-4">
            <div className="h-72 w-full animate-pulse rounded-[14px] border border-[#E4E4E7] bg-white p-8">
              <div className="h-4 w-32 rounded bg-[#E4E4E7]" />
              <div className="mt-10 h-6 w-3/4 rounded bg-[#E4E4E7]" />
              <div className="mt-3 h-6 w-1/2 rounded bg-[#F4F4F5]" />
            </div>
          </div>
        )}

        {screen.status === 'error' && (
          <div
            role="alert"
            className="mt-6 flex items-center justify-between flex-wrap gap-3 rounded-[14px] border border-[#FECACA] bg-[#FEF2F2] p-5 text-[13px] text-[#B91C1C]"
          >
            <div className="flex items-center gap-2 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0 text-[#DC2626]" />
              <span>{screen.message}</span>
            </div>
            <button
              type="button"
              onClick={loadFlashcards}
              className="pill-btn"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {screen.status === 'success' && !currentCard && (
          <div className="mt-6 hairline-card flex flex-col items-center justify-center p-12 text-center">
            <SproutMascot pose="guide" size={56} />
            <h2
              className="mt-3 text-base font-semibold text-[#18181B]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              No flashcards in this filter yet
            </h2>
            <p className="mt-1 max-w-md text-[12.5px] text-[#71717A]">
              Add your own custom IB flashcard with LaTeX formulas or switch subject tabs.
            </p>
            <button
              type="button"
              onClick={() => {
                setModalError(null);
                setModalStatus('open');
              }}
              className="pill-btn-dark mt-4"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Flashcard</span>
            </button>
          </div>
        )}

        {screen.status === 'success' && currentCard && (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Interactive Flip Card */}
            <div className="lg:col-span-2">
              <div
                role="button"
                tabIndex={0}
                aria-label={
                  cardSide === 'front'
                    ? 'Flashcard front prompt. Click or press Space to reveal answer.'
                    : 'Flashcard back answer. Click or press Space to show prompt.'
                }
                onClick={handleFlip}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
                    e.preventDefault();
                    e.stopPropagation();
                    handleFlip();
                  }
                }}
                className="group relative flex min-h-[340px] cursor-pointer flex-col justify-between rounded-[14px] border border-[#E4E4E7] bg-white p-6 transition-colors duration-150 hover:border-[#D4D4D8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] sm:p-8"
              >
                {/* Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F4F4F5] pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-md px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${
                        cardSide === 'front'
                          ? 'bg-[#18181B] text-white'
                          : 'bg-[#059669] text-white'
                      }`}
                    >
                      {cardSide === 'front' ? 'Prompt (Front)' : 'Markscheme Answer (Back)'}
                    </span>
                    {currentDeck && (
                      <span className="text-xs font-medium text-[#71717A]">
                        {currentDeck.title}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#71717A]">
                    Card {cardIndex + 1} of {filteredCards.length}
                  </span>
                </div>

                {/* Card Body with KaTeX */}
                <div className="my-auto py-8">
                  {cardSide === 'front' ? (
                    <KaTeXText
                      text={currentCard.frontMarkdown}
                      className="text-lg font-semibold leading-relaxed text-[#18181B] sm:text-xl"
                    />
                  ) : (
                    <div className="space-y-3">
                      <div className="text-xs font-semibold uppercase tracking-wider text-[#71717A]">
                        Official IB Markscheme Key Points
                      </div>
                      <KaTeXText
                        text={currentCard.backMarkdown}
                        className="text-base leading-relaxed text-[#27272A]"
                      />
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#F4F4F5] pt-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {currentCard.tags.map((tag) => (
                      <span key={tag} className="mini-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#18181B]">
                    <RotateCcw className="h-3.5 w-3.5" />
                    Click or press Space to flip
                  </span>
                </div>
              </div>

              {/* SM-2 Rating Bar */}
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <button
                  type="button"
                  onClick={() => handleRateCard('again')}
                  className="flex flex-col items-center justify-center rounded-xl border border-rose-200 bg-rose-50/70 px-4 py-3 text-center transition-colors duration-150 hover:bg-rose-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
                >
                  <span className="text-xs font-bold text-rose-900">Again · 1m</span>
                  <span className="mt-0.5 text-[11px] text-rose-700">Reset interval (Key 1)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRateCard('hard')}
                  className="flex flex-col items-center justify-center rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-center transition-colors duration-150 hover:bg-amber-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
                >
                  <span className="text-xs font-bold text-amber-900">Hard · 1d</span>
                  <span className="mt-0.5 text-[11px] text-amber-700">Review tomorrow (Key 2)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRateCard('good')}
                  className="flex flex-col items-center justify-center rounded-xl border border-sky-200 bg-sky-50/70 px-4 py-3 text-center transition-colors duration-150 hover:bg-sky-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
                >
                  <span className="text-xs font-bold text-sky-900">Good · 4d</span>
                  <span className="mt-0.5 text-[11px] text-sky-700">Standard SM-2 (Key 3)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRateCard('easy')}
                  className="flex flex-col items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-center transition-colors duration-150 hover:bg-emerald-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
                >
                  <span className="text-xs font-bold text-emerald-900">Easy · 7d</span>
                  <span className="mt-0.5 text-[11px] text-emerald-700">High confidence (Key 4)</span>
                </button>
              </div>
            </div>

            {/* Right Column: SM-2 Telemetry & Queue */}
            <div className="space-y-4">
              <div className="hairline-card">
                <div className="flex items-center justify-between">
                  <h2
                    className="text-sm font-semibold text-[#18181B]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Card SM-2 Telemetry
                  </h2>
                  <Sparkles className="h-4 w-4 text-[#D97706]" />
                </div>
                <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg border border-[#E4E4E7] bg-[#FAFAFA] p-2.5">
                    <dt className="text-[11px] font-medium text-[#71717A]">Ease Factor</dt>
                    <dd className="mt-1 font-mono text-sm font-bold text-[#18181B]">
                      {currentCard.easeFactor.toFixed(2)}
                    </dd>
                  </div>
                  <div className="rounded-lg border border-[#E4E4E7] bg-[#FAFAFA] p-2.5">
                    <dt className="text-[11px] font-medium text-[#71717A]">Interval</dt>
                    <dd className="mt-1 font-mono text-sm font-bold text-[#18181B]">
                      {currentCard.intervalDays}d
                    </dd>
                  </div>
                  <div className="rounded-lg border border-[#E4E4E7] bg-[#FAFAFA] p-2.5">
                    <dt className="text-[11px] font-medium text-[#71717A]">Repetitions</dt>
                    <dd className="mt-1 font-mono text-sm font-bold text-[#18181B]">
                      {currentCard.repetitions}
                    </dd>
                  </div>
                </dl>

                <div className="mt-5 border-t border-[#F4F4F5] pt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
                    Deck Queue ({filteredCards.length} cards)
                  </h3>
                  <div className="mt-2.5 max-h-60 space-y-1.5 overflow-y-auto pr-1">
                    {filteredCards.map((c, idx) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setCardIndex(idx);
                          setCardSide('front');
                        }}
                        className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] ${
                          idx === cardIndex
                            ? 'border-[#18181B] bg-[#18181B] text-white'
                            : 'border-[#E4E4E7] bg-[#FAFAFA] text-[#3F3F46] hover:bg-[#F4F4F5]'
                        }`}
                      >
                        <KaTeXText
                          text={c.frontMarkdown}
                          as="span"
                          className="line-clamp-1 font-medium min-w-0"
                        />
                        <span className="ml-2 shrink-0 font-mono text-[11px] opacity-75">
                          {c.intervalDays}d
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* + Add Flashcard Modal */}
        {modalStatus !== 'closed' && screen.status === 'success' && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
            onClick={() => {
              if (modalStatus === 'open') {
                setModalStatus('closed');
                setModalError(null);
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="create-flashcard-title"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-[16px] border border-[#E4E4E7] bg-white p-6"
            >
              <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-3">
                <h2
                  id="create-flashcard-title"
                  className="text-base font-semibold text-[#18181B]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Create Custom IB Flashcard
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    if (modalStatus === 'open') {
                      setModalStatus('closed');
                      setModalError(null);
                    }
                  }}
                  aria-label="Close modal"
                  className="rounded-lg p-1 text-[#71717A] transition-colors duration-150 hover:bg-[#F4F4F5] hover:text-[#18181B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateFlashcard} className="mt-4 space-y-4">
                {modalError && (
                  <div
                    role="alert"
                    className="flex items-center gap-2 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-xs font-medium text-[#B91C1C]"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0 text-[#DC2626]" />
                    <span>{modalError}</span>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="flashcard-deck-select"
                    className="block text-xs font-semibold text-[#3F3F46]"
                  >
                    Target Deck
                  </label>
                  <select
                    id="flashcard-deck-select"
                    value={newDeckId}
                    onChange={(e) => setNewDeckId(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#E4E4E7] bg-white px-3 py-2 text-xs text-[#18181B] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
                  >
                    {screen.data.decks.map((d) => (
                      <option key={d.id} value={d.id}>
                        [{d.subjectSlug.toUpperCase()}] {d.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="flashcard-front-input"
                    className="block text-xs font-semibold text-[#3F3F46]"
                  >
                    Front Prompt (Supports KaTeX $...$)
                  </label>
                  <textarea
                    id="flashcard-front-input"
                    rows={2}
                    required
                    value={newFront}
                    onChange={(e) => setNewFront(e.target.value)}
                    placeholder="e.g., State Hess’s Law and the enthalpy change formula using average bond enthalpies."
                    className="mt-1 w-full rounded-lg border border-[#E4E4E7] px-3 py-2 text-xs text-[#18181B] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="flashcard-back-input"
                    className="block text-xs font-semibold text-[#3F3F46]"
                  >
                    Back Markscheme Answer (Supports KaTeX $$...$$)
                  </label>
                  <textarea
                    id="flashcard-back-input"
                    rows={3}
                    required
                    value={newBack}
                    onChange={(e) => setNewBack(e.target.value)}
                    placeholder="e.g., $$\Delta H^\ominus = \sum E(\text{bonds broken}) - \sum E(\text{bonds formed})$$"
                    className="mt-1 w-full rounded-lg border border-[#E4E4E7] px-3 py-2 text-xs text-[#18181B] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="flashcard-tags-input"
                    className="block text-xs font-semibold text-[#3F3F46]"
                  >
                    Tags (comma-separated)
                  </label>
                  <input
                    id="flashcard-tags-input"
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#E4E4E7] px-3 py-2 text-xs text-[#18181B] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setModalStatus('closed');
                      setModalError(null);
                    }}
                    disabled={modalStatus === 'submitting'}
                    className="pill-btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={modalStatus === 'submitting'}
                    className="pill-btn-dark disabled:opacity-50"
                  >
                    {modalStatus === 'submitting' ? 'Saving...' : 'Save Flashcard'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FlashcardsSkeleton() {
  return (
    <div className="main-pad !pt-[26px]">
      <div className="col-center space-y-5">
        <div className="h-8 w-72 animate-pulse rounded-lg bg-[#E4E4E7]" />
        <div className="h-72 animate-pulse rounded-[14px] border border-[#E4E4E7] bg-white" />
      </div>
    </div>
  );
}

export default function FlashcardsPage() {
  return (
    <Suspense fallback={<FlashcardsSkeleton />}>
      <FlashcardsContent />
    </Suspense>
  );
}
