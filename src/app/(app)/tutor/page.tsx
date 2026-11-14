'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ScreenState, SubjectSlug } from '@/types/fsm';
import { SproutMascot } from '@/components/mascot/SproutMascot';
import { KaTeXText } from '@/components/math/KaTeXText';
import { Send, Sparkles, BookOpen, Lightbulb, RotateCcw, AlertCircle } from 'lucide-react';

interface TutorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  subjectLabel?: string;
  keyTakeaways?: string[];
  followUpQuestion?: string;
  markschemeTip?: string;
  mode?: 'gemini' | 'deterministic_fallback';
  modelUsed?: string;
}

const SUBJECT_OPTIONS: Array<{
  slug: SubjectSlug;
  label: string;
  defaultTopic: string;
  starterPrompts: [string, string, string];
}> = [
  {
    slug: 'bio',
    label: 'Biology HL',
    defaultTopic: 'B2.1 Membranes, Water Potential & C1.2 Chemiosmosis',
    starterPrompts: [
      'Explain IB Markscheme wording for Water Potential ($\\Psi_w = \\Psi_s + \\Psi_p$)',
      'Quiz me on SL/HL traps in Chemiosmosis & ATP Synthase',
      'Build an essay thesis for a Paper 2 Section B 8-mark question on enzyme inhibition',
    ],
  },
  {
    slug: 'chem',
    label: 'Chemistry SL',
    defaultTopic: 'Reactivity 1.1–1.2 Enthalpy Cycles ($\\Delta H^\\ominus$), Bond Enthalpies & Calorimetry',
    starterPrompts: [
      'Explain IB Markscheme wording for Hess’s Law & average bond enthalpies ($\\Delta H^\\ominus = \\sum E_{\\text{broken}} - \\sum E_{\\text{formed}}$)',
      'Quiz me on SL traps in Maxwell-Boltzmann curves & activation energy',
      'Build a structured Paper 2 response for Brønsted-Lowry conjugate acid-base pairs',
    ],
  },
  {
    slug: 'hist',
    label: 'History HL',
    defaultTopic: 'Paper 1 OPCVL & Paper 2 Cold War / Authoritarian States',
    starterPrompts: [
      'Explain IB Markscheme wording for Paper 1 Q3 OPCVL source evaluation',
      'Quiz me on SL/HL traps between Orthodox and Revisionist Cold War historians',
      'Build an essay thesis on the rise of an authoritarian state (Paper 2 Topic 10)',
    ],
  },
  {
    slug: 'eng',
    label: 'English Lit HL',
    defaultTopic: 'Paper 1 Unseen Commentary & HL Essay Criterion B',
    starterPrompts: [
      'Explain IB Markscheme wording for Criterion B (Authorial Choices)',
      'Quiz me on SL/HL traps when analyzing free indirect discourse & poetic volta',
      'Build an essay thesis for a Paper 2 comparative essay on power and alienation',
    ],
  },
  {
    slug: 'fr',
    label: 'French B SL',
    defaultTopic: 'Paper 1 Production Écrite & Subjonctif Présent',
    starterPrompts: [
      'Explain IB Markscheme wording for Criterion A (Idiomatic French & Subjunctive)',
      'Quiz me on SL/HL traps in Paper 1 text-type conventions (Article vs Lettre formelle)',
      'Build an essay thesis en français avec « Bien que + subjonctif »',
    ],
  },
  {
    slug: 'math',
    label: 'Math AA SL',
    defaultTopic: 'Topic 5 Calculus Kinematics & Topic 4 Distributions',
    starterPrompts: [
      'Explain IB Markscheme wording for M1/A1 marks in $\\int |v(t)|\\,dt$ total distance',
      'Quiz me on SL/HL traps in Binomial vs Normal distribution GDC setups',
      'Build an optimization strategy for stationary points & second derivative tests',
    ],
  },
];

const VALID_SUBJECTS: SubjectSlug[] = ['bio', 'chem', 'hist', 'eng', 'fr', 'math'];

function parseSubjectParam(raw: string | null): SubjectSlug {
  if (raw && VALID_SUBJECTS.includes(raw as SubjectSlug)) {
    return raw as SubjectSlug;
  }
  return 'bio';
}

function SproutTutorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramSubject = searchParams.get('subject');

  const [selectedSlug, setSelectedSlug] = useState<SubjectSlug>(() =>
    parseSubjectParam(paramSubject)
  );
  const [inputMessage, setInputMessage] = useState<string>('');
  const [chatScreen, setChatScreen] = useState<ScreenState<TutorMessage[]>>({
    status: 'idle',
  });
  const [sendingStatus, setSendingStatus] = useState<'ready' | 'sending'>('ready');
  const [chatError, setChatError] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
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

  const activeSubject =
    SUBJECT_OPTIONS.find((s) => s.slug === selectedSlug) ?? SUBJECT_OPTIONS[0];

  async function sendPromptToTutor(textToSend: string) {
    const trimmed = textToSend.trim();
    if (!trimmed || sendingStatus === 'sending') return;

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setChatError(null);
    setLastFailedMessage(null);

    const currentMessages =
      chatScreen.status === 'success' ? chatScreen.data : [];
    const userMsg: TutorMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };

    const nextMessages = [...currentMessages, userMsg];
    setChatScreen({ status: 'success', data: nextMessages });
    setInputMessage('');
    setSendingStatus('sending');

    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          subjectSlug: activeSubject.slug,
          topicTitle: activeSubject.defaultTopic,
          message: trimmed,
          history: currentMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to fetch tutor response');
      }
      const json = await res.json();
      const assistantMsg: TutorMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        subjectLabel: activeSubject.label,
        content:
          json.reply ||
          'Let us break this concept down according to the IB Diploma markscheme.',
        keyTakeaways: json.keyTakeaways,
        followUpQuestion: json.followUpQuestion,
        markschemeTip: json.markschemeTip,
        mode: json.mode,
        modelUsed: json.modelUsed,
      };
      setChatScreen({
        status: 'success',
        data: [...nextMessages, assistantMsg],
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      const errorMsg =
        err instanceof Error && err.message
          ? err.message
          : 'Sprout AI Tutor encountered a connection issue. Please retry.';
      setLastFailedMessage(trimmed);
      if (currentMessages.length === 0) {
        setChatScreen({
          status: 'error',
          message: errorMsg,
        });
      } else {
        // Preserve student's existing multi-turn conversation so it is never wiped
        setChatScreen({
          status: 'success',
          data: nextMessages,
        });
        setChatError(errorMsg);
      }
    } finally {
      setSendingStatus('ready');
    }
  }

  function handleRetryLastPrompt() {
    if (!lastFailedMessage) return;
    const retryText = lastFailedMessage;
    if (chatScreen.status === 'success' && chatScreen.data.length > 0) {
      setChatScreen({
        status: 'success',
        data: chatScreen.data.slice(0, -1),
      });
    }
    setChatError(null);
    setLastFailedMessage(null);
    sendPromptToTutor(retryText);
  }

  return (
    <div className="main-pad !pt-[26px]">
      <div className="col-center flex flex-col">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#E4E4E7] pb-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#E4E4E7] bg-[#FAFAFA]">
              <SproutMascot pose="guide" size={38} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1
                  className="h-title !text-[24px]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Sprout Socratic AI Tutor
                </h1>
                <span className="rounded-full border border-[#A7F3D0] bg-[#ECFDF5] px-2.5 py-0.5 text-xs font-semibold text-[#065F46]">
                  IB Examiner Aligned
                </span>
              </div>
              <p className="text-[13px] text-[#71717A] mt-0.5">
                Ask subject-specific questions, decode IB markscheme phrasing, and practice with Socratic follow-ups.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              abortControllerRef.current?.abort();
              setChatError(null);
              setLastFailedMessage(null);
              setSendingStatus('ready');
              setChatScreen({ status: 'idle' });
            }}
            className="pill-btn self-start sm:self-auto"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>New Dialogue</span>
          </button>
        </div>

        {/* Subject Context Selector */}
        <div
          role="tablist"
          aria-label="Select IB subject context"
          className="mt-4 flex flex-wrap items-center gap-2"
        >
          {SUBJECT_OPTIONS.map((subj) => {
            const isSelected = subj.slug === selectedSlug;
            return (
              <button
                key={subj.slug}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedSlug(subj.slug)}
                className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] ${
                  isSelected
                    ? 'border-[#18181B] bg-[#18181B] text-white'
                    : 'border-[#E4E4E7] bg-white text-[#3F3F46] hover:bg-[#F4F4F5]'
                }`}
              >
                {subj.label}
              </button>
            );
          })}
        </div>

        {/* Chat Viewport */}
        <div className="mt-5 hairline-card flex min-h-[440px] flex-col justify-between p-5 sm:p-6">
          {chatScreen.status === 'idle' && (
            <div className="my-auto flex flex-col items-center justify-center py-8 text-center">
              <SproutMascot pose="snoozing" size={72} />
              <h2
                className="mt-4 text-base font-semibold text-[#18181B]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Sprout is snoozing until you pick a question
              </h2>
              <p className="mt-1 max-w-md text-[12.5px] text-[#71717A]">
                Active Context: <strong className="text-[#18181B]">{activeSubject.label}</strong> (
                <KaTeXText text={activeSubject.defaultTopic} as="span" />). Click a starter chip below or ask your own question.
              </p>

              {/* One-Click Starter Chips */}
              <div className="mt-6 flex max-w-2xl flex-wrap justify-center gap-2.5">
                {activeSubject.starterPrompts.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => sendPromptToTutor(chip)}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] px-3.5 py-2.5 text-left text-xs font-semibold text-[#18181B] transition-colors duration-150 hover:border-[#D4D4D8] hover:bg-[#F4F4F5] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
                  >
                    <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#D97706]" />
                    <KaTeXText text={chip} as="span" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {chatScreen.status === 'error' && (
            <div
              role="alert"
              className="my-auto flex items-center justify-between flex-wrap gap-3 rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4 text-xs text-[#B91C1C]"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-[#DC2626]" />
                <span>{chatScreen.message}</span>
              </div>
              {lastFailedMessage && (
                <button
                  type="button"
                  onClick={handleRetryLastPrompt}
                  className="pill-btn"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Retry</span>
                </button>
              )}
            </div>
          )}

          {chatScreen.status === 'success' && (
            <div className="space-y-5 overflow-y-auto pr-1">
              {chatScreen.data.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-3xl rounded-2xl p-4 ${
                      msg.role === 'user'
                        ? 'bg-[#18181B] text-white'
                        : 'border border-[#E4E4E7] bg-[#FAFAFA] text-[#18181B]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-wider opacity-75">
                      <span>
                        {msg.role === 'user'
                          ? 'You'
                          : `Sprout Tutor · ${msg.subjectLabel ?? activeSubject.label}`}
                      </span>
                      {msg.role === 'assistant' && msg.mode && (
                        <span className="rounded-full border border-[#E4E4E7] bg-white px-2 py-0.5 text-[10px] font-medium normal-case tracking-normal text-[#71717A]">
                          {msg.mode === 'gemini'
                            ? `Gemini (${msg.modelUsed || 'AI'})`
                            : 'Built-In Rubric'}
                        </span>
                      )}
                    </div>

                    <KaTeXText
                      text={msg.content}
                      className="mt-2 text-sm leading-relaxed"
                    />

                    {msg.keyTakeaways && msg.keyTakeaways.length > 0 && (
                      <div className="mt-4 rounded-xl border border-[#E4E4E7] bg-white p-3.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#18181B]">
                          <BookOpen className="h-3.5 w-3.5 text-[#059669]" />
                          <span>IB Markscheme Takeaways</span>
                        </div>
                        <ul className="mt-2 space-y-1.5 text-xs text-[#3F3F46]">
                          {msg.keyTakeaways.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="font-bold text-[#059669]">•</span>
                              <KaTeXText text={item} as="span" />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {msg.markschemeTip && (
                      <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-950">
                        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[#D97706]" />
                        <div>
                          <strong className="font-semibold">Examiner Trap Warning: </strong>
                          <KaTeXText text={msg.markschemeTip} as="span" />
                        </div>
                      </div>
                    )}

                    {msg.followUpQuestion && (
                      <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-xs text-emerald-950">
                        <span className="font-bold">Socratic Check: </span>
                        <KaTeXText text={msg.followUpQuestion} as="span" />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {sendingStatus === 'sending' && (
                <div className="h-24 w-2/3 animate-pulse rounded-2xl border border-[#E4E4E7] bg-[#F4F4F5] p-4" />
              )}

              {chatError && (
                <div
                  role="alert"
                  className="flex items-center justify-between flex-wrap gap-3 rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-3.5 text-xs text-[#B91C1C]"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-[#DC2626]" />
                    <span>{chatError}</span>
                  </div>
                  {lastFailedMessage && (
                    <button
                      type="button"
                      onClick={handleRetryLastPrompt}
                      disabled={sendingStatus === 'sending'}
                      className="pill-btn"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Retry</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Composer Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendPromptToTutor(inputMessage);
            }}
            className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 border-t border-[#F4F4F5] pt-4"
          >
            <input
              type="text"
              aria-label={`Ask Sprout about ${activeSubject.label}`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask Sprout about ${activeSubject.label} formulas, markschemes, or essay structures...`}
              className="min-w-0 w-full sm:w-auto sm:flex-1 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] px-4 py-2.5 text-sm text-[#18181B] placeholder:text-[#71717A] transition-colors duration-150 focus:border-[#18181B] focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
            />
            <button
              type="submit"
              disabled={sendingStatus === 'sending' || !inputMessage.trim()}
              aria-label="Send message to Sprout Tutor"
              className="pill-btn-dark w-full sm:w-auto justify-center !py-2.5 !px-4 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Ask Sprout</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function TutorSkeleton() {
  return (
    <div className="main-pad !pt-[26px]">
      <div className="col-center space-y-5">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-[#E4E4E7]" />
        <div className="h-96 animate-pulse rounded-[14px] border border-[#E4E4E7] bg-white" />
      </div>
    </div>
  );
}

export default function SproutTutorPage() {
  return (
    <Suspense fallback={<TutorSkeleton />}>
      <SproutTutorContent />
    </Suspense>
  );
}
