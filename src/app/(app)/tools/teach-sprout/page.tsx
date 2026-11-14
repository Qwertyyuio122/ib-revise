'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import type { ScreenState, SubjectSlug } from '@/types/fsm';
import { SproutMascot } from '@/components/mascot/SproutMascot';
import { KaTeXText } from '@/components/math/KaTeXText';
import {
  Send,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Globe,
  RotateCcw,
} from 'lucide-react';

interface FeynmanTopic {
  slug: SubjectSlug;
  subjectLabel: string;
  topicTitle: string;
  babyPrompt: string;
  sampleExplanation: string;
}

const FeynmanFeedbackSchema = z.object({
  sproutQuestion: z.string(),
  clarityScore: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  gapsToClarify: z.array(z.string()),
  mode: z.string(),
  modelUsed: z.string().optional(),
});

type FeynmanFeedback = z.infer<typeof FeynmanFeedbackSchema>;

const FEYNMAN_TOPICS: FeynmanTopic[] = [
  {
    slug: 'bio',
    subjectLabel: 'Biology HL',
    topicTitle: 'Chemiosmosis & ATP Synthase in Cellular Respiration',
    babyPrompt:
      'Hi! I am Baby Sprout. Everyone keeps saying "chemiosmosis makes ATP", but how does pumping tiny protons ($\\text{H}^+$) across a membrane actually spin a molecular turbine?',
    sampleExplanation:
      'Think of the inner mitochondrial membrane like a hydroelectric dam! The electron transport chain uses energy from electrons to pump H+ protons into a narrow reservoir (the intermembrane space). Because protons are crowded and positively charged, they rush back down through ATP synthase like water turning a turbine, physically rotating it to press ADP and Pi together into ATP.',
  },
  {
    slug: 'chem',
    subjectLabel: 'Chemistry SL',
    topicTitle: 'Dynamic Equilibrium & Le Chatelier’s Principle ($K_c$)',
    babyPrompt:
      'Wait—if a chemical reaction reaches "equilibrium", does that mean all the molecules freeze and stop reacting? Explain it to me simply!',
    sampleExplanation:
      'Not at all! Imagine a busy bridge between two islands where 50 cars cross east every minute and 50 cars cross west every minute. The total number of cars on each island stays constant, even though cars are still moving both ways at equal rates. That is why macroscopic concentrations stay constant while forward and reverse reactions continue at the same rate.',
  },
  {
    slug: 'hist',
    subjectLabel: 'History HL',
    topicTitle: 'Appeasement & Systemic Failure of Collective Security (1930s)',
    babyPrompt:
      'Why did Britain and France let the League of Nations fail in the 1930s instead of stopping aggression right away?',
    sampleExplanation:
      'Imagine a neighborhood watch where the two biggest guards are exhausted, broke from the Great Depression, and afraid of starting a huge fire. Without the USA in the League of Nations, Britain and France prioritized domestic economic recovery and feared both war and the USSR, so they traded concessions for time until Munich in 1938.',
  },
  {
    slug: 'eng',
    subjectLabel: 'English Lit HL',
    topicTitle: 'Unreliable Narration & Free Indirect Discourse',
    babyPrompt:
      'How can a reader tell that a narrator is unreliable if the narrator never openly admits they are lying?',
    sampleExplanation:
      'Because the author plants subtle contradictions between what the narrator claims and how other characters react! Like someone insisting "I am totally calm" while describing their own white knuckles and racing heartbeat—the gap between their self-image and the concrete details lets the reader see the truth behind the mask.',
  },
  {
    slug: 'fr',
    subjectLabel: 'French B SL (En Français)',
    topicTitle: 'L’usage du Subjonctif Présent (Doute, Volonté et Concession)',
    babyPrompt:
      'Coucou ! Je suis Bébé Sprout. Pourquoi utilise-t-on le subjonctif après « bien que » ou « il faut que » au lieu de l’indicatif normal ? Explique-moi en français !',
    sampleExplanation:
      'En français, l’indicatif sert à décrire la réalité objective (ce qui est certain), tandis que le subjonctif exprime une attitude subjective du locuteur : un souhait, une nécessité (« il est primordial que nous protégions la planète ») ou une concession (« bien que cette mesure soit difficile »). C’est comme changer la couleur de la phrase pour montrer l’émotion ou le doute !',
  },
  {
    slug: 'math',
    subjectLabel: 'Math AA SL',
    topicTitle: 'The Fundamental Theorem of Calculus (Derivative vs Area)',
    babyPrompt:
      'Why is finding the area under a velocity curve ($\\int v(t)\\,dt$) the exact opposite of finding the slope of a displacement curve ($s\'(t)$)?',
    sampleExplanation:
      'Because accumulating tiny steps of change brings you back to the total change! If you slice a trip into tiny 1-second intervals, distance in each slice is speed times time (the area of a thin rectangle). Adding up all those rectangles gives total displacement, whereas dividing tiny distance by tiny time gives instantaneous slope (velocity).',
  },
];

