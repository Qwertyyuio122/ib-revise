'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import type { ScreenState, SubjectSlug } from '@/types/fsm';
import { SproutMascot } from '@/components/mascot/SproutMascot';
import { KaTeXText } from '@/components/math/KaTeXText';
import {
  Timer,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RotateCcw,
  Play,
  Pause,
} from 'lucide-react';

interface BlurtingTopic {
  id: string;
  subjectSlug: SubjectSlug;
  subjectLabel: string;
  title: string;
  promptHint: string;
  checklist: string[];
  sampleBlurt: string;
}

const BlurtingEvaluationSchema = z.object({
  scorePercent: z.number().min(0).max(100),
  coveredPoints: z.array(z.string()),
  missedPoints: z.array(z.string()),
  coachingTip: z.string(),
  mode: z.string(),
  modelUsed: z.string().optional(),
});

type BlurtingEvaluation = z.infer<typeof BlurtingEvaluationSchema>;

const BLURTING_TOPICS: BlurtingTopic[] = [
  {
    id: 'bio-water-potential',
    subjectSlug: 'bio',
    subjectLabel: 'Biology HL',
    title: 'B2.1 Osmosis, Water Potential ($\\Psi_w$) & Turgor Pressure',
    promptHint:
      'Write everything you remember about water potential, solute potential, pressure potential, and plant tissue plasmolysis.',
    checklist: [
      'Water potential equation: $\\Psi_w = \\Psi_s + \\Psi_p$',
      'Net movement of free water molecules from higher (less negative) $\\Psi_w$ to lower (more negative) $\\Psi_w$',
      'Solute potential ($\\Psi_s$) is always negative ($\\le 0$) due to hydration shells around solutes',
      'Pressure potential ($\\Psi_p$) represents hydrostatic turgor pressure against the rigid cellulose cell wall',
      'In hypertonic solutions, protoplast shrinks away from cell wall causing plasmolysis ($\\Psi_p = 0$)',
    ],
    sampleBlurt:
      'Water potential is Psi_w = Psi_s + Psi_p. Free water molecules move from higher water potential to lower water potential across a partially permeable membrane. Solute potential is negative because solutes bind water molecules. In hypertonic solutions, plant cells lose water by osmosis and undergo plasmolysis.',
  },
  {
    id: 'chem-enthalpy-hess',
    subjectSlug: 'chem',
    subjectLabel: 'Chemistry SL',
    title: 'Reactivity 1.1–1.2 Calorimetry ($q = mc\\Delta T$), Hess’s Law & Bond Enthalpies',
    promptHint:
      'Recall solution calorimetry equations, exothermic/endothermic sign conventions, Hess’s Law cycles, and the bond enthalpy direction trap.',
    checklist: [
      'Heat transferred in solution calorimetry: $q = mc\\Delta T$ using solution mass $m$ ($\\text{g}$) and $c = 4.18\\text{ J g}^{-1}\\text{ K}^{-1}$',
      'Molar enthalpy change: $\\Delta H = -\\frac{q}{1000n}$ ($\\text{kJ mol}^{-1}$), negative for exothermic reactions',
      'Hess’s Law: total enthalpy change $\\Delta H$ depends only on initial and final states, independent of reaction pathway',
      'Average bond enthalpy formula: $\\Delta H^\\ominus = \\sum E(\\text{bonds broken}) - \\sum E(\\text{bonds formed})$',
      'Bond enthalpies are gaseous averages, causing systematic deviation from experimental liquid/aqueous $\\Delta H$ values',
    ],
    sampleBlurt:
      'In calorimetry, q = mcDeltaT using mass of solution and specific heat capacity 4.18 J/g/K, then Delta H = -q/(1000n) in kJ/mol with a negative sign for exothermic reactions. By Hess Law enthalpy change is path independent. Using average bond enthalpies, Delta H = sum of bonds broken minus sum of bonds formed, which only applies to gaseous species.',
  },
  {
    id: 'hist-coldwar-origins',
    subjectSlug: 'hist',
    subjectLabel: 'History HL',
    title: 'Paper 2 Cold War Breakdown of the Grand Alliance (1945–1949)',
    promptHint:
      'Write down the conferences, doctrines, economic plans, and historiographical schools explaining the 1945–1949 breakdown.',
    checklist: [
      'Yalta & Potsdam Conferences (1945): Disagreements over Polish borders, German reparations, and atomic diplomacy',
      'Kennan Long Telegram (1946) and Truman Doctrine (1947) establishing US policy of Containment',
      'Marshall Plan ($13 billion European Recovery Program) vs Soviet Molotov Plan / Comecon',
      'Berlin Blockade and Airlift (1948–1949) leading to creation of NATO and division of Germany',
      'Historiography contrast: Orthodox (Soviet expansionism) vs Revisionist (US Open Door economic hegemony) vs Post-Revisionist',
    ],
    sampleBlurt:
      'At Yalta and Potsdam in 1945 tensions emerged over Poland and German reparations. Kennan wrote the Long Telegram which inspired the Truman Doctrine of containment and the Marshall Plan. Stalin responded with the Berlin Blockade in 1948. Orthodox historians blame Stalin while Revisionists emphasize US dollar diplomacy.',
  },
  {
    id: 'eng-unseen-commentary',
    subjectSlug: 'eng',
    subjectLabel: 'English Lit HL',
    title: 'Paper 1 Unseen Literary Analysis: Narrative Voice & Poetic Structure',
    promptHint:
      'List the core structural, tonal, and syntactic techniques you check during your 5-minute Paper 1 reading window.',
    checklist: [
      'Narrative perspective & distance (first-person unreliable, omniscient, or free indirect discourse)',
      'Structural progression & the pivotal turn (volta) where tone or semantic field shifts',
      'Syntactic pacing: enjambment vs medial caesura and parataxis vs hypotaxis',
      'Sensory imagery clusters (visual, auditory, tactile, visceral) constructing atmosphere',
      'Avoid device-spotting: explicitly connect every authorial choice to reader perception and thematic tension',
    ],
    sampleBlurt:
      'In Paper 1 commentary, start by checking narrative voice such as free indirect discourse and structural shifts like the volta. Analyze syntax including enjambment and caesura, plus sensory imagery clusters, always linking authorial choices to the effect on the reader.',
  },
  {
    id: 'fr-subjonctif-paper1',
    subjectSlug: 'fr',
    subjectLabel: 'French B SL',
    title: 'Paper 1 Production Écrite : Déclencheurs du Subjonctif & Connecteurs',
    promptHint:
      'Notez de mémoire vos déclencheurs du subjonctif, connecteurs logiques C1 et conventions de types de textes.',
    checklist: [
      'Concession avec Bien que / Quoique + subjonctif présent (« Bien que cette mesure soit... »)',
      'Nécessité avec Il est primordial / indispensable que + subjonctif (« Il faut que nous prenions... »)',
      'But avec Pour que / Afin que + subjonctif (« Afin que les jeunes puissent... »)',
      'Connecteurs logiques articulés : Force est de constater que, En revanche, Par conséquent',
      'Conventions du type de texte (registre, titre accrocheur, formule d\'appel et de clôture)',
    ],
    sampleBlurt:
      'Pour réussir Paper 1 en français, il faut utiliser bien que suivi du subjonctif, il est primordial que + subjonctif, et pour que + subjonctif. On structure avec Force est de constater que et En revanche en respectant le registre du type de texte.',
  },
  {
    id: 'math-calculus-kinematics',
    subjectSlug: 'math',
    subjectLabel: 'Math AA SL',
    title: 'Topic 5 Calculus: Kinematics ($s, v, a$) & Optimization',
    promptHint:
      'Write the derivative/integral links between displacement, velocity, acceleration, and total distance vs net displacement.',
    checklist: [
      'Velocity is the derivative of displacement: $v(t) = s\'(t) = \\frac{ds}{dt}$ and acceleration $a(t) = v\'(t)$',
      'Particle is instantaneously at rest (changes direction) when $v(t) = 0$ with sign change',
      'Net displacement on $[t_1, t_2]$ is $\\Delta s = \\int_{t_1}^{t_2} v(t)\\,dt$',
      'Total distance travelled on $[t_1, t_2]$ is $d = \\int_{t_1}^{t_2} |v(t)|\\,dt$',
      'Stationary points occur when $f\'(x) = 0$; local maximum when $f\'\'(x) < 0$ and local minimum when $f\'\'(x) > 0$',
    ],
    sampleBlurt:
      'Velocity v(t) is the derivative of displacement s(t), and acceleration a(t) is the derivative of velocity. A particle changes direction when v(t) = 0. Net displacement is the integral of v(t) dt, while total distance travelled is the integral of |v(t)| dt.',
  },
];

