'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { ScreenState, SubjectSlug } from '@/types/fsm';
import { SproutMascot } from '@/components/mascot/SproutMascot';
import { KaTeXText } from '@/components/math/KaTeXText';
import {
  Calendar,
  CheckSquare,
  Square,
  Plus,
  Sparkles,
  Trash2,
  Clock,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

interface StudyTask {
  id: string;
  subjectSlug: SubjectSlug | null;
  title: string;
  scheduledDate: string;
  startTime: string | null;
  durationMinutes: number;
  taskType: string;
  completed: number;
}

type PlannerViewMode = 'today' | 'week' | 'month';

const SUBJECT_BADGE: Record<string, { label: string; classes: string }> = {
  bio: {
    label: 'Biology HL',
    classes: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  },
  chem: {
    label: 'Chemistry SL',
    classes: 'border-teal-200 bg-teal-50 text-teal-800',
  },
  hist: {
    label: 'History HL',
    classes: 'border-amber-200 bg-amber-50 text-amber-800',
  },
  eng: {
    label: 'English Lit HL',
    classes: 'border-blue-200 bg-blue-50 text-blue-800',
  },
  fr: {
    label: 'French B SL',
    classes: 'border-sky-200 bg-sky-50 text-sky-800',
  },
  math: {
    label: 'Math AA SL',
    classes: 'border-amber-200 bg-amber-50 text-amber-900',
  },
};

function addDaysIso(baseIso: string, days: number): string {
  const [y, m, d] = baseIso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}

export default function StudyPlannerPage() {
  const router = useRouter();
  const [screen, setScreen] = useState<ScreenState<StudyTask[]>>({
    status: 'loading',
  });
  const [viewMode, setViewMode] = useState<PlannerViewMode>('week');
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState<SubjectSlug>('bio');
  const [newDuration, setNewDuration] = useState<number>(45);
  const [newTaskType, setNewTaskType] = useState<
    'questions' | 'flashcards' | 'mock_exam' | 'essay_ia' | 'blurting'
  >('questions');
  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const weekEndIso = useMemo(() => addDaysIso(todayIso, 6), [todayIso]);
  const monthEndIso = useMemo(() => addDaysIso(todayIso, 29), [todayIso]);
  const currentMonthPrefix = useMemo(() => todayIso.slice(0, 7), [todayIso]);
  const [newDate, setNewDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [generatingStatus, setGeneratingStatus] = useState<'idle' | 'generating'>(
    'idle'
  );
  const [addingTask, setAddingTask] = useState<'idle' | 'submitting'>('idle');
  const [actionError, setActionError] = useState<string | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const routerRef = useRef(router);
  routerRef.current = router;

  const loadPlanner = useCallback(() => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setScreen({ status: 'loading' });
    setActionError(null);
    fetch('/api/planner', { signal: controller.signal })
      .then(async (res) => {
        if (res.status === 401) {
          routerRef.current.push('/login');
          return null;
        }
        if (!res.ok) {
          throw new Error('Unable to load IB Study Planner.');
        }
        return (await res.json()) as { tasks?: StudyTask[] };
      })
      .then((json) => {
        if (!json) return;
        setScreen({ status: 'success', data: json.tasks ?? [] });
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return;
        setScreen({
          status: 'error',
          message: 'Unable to load IB Study Planner.',
        });
      });
  }, []);

  useEffect(() => {
    loadPlanner();
    return () => controllerRef.current?.abort();
  }, [loadPlanner]);

  const displayedTasks = useMemo(() => {
    if (screen.status !== 'success') return [];
    const sorted = [...screen.data].sort((a, b) =>
      a.scheduledDate.localeCompare(b.scheduledDate)
    );
    if (viewMode === 'today') {
      return sorted.filter((t) => t.scheduledDate === todayIso);
    }
    if (viewMode === 'week') {
      return sorted.filter(
        (t) => t.scheduledDate >= todayIso && t.scheduledDate <= weekEndIso
      );
    }
    // Month view: entire current calendar month or 30-day rolling horizon
    return sorted.filter(
      (t) =>
        t.scheduledDate.startsWith(currentMonthPrefix) ||
        (t.scheduledDate >= todayIso && t.scheduledDate <= monthEndIso)
    );
  }, [screen, viewMode, todayIso, weekEndIso, currentMonthPrefix, monthEndIso]);

  const monthGroupedTasks = useMemo(() => {
    if (viewMode !== 'month') return [];
    const groups = new Map<string, StudyTask[]>();
    for (const t of displayedTasks) {
      const bucket = t.scheduledDate;
      const existing = groups.get(bucket);
      if (existing) existing.push(t);
      else groups.set(bucket, [t]);
    }
    return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [displayedTasks, viewMode]);

  const progressStats = useMemo(() => {
    if (displayedTasks.length === 0) {
      return { completed: 0, total: 0, percent: 0 };
    }
    const completed = displayedTasks.filter((t) => t.completed === 1).length;
    const total = displayedTasks.length;
    return {
      completed,
      total,
      percent: Math.round((completed / total) * 100),
    };
  }, [displayedTasks]);

  async function handleToggleTask(task: StudyTask) {
    if (screen.status !== 'success') return;
    const previous = screen.data;
    const nextCompleted = task.completed === 1 ? 0 : 1;
    setActionError(null);
    setScreen({
      status: 'success',
      data: previous.map((t) =>
        t.id === task.id ? { ...t, completed: nextCompleted } : t
      ),
    });
    try {
      const res = await fetch('/api/planner', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id, completed: Boolean(nextCompleted) }),
      });
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      if (!res.ok) {
        throw new Error('Failed to update task');
      }
    } catch {
      setScreen({ status: 'success', data: previous });
      setActionError('Could not update task completion. Please try again.');
    }
  }

  async function handleAddStudyBlock(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim() || screen.status !== 'success' || addingTask === 'submitting') {
      return;
    }
    const safeDuration = Number.isFinite(newDuration)
      ? Math.min(180, Math.max(15, Math.round(newDuration)))
      : 45;
    setAddingTask('submitting');
    setActionError(null);

    try {
      const res = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectSlug: newSubject,
          title: newTitle.trim(),
          scheduledDate: newDate || todayIso,
          startTime: '17:00',
          durationMinutes: safeDuration,
          taskType: newTaskType,
        }),
      });
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.task) {
        throw new Error(json.error || 'Could not add study block.');
      }
      setScreen((prev) =>
        prev.status === 'success'
          ? { status: 'success', data: [json.task, ...prev.data] }
          : prev
      );
      setNewTitle('');
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Unable to add study block.'
      );
    } finally {
      setAddingTask('idle');
    }
  }

  async function handleGenerate7DaySchedule() {
    setGeneratingStatus('generating');
    setActionError(null);
    try {
      const res = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generateSchedule: true }),
      });
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.tasks) {
        throw new Error(json.error || 'Could not generate 7-day schedule.');
      }
      setScreen({ status: 'success', data: json.tasks });
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : 'Unable to auto-generate 7-day IB schedule.'
      );
    } finally {
      setGeneratingStatus('idle');
    }
  }

  async function handleDeleteTask(id: string) {
    if (screen.status !== 'success') return;
    const previous = screen.data;
    setActionError(null);
    setScreen({
      status: 'success',
      data: previous.filter((t) => t.id !== id),
    });
    try {
      const res = await fetch('/api/planner', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      if (!res.ok) {
        throw new Error('Could not delete study block.');
      }
    } catch {
      setScreen({ status: 'success', data: previous });
      setActionError('Could not delete study block. Please try again.');
    }
  }

  const viewHeaderLabel =
    viewMode === 'today'
      ? `Today (${todayIso})`
      : viewMode === 'week'
      ? `7-Day Window (${todayIso} → ${weekEndIso})`
      : `Monthly & 30-Day Horizon (${todayIso.slice(0, 7)})`;

  function renderTaskRow(task: StudyTask) {
    const badge = SUBJECT_BADGE[task.subjectSlug ?? 'bio'] ?? SUBJECT_BADGE.bio;
    const isDone = task.completed === 1;
    return (
      <div
        key={task.id}
        className={`flex items-center justify-between gap-4 rounded-[12px] border p-4 transition-colors duration-150 ${
          isDone
            ? 'border-[#E4E4E7] bg-[#FAFAFA] opacity-75'
            : 'border-[#E4E4E7] bg-white hover:border-[#D4D4D8]'
        }`}
      >
        <div className="flex items-start gap-3 min-w-0">
          <button
            type="button"
            onClick={() => handleToggleTask(task)}
            aria-label={
              isDone
                ? `Mark "${task.title}" incomplete`
                : `Mark "${task.title}" complete`
            }
            aria-pressed={isDone}
            className="mt-0.5 text-[#3F3F46] transition-colors duration-150 hover:text-[#059669] rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] cursor-pointer shrink-0"
          >
            {isDone ? (
              <CheckSquare className="h-5 w-5 text-[#059669]" />
            ) : (
              <Square className="h-5 w-5 text-[#71717A]" />
            )}
          </button>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold ${badge.classes}`}
              >
                {badge.label}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-[#71717A]">
                <Calendar className="h-3 w-3" />
                {task.scheduledDate}
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-xs text-[#71717A]">
                <Clock className="h-3 w-3" />
                {task.durationMinutes}m
              </span>
            </div>

            <div
              className={`mt-1.5 text-sm font-semibold ${
                isDone ? 'line-through text-[#71717A]' : 'text-[#18181B]'
              }`}
            >
              <KaTeXText text={task.title} as="span" />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleDeleteTask(task.id)}
          aria-label={`Delete study block "${task.title}"`}
          className="rounded-lg p-1.5 text-[#71717A] transition-colors duration-150 hover:bg-[#FEF2F2] hover:text-[#DC2626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] cursor-pointer shrink-0"
          title="Delete Study Block"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    );
  }

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
              <h1
                className="h-title !text-[24px]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Adaptive IB Study Planner
              </h1>
              <p className="text-[13px] text-[#71717A] mt-0.5">
                Balance HL &amp; SL exam preparation with interleaved active recall blocks.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Segmented View Switcher: Focus (Today) | Week | Month */}
            <div
              role="tablist"
              aria-label="Planner view range"
              className="inline-flex rounded-full border border-[#E4E4E7] bg-white p-1"
            >
              {(
                [
                  { id: 'today', label: 'Focus (Today)' },
                  { id: 'week', label: 'Week' },
                  { id: 'month', label: 'Month' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={viewMode === tab.id}
                  onClick={() => setViewMode(tab.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] ${
                    viewMode === tab.id
                      ? 'bg-[#18181B] text-white'
                      : 'text-[#71717A] hover:text-[#18181B]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleGenerate7DaySchedule}
              disabled={generatingStatus === 'generating'}
              className="pill-btn-dark disabled:opacity-50"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>
                {generatingStatus === 'generating'
                  ? 'Generating Plan...'
                  : 'Auto-Generate 7-Day IB Schedule'}
              </span>
            </button>
          </div>
        </div>

        {/* Progress Summary Bar */}
        <div className="mt-5 hairline-card !p-4 sm:!p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-[#3F3F46]">
            <span>
              {viewHeaderLabel} · {progressStats.completed} of{' '}
              {progressStats.total} study blocks completed
            </span>
            <span className="font-mono font-bold text-[#18181B]">
              {progressStats.percent}%
            </span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#F4F4F5]">
            <div
              className="h-full rounded-full bg-[#059669] transition-all duration-300"
              style={{ width: `${progressStats.percent}%` }}
            />
          </div>
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

        {/* Main Grid: Task List + Add Study Block Form */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-8">
            {screen.status === 'loading' && (
              <div className="space-y-3">
                <div className="h-20 animate-pulse rounded-[12px] border border-[#E4E4E7] bg-white" />
                <div className="h-20 animate-pulse rounded-[12px] border border-[#E4E4E7] bg-white" />
              </div>
            )}

            {screen.status === 'error' && (
              <div
                role="alert"
                className="flex items-center justify-between flex-wrap gap-3 rounded-[14px] border border-[#FECACA] bg-[#FEF2F2] p-4 text-[#B91C1C]"
              >
                <div className="flex items-center gap-2 text-[13px] font-medium">
                  <AlertCircle className="h-5 w-5 shrink-0 text-[#DC2626]" />
                  <span>{screen.message || 'Unable to load IB Study Planner.'}</span>
                </div>
                <button
                  type="button"
                  onClick={loadPlanner}
                  className="pill-btn"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Retry</span>
                </button>
              </div>
            )}

            {screen.status === 'success' && displayedTasks.length === 0 && (
              <div className="rounded-[14px] border border-dashed border-[#E4E4E7] bg-white p-8 text-center">
                <div className="mx-auto flex justify-center">
                  <SproutMascot pose="guide" size={56} />
                </div>
                <h3
                  className="mt-2 text-sm font-semibold text-[#18181B]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  No study blocks scheduled for {viewMode === 'today' ? 'today' : viewMode === 'week' ? 'this 7-day window' : 'this month'}
                </h3>
                <p className="mt-1 text-xs text-[#71717A]">
                  Add a targeted block on the right or switch to Week / Month view.
                </p>
                <button
                  type="button"
                  onClick={() => titleInputRef.current?.focus()}
                  className="pill-btn-dark mt-4"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Quick Add Block</span>
                </button>
              </div>
            )}

            {screen.status === 'success' &&
              displayedTasks.length > 0 &&
              viewMode !== 'month' &&
              displayedTasks.map((task) => renderTaskRow(task))}

            {screen.status === 'success' &&
              displayedTasks.length > 0 &&
              viewMode === 'month' && (
                <div className="space-y-4">
                  {monthGroupedTasks.map(([dateKey, items]) => (
                    <div key={dateKey} className="space-y-2">
                      <div className="flex items-center justify-between px-1">
                        <span className="font-mono text-[11.5px] font-semibold text-[#71717A]">
                          {dateKey}
                          {dateKey === todayIso ? ' · Today' : ''}
                        </span>
                        <span className="mini-tag">
                          {items.length} {items.length === 1 ? 'block' : 'blocks'}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {items.map((task) => renderTaskRow(task))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>

          {/* + Add Study Block Form */}
          <div className="lg:col-span-4">
            <form
              onSubmit={handleAddStudyBlock}
              className="hairline-card !p-5"
            >
              <h2
                className="text-sm font-semibold text-[#18181B]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Add Study Block
              </h2>
              <p className="mt-1 text-xs text-[#71717A]">
                Schedule a targeted question drill, mock paper, or active recall session.
              </p>

              <div className="mt-4 space-y-3.5">
                <div>
                  <label
                    htmlFor="planner-subject-select"
                    className="block text-xs font-semibold text-[#3F3F46]"
                  >
                    IB Subject
                  </label>
                  <select
                    id="planner-subject-select"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value as SubjectSlug)}
                    className="mt-1 w-full rounded-lg border border-[#E4E4E7] bg-white px-3 py-2 text-xs text-[#18181B] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
                  >
                    <option value="bio">Biology HL</option>
                    <option value="chem">Chemistry SL</option>
                    <option value="hist">History HL</option>
                    <option value="eng">English Lit HL</option>
                    <option value="fr">French B SL</option>
                    <option value="math">Math AA SL</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="planner-title-input"
                    className="block text-xs font-semibold text-[#3F3F46]"
                  >
                    Study Block Title
                  </label>
                  <input
                    id="planner-title-input"
                    ref={titleInputRef}
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., Paper 2 Section B Osmosis Drill"
                    className="mt-1 w-full rounded-lg border border-[#E4E4E7] px-3 py-2 text-xs text-[#18181B] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="planner-date-input"
                    className="block text-xs font-semibold text-[#3F3F46]"
                  >
                    Scheduled Date
                  </label>
                  <input
                    id="planner-date-input"
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#E4E4E7] bg-white px-3 py-2 font-mono text-xs text-[#18181B] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label
                      htmlFor="planner-type-select"
                      className="block text-xs font-semibold text-[#3F3F46]"
                    >
                      Activity Type
                    </label>
                    <select
                      id="planner-type-select"
                      value={newTaskType}
                      onChange={(e) =>
                        setNewTaskType(
                          e.target.value as
                            | 'questions'
                            | 'flashcards'
                            | 'mock_exam'
                            | 'essay_ia'
                            | 'blurting'
                        )
                      }
                      className="mt-1 w-full rounded-lg border border-[#E4E4E7] bg-white px-2.5 py-2 text-xs text-[#18181B] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
                    >
                      <option value="questions">Question Bank</option>
                      <option value="flashcards">SM-2 Flashcards</option>
                      <option value="blurting">Blurting Recall</option>
                      <option value="mock_exam">Mock Exam</option>
                      <option value="essay_ia">Essay / IA Draft</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="planner-duration-input"
                      className="block text-xs font-semibold text-[#3F3F46]"
                    >
                      Duration (min)
                    </label>
                    <input
                      id="planner-duration-input"
                      type="number"
                      min={15}
                      max={180}
                      step={5}
                      value={newDuration}
                      onChange={(e) => setNewDuration(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-[#E4E4E7] px-3 py-2 font-mono text-xs text-[#18181B] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={screen.status !== 'success' || addingTask === 'submitting'}
                  className="pill-btn-dark w-full justify-center !py-2.5"
                >
                  <Plus className="h-4 w-4" />
                  <span>
                    {addingTask === 'submitting' ? 'Adding...' : 'Add to Schedule'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
