'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { KaTeXText } from '@/components/math/KaTeXText';
import { InteractiveMathDiagram } from '@/components/questions/InteractiveMathDiagram';
import type { MathDiagramSpec } from '@/content/schemas';
import type { ScreenState } from '@/types/fsm';

export interface QuestionRunnerItem {
  id: string;
  subjectSlug: string;
  topicId: string;
  subtopicCode?: string | null;
  topicCode: string;
  topicTitle: string;
  unitCode: string;
  levelScope: string;
  paper: string;
  questionType: string;
  calculatorPolicy: string;
  difficulty: string;
  marks: number;
  commandTerm: string;
  stemMarkdown: string;
  stimulusMarkdown?: string | null;
  diagramSpec?: MathDiagramSpec | null;
  options?: Array<{ id: 'A' | 'B' | 'C' | 'D'; text: string }> | null;
  correctOptionId?: 'A' | 'B' | 'C' | 'D' | null;
  markschemePoints: Array<{
    pointId: string;
    requirement: string;
    marks: number;
    notes?: string;
  }>;
  walkthroughSteps: Array<{
    stepNumber: number;
    title: string;
    explanationMarkdown: string;
  }>;
  commonPitfalls: string[];
  isDailyEligible?: boolean;
}

const GradeResultSchema = z.object({
  awardedMarks: z.number(),
  maxMarks: z.number(),
  matchedPoints: z.array(z.string()),
  missedPoints: z.array(z.string()),
  examinerFeedback: z.string(),
  improvementTip: z.string().default(''),
  mode: z.enum(['gemini', 'deterministic_fallback']).default('deterministic_fallback'),
  modelUsed: z.string().optional(),
});

type GradeResult = z.infer<typeof GradeResultSchema>;

const MistakeEntrySchema = z.object({
  id: z.string(),
  questionId: z.string(),
  userAnswer: z.string().default(''),
  missedConcepts: z.array(z.string()).default([]),
  resolved: z.number().default(0),
  question: z
    .object({
      id: z.string(),
      subjectSlug: z.string(),
      paper: z.string(),
      marks: z.number(),
      stemMarkdown: z.string(),
    })
    .passthrough(),
});

const MistakesResponseSchema = z.object({
  mistakes: z.array(MistakeEntrySchema).default([]),
});

type MistakeEntry = z.infer<typeof MistakeEntrySchema>;

const VALID_SUBJECT_SLUGS = new Set([
  'bio',
  'chem',
  'hist',
  'eng',
  'fr',
  'math',
]);

const FILTER_SELECT_CLASS =
  'w-full sm:w-auto max-w-full px-3 py-1.5 rounded-full border border-[#E4E4E7] bg-[#FFFFFF] text-[12px] font-medium text-[#18181B] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] cursor-pointer';

const SUBJECT_NAMES: Record<string, string> = {
  bio: 'Biology HL',
  chem: 'Chemistry SL',
  hist: 'History HL',
  eng: 'English Literature HL',
  fr: 'French B SL',
  math: 'Math AA SL',
};

interface TopicOption {
  id: string;
  subjectSlug: string;
  unitCode: string;
  unitTitle: string;
  code: string;
  title: string;
  levelScope: string;
}

interface QuestionRunnerClientProps {
  initialQuestions: QuestionRunnerItem[];
  initialSubject?: string;
  initialTopicId?: string;
  initialPaper?: string;
  initialMode?: string;
  initialQuestionId?: string;
  initialHasDiagram?: boolean;
  serverPaginated?: boolean;
  initialTotalCount?: number;
  initialPage?: number;
  initialPageSize?: number;
  initialTotalPages?: number;
  availableTopics?: TopicOption[];
}

type RunnerMode = 'practice' | 'exam' | 'mistakes' | 'daily';

type MistakeSaveState =
  | { status: 'idle' }
  | { status: 'saving' }
  | { status: 'saved'; message: string }
  | { status: 'error'; message: string };

type ExamSaveState =
  | { status: 'idle' }
  | { status: 'saving' }
  | { status: 'saved'; message: string }
  | { status: 'error'; message: string };

interface ExamQuestionDraft {
  userAnswer: string;
  selectedOption: string | null;
  gradeState: ScreenState<GradeResult>;
  showMarkscheme: boolean;
  showWalkthrough: boolean;
}

export function normalizeRunnerMode(rawMode?: string): {
  mode: RunnerMode;
  openWalkthrough: boolean;
} {
  const normalized = rawMode?.trim().toLowerCase();
  if (
    normalized === 'exam' ||
    normalized === 'mistakes' ||
    normalized === 'daily'
  ) {
    return { mode: normalized, openWalkthrough: false };
  }
  if (normalized === 'walkthrough') {
    return { mode: 'practice', openWalkthrough: true };
  }
  return { mode: 'practice', openWalkthrough: false };
}

export function pickDailyQuestions(
  list: QuestionRunnerItem[],
  limit = 5
): QuestionRunnerItem[] {
  const eligible = list.filter((q) => q.isDailyEligible !== false);
  const pool = eligible.length > 0 ? eligible : list;
  if (pool.length <= limit) return pool;

  const bySubject = new Map<string, QuestionRunnerItem[]>();
  for (const item of pool) {
    const queue = bySubject.get(item.subjectSlug) ?? [];
    queue.push(item);
    bySubject.set(item.subjectSlug, queue);
  }

  const picked: QuestionRunnerItem[] = [];
  const queues = Array.from(bySubject.values());
  let round = 0;
  while (picked.length < limit) {
    let addedInRound = false;
    for (const queue of queues) {
      if (round < queue.length) {
        picked.push(queue[round]);
        addedInRound = true;
        if (picked.length >= limit) break;
      }
    }
    if (!addedInRound) break;
    round += 1;
  }
  return picked;
}

export function filterQuestions(
  list: QuestionRunnerItem[],
  filters: {
    subject: string;
    topicId: string;
    paper: string;
    difficulty: string;
  }
): QuestionRunnerItem[] {
  return list.filter((q) => {
    if (filters.subject !== 'all' && q.subjectSlug !== filters.subject) {
      return false;
    }
    if (filters.topicId && filters.topicId !== 'all' && q.topicId !== filters.topicId) {
      return false;
    }
    if (
      filters.paper !== 'all' &&
      !q.paper.toLowerCase().includes(filters.paper.toLowerCase())
    ) {
      return false;
    }
    if (filters.difficulty !== 'all' && q.difficulty !== filters.difficulty) {
      return false;
    }
    return true;
  });
}