const VALID_SUBJECTS: SubjectSlug[] = ['bio', 'chem', 'hist', 'eng', 'fr', 'math'];

function parseSubjectSlug(raw: string | null): SubjectSlug {
  if (raw && VALID_SUBJECTS.includes(raw as SubjectSlug)) {
    return raw as SubjectSlug;
  }
  return 'bio';
}

function TeachSproutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramSubject = searchParams.get('subject');

  const [selectedSlug, setSelectedSlug] = useState<SubjectSlug>(() =>
    parseSubjectSlug(paramSubject)
  );
  const [explanation, setExplanation] = useState<string>('');
  const [turnNumber, setTurnNumber] = useState<number>(1);
  const [feedbackScreen, setFeedbackScreen] = useState<
    ScreenState<FeynmanFeedback>
  >({ status: 'idle' });
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (paramSubject && VALID_SUBJECTS.includes(paramSubject as SubjectSlug)) {
      setSelectedSlug(paramSubject as SubjectSlug);
    }
  }, [paramSubject]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const activeTopic =
    FEYNMAN_TOPICS.find((t) => t.slug === selectedSlug) ?? FEYNMAN_TOPICS[0];
  const isFrench = selectedSlug === 'fr';

  async function submitFeynmanExplanation(overrideText?: string) {
    const trimmed = (overrideText ?? explanation).trim();
    if (!trimmed) {
      setFeedbackScreen({
        status: 'empty',
        message:
          'Explain the concept in plain intuition first, or load a model analogy to see how Baby Sprout responds.',
      });
      return;
    }

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setFeedbackScreen({ status: 'loading' });
    try {
      const res = await fetch('/api/ai/teach-sprout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          subjectSlug: activeTopic.slug,
          topicTitle: activeTopic.topicTitle,
          studentExplanation: trimmed,
          turnNumber,
          language: isFrench ? 'fr' : 'en',
        }),
      });
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      if (!res.ok) throw new Error('Request failed');
      const parsed = FeynmanFeedbackSchema.safeParse(await res.json());
      if (!parsed.success) {
        throw new Error('Invalid response');
      }
      setFeedbackScreen({ status: 'success', data: parsed.data });
      setTurnNumber((n) => n + 1);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setFeedbackScreen({
        status: 'error',
        message: 'Baby Sprout could not process your explanation. Try again!',
      });
    }
  }

  function handleTeachSprout(e: React.FormEvent) {
    e.preventDefault();
    void submitFeynmanExplanation();
  }

  return (
    <div className="main-pad !pt-[26px]">
      <style>{`
        @keyframes tsBubbleEnter {
          from {
            opacity: 0;
            transform: translateY(5px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes tsCardEnter {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes tsShimmerSweep {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(100%);
          }
        }
        .ts-bubble-enter {
          animation: tsBubbleEnter 210ms cubic-bezier(0.23, 1, 0.32, 1) both;
        }
        .ts-stagger-card {
          animation: tsCardEnter 200ms cubic-bezier(0.23, 1, 0.32, 1) both;
          animation-delay: calc(var(--ts-i, 0) * 40ms);
        }
        .ts-progress-fill {
          transform-origin: left center;
          transition: transform 280ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        @starting-style {
          .ts-progress-fill {
            transform: scaleX(0.04);
          }
        }
        .ts-pill-btn {
          transition:
            background-color 150ms ease,
            border-color 150ms ease,
            color 150ms ease,
            transform 150ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .ts-pill-btn:active:not(:disabled) {
          transform: scale(0.975);
        }
        .ts-shimmer {
          position: relative;
          overflow: hidden;
          background: #F4F4F5;
        }
        .ts-shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.72) 50%, transparent 100%);
          animation: tsShimmerSweep 1.35s cubic-bezier(0.77, 0, 0.175, 1) infinite;
        }
        @media (hover: hover) and (pointer: fine) {
          .ts-pill-btn:hover:not(:disabled) {
            transform: translateY(-1px);
          }
          .ts-pill-btn:active:not(:disabled) {
            transform: scale(0.975);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ts-bubble-enter,
          .ts-stagger-card {
            animation: tsFadeOnly 160ms ease both;
            animation-delay: 0ms;
          }
          .ts-progress-fill {
            transition: none;
          }
          .ts-pill-btn {
            transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease;
          }
          .ts-pill-btn:hover:not(:disabled),
          .ts-pill-btn:active:not(:disabled) {
            transform: none;
          }
          .ts-shimmer::after {
            animation: none;
            opacity: 0;
          }
        }
        @keyframes tsFadeOnly {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <div className="col-center-wide">
        {/* Botanical Study Stage Header */}
        <div className="relative overflow-hidden rounded-[14px] border border-[#E4E4E7] bg-[#FAFAFA] p-5 sm:p-6">
          {/* Subtle Ambient Botanical Linework Motif */}
          <svg
            viewBox="0 0 220 120"
            fill="none"
            aria-hidden="true"
            className="pointer-events-none absolute -right-4 -top-2 h-28 w-52 opacity-[0.16]"
          >
            <path
              d="M20 112 C62 88, 108 58, 186 24"
              stroke="#059669"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M112 62 C110 34, 134 18, 158 26 C148 48, 130 62, 112 62 Z"
              stroke="#059669"
              strokeWidth="1.4"
            />
            <path
              d="M148 42 C158 18, 184 12, 204 20 C190 40, 170 48, 148 42 Z"
              stroke="#10B981"
              strokeWidth="1.3"
            />
            <circle cx="82" cy="79" r="3" stroke="#059669" strokeWidth="1.3" />
          </svg>

          <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start sm:items-center gap-4 min-w-0">
              <div className="relative flex h-16 w-16 sm:h-[72px] sm:w-[72px] shrink-0 items-center justify-center rounded-[14px] border border-[#A7F3D0] bg-white">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-1 rounded-[10px] bg-[radial-gradient(circle_at_50%_55%,rgba(167,243,208,0.48),transparent_72%)]"
                />
                <SproutMascot pose="baby" size={52} className="relative" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="mini-tag bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] font-mono">
                    FEYNMAN STUDIO · TURN #{turnNumber}
                  </span>
                  <span className="rounded-full border border-[#E4E4E7] bg-white px-2.5 py-0.5 text-[11.5px] font-semibold text-[#3F3F46]">
                    {isFrench ? 'Mode Français B SL' : 'Intuition vs Jargon'}
                  </span>
                </div>
                <h1
                  className="h-title !text-[23px] sm:!text-[25px]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Teach Baby Sprout <span className="h-sub !text-[21px] sm:!text-[22px]">/ Active Explanation</span>
                </h1>
                <p className="text-[13px] text-[#71717A] mt-1 max-w-xl">
                  If you can explain a complex IB concept to Baby Sprout in plain intuition without hiding behind memorized jargon, you truly own it.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                abortControllerRef.current?.abort();
                setExplanation('');
                setTurnNumber(1);
                setFeedbackScreen({ status: 'idle' });
              }}
              className="pill-btn ts-pill-btn self-start sm:self-center shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Reset Session</span>
            </button>
          </div>
        </div>

        {/* Subject Selector */}
        <div
          role="tablist"
          aria-label="Feynman study subjects"
          className="mt-5 flex flex-wrap items-center gap-2"
        >
          {FEYNMAN_TOPICS.map((item) => {
            const isSelected = item.slug === selectedSlug;
            return (
              <button
                key={item.slug}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  abortControllerRef.current?.abort();
                  setSelectedSlug(item.slug);
                  setExplanation('');
                  setTurnNumber(1);
                  setFeedbackScreen({ status: 'idle' });
                }}
                className={`ts-pill-btn inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] ${
                  isSelected
                    ? 'border-[#18181B] bg-[#18181B] text-white'
                    : 'border-[#E4E4E7] bg-white text-[#3F3F46] hover:bg-[#F4F4F5]'
                }`}
              >
                {item.slug === 'fr' && <Globe className="h-3.5 w-3.5" aria-hidden="true" />}
                <span>{item.subjectLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Main Split Studio */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* Left Column: Baby Sprout Prompt + Student Explanation */}
          <div className="space-y-4 lg:col-span-7 min-w-0">
            <div
              key={`${activeTopic.slug}-${feedbackScreen.status === 'success' ? feedbackScreen.data.sproutQuestion : 'base'}`}
              className="ts-bubble-enter rounded-[14px] border border-[#A7F3D0] border-l-[3.5px] border-l-[#059669] bg-[#ECFDF5]/55 p-5"
            >
              <div className="flex items-start gap-3.5">
                <div className="shrink-0 rounded-[12px] border border-[#A7F3D0] bg-white p-2">
                  <SproutMascot pose="baby" size={44} />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#065F46]">
                      {isFrench ? 'Question de Bébé Sprout' : 'Baby Sprout Asks'}
                    </span>
                    <span className="text-[11px] font-mono text-[#059669]">
                      · {activeTopic.topicTitle}
                    </span>
                  </div>
                  <KaTeXText
                    text={
                      feedbackScreen.status === 'success'
                        ? feedbackScreen.data.sproutQuestion
                        : activeTopic.babyPrompt
                    }
                    className="mt-1.5 text-[14px] font-medium leading-relaxed text-[#18181B]"
                  />
                </div>
              </div>
            </div>

            <form onSubmit={handleTeachSprout} className="hairline-card space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor="teach-sprout-textarea"
                  className="text-[11.5px] font-mono font-bold uppercase tracking-wider text-[#71717A]"
                >
                  {isFrench
                    ? 'Votre explication simple (en français)'
                    : 'Your Plain-Language Explanation'}
                </label>
                <div className="flex items-center gap-2 shrink-0">
                  {explanation.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        abortControllerRef.current?.abort();
                        setExplanation('');
                        setFeedbackScreen({
                          status: 'empty',
                          message:
                            'Explanation cleared. Explain the concept in plain intuition or load a model analogy.',
                        });
                      }}
                      className="pill-btn ts-pill-btn"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setExplanation(activeTopic.sampleExplanation)}
                    className="pill-btn ts-pill-btn"
                  >
                    {isFrench ? 'Insérer un exemple' : 'Load Model Analogy'}
                  </button>
                </div>
              </div>

              <textarea
                id="teach-sprout-textarea"
                rows={7}
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder={
                  isFrench
                    ? 'Expliquez le concept avec une analogie simple du quotidien...'
                    : 'Use a real-world analogy and explain the "why" step-by-step...'
                }
                className="w-full rounded-[11px] border border-[#E4E4E7] bg-[#FAFAFA] p-4 text-[13.5px] leading-relaxed text-[#18181B] placeholder:text-[#71717A] transition-[background-color,border-color] duration-150 focus:border-[#18181B] focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
              />

              <div className="pt-1 flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-[11.5px] text-[#71717A]">
                  Turn #{turnNumber} · Aim for clear cause-and-effect + 1 concrete analogy
                </span>
                <button
                  type="submit"
                  disabled={
                    feedbackScreen.status === 'loading' || !explanation.trim()
                  }
                  className="pill-btn-dark ts-pill-btn !py-2.5 !px-5 disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>
                    {feedbackScreen.status === 'loading'
                      ? 'Baby Sprout is thinking...'
                      : isFrench
                      ? 'Expliquer à Sprout'
                      : 'Teach Baby Sprout'}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Clarity Score & Jargon Detector */}
          <div className="hairline-card lg:col-span-5 min-w-0">
            {feedbackScreen.status === 'idle' && (
              <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#A7F3D0] bg-[#ECFDF5]">
                  <SproutMascot pose="baby" size={56} />
                </div>
                <h2
                  className="mt-4 text-[16px] font-semibold text-[#18181B]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Feynman Clarity Meter Ready
                </h2>
                <p className="mt-1.5 max-w-xs text-[12.5px] text-[#71717A] leading-relaxed">
                  Explain the concept on the left (or click{' '}
                  <strong className="text-[#18181B]">
                    {isFrench ? 'Insérer un exemple' : 'Load Model Analogy'}
                  </strong>
                  ) to get your 0–100% Clarity Score and follow-up question.
                </p>
              </div>
            )}

            {feedbackScreen.status === 'loading' && (
              <div
                className="space-y-4 py-2"
                aria-busy="true"
                aria-label="Evaluating explanation clarity"
              >
                <div className="flex items-center justify-between gap-3 border-b border-[#F4F4F5] pb-4">
                  <div className="space-y-2 flex-1">
                    <div className="ts-shimmer h-3 w-28 rounded" />
                    <div className="ts-shimmer h-5 w-44 rounded-md" />
                    <div className="ts-shimmer h-4 w-32 rounded-full" />
                  </div>
                  <div className="ts-shimmer h-10 w-16 rounded-xl shrink-0" />
                </div>
                <div className="space-y-1.5">
                  <div className="ts-shimmer h-2.5 w-full rounded-full" />
                  <div className="flex justify-between">
                    <div className="ts-shimmer h-2.5 w-12 rounded" />
                    <div className="ts-shimmer h-2.5 w-16 rounded" />
                  </div>
                </div>
                <div className="rounded-[12px] border border-[#E4E4E7] bg-[#FAFAFA] p-3.5 space-y-2">
                  <div className="ts-shimmer h-3.5 w-36 rounded" />
                  <div className="ts-shimmer h-11 w-full rounded-[9px]" />
                  <div className="ts-shimmer h-11 w-full rounded-[9px]" />
                </div>
                <div className="rounded-[12px] border border-[#E4E4E7] bg-[#FAFAFA] p-3.5 space-y-2">
                  <div className="ts-shimmer h-3.5 w-44 rounded" />
                  <div className="ts-shimmer h-11 w-full rounded-[9px]" />
                </div>
              </div>
            )}

            {feedbackScreen.status === 'empty' && (
              <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#A7F3D0] bg-[#ECFDF5]">
                  <SproutMascot pose="baby" size={46} />
                </div>
                <p className="mt-3 max-w-xs text-[12.5px] text-[#71717A] leading-relaxed">
                  {feedbackScreen.message}
                </p>
                <button
                  type="button"
                  onClick={() => setExplanation(activeTopic.sampleExplanation)}
                  className="pill-btn-dark ts-pill-btn mt-4"
                >
                  {isFrench ? 'Insérer un exemple' : 'Load Model Analogy'}
                </button>
              </div>
            )}

            {feedbackScreen.status === 'error' && (
              <div
                role="alert"
                className="ts-bubble-enter rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4 text-xs text-[#B91C1C] space-y-3"
              >
                <p>{feedbackScreen.message}</p>
                <button
                  type="button"
                  onClick={() => void submitFeynmanExplanation()}
                  className="pill-btn-dark ts-pill-btn"
                >
                  Retry Explanation
                </button>
              </div>
            )}

            {feedbackScreen.status === 'success' && (
              <div key={`score-${turnNumber}`} className="space-y-4">
                <div className="ts-stagger-card flex items-center justify-between gap-3 border-b border-[#F4F4F5] pb-4" style={{ '--ts-i': 0 } as React.CSSProperties}>
                  <div className="min-w-0">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#71717A]">
                      Feynman Clarity Score
                    </span>
                    <h2
                      className="text-[17px] font-semibold text-[#18181B]"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      Intuition vs Jargon Analysis
                    </h2>
                    <span className="mt-1 inline-block rounded-full border border-[#E4E4E7] bg-[#FAFAFA] px-2.5 py-0.5 text-[11px] font-mono font-medium text-[#71717A]">
                      {feedbackScreen.data.mode === 'gemini'
                        ? `Live Gemini (${feedbackScreen.data.modelUsed || 'AI'})`
                        : 'Built-In Feynman Engine'}
                    </span>
                  </div>
                  <div
                    className={`rounded-xl border px-3.5 py-1.5 font-mono text-lg font-extrabold shrink-0 ${
                      feedbackScreen.data.clarityScore >= 75
                        ? 'border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]'
                        : feedbackScreen.data.clarityScore >= 50
                        ? 'border-[#FDE68A] bg-[#FEF3C7] text-[#92400E]'
                        : 'border-[#FECACA] bg-[#FEF2F2] text-[#991B1B]'
                    }`}
                  >
                    {feedbackScreen.data.clarityScore}%
                  </div>
                </div>

                {/* Animated GPU scaleX Clarity Mastery Bar */}
                <div className="ts-stagger-card space-y-1.5" style={{ '--ts-i': 1 } as React.CSSProperties}>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#71717A]">
                    <span>Clarity Mastery Indicator</span>
                    <span className="font-semibold text-[#18181B]">
                      {feedbackScreen.data.clarityScore} / 100
                    </span>
                  </div>
                  <div
                    role="progressbar"
                    aria-valuenow={feedbackScreen.data.clarityScore}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Feynman clarity mastery"
                    className="h-2.5 w-full overflow-hidden rounded-full border border-[#E4E4E7] bg-[#F4F4F5]"
                  >
                    <div
                      className={`ts-progress-fill h-full w-full rounded-full ${
                        feedbackScreen.data.clarityScore >= 75
                          ? 'bg-[#059669]'
                          : feedbackScreen.data.clarityScore >= 50
                          ? 'bg-[#D97706]'
                          : 'bg-[#DC2626]'
                      }`}
                      style={{
                        transform: `scaleX(${Math.max(
                          0.03,
                          Math.min(1, feedbackScreen.data.clarityScore / 100)
                        )})`,
                      }}
                    />
                  </div>
                </div>

                <div
                  className="ts-stagger-card rounded-[12px] border border-[#A7F3D0] bg-[#ECFDF5]/50 p-4"
                  style={{ '--ts-i': 2 } as React.CSSProperties}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#065F46]">
                    <CheckCircle2 className="h-4 w-4 text-[#059669] shrink-0" aria-hidden="true" />
                    <span>Clear Intuition Strengths</span>
                  </div>
                  <ul className="mt-2.5 space-y-2">
                    {feedbackScreen.data.strengths.map((s, idx) => (
                      <li
                        key={idx}
                        className="ts-stagger-card rounded-[9px] border border-[#A7F3D0]/80 bg-white p-2.5 text-xs text-[#27272A]"
                        style={{ '--ts-i': 3 + idx } as React.CSSProperties}
                      >
                        <KaTeXText text={s} />
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className="ts-stagger-card rounded-[12px] border border-[#FDE68A] bg-[#FFFBEB]/70 p-4"
                  style={{ '--ts-i': 4 } as React.CSSProperties}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#92400E]">
                    <HelpCircle className="h-4 w-4 text-[#D97706] shrink-0" aria-hidden="true" />
                    <span>Unexplained Jargon / Next Step to Clarify</span>
                  </div>
                  <ul className="mt-2.5 space-y-2">
                    {feedbackScreen.data.gapsToClarify.map((g, idx) => (
                      <li
                        key={idx}
                        className="ts-stagger-card rounded-[9px] border border-[#FDE68A]/90 bg-white p-2.5 text-xs text-[#27272A]"
                        style={{ '--ts-i': 5 + idx } as React.CSSProperties}
                      >
                        <KaTeXText text={g} />
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-medium text-[#71717A]">
                  <Sparkles className="h-3.5 w-3.5 text-[#D97706] shrink-0" aria-hidden="true" />
                  <span>
                    Baby Sprout updated the prompt card on the left with a follow-up question!
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TeachSproutSkeleton() {
  return (
    <div className="main-pad !pt-[26px]">
      <style>{`
        @keyframes tsFallbackSweep {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
        .ts-fallback-shimmer {
          position: relative;
          overflow: hidden;
          background: #F4F4F5;
        }
        .ts-fallback-shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.72) 50%, transparent 100%);
          animation: tsFallbackSweep 1.35s cubic-bezier(0.77, 0, 0.175, 1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .ts-fallback-shimmer::after { animation: none; opacity: 0; }
        }
      `}</style>
      <div className="col-center-wide space-y-5">
        <div className="rounded-[14px] border border-[#E4E4E7] bg-[#FAFAFA] p-6 flex items-center gap-4">
          <div className="ts-fallback-shimmer h-16 w-16 rounded-[14px] shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="ts-fallback-shimmer h-3.5 w-40 rounded" />
            <div className="ts-fallback-shimmer h-6 w-72 max-w-full rounded-md" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-4">
            <div className="ts-fallback-shimmer h-28 rounded-[14px] border border-[#E4E4E7]" />
            <div className="ts-fallback-shimmer h-64 rounded-[14px] border border-[#E4E4E7]" />
          </div>
          <div className="ts-fallback-shimmer lg:col-span-5 h-80 rounded-[14px] border border-[#E4E4E7]" />
        </div>
      </div>
    </div>
  );
}

export default function TeachSproutPage() {
  return (
    <Suspense fallback={<TeachSproutSkeleton />}>
      <TeachSproutContent />
    </Suspense>
  );
}