type TimerMode = 'paused' | 'running';

function resolveInitialTopicId(
  topicIdParam: string | null,
  subjectParam: string | null
): string {
  if (topicIdParam) {
    const exactMatch = BLURTING_TOPICS.find((t) => t.id === topicIdParam);
    if (exactMatch) return exactMatch.id;
  }
  if (subjectParam) {
    const subjectMatch = BLURTING_TOPICS.find(
      (t) => t.subjectSlug === subjectParam
    );
    if (subjectMatch) return subjectMatch.id;
  }
  return BLURTING_TOPICS[0].id;
}

function BlurtingStudioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramTopicId = searchParams.get('topicId');
  const paramSubject = searchParams.get('subject');

  const [selectedTopicId, setSelectedTopicId] = useState<string>(() =>
    resolveInitialTopicId(paramTopicId, paramSubject)
  );
  const [userBlurtText, setUserBlurtText] = useState<string>('');
  const [secondsLeft, setSecondsLeft] = useState<number>(180);
  const [timerMode, setTimerMode] = useState<TimerMode>('paused');
  const [evalScreen, setEvalScreen] = useState<ScreenState<BlurtingEvaluation>>({
    status: 'idle',
  });
  const endTimeRef = useRef<number | null>(null);
  const secondsLeftRef = useRef<number>(secondsLeft);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    secondsLeftRef.current = secondsLeft;
  }, [secondsLeft]);

  useEffect(() => {
    if (paramTopicId || paramSubject) {
      setSelectedTopicId(resolveInitialTopicId(paramTopicId, paramSubject));
    }
  }, [paramTopicId, paramSubject]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const activeTopic =
    BLURTING_TOPICS.find((t) => t.id === selectedTopicId) ?? BLURTING_TOPICS[0];

  useEffect(() => {
    if (timerMode !== 'running') {
      endTimeRef.current = null;
      return;
    }
    const startSec = secondsLeftRef.current > 0 ? secondsLeftRef.current : 180;
    if (secondsLeftRef.current <= 0) {
      setSecondsLeft(180);
    }
    endTimeRef.current = Date.now() + startSec * 1000;
    const handle = window.setInterval(() => {
      if (!endTimeRef.current) return;
      const remaining = Math.max(
        0,
        Math.ceil((endTimeRef.current - Date.now()) / 1000)
      );
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        endTimeRef.current = null;
        setTimerMode('paused');
      }
    }, 250);
    return () => window.clearInterval(handle);
  }, [timerMode]);

  function formatTimer(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  async function runEvaluation(overrideText?: string) {
    const blurtContent = (overrideText ?? userBlurtText).trim();
    if (!blurtContent) {
      setEvalScreen({
        status: 'empty',
        message: 'Write what you remember from memory first, or load a sample blurt to preview markscheme comparison.',
      });
      return;
    }

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setTimerMode('paused');
    setEvalScreen({ status: 'loading' });

    try {
      const res = await fetch('/api/ai/blurting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          subjectSlug: activeTopic.subjectSlug,
          topicId: activeTopic.id,
          topicTitle: activeTopic.title,
          userBlurtText: blurtContent,
          checklist: activeTopic.checklist,
        }),
      });
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      if (!res.ok) throw new Error('Evaluation failed');
      const parsed = BlurtingEvaluationSchema.safeParse(await res.json());
      if (!parsed.success) {
        throw new Error('Invalid evaluation response');
      }
      setEvalScreen({ status: 'success', data: parsed.data });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setEvalScreen({
        status: 'error',
        message: 'Could not evaluate recall right now. Please try again.',
      });
    }
  }

  function handleCheckRecall(e: React.FormEvent) {
    e.preventDefault();
    void runEvaluation();
  }

  return (
    <div className="main-pad !pt-[26px]">
      <style>{`
        @keyframes blCardEnter {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes blShimmerSweep {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(100%);
          }
        }
        .bl-card-enter {
          animation: blCardEnter 200ms cubic-bezier(0.23, 1, 0.32, 1) both;
          animation-delay: calc(var(--bl-i, 0) * 40ms);
        }
        .bl-timer-fill {
          transform-origin: left center;
          transition: transform 250ms linear;
        }
        .bl-coverage-fill {
          transform-origin: left center;
          transition: transform 280ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        @starting-style {
          .bl-coverage-fill {
            transform: scaleX(0.04);
          }
        }
        .bl-pill-btn {
          transition:
            background-color 150ms ease,
            border-color 150ms ease,
            color 150ms ease,
            transform 150ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .bl-pill-btn:active:not(:disabled) {
          transform: scale(0.975);
        }
        .bl-shimmer {
          position: relative;
          overflow: hidden;
          background: #F4F4F5;
        }
        .bl-shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.72) 50%, transparent 100%);
          animation: blShimmerSweep 1.35s cubic-bezier(0.77, 0, 0.175, 1) infinite;
        }
        @media (hover: hover) and (pointer: fine) {
          .bl-pill-btn:hover:not(:disabled) {
            transform: translateY(-1px);
          }
          .bl-pill-btn:active:not(:disabled) {
            transform: scale(0.975);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .bl-card-enter {
            animation: blFadeOnly 160ms ease both;
            animation-delay: 0ms;
          }
          .bl-timer-fill,
          .bl-coverage-fill {
            transition: none;
          }
          .bl-pill-btn {
            transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease;
          }
          .bl-pill-btn:hover:not(:disabled),
          .bl-pill-btn:active:not(:disabled) {
            transform: none;
          }
          .bl-shimmer::after {
            animation: none;
            opacity: 0;
          }
        }
        @keyframes blFadeOnly {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <div className="col-center-wide">
        {/* Botanical Notepad Stage Header */}
        <div className="relative overflow-hidden rounded-[14px] border border-[#E4E4E7] bg-[#FAFAFA] p-5 sm:p-6">
          {/* Subtle Ambient Botanical & Ruled Page Motif */}
          <svg
            viewBox="0 0 220 120"
            fill="none"
            aria-hidden="true"
            className="pointer-events-none absolute -right-4 -top-2 h-28 w-52 opacity-[0.16]"
          >
            <path
              d="M28 110 C68 84, 118 52, 192 22"
              stroke="#059669"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M118 58 C118 32, 140 18, 162 24 C154 46, 136 58, 118 58 Z"
              stroke="#D97706"
              strokeWidth="1.35"
            />
            <line x1="142" y1="78" x2="204" y2="78" stroke="#A1A1AA" strokeWidth="1.2" strokeDasharray="4 4" />
            <line x1="154" y1="92" x2="204" y2="92" stroke="#A1A1AA" strokeWidth="1.2" strokeDasharray="4 4" />
          </svg>

          <div className="relative flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex items-start sm:items-center gap-4 min-w-0">
              <div className="relative flex h-16 w-16 sm:h-[72px] sm:w-[72px] shrink-0 items-center justify-center rounded-[14px] border border-[#FDE68A] bg-white">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-1 rounded-[10px] bg-[radial-gradient(circle_at_50%_55%,rgba(254,243,199,0.78),transparent_72%)]"
                />
                <SproutMascot pose="notepad" size={54} className="relative" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="mini-tag bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] font-mono">
                    BLANK-PAGE METHOD · {activeTopic.checklist.length} CHECKPOINTS
                  </span>
                  <span className="rounded-full border border-[#E4E4E7] bg-white px-2.5 py-0.5 text-[11.5px] font-semibold text-[#3F3F46]">
                    {activeTopic.subjectLabel}
                  </span>
                </div>
                <h1
                  className="h-title !text-[23px] sm:!text-[25px]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Active Recall <span className="h-sub !text-[21px] sm:!text-[22px]">/ Blurting Studio</span>
                </h1>
                <p className="text-[13px] text-[#71717A] mt-1 max-w-xl">
                  Empty your memory onto a blank canvas before Sprout compares your blurt against the IB markscheme checklist.
                </p>
              </div>
            </div>

            {/* Countdown Recall Timer */}
            <div className="self-start lg:self-center rounded-[12px] border border-[#E4E4E7] bg-white px-3.5 py-2.5 space-y-2 shrink-0">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-[#D97706]" aria-hidden="true" />
                <span className="font-mono text-sm font-bold text-[#18181B] tabular-nums">
                  {formatTimer(secondsLeft)}
                </span>
                  <button
                    type="button"
                    onClick={() =>
                      setTimerMode((prev) => (prev === 'running' ? 'paused' : 'running'))
                    }
                    className="pill-btn-dark bl-pill-btn !py-1 !px-2.5 !text-[11.5px]"
                  >
                    {timerMode === 'running' ? (
                      <Pause className="h-3 w-3" aria-hidden="true" />
                    ) : (
                      <Play className="h-3 w-3" aria-hidden="true" />
                    )}
                    <span>{timerMode === 'running' ? 'Pause' : 'Start 3m Sprint'}</span>
                  </button>
                <button
                  type="button"
                  onClick={() => {
                    endTimeRef.current = null;
                    setTimerMode('paused');
                    setSecondsLeft(180);
                  }}
                  aria-label="Reset countdown timer"
                  className="bl-pill-btn rounded-md border border-[#E4E4E7] p-1 text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] cursor-pointer"
                  title="Reset Timer"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F4F4F5]">
                <div
                  className="bl-timer-fill h-full w-full rounded-full bg-[#D97706]"
                  style={{
                    transform: `scaleX(${Math.max(0.01, Math.min(1, secondsLeft / 180))})`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Subject & Topic Selector Pills */}
        <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {BLURTING_TOPICS.map((topic) => {
            const isSelected = topic.id === selectedTopicId;
            return (
              <button
                key={topic.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  abortControllerRef.current?.abort();
                  endTimeRef.current = null;
                  setSelectedTopicId(topic.id);
                  setEvalScreen({ status: 'idle' });
                  setSecondsLeft(180);
                  setTimerMode('paused');
                }}
                className={`bl-pill-btn flex flex-col items-start rounded-[12px] border p-3.5 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] ${
                  isSelected
                    ? 'border-[#18181B] bg-[#18181B] text-white'
                    : 'border-[#E4E4E7] bg-white text-[#18181B] hover:bg-[#FAFAFA]'
                }`}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <span
                    className={`rounded px-2 py-0.5 text-[11px] font-mono font-semibold ${
                      isSelected
                        ? 'bg-white/15 text-white'
                        : 'bg-[#F4F4F5] text-[#3F3F46]'
                    }`}
                  >
                    {topic.subjectLabel}
                  </span>
                  {isSelected && (
                    <span
                      className="h-2 w-2 rounded-full bg-[#F59E0B]"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <KaTeXText
                  text={topic.title}
                  className="mt-2 text-xs font-bold leading-snug"
                />
              </button>
            );
          })}
        </div>

        {/* Main Blank-Page Recall Workspace */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          <form
            onSubmit={handleCheckRecall}
            className="hairline-card flex flex-col lg:col-span-6 min-w-0"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#71717A]">
                  Active Topic Prompt
                </span>
                <KaTeXText
                  text={activeTopic.title}
                  className="mt-0.5 text-base font-semibold text-[#18181B]"
                />
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {userBlurtText.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      abortControllerRef.current?.abort();
                      setUserBlurtText('');
                      setEvalScreen({
                        status: 'empty',
                        message:
                          'Canvas cleared. Write your recall notes from memory or load a sample blurt.',
                      });
                    }}
                    className="pill-btn bl-pill-btn"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setUserBlurtText(activeTopic.sampleBlurt)}
                  className="pill-btn bl-pill-btn"
                >
                  Load Sample Blurt
                </button>
              </div>
            </div>

            <p className="mt-2 text-xs text-[#71717A] leading-relaxed">
              {activeTopic.promptHint}
            </p>

            <textarea
              rows={10}
              aria-label="Active recall blurt text"
              value={userBlurtText}
              onChange={(e) => setUserBlurtText(e.target.value)}
              placeholder="Type everything you can recall from memory without looking at your notes—formulas, definitions, mechanisms, and markscheme keywords..."
              className="mt-4 w-full flex-1 rounded-[11px] border border-[#E4E4E7] bg-[#FAFAFA] p-4 text-[13.5px] leading-relaxed text-[#18181B] placeholder:text-[#71717A] transition-[background-color,border-color] duration-150 focus:border-[#18181B] focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
            />

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-xs text-[#71717A]">
                {userBlurtText.trim().split(/\s+/).filter(Boolean).length} words written
              </span>
              <button
                type="submit"
                disabled={evalScreen.status === 'loading' || !userBlurtText.trim()}
                className="pill-btn-dark bl-pill-btn !py-2.5 !px-5 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <span>
                  {evalScreen.status === 'loading'
                    ? 'Evaluating against IB Markscheme...'
                    : 'Check My Recall'}
                </span>
              </button>
            </div>
          </form>

          {/* Side-by-Side Results Card */}
          <div className="hairline-card lg:col-span-6 min-w-0">
            {evalScreen.status === 'idle' && (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#FDE68A] bg-[#FFFBEB]">
                  <SproutMascot pose="notepad" size={58} />
                </div>
                <h2
                  className="mt-4 text-base font-semibold text-[#18181B]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Markscheme Checklist Hidden During Recall
                </h2>
                <p className="mt-1.5 max-w-sm text-xs text-[#71717A] leading-relaxed">
                  Write your free-recall blurt on the left or click{' '}
                  <strong className="text-[#18181B]">Load Sample Blurt</strong>, then press{' '}
                  <strong className="text-[#18181B]">Check My Recall</strong> to reveal covered vs missed points.
                </p>
              </div>
            )}

            {evalScreen.status === 'loading' && (
              <div
                className="space-y-4 py-2"
                aria-busy="true"
                aria-label="Evaluating active recall against markscheme"
              >
                <div className="flex items-center justify-between gap-3 border-b border-[#F4F4F5] pb-4">
                  <div className="space-y-2 flex-1">
                    <div className="bl-shimmer h-3 w-28 rounded" />
                    <div className="bl-shimmer h-5 w-48 rounded-md" />
                    <div className="bl-shimmer h-4 w-28 rounded-full" />
                  </div>
                  <div className="bl-shimmer h-10 w-16 rounded-xl shrink-0" />
                </div>
                <div className="bl-shimmer h-2.5 w-full rounded-full" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-[12px] border border-[#E4E4E7] bg-[#FAFAFA] p-3.5 space-y-2">
                    <div className="bl-shimmer h-3.5 w-32 rounded" />
                    <div className="bl-shimmer h-12 w-full rounded-lg" />
                    <div className="bl-shimmer h-12 w-full rounded-lg" />
                  </div>
                  <div className="rounded-[12px] border border-[#E4E4E7] bg-[#FAFAFA] p-3.5 space-y-2">
                    <div className="bl-shimmer h-3.5 w-32 rounded" />
                    <div className="bl-shimmer h-12 w-full rounded-lg" />
                    <div className="bl-shimmer h-12 w-full rounded-lg" />
                  </div>
                </div>
                <div className="bl-shimmer h-12 w-full rounded-xl" />
              </div>
            )}

            {evalScreen.status === 'empty' && (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#FDE68A] bg-[#FFFBEB]">
                  <SproutMascot pose="notepad" size={46} />
                </div>
                <p className="mt-3 max-w-sm text-xs text-[#71717A] leading-relaxed">
                  {evalScreen.message}
                </p>
                <button
                  type="button"
                  onClick={() => setUserBlurtText(activeTopic.sampleBlurt)}
                  className="pill-btn-dark bl-pill-btn mt-4"
                >
                  Load Sample Blurt
                </button>
              </div>
            )}

            {evalScreen.status === 'error' && (
              <div
                role="alert"
                className="bl-card-enter rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4 text-xs text-[#B91C1C] space-y-3"
              >
                <p>{evalScreen.message}</p>
                <button
                  type="button"
                  onClick={() => void runEvaluation()}
                  className="pill-btn-dark bl-pill-btn"
                >
                  Retry Evaluation
                </button>
              </div>
            )}

            {evalScreen.status === 'success' && (
              <div key={`${activeTopic.id}-${evalScreen.data.scorePercent}`} className="space-y-4">
                <div
                  className="bl-card-enter flex items-center justify-between gap-3 border-b border-[#F4F4F5] pb-4"
                  style={{ '--bl-i': 0 } as React.CSSProperties}
                >
                  <div className="min-w-0">
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#71717A]">
                      Active Recall Score
                    </span>
                    <h2
                      className="text-lg font-semibold text-[#18181B]"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      Markscheme Coverage Report
                    </h2>
                    <span className="mt-1 inline-block rounded-full border border-[#E4E4E7] bg-[#FAFAFA] px-2.5 py-0.5 text-[11px] font-mono font-medium text-[#71717A]">
                      {evalScreen.data.mode === 'gemini'
                        ? `Live Gemini (${evalScreen.data.modelUsed || 'AI'})`
                        : 'Built-In IB Checklist'}
                    </span>
                  </div>
                  <div
                    className={`rounded-xl border px-3.5 py-1.5 font-mono text-lg font-extrabold shrink-0 ${
                      evalScreen.data.scorePercent >= 75
                        ? 'border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]'
                        : evalScreen.data.scorePercent >= 50
                        ? 'border-[#FDE68A] bg-[#FEF3C7] text-[#92400E]'
                        : 'border-[#FECACA] bg-[#FEF2F2] text-[#991B1B]'
                    }`}
                  >
                    {evalScreen.data.scorePercent}%
                  </div>
                </div>

                {/* Animated GPU scaleX Coverage Progress Indicator */}
                <div
                  className="bl-card-enter space-y-1.5"
                  style={{ '--bl-i': 1 } as React.CSSProperties}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#71717A]">
                    <span>Checklist Coverage</span>
                    <span className="font-semibold text-[#18181B]">
                      {evalScreen.data.coveredPoints.length} of{' '}
                      {evalScreen.data.coveredPoints.length + evalScreen.data.missedPoints.length}{' '}
                      points recalled
                    </span>
                  </div>
                  <div
                    role="progressbar"
                    aria-valuenow={evalScreen.data.scorePercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Markscheme checklist coverage"
                    className="h-2.5 w-full overflow-hidden rounded-full border border-[#E4E4E7] bg-[#F4F4F5]"
                  >
                    <div
                      className={`bl-coverage-fill h-full w-full rounded-full ${
                        evalScreen.data.scorePercent >= 75
                          ? 'bg-[#059669]'
                          : evalScreen.data.scorePercent >= 50
                          ? 'bg-[#D97706]'
                          : 'bg-[#DC2626]'
                      }`}
                      style={{
                        transform: `scaleX(${Math.max(
                          0.03,
                          Math.min(1, evalScreen.data.scorePercent / 100)
                        )})`,
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Covered Markscheme Points */}
                  <div
                    className="bl-card-enter rounded-[12px] border border-[#A7F3D0] bg-[#ECFDF5]/50 p-4 min-w-0"
                    style={{ '--bl-i': 2 } as React.CSSProperties}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#065F46]">
                      <CheckCircle2 className="h-4 w-4 text-[#059669] shrink-0" aria-hidden="true" />
                      <span>
                        Covered Markscheme Points ({evalScreen.data.coveredPoints.length})
                      </span>
                    </div>
                    <ul className="mt-3 space-y-2">
                      {evalScreen.data.coveredPoints.length === 0 ? (
                        <li className="text-xs text-[#065F46]/80">
                          No exact checklist matches yet—review the right column and retry!
                        </li>
                      ) : (
                        evalScreen.data.coveredPoints.map((pt, i) => (
                          <li
                            key={i}
                            className="bl-card-enter rounded-[9px] border border-[#A7F3D0]/80 bg-white p-2.5 text-xs text-[#27272A]"
                            style={{ '--bl-i': 3 + i } as React.CSSProperties}
                          >
                            <KaTeXText text={pt} />
                          </li>
                        ))
                      )}
                    </ul>
                  </div>

                  {/* Missed Concepts to Review */}
                  <div
                    className="bl-card-enter rounded-[12px] border border-[#FDE68A] bg-[#FFFBEB]/70 p-4 min-w-0"
                    style={{ '--bl-i': 3 } as React.CSSProperties}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#92400E]">
                      <AlertCircle className="h-4 w-4 text-[#D97706] shrink-0" aria-hidden="true" />
                      <span>
                        Missed Concepts to Review ({evalScreen.data.missedPoints.length})
                      </span>
                    </div>
                    <ul className="mt-3 space-y-2">
                      {evalScreen.data.missedPoints.length === 0 ? (
                        <li className="text-xs text-[#92400E]">
                          100% Markscheme coverage! Every key concept was recalled.
                        </li>
                      ) : (
                        evalScreen.data.missedPoints.map((pt, i) => (
                          <li
                            key={i}
                            className="bl-card-enter rounded-[9px] border border-[#FDE68A]/90 bg-white p-2.5 text-xs text-[#27272A]"
                            style={{ '--bl-i': 4 + i } as React.CSSProperties}
                          >
                            <KaTeXText text={pt} />
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>

                <div
                  className="bl-card-enter rounded-[11px] border border-[#E4E4E7] bg-[#FAFAFA] p-3.5 text-xs text-[#3F3F46]"
                  style={{ '--bl-i': 5 } as React.CSSProperties}
                >
                  <strong className="font-semibold text-[#18181B]">
                    Sprout Coaching Tip:{' '}
                  </strong>
                  <KaTeXText text={evalScreen.data.coachingTip} as="span" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BlurtingSkeleton() {
  return (
    <div className="main-pad !pt-[26px]">
      <style>{`
        @keyframes blFallbackSweep {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
        .bl-fallback-shimmer {
          position: relative;
          overflow: hidden;
          background: #F4F4F5;
        }
        .bl-fallback-shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.72) 50%, transparent 100%);
          animation: blFallbackSweep 1.35s cubic-bezier(0.77, 0, 0.175, 1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .bl-fallback-shimmer::after { animation: none; opacity: 0; }
        }
      `}</style>
      <div className="col-center-wide space-y-5">
        <div className="rounded-[14px] border border-[#E4E4E7] bg-[#FAFAFA] p-6 flex items-center gap-4">
          <div className="bl-fallback-shimmer h-16 w-16 rounded-[14px] shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="bl-fallback-shimmer h-3.5 w-40 rounded" />
            <div className="bl-fallback-shimmer h-6 w-72 max-w-full rounded-md" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="bl-fallback-shimmer lg:col-span-6 h-80 rounded-[14px] border border-[#E4E4E7]" />
          <div className="bl-fallback-shimmer lg:col-span-6 h-80 rounded-[14px] border border-[#E4E4E7]" />
        </div>
      </div>
    </div>
  );
}

export default function BlurtingStudioPage() {
  return (
    <Suspense fallback={<BlurtingSkeleton />}>
      <BlurtingStudioContent />
    </Suspense>
  );
}