export function QuestionRunnerClient({
  initialQuestions,
  initialSubject = 'all',
  initialTopicId = 'all',
  initialPaper = 'all',
  initialMode = 'practice',
  initialQuestionId,
  initialHasDiagram = false,
  serverPaginated = false,
  initialTotalCount,
  initialPage = 1,
  initialPageSize = 25,
  initialTotalPages = 1,
  availableTopics = [],
}: QuestionRunnerClientProps) {
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;

  const initialModeNormalized = normalizeRunnerMode(initialMode);
  const [mode, setMode] = useState<RunnerMode>(initialModeNormalized.mode);
  const [subjectFilter, setSubjectFilter] = useState(initialSubject);
  const [topicFilter, setTopicFilter] = useState(initialTopicId);
  const [paperFilter, setPaperFilter] = useState(initialPaper);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [diagramOnly, setDiagramOnly] = useState(initialHasDiagram);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [loadedQuestions, setLoadedQuestions] =
    useState<QuestionRunnerItem[]>(initialQuestions);
  const [serverFetchState, setServerFetchState] = useState<
    ScreenState<QuestionRunnerItem[]>
  >(() =>
    initialQuestions.length > 0
      ? { status: 'success', data: initialQuestions }
      : { status: 'empty', message: 'No questions match these filters.' }
  );
  const [serverPage, setServerPage] = useState(initialPage);
  const [serverTotalCount, setServerTotalCount] = useState(
    initialTotalCount ?? initialQuestions.length
  );
  const [serverTotalPages, setServerTotalPages] = useState(initialTotalPages);
  const [serverQueryTrigger, setServerQueryTrigger] = useState(0);
  const [shuffleNextFetch, setShuffleNextFetch] = useState(false);
  const pendingLandingRef = useRef<'first' | 'last'>('first');
  const buildQueryKey = (
    m: RunnerMode,
    subj: string,
    top: string,
    pap: string,
    diff: string,
    diag: boolean,
    qStr: string,
    pg: number,
    trig: number
  ) => `${m}|${subj}|${top}|${pap}|${diff}|${diag ? '1' : '0'}|${qStr}|${pg}|${trig}`;
  const lastFetchedKeyRef = useRef<string>(
    buildQueryKey(
      initialModeNormalized.mode,
      initialSubject,
      initialTopicId,
      initialPaper,
      'all',
      initialHasDiagram,
      '',
      initialPage,
      0
    )
  );

  const questions = serverPaginated ? loadedQuestions : initialQuestions;
  const [currentIndex, setCurrentIndex] = useState(() => {
    const initialFiltered = filterQuestions(initialQuestions, {
      subject: initialSubject,
      topicId: initialTopicId,
      paper: initialPaper,
      difficulty: 'all',
    });
    const initialActive =
      initialModeNormalized.mode === 'daily'
        ? pickDailyQuestions(initialFiltered)
        : initialFiltered;
    if (initialQuestionId) {
      const idx = initialActive.findIndex((q) => q.id === initialQuestionId);
      if (idx >= 0) return idx;
    }
    return 0;
  });

  const [userAnswer, setUserAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showMarkscheme, setShowMarkscheme] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(
    initialModeNormalized.openWalkthrough
  );
  const [gradeState, setGradeState] = useState<ScreenState<GradeResult>>({
    status: 'idle',
  });
  const [attemptSaveError, setAttemptSaveError] = useState<string | null>(null);
  const [mistakeSaveState, setMistakeSaveState] = useState<MistakeSaveState>({
    status: 'idle',
  });
  const [examDrafts, setExamDrafts] = useState<
    Record<string, ExamQuestionDraft>
  >({});
  const [examSaveState, setExamSaveState] = useState<ExamSaveState>({
    status: 'idle',
  });
  const [mistakeToggleError, setMistakeToggleError] = useState<string | null>(
    null
  );

  const gradeAbortRef = useRef<AbortController | null>(null);
  const mistakeAbortRef = useRef<AbortController | null>(null);
  const examAbortRef = useRef<AbortController | null>(null);
  const mistakeUpdateAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      gradeAbortRef.current?.abort();
      mistakeAbortRef.current?.abort();
      examAbortRef.current?.abort();
      mistakeUpdateAbortRef.current?.abort();
    };
  }, []);

  // Sync URL search params when client-side navigation updates props
  const urlPropKey = `${initialSubject}|${initialTopicId}|${initialPaper}|${initialMode}|${initialQuestionId ?? ''}`;
  const prevUrlPropKeyRef = useRef(urlPropKey);
  useEffect(() => {
    if (prevUrlPropKeyRef.current === urlPropKey) return;
    prevUrlPropKeyRef.current = urlPropKey;

    const nextModeNorm = normalizeRunnerMode(initialMode);
    const nextFiltered = filterQuestions(questions, {
      subject: initialSubject,
      topicId: initialTopicId,
      paper: initialPaper,
      difficulty: 'all',
    });
    const nextActive =
      nextModeNorm.mode === 'daily'
        ? pickDailyQuestions(nextFiltered)
        : nextFiltered;
    let nextIdx = 0;
    if (initialQuestionId) {
      const found = nextActive.findIndex((q) => q.id === initialQuestionId);
      if (found >= 0) nextIdx = found;
    }

    setMode(nextModeNorm.mode);
    setSubjectFilter(initialSubject);
    setTopicFilter(initialTopicId);
    setPaperFilter(initialPaper);
    setDifficultyFilter('all');
    setDiagramOnly(initialHasDiagram);
    setSearchInput('');
    setDebouncedSearch('');
    setServerPage(initialPage);
    if (serverPaginated) {
      lastFetchedKeyRef.current = buildQueryKey(
        nextModeNorm.mode,
        initialSubject,
        initialTopicId,
        initialPaper,
        'all',
        initialHasDiagram,
        '',
        initialPage,
        serverQueryTrigger
      );
      setLoadedQuestions(initialQuestions);
      setServerTotalCount(initialTotalCount ?? initialQuestions.length);
      setServerTotalPages(initialTotalPages);
      setServerFetchState(
        initialQuestions.length > 0
          ? { status: 'success', data: initialQuestions }
          : { status: 'empty', message: 'No questions match these filters.' }
      );
    }
    setCurrentIndex(nextIdx);
    setExamDrafts({});
    setExamSaveState({ status: 'idle' });
    resetQuestionUiState(nextModeNorm.openWalkthrough);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlPropKey]);

  // Debounce free-text search in server-paginated mode
  useEffect(() => {
    if (!serverPaginated) return;
    const trimmed = searchInput.trim();
    if (trimmed === debouncedSearch) return;
    const handle = setTimeout(() => {
      setDebouncedSearch(trimmed);
      setServerPage(1);
    }, 250);
    return () => clearTimeout(handle);
  }, [searchInput, debouncedSearch, serverPaginated]);

  // Fetch server-paginated question slice when filters, mode, or page change
  useEffect(() => {
    if (!serverPaginated) return;
    if (mode === 'mistakes') return;
    const queryKey = buildQueryKey(
      mode,
      subjectFilter,
      topicFilter,
      paperFilter,
      difficultyFilter,
      diagramOnly,
      debouncedSearch,
      serverPage,
      serverQueryTrigger
    );
    if (queryKey === lastFetchedKeyRef.current) {
      return;
    }
    lastFetchedKeyRef.current = queryKey;

    const controller = new AbortController();
    setServerFetchState({ status: 'loading' });

    const qs = new URLSearchParams();
    if (subjectFilter !== 'all') qs.set('subject', subjectFilter);
    if (topicFilter !== 'all') qs.set('topicId', topicFilter);
    if (paperFilter !== 'all') qs.set('paper', paperFilter);
    if (difficultyFilter !== 'all') qs.set('difficulty', difficultyFilter);
    if (diagramOnly) qs.set('hasDiagram', '1');
    if (debouncedSearch) qs.set('q', debouncedSearch);
    qs.set('mode', mode);
    qs.set('page', String(serverPage));
    qs.set('limit', String(mode === 'exam' ? 15 : initialPageSize));
    if (shuffleNextFetch) qs.set('shuffle', '1');

    fetch(`/api/questions?${qs.toString()}`, { signal: controller.signal })
      .then(async (res) => {
        if (res.status === 401) {
          routerRef.current.push('/login');
          return null;
        }
        if (!res.ok) {
          throw new Error('Could not load questions.');
        }
        return await res.json();
      })
      .then((data) => {
        if (!data || controller.signal.aborted) return;
        const list = Array.isArray(data.questions)
          ? (data.questions as QuestionRunnerItem[])
          : [];
        const total =
          typeof data.totalCount === 'number' ? data.totalCount : list.length;
        const nextTotalPages =
          typeof data.totalPages === 'number' ? data.totalPages : 1;
        setLoadedQuestions(list);
        setServerTotalCount(total);
        setServerTotalPages(nextTotalPages);
        setShuffleNextFetch(false);
        const landing = pendingLandingRef.current;
        pendingLandingRef.current = 'first';
        setCurrentIndex(
          landing === 'last' && list.length > 0 ? list.length - 1 : 0
        );
        resetQuestionUiState();
        if (list.length === 0) {
          setServerFetchState({
            status: 'empty',
            message: 'No questions match your current filters.',
          });
        } else {
          setServerFetchState({ status: 'success', data: list });
        }
      })
      .catch((err) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        if (!controller.signal.aborted) {
          setShuffleNextFetch(false);
          setServerFetchState({
            status: 'error',
            message:
              err instanceof Error
                ? err.message
                : 'Failed to load questions from server.',
          });
        }
      });

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    serverPaginated,
    mode,
    subjectFilter,
    topicFilter,
    paperFilter,
    difficultyFilter,
    diagramOnly,
    debouncedSearch,
    serverPage,
    serverQueryTrigger,
  ]);

  // Mistakes log items with AbortController + 401 + error/loading FSM
  const [mistakesState, setMistakesState] = useState<ScreenState<MistakeEntry[]>>(
    () => ({
      status: initialModeNormalized.mode === 'mistakes' ? 'loading' : 'idle',
    })
  );
  const [mistakesReloadKey, setMistakesReloadKey] = useState(0);

  useEffect(() => {
    if (mode !== 'mistakes') return;
    const controller = new AbortController();
    setMistakesState({ status: 'loading' });
    setMistakeToggleError(null);

    fetch(`/api/mistakes?subject=${encodeURIComponent(subjectFilter)}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        if (res.status === 401) {
          routerRef.current.push('/login');
          return null;
        }
        if (!res.ok) {
          throw new Error('Could not load Mistakes Log.');
        }
        return await res.json();
      })
      .then((raw) => {
        if (!raw || controller.signal.aborted) return;
        const parsed = MistakesResponseSchema.safeParse(raw);
        if (!parsed.success) {
          setMistakesState({
            status: 'error',
            message: 'Received unexpected Mistakes Log data. Please retry.',
          });
          return;
        }
        const list = parsed.data.mistakes;
        if (list.length === 0) {
          setMistakesState({
            status: 'empty',
            message: 'No logged mistakes yet.',
          });
        } else {
          setMistakesState({ status: 'success', data: list });
        }
      })
      .catch((err) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        if (!controller.signal.aborted) {
          setMistakesState({
            status: 'error',
            message:
              err instanceof Error
                ? err.message
                : 'Failed to load Mistakes Log.',
          });
        }
      });

    return () => {
      controller.abort();
    };
  }, [mode, subjectFilter, mistakesReloadKey]);

  // Filter questions client-side (only when using inline test initialQuestions;
  // serverPaginated mode returns exact SQL-filtered pages directly)
  const filteredQuestions = useMemo(
    () =>
      serverPaginated
        ? questions
        : filterQuestions(questions, {
            subject: subjectFilter,
            topicId: topicFilter,
            paper: paperFilter,
            difficulty: difficultyFilter,
          }),
    [
      serverPaginated,
      questions,
      subjectFilter,
      topicFilter,
      paperFilter,
      difficultyFilter,
    ]
  );

  const activeQuestions = useMemo(
    () =>
      !serverPaginated && mode === 'daily'
        ? pickDailyQuestions(filteredQuestions)
        : filteredQuestions,
    [serverPaginated, mode, filteredQuestions]
  );

  const visibleTopics = useMemo(
    () =>
      subjectFilter === 'all'
        ? availableTopics
        : availableTopics.filter((t) => t.subjectSlug === subjectFilter),
    [availableTopics, subjectFilter]
  );

  const safeIndex =
    activeQuestions.length > 0
      ? ((currentIndex % activeQuestions.length) + activeQuestions.length) %
        activeQuestions.length
      : 0;
  const currentQuestion = activeQuestions[safeIndex] ?? null;

  function resetQuestionUiState(openWalkthrough = false) {
    gradeAbortRef.current?.abort();
    mistakeAbortRef.current?.abort();
    setUserAnswer('');
    setSelectedOption(null);
    setShowMarkscheme(false);
    setShowWalkthrough(openWalkthrough);
    setGradeState({ status: 'idle' });
    setAttemptSaveError(null);
    setMistakeSaveState({ status: 'idle' });
  }

  function selectQuestionIndex(nextIdx: number) {
    if (mode === 'exam' && currentQuestion) {
      const snapshot: ExamQuestionDraft = {
        userAnswer,
        selectedOption,
        gradeState:
          gradeState.status === 'loading' ? { status: 'idle' } : gradeState,
        showMarkscheme,
        showWalkthrough,
      };
      const normalizedIdx =
        activeQuestions.length > 0
          ? ((nextIdx % activeQuestions.length) + activeQuestions.length) %
            activeQuestions.length
          : 0;
      const targetQuestion = activeQuestions[normalizedIdx];
      const nextDrafts = { ...examDrafts, [currentQuestion.id]: snapshot };
      setExamDrafts(nextDrafts);

      const savedDraft = targetQuestion ? nextDrafts[targetQuestion.id] : undefined;
      gradeAbortRef.current?.abort();
      mistakeAbortRef.current?.abort();
      setCurrentIndex(nextIdx);
      setUserAnswer(savedDraft?.userAnswer ?? '');
      setSelectedOption(savedDraft?.selectedOption ?? null);
      setShowMarkscheme(savedDraft?.showMarkscheme ?? false);
      setShowWalkthrough(savedDraft?.showWalkthrough ?? false);
      setGradeState(savedDraft?.gradeState ?? { status: 'idle' });
      setAttemptSaveError(null);
      setMistakeSaveState({ status: 'idle' });
      return;
    }

    setCurrentIndex(nextIdx);
    resetQuestionUiState();
  }

  function handleResetFilters() {
    setSubjectFilter('all');
    setTopicFilter('all');
    setPaperFilter('all');
    setDifficultyFilter('all');
    setDiagramOnly(false);
    setSearchInput('');
    setDebouncedSearch('');
    setServerPage(1);
    setCurrentIndex(0);
    setExamDrafts({});
    setExamSaveState({ status: 'idle' });
    resetQuestionUiState();
  }

  async function persistQuestionAttempt(
    payload: {
      questionId: string;
      userAnswer: string;
      awardedMarks: number;
      maxMarks: number;
      matchedPoints: string[];
      missedPoints: string[];
      aiFeedbackMarkdown: string;
      durationSeconds: number;
    },
    signal?: AbortSignal
  ): Promise<boolean> {
    try {
      const res = await fetch('/api/questions/attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal,
      });
      if (res.status === 401) {
        routerRef.current.push('/login');
        return false;
      }
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setAttemptSaveError(
          errData.error ??
            'Answer graded, but your attempt could not be saved to your progress log.'
        );
        return false;
      }
      setAttemptSaveError(null);
      return true;
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return false;
      setAttemptSaveError(
        'Answer graded, but a network error prevented saving your attempt.'
      );
      return false;
    }
  }

  async function handleGradeAnswer() {
    if (!currentQuestion) return;

    const durationSeconds = 0;

    if (
      currentQuestion.questionType === 'mcq' &&
      currentQuestion.options &&
      currentQuestion.correctOptionId
    ) {
      const chosen = selectedOption ?? userAnswer.trim().toUpperCase();
      if (!chosen) {
        setGradeState({
          status: 'error',
          message: 'Select an answer option (A–D) before grading.',
        });
        return;
      }

      const isCorrect = chosen === currentQuestion.correctOptionId;
      const result: GradeResult = {
        awardedMarks: isCorrect ? currentQuestion.marks : 0,
        maxMarks: currentQuestion.marks,
        matchedPoints: isCorrect
          ? currentQuestion.markschemePoints.map(
              (p) => `${p.pointId}: ${p.requirement}`
            )
          : [],
        missedPoints: isCorrect
          ? []
          : currentQuestion.markschemePoints.map(
              (p) => `${p.pointId}: ${p.requirement}`
            ),
        examinerFeedback: isCorrect
          ? `Correct (${currentQuestion.correctOptionId}). Full credit awarded.`
          : `Option ${chosen} is incorrect. The correct option is ${currentQuestion.correctOptionId}.`,
        improvementTip:
          currentQuestion.commonPitfalls[0] ??
          'Check the step-by-step walkthrough below.',
        mode: 'deterministic_fallback',
      };

      gradeAbortRef.current?.abort();
      const controller = new AbortController();
      gradeAbortRef.current = controller;

      const nextGrade: ScreenState<GradeResult> = {
        status: 'success',
        data: result,
      };
      setGradeState(nextGrade);
      setShowMarkscheme(true);
      setAttemptSaveError(null);
      if (mode === 'exam') {
        setExamDrafts((prev) => ({
          ...prev,
          [currentQuestion.id]: {
            userAnswer,
            selectedOption: chosen,
            gradeState: nextGrade,
            showMarkscheme: true,
            showWalkthrough,
          },
        }));
      }

      await persistQuestionAttempt(
        {
          questionId: currentQuestion.id,
          userAnswer: chosen,
          awardedMarks: result.awardedMarks,
          maxMarks: result.maxMarks,
          matchedPoints: result.matchedPoints,
          missedPoints: result.missedPoints,
          aiFeedbackMarkdown: result.examinerFeedback,
          durationSeconds,
        },
        controller.signal
      );
      return;
    }

    if (!userAnswer.trim()) {
      setGradeState({
        status: 'error',
        message: 'Write your response before grading against the IB markscheme.',
      });
      return;
    }

    gradeAbortRef.current?.abort();
    const controller = new AbortController();
    gradeAbortRef.current = controller;

    setGradeState({ status: 'loading' });
    setAttemptSaveError(null);
    try {
      const res = await fetch('/api/ai/grade-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          subjectSlug: currentQuestion.subjectSlug,
          commandTerm: currentQuestion.commandTerm,
          stemMarkdown: currentQuestion.stemMarkdown,
          marks: currentQuestion.marks,
          userAnswer,
          markschemePoints: currentQuestion.markschemePoints,
        }),
        signal: controller.signal,
      });
      if (res.status === 401) {
        routerRef.current.push('/login');
        return;
      }
      const raw = await res.json().catch(() => ({}));
      if (controller.signal.aborted) return;
      if (!res.ok) {
        setGradeState({
          status: 'error',
          message:
            typeof raw?.error === 'string'
              ? raw.error
              : 'Could not grade response.',
        });
        return;
      }
      const parsedGrade = GradeResultSchema.safeParse(raw);
      if (!parsedGrade.success) {
        setGradeState({
          status: 'error',
          message: 'Received unexpected grading format. Please retry.',
        });
        return;
      }
      const data = parsedGrade.data;
      const nextGrade: ScreenState<GradeResult> = { status: 'success', data };
      setGradeState(nextGrade);
      if (mode === 'exam') {
        setExamDrafts((prev) => ({
          ...prev,
          [currentQuestion.id]: {
            userAnswer,
            selectedOption,
            gradeState: nextGrade,
            showMarkscheme,
            showWalkthrough,
          },
        }));
      }

      await persistQuestionAttempt(
        {
          questionId: currentQuestion.id,
          userAnswer,
          awardedMarks: data.awardedMarks,
          maxMarks: data.maxMarks,
          matchedPoints: data.matchedPoints,
          missedPoints: data.missedPoints,
          aiFeedbackMarkdown: data.examinerFeedback,
          durationSeconds,
        },
        controller.signal
      );
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setGradeState({
        status: 'error',
        message: 'Network error while grading answer.',
      });
    }
  }

  async function handleSaveToMistakesLog() {
    if (!currentQuestion || mistakeSaveState.status === 'saving') return;
    const missed =
      gradeState.status === 'success' && gradeState.data.missedPoints.length > 0
        ? gradeState.data.missedPoints
        : currentQuestion.markschemePoints.map((p) => p.requirement);

    mistakeAbortRef.current?.abort();
    const controller = new AbortController();
    mistakeAbortRef.current = controller;

    setMistakeSaveState({ status: 'saving' });
    try {
      const res = await fetch('/api/mistakes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          userAnswer: selectedOption ?? userAnswer,
          missedConcepts: missed,
        }),
        signal: controller.signal,
      });
      if (res.status === 401) {
        routerRef.current.push('/login');
        return;
      }
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.error ?? 'Could not save question to Mistakes Log.'
        );
      }
      if (!controller.signal.aborted) {
        setMistakeSaveState({
          status: 'saved',
          message: 'Saved to Mistakes Log for spaced redo.',
        });
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setMistakeSaveState({
        status: 'error',
        message:
          err instanceof Error
            ? err.message
            : 'Network error while saving to Mistakes Log.',
      });
    }
  }

  async function handleSaveExamSession() {
    if (activeQuestions.length === 0 || examSaveState.status === 'saving') {
      return;
    }
    const candidateSlug =
      subjectFilter !== 'all'
        ? subjectFilter
        : activeQuestions[0]?.subjectSlug ?? 'bio';
    const resolvedSubject = VALID_SUBJECT_SLUGS.has(candidateSlug)
      ? candidateSlug
      : 'bio';
    const totalMarks = activeQuestions.reduce((acc, q) => acc + q.marks, 0);
    const timeLimitMinutes = Math.max(10, Math.round(totalMarks * 1.5));

    examAbortRef.current?.abort();
    const controller = new AbortController();
    examAbortRef.current = controller;

    setExamSaveState({ status: 'saving' });
    try {
      const res = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectSlug: resolvedSubject,
          title: `${SUBJECT_NAMES[resolvedSubject] ?? resolvedSubject} Custom Mock (${activeQuestions.length}Q)`,
          paperFilter: paperFilter === 'all' ? 'All Papers' : paperFilter,
          timeLimitMinutes,
          questionIds: activeQuestions.map((q) => q.id),
        }),
        signal: controller.signal,
      });
      if (res.status === 401) {
        routerRef.current.push('/login');
        return;
      }
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error ?? 'Could not save mock exam session.');
      }
      if (!controller.signal.aborted) {
        setExamSaveState({
          status: 'saved',
          message: `Mock session saved (${timeLimitMinutes} min limit).`,
        });
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setExamSaveState({
        status: 'error',
        message:
          err instanceof Error
            ? err.message
            : 'Network error while saving mock session.',
      });
    }
  }

  async function handleToggleMistakeResolved(entry: MistakeEntry) {
    if (mistakesState.status !== 'success') return;
    const prevResolved = entry.resolved;
    const nextResolved = prevResolved ? 0 : 1;
    setMistakeToggleError(null);

    setMistakesState((prev) =>
      prev.status === 'success'
        ? {
            status: 'success',
            data: prev.data.map((item) =>
              item.id === entry.id ? { ...item, resolved: nextResolved } : item
            ),
          }
        : prev
    );

    mistakeUpdateAbortRef.current?.abort();
    const controller = new AbortController();
    mistakeUpdateAbortRef.current = controller;

    try {
      const res = await fetch('/api/mistakes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: entry.id, resolved: Boolean(nextResolved) }),
        signal: controller.signal,
      });
      if (res.status === 401) {
        routerRef.current.push('/login');
        return;
      }
      if (!res.ok) {
        throw new Error('Could not update mistake status.');
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setMistakesState((prev) =>
        prev.status === 'success'
          ? {
              status: 'success',
              data: prev.data.map((item) =>
                item.id === entry.id
                  ? { ...item, resolved: prevResolved }
                  : item
              ),
            }
          : prev
      );
      setMistakeToggleError('Could not update mistake status. Please retry.');
    }
  }

  async function handleRedoMistake(questionId: string) {
    const idx = questions.findIndex((q) => q.id === questionId);
    if (idx >= 0) {
      setSubjectFilter('all');
      setTopicFilter('all');
      setPaperFilter('all');
      setDifficultyFilter('all');
      setDiagramOnly(false);
      setSearchInput('');
      setDebouncedSearch('');
      setMode('practice');
      selectQuestionIndex(idx);
      return;
    }

    if (!serverPaginated) {
      setMistakeToggleError('This question is outside the current practice pack.');
      return;
    }

    try {
      const res = await fetch(
        `/api/questions?questionId=${encodeURIComponent(questionId)}`
      );
      if (res.status === 401) {
        routerRef.current.push('/login');
        return;
      }
      if (!res.ok) {
        throw new Error('Could not load target question.');
      }
      const data = await res.json();
      const loaded = Array.isArray(data?.questions)
        ? (data.questions as QuestionRunnerItem[])
        : [];
      if (loaded.length === 0) {
        setMistakeToggleError('This question could not be found in the bank.');
        return;
      }
      lastFetchedKeyRef.current = buildQueryKey(
        'practice',
        'all',
        'all',
        'all',
        'all',
        false,
        '',
        1,
        serverQueryTrigger
      );
      setSubjectFilter('all');
      setTopicFilter('all');
      setPaperFilter('all');
      setDifficultyFilter('all');
      setDiagramOnly(false);
      setSearchInput('');
      setDebouncedSearch('');
      setLoadedQuestions(loaded);
      setServerTotalCount(1);
      setServerPage(1);
      setServerTotalPages(1);
      setServerFetchState({ status: 'success', data: loaded });
      setMode('practice');
      setCurrentIndex(0);
      resetQuestionUiState();
    } catch (err) {
      setMistakeToggleError(
        err instanceof Error
          ? err.message
          : 'Could not load question for redo.'
      );
    }
  }

  function stepQuestion(delta: -1 | 1) {
    if (
      serverPaginated &&
      mode === 'practice' &&
      activeQuestions.length > 0
    ) {
      if (delta === 1 && safeIndex >= activeQuestions.length - 1) {
        if (serverPage < serverTotalPages) {
          pendingLandingRef.current = 'first';
          setServerPage((p) => p + 1);
          return;
        }
      } else if (delta === -1 && safeIndex <= 0) {
        if (serverPage > 1) {
          pendingLandingRef.current = 'last';
          setServerPage((p) => p - 1);
          return;
        }
      }
    }
    selectQuestionIndex(
      (safeIndex + delta + activeQuestions.length) %
        Math.max(1, activeQuestions.length)
    );
  }

  return (
    <div className="main-pad !pt-[26px]">
      <div className="col-center min-w-0">
        {/* Top Mode & Filter Strip */}
        <div className="flex items-center justify-between gap-3 flex-wrap mb-4 pb-3 border-b border-[#F4F4F5]">
          <div
            role="tablist"
            aria-label="Question Runner Modes"
            className="flex flex-wrap sm:inline-flex gap-1 p-1 rounded-2xl sm:rounded-full bg-[#F4F4F5] max-w-full"
          >
            {[
              { id: 'practice', label: 'Question Runner' },
              { id: 'daily', label: 'Sprout Daily #2' },
              { id: 'exam', label: 'Exam Builder' },
              { id: 'mistakes', label: 'Mistakes Log' },
            ].map((m) => (
              <button
                key={m.id}
                id={`runner-tab-${m.id}`}
                type="button"
                role="tab"
                aria-selected={mode === m.id}
                aria-controls={`runner-panel-${m.id}`}
                onClick={() => {
                  const next = m.id as RunnerMode;
                  setMode(next);
                  if (serverPaginated) {
                    setServerPage(1);
                  }
                }}
                className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] cursor-pointer ${
                  mode === m.id
                    ? 'bg-[#FFFFFF] text-[#18181B]'
                    : 'text-[#71717A] hover:text-[#18181B]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <select
              value={subjectFilter}
              onChange={(e) => {
                setSubjectFilter(e.target.value);
                setTopicFilter('all');
                setServerPage(1);
                setExamDrafts({});
                setExamSaveState({ status: 'idle' });
                selectQuestionIndex(0);
              }}
              aria-label="Filter by Subject"
              className={FILTER_SELECT_CLASS}
            >
              <option value="all">All 6 IB Subjects</option>
              <option value="bio">Biology HL</option>
              <option value="chem">Chemistry SL</option>
              <option value="hist">History HL</option>
              <option value="eng">English Literature HL</option>
              <option value="fr">French B SL</option>
              <option value="math">Math AA SL</option>
            </select>

            {mode !== 'mistakes' && (
              <>
                {visibleTopics.length > 0 && (
                  <select
                    value={topicFilter}
                    onChange={(e) => {
                      setTopicFilter(e.target.value);
                      setServerPage(1);
                      setExamDrafts({});
                      setExamSaveState({ status: 'idle' });
                      selectQuestionIndex(0);
                    }}
                    aria-label="Filter by Topic"
                    className={`${FILTER_SELECT_CLASS} max-w-[220px] truncate`}
                  >
                    <option value="all">All Topics</option>
                    {visibleTopics.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.code} · {t.title}
                      </option>
                    ))}
                  </select>
                )}

                <select
                  value={paperFilter}
                  onChange={(e) => {
                    setPaperFilter(e.target.value);
                    setServerPage(1);
                    setExamDrafts({});
                    setExamSaveState({ status: 'idle' });
                    selectQuestionIndex(0);
                  }}
                  aria-label="Filter by Paper"
                  className={FILTER_SELECT_CLASS}
                >
                  <option value="all">All Papers</option>
                  <option value="Paper 1">Paper 1 / 1A / 1B</option>
                  <option value="Paper 2">Paper 2</option>
                  <option value="Paper 3">Paper 3 (HL)</option>
                </select>

                <select
                  value={difficultyFilter}
                  onChange={(e) => {
                    setDifficultyFilter(e.target.value);
                    setServerPage(1);
                    setExamDrafts({});
                    setExamSaveState({ status: 'idle' });
                    selectQuestionIndex(0);
                  }}
                  aria-label="Filter by Difficulty"
                  className={FILTER_SELECT_CLASS}
                >
                  <option value="all">All Difficulties</option>
                  <option value="foundation">Foundation</option>
                  <option value="standard">Standard IB</option>
                  <option value="challenging">Challenging (7-Level)</option>
                </select>

                {serverPaginated && (
                  <>
                    <button
                      type="button"
                      aria-pressed={diagramOnly}
                      onClick={() => {
                        setDiagramOnly((v) => !v);
                        setServerPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-full border text-[12px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] cursor-pointer ${
                        diagramOnly
                          ? 'bg-[#FEF3C7] border-[#D97706] text-[#92400E]'
                          : 'bg-[#FFFFFF] border-[#E4E4E7] text-[#3F3F46] hover:bg-[#F4F4F5]'
                      }`}
                    >
                      Interactive Diagrams
                    </button>

                    <input
                      type="search"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Search questions..."
                      aria-label="Search questions"
                      className="w-full sm:w-44 px-3 py-1.5 rounded-full border border-[#E4E4E7] bg-[#FFFFFF] text-[12px] text-[#18181B] placeholder:text-[#71717A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] transition-colors duration-150"
                    />
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {topicFilter !== 'all' && mode !== 'mistakes' && (
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] px-3 py-2 text-xs text-[#3F3F46]">
            <span>
              Filtered to topic: <strong className="font-mono">{topicFilter}</strong>
            </span>
            <button
              type="button"
              onClick={() => {
                setTopicFilter('all');
                setExamDrafts({});
                setExamSaveState({ status: 'idle' });
                selectQuestionIndex(0);
              }}
              className="text-xs font-semibold text-[#18181B] underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] rounded cursor-pointer"
            >
              Clear topic filter
            </button>
          </div>
        )}

        {mode === 'mistakes' ? (
          <div
            role="tabpanel"
            id="runner-panel-mistakes"
            aria-labelledby="runner-tab-mistakes"
            className="space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <h1
                  className="text-[20px] font-semibold text-[#18181B]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Mistakes Log &amp; Missed Markscheme Terminology
                </h1>
                <p className="text-[12.5px] text-[#71717A]">
                  Redo missed questions and verify exact IB markscheme phrasing
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMode('practice')}
                className="pill-btn-dark shrink-0"
              >
                Back to Question Runner →
              </button>
            </div>

            {mistakeToggleError && (
              <div
                role="alert"
                className="hairline-card border-[#FECACA] bg-[#FEF2F2] flex flex-wrap items-center justify-between gap-3"
              >
                <span className="text-[12.5px] font-medium text-[#991B1B]">
                  {mistakeToggleError}
                </span>
                <button
                  type="button"
                  onClick={() => setMistakeToggleError(null)}
                  className="pill-btn"
                >
                  Dismiss
                </button>
              </div>
            )}

            {mistakesState.status === 'loading' && (
              <div className="space-y-3" aria-busy="true">
                <div className="hairline-card h-28 animate-pulse bg-[#FAFAFA]" />
                <div className="hairline-card h-28 animate-pulse bg-[#FAFAFA]" />
              </div>
            )}

            {mistakesState.status === 'error' && (
              <div
                role="alert"
                className="hairline-card border-[#FECACA] bg-[#FEF2F2] flex flex-wrap items-center justify-between gap-3"
              >
                <span className="text-[13px] font-medium text-[#991B1B]">
                  {mistakesState.message}
                </span>
                <button
                  type="button"
                  onClick={() => setMistakesReloadKey((k) => k + 1)}
                  className="pill-btn"
                >
                  Retry
                </button>
              </div>
            )}

            {(mistakesState.status === 'empty' ||
              mistakesState.status === 'idle') && (
              <div className="hairline-card text-center py-10">
                <p className="text-[13.5px] text-[#71717A] mb-3">
                  No logged mistakes yet. Click &quot;Mistakes Log&quot; on any
                  question in the runner to save it here for targeted redo.
                </p>
                <button
                  type="button"
                  onClick={() => setMode('practice')}
                  className="pill-btn-dark"
                >
                  Practice Questions →
                </button>
              </div>
            )}

            {mistakesState.status === 'success' &&
              mistakesState.data.map((m) => (
                <div key={m.id} className="hairline-card min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      <span className="text-[12px] font-semibold text-[#DC2626]">
                        {SUBJECT_NAMES[m.question.subjectSlug] ??
                          m.question.subjectSlug}{' '}
                        · {m.question.paper} · {m.question.marks} Marks
                      </span>
                      {m.resolved === 1 && (
                        <span className="px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] text-[11px] font-semibold">
                          ✓ Mastered
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleMistakeResolved(m)}
                        className="pill-btn"
                      >
                        {m.resolved ? 'Reopen' : 'Mark Mastered'}
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleRedoMistake(m.questionId)}
                        className="pill-btn-dark"
                      >
                        Redo Question →
                      </button>
                    </div>
                  </div>
                  <div className="text-[14.5px] font-semibold text-[#18181B] mb-2 break-words">
                    <KaTeXText text={m.question.stemMarkdown} />
                  </div>
                  <div className="p-3 rounded-[10px] bg-[#FEF2F2] border border-[#FECACA] text-[12px] text-[#991B1B] break-words">
                    <div className="font-semibold mb-1">
                      Missed Markscheme Points to Master:
                    </div>
                    <ul className="list-disc pl-4 space-y-0.5">
                      {m.missedConcepts.map((c, idx) => (
                        <li key={idx}>
                          <KaTeXText text={c} as="span" />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
          </div>
        ) : serverPaginated && serverFetchState.status === 'loading' ? (
          <div
            role="tabpanel"
            id={`runner-panel-${mode}`}
            aria-labelledby={`runner-tab-${mode}`}
            aria-busy="true"
            className="space-y-4"
          >
            <div className="hairline-card h-24 animate-pulse bg-[#FAFAFA]" />
            <div className="hairline-card h-64 animate-pulse bg-[#FAFAFA]" />
          </div>
        ) : serverPaginated && serverFetchState.status === 'error' ? (
          <div
            role="alert"
            className="hairline-card border-[#FECACA] bg-[#FEF2F2] flex flex-wrap items-center justify-between gap-3"
          >
            <span className="text-[13px] font-medium text-[#991B1B]">
              {serverFetchState.message}
            </span>
            <button
              type="button"
              onClick={() => setServerQueryTrigger((k) => k + 1)}
              className="pill-btn"
            >
              Retry
            </button>
          </div>
        ) : !currentQuestion ? (
          <div
            role="tabpanel"
            id={`runner-panel-${mode}`}
            aria-labelledby={`runner-tab-${mode}`}
            className="hairline-card text-center py-12"
          >
            <h2 className="text-[16px] font-semibold text-[#18181B] mb-1">
              No IB Questions Match These Filters
            </h2>
            <p className="text-[13px] text-[#71717A] mb-4 max-w-md mx-auto">
              There are no questions matching your current subject, paper,
              topic, or difficulty selection. Reset filters to browse all
              available IB practice questions.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="pill-btn-dark"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div
            role="tabpanel"
            id={`runner-panel-${mode}`}
            aria-labelledby={`runner-tab-${mode}`}
          >
            {mode === 'exam' && (
              <div className="mb-4 px-4 py-3 rounded-[12px] bg-[#FAFAFA] border border-[#E4E4E7] space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-[#18181B]">
                      Timed Custom Mock Paper ({activeQuestions.length} Questions ·{' '}
                      {activeQuestions.reduce((acc, q) => acc + q.marks, 0)} Total
                      Marks)
                    </div>
                    <div className="text-[11.5px] text-[#71717A]">
                      Calibrated to official IB paper weightings and calculator rules · Drafts preserved per question
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    <button
                      type="button"
                      onClick={handleSaveExamSession}
                      disabled={examSaveState.status === 'saving'}
                      className="pill-btn"
                    >
                      {examSaveState.status === 'saving'
                        ? 'Saving Mock...'
                        : 'Save Mock Session'}
                    </button>
                  </div>
                </div>

                {examSaveState.status === 'saved' && (
                  <div className="text-[12px] font-medium text-[#059669]">
                    ✓ {examSaveState.message}
                  </div>
                )}
                {examSaveState.status === 'error' && (
                  <div
                    role="alert"
                    className="text-[12px] font-medium text-[#991B1B]"
                  >
                    {examSaveState.message}
                  </div>
                )}

                <div className="flex gap-1.5 flex-wrap">
                  {activeQuestions.map((q, idx) => {
                    const draft = examDrafts[q.id];
                    const isAnswered =
                      idx === safeIndex
                        ? Boolean(selectedOption || userAnswer.trim())
                        : Boolean(
                            draft?.selectedOption || draft?.userAnswer.trim()
                          );
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => selectQuestionIndex(idx)}
                        aria-label={`Jump to Question ${idx + 1}${isAnswered ? ' (answered)' : ''}`}
                        className={`w-7 h-7 rounded-full text-[11.5px] font-mono font-semibold border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] cursor-pointer ${
                          idx === safeIndex
                            ? 'bg-[#18181B] text-white border-[#18181B]'
                            : isAnswered
                            ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0] hover:bg-[#D1FAE5]'
                            : 'bg-white text-[#52525B] border-[#E4E4E7] hover:bg-[#F4F4F5]'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Breadcrumb + Progress Row */}
            <div className="flex justify-between items-center mb-[16px] flex-wrap gap-2">
              <div className="text-[13px] text-[#71717A] min-w-0 break-words">
                <Link
                  href={`/subjects/${currentQuestion.subjectSlug}`}
                  className="hover:text-[#18181B] hover:underline"
                >
                  {SUBJECT_NAMES[currentQuestion.subjectSlug] ??
                    currentQuestion.subjectSlug}
                </Link>{' '}
                &nbsp;&gt;&nbsp; {currentQuestion.unitCode || currentQuestion.topicCode}{' '}
                · {currentQuestion.topicTitle}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11.5px] text-[#71717A] font-mono">
                  {serverPaginated && mode === 'practice'
                    ? `Q${((serverPage - 1) * initialPageSize + safeIndex + 1).toLocaleString()} of ${serverTotalCount.toLocaleString()}`
                    : `Q${safeIndex + 1} of ${activeQuestions.length}`}
                </span>
              </div>
            </div>

            {/* Main Question Hairline Card */}
            <div className="hairline-card min-w-0">
              <div className="flex items-center justify-between gap-2 mb-[14px] flex-wrap">
                <div className="flex gap-[8px] flex-wrap min-w-0">
                  <span className="mini-tag">
                    {currentQuestion.levelScope === 'SL/Core'
                      ? 'SL Core'
                      : currentQuestion.levelScope}
                  </span>
                  <span className="mini-tag">{currentQuestion.paper}</span>
                  <span className="mini-tag">
                    {currentQuestion.marks}{' '}
                    {currentQuestion.marks === 1 ? 'Mark' : 'Marks'}
                  </span>
                  <span className="mini-tag">{currentQuestion.commandTerm}</span>
                  <span className="mini-tag">
                    {currentQuestion.calculatorPolicy === 'non_calculator'
                      ? 'Non-Calculator'
                      : currentQuestion.calculatorPolicy === 'gdc_required'
                      ? 'GDC Required'
                      : 'Calculator / Data Booklet Allowed'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => stepQuestion(-1)}
                    className="pill-btn !py-1 !px-2.5"
                  >
                    ← Prev
                  </button>
                  <button
                    type="button"
                    onClick={() => stepQuestion(1)}
                    className="pill-btn !py-1 !px-2.5"
                  >
                    Next →
                  </button>
                </div>
              </div>

              {currentQuestion.stimulusMarkdown && (
                <div className="mb-4 p-3.5 rounded-[12px] bg-[#FAFAFA] border border-[#E4E4E7] text-[13px] text-[#3F3F46] leading-relaxed break-words overflow-x-auto">
                  <KaTeXText text={currentQuestion.stimulusMarkdown} />
                </div>
              )}

              {currentQuestion.diagramSpec && (
                <InteractiveMathDiagram
                  key={currentQuestion.id}
                  spec={currentQuestion.diagramSpec}
                />
              )}

              <h2
                className="text-[19px] font-semibold leading-[1.4] mb-[16px] text-[#18181B] break-words"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <KaTeXText text={currentQuestion.stemMarkdown} as="span" />
              </h2>

              {currentQuestion.questionType === 'mcq' &&
              currentQuestion.options ? (
                <div className="space-y-2 mb-4">
                  {currentQuestion.options.map((opt) => {
                    const active = selectedOption === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setSelectedOption(opt.id)}
                        className={`w-full text-left p-3 rounded-[12px] border text-[13.5px] flex items-center gap-3 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#18181B] cursor-pointer min-w-0 ${
                          active
                            ? 'bg-[#F4F4F5] border-[#18181B] font-semibold text-[#18181B]'
                            : 'bg-[#FAFAFA] border-[#E4E4E7] text-[#3F3F46] hover:bg-[#F4F4F5]'
                        }`}
                      >
                        <span className="w-6 h-6 rounded-full bg-white border border-[#E4E4E7] font-mono text-[12px] font-semibold inline-flex items-center justify-center flex-shrink-0">
                          {opt.id}
                        </span>
                        <span className="min-w-0 break-words">
                          <KaTeXText text={opt.text} as="span" />
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <textarea
                  rows={4}
                  aria-label="Your answer"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder={`Write your ${currentQuestion.commandTerm.toLowerCase()} response (${currentQuestion.marks} marks)...`}
                  className="w-full border border-[#E4E4E7] rounded-[12px] px-[14px] py-[12px] text-[13.5px] bg-[#FAFAFA] text-[#18181B] focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] transition-colors duration-150"
                />
              )}

              <div className="flex justify-between items-center mt-[16px] flex-wrap gap-[10px]">
                <div className="flex gap-[8px] flex-wrap">
                  <button
                    type="button"
                    aria-expanded={showMarkscheme}
                    onClick={() => setShowMarkscheme((v) => !v)}
                    className="pill-btn"
                  >
                    {showMarkscheme ? 'Hide Markscheme' : 'Reveal Markscheme'}
                  </button>
                  <button
                    type="button"
                    aria-expanded={showWalkthrough}
                    onClick={() => setShowWalkthrough((v) => !v)}
                    className="pill-btn"
                  >
                    {showWalkthrough
                      ? 'Hide Walkthrough'
                      : 'Step-by-Step Walkthrough'}
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveToMistakesLog}
                    disabled={mistakeSaveState.status === 'saving'}
                    className="pill-btn disabled:opacity-60"
                  >
                    {mistakeSaveState.status === 'saving'
                      ? 'Saving...'
                      : 'Mistakes Log'}
                  </button>
                  <Link
                    href={`/tutor?subject=${currentQuestion.subjectSlug}`}
                    className="pill-btn"
                  >
                    Ask Sprout Tutor
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={handleGradeAnswer}
                  disabled={gradeState.status === 'loading'}
                  className="pill-btn-dark disabled:opacity-60"
                >
                  {gradeState.status === 'loading'
                    ? 'Grading against IB Markscheme...'
                    : 'Grade My Answer'}
                </button>
              </div>

              {mistakeSaveState.status === 'saved' && (
                <div className="mt-3 text-[12px] text-[#059669] font-medium">
                  ✓ {mistakeSaveState.message}
                </div>
              )}

              {mistakeSaveState.status === 'error' && (
                <div
                  role="alert"
                  className="mt-3 p-3 rounded-[12px] bg-[#FEF2F2] border border-[#FECACA] text-[12px] text-[#991B1B] font-medium"
                >
                  {mistakeSaveState.message}
                </div>
              )}

              {attemptSaveError && (
                <div
                  role="alert"
                  className="mt-3 p-3 rounded-[12px] bg-[#FEF2F2] border border-[#FECACA] text-[12px] text-[#991B1B] font-medium"
                >
                  {attemptSaveError}
                </div>
              )}

              {gradeState.status === 'error' && (
                <div
                  role="alert"
                  className="mt-4 p-3.5 rounded-[12px] bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-between gap-3 flex-wrap"
                >
                  <span className="text-[12.5px] text-[#991B1B] font-medium">
                    {gradeState.message}
                  </span>
                  <button
                    type="button"
                    onClick={handleGradeAnswer}
                    className="pill-btn"
                  >
                    Retry Grading
                  </button>
                </div>
              )}

              {gradeState.status === 'loading' && (
                <div
                  aria-busy="true"
                  aria-label="Grading against IB markscheme"
                  className="mt-5 p-4 rounded-[12px] bg-[#FAFAFA] border border-[#E4E4E7] space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="h-5 w-44 rounded-full bg-[#E4E4E7] animate-pulse" />
                    <div className="h-4 w-32 rounded bg-[#E4E4E7] animate-pulse" />
                  </div>
                  <div className="h-4 w-full rounded bg-[#E4E4E7] animate-pulse" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="h-20 rounded-[10px] bg-[#E4E4E7]/70 animate-pulse" />
                    <div className="h-20 rounded-[10px] bg-[#E4E4E7]/70 animate-pulse" />
                  </div>
                </div>
              )}

              {/* Instant Rubric Grading Output */}
              {gradeState.status === 'success' && (
                <div className="mt-5 p-4 rounded-[12px] bg-[#FAFAFA] border border-[#E4E4E7] min-w-0">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] font-mono text-[12px] font-bold">
                        Score: {gradeState.data.awardedMarks} /{' '}
                        {gradeState.data.maxMarks} Marks
                      </span>
                      <span className="text-[12.5px] font-semibold text-[#18181B]">
                        IB Examiner Rubric Breakdown
                      </span>
                    </div>
                    <span className="mini-tag">
                      {gradeState.data.mode === 'gemini'
                        ? `Graded via Gemini (${gradeState.data.modelUsed || 'AI'})`
                        : 'Graded via IB Markscheme Checklist'}
                    </span>
                  </div>

                  <p className="text-[13px] text-[#3F3F46] mb-3 break-words">
                    <KaTeXText
                      text={gradeState.data.examinerFeedback}
                      as="span"
                    />
                  </p>

                  {gradeState.data.improvementTip && (
                    <div className="mb-3 px-3 py-2 rounded-[10px] bg-[#FFFBEB] border border-[#FDE68A] text-[12px] text-[#92400E] break-words">
                      <span className="font-semibold">Examiner Tip: </span>
                      <KaTeXText
                        text={gradeState.data.improvementTip}
                        as="span"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12.5px]">
                    <div className="p-3 rounded-[10px] bg-[#ECFDF5] border border-[#A7F3D0] min-w-0 break-words">
                      <div className="font-semibold text-[#065F46] mb-1">
                        ✓ Awarded Markscheme Points (
                        {gradeState.data.matchedPoints.length})
                      </div>
                      {gradeState.data.matchedPoints.length === 0 ? (
                        <div className="text-[#065F46]/80">
                          No markscheme points matched yet.
                        </div>
                      ) : (
                        <ul className="space-y-1 text-[#065F46]">
                          {gradeState.data.matchedPoints.map((pt, i) => (
                            <li key={i}>
                              <KaTeXText text={pt} as="span" />
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="p-3 rounded-[10px] bg-[#FEF3C7] border border-[#FDE68A] min-w-0 break-words">
                      <div className="font-semibold text-[#92400E] mb-1">
                        ! Missed / Remaining Points (
                        {gradeState.data.missedPoints.length})
                      </div>
                      {gradeState.data.missedPoints.length === 0 ? (
                        <div className="text-[#92400E]">
                          All required markscheme points satisfied!
                        </div>
                      ) : (
                        <ul className="space-y-1 text-[#92400E]">
                          {gradeState.data.missedPoints.map((pt, i) => (
                            <li key={i}>
                              <KaTeXText text={pt} as="span" />
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Official IB Markscheme Reveal */}
              {showMarkscheme && (
                <div className="mt-5 p-4 rounded-[12px] bg-[#FAFAFA] border border-[#E4E4E7] min-w-0">
                  <div className="text-[13px] font-semibold text-[#18181B] mb-2">
                    Official IB Markscheme ({currentQuestion.marks} Marks)
                  </div>
                  <div className="space-y-2">
                    {currentQuestion.markschemePoints.map((pt) => (
                      <div
                        key={pt.pointId}
                        className="flex items-start justify-between gap-3 p-2.5 rounded-[8px] bg-white border border-[#E4E4E7] text-[13px] min-w-0"
                      >
                        <div className="flex items-start gap-2 min-w-0 flex-1">
                          <span className="font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded bg-[#ECFDF5] text-[#065F46] shrink-0">
                            {pt.pointId}
                          </span>
                          <div className="min-w-0 break-words">
                            <KaTeXText
                              text={pt.requirement}
                              className="text-[#18181B]"
                            />
                            {pt.notes && (
                              <div className="text-[11.5px] text-[#71717A] mt-0.5">
                                Examiner Note:{' '}
                                <KaTeXText text={pt.notes} as="span" />
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="font-mono text-[11.5px] font-semibold text-[#3F3F46] whitespace-nowrap shrink-0">
                          [{pt.marks}]
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Text & Math Step-by-Step Walkthrough (Zero Videos) */}
              {showWalkthrough && (
                <div className="mt-5 p-4 rounded-[12px] bg-[#FFFFFF] border border-[#E4E4E7] min-w-0">
                  <div className="text-[13px] font-semibold text-[#18181B] mb-2.5">
                    Written Step-by-Step Solution Walkthrough
                  </div>
                  <div className="space-y-2.5">
                    {currentQuestion.walkthroughSteps.map((st) => (
                      <div
                        key={st.stepNumber}
                        className="p-3 rounded-[10px] bg-[#FAFAFA] border border-[#F4F4F5] min-w-0 break-words"
                      >
                        <div className="text-[12.5px] font-semibold text-[#18181B] mb-1">
                          Step {st.stepNumber}: {st.title}
                        </div>
                        <KaTeXText
                          text={st.explanationMarkdown}
                          className="text-[13px] text-[#3F3F46] leading-relaxed"
                        />
                      </div>
                    ))}
                    {currentQuestion.commonPitfalls.length > 0 && (
                      <div className="p-3 rounded-[10px] bg-[#FFFBEB] border border-[#FDE68A] min-w-0 break-words">
                        <div className="text-[12px] font-semibold text-[#92400E] mb-1">
                          Common IB Examiner Pitfalls
                        </div>
                        <ul className="list-disc pl-4 space-y-0.5 text-[12px] text-[#92400E]">
                          {currentQuestion.commonPitfalls.map((pitfall, idx) => (
                            <li key={idx}>
                              <KaTeXText text={pitfall} as="span" />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {serverPaginated && mode === 'practice' && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 px-1 text-[12px] text-[#71717A]">
                <span className="font-mono">
                  Page {serverPage.toLocaleString()} of{' '}
                  {serverTotalPages.toLocaleString()} ·{' '}
                  {serverTotalCount.toLocaleString()} matching questions
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    disabled={serverPage <= 1}
                    onClick={() => {
                      pendingLandingRef.current = 'first';
                      setServerPage((p) => Math.max(1, p - 1));
                    }}
                    className="pill-btn !py-1 !px-2.5 disabled:opacity-45"
                  >
                    ← Prev Page
                  </button>
                  <button
                    type="button"
                    disabled={serverPage >= serverTotalPages}
                    onClick={() => {
                      pendingLandingRef.current = 'first';
                      setServerPage((p) => Math.min(serverTotalPages, p + 1));
                    }}
                    className="pill-btn !py-1 !px-2.5 disabled:opacity-45"
                  >
                    Next Page →
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShuffleNextFetch(true);
                      setServerQueryTrigger((k) => k + 1);
                    }}
                    className="pill-btn !py-1 !px-2.5"
                  >
                    Shuffle Set
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
