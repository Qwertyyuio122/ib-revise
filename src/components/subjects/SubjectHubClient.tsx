'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type {
  SubjectConfig,
  SyllabusTopic,
} from '@/content/schemas';
import type { MasteryStatus, ScreenState } from '@/types/fsm';
import { KaTeXText } from '@/components/math/KaTeXText';

type SubjectToolCard = SubjectConfig['practiceTools'][number];

interface BookmarkItem {
  id: string;
  title: string;
  subtitle: string;
  itemType: string;
  href: string;
}

interface StudyTaskItem {
  id: string;
  title: string;
  scheduledDate: string;
  durationMinutes: number;
  taskType: string;
  completed: number;
  subjectSlug: string | null;
}

interface SubjectHubClientProps {
  subject: SubjectConfig;
  topics: SyllabusTopic[];
  initialTab?: string;
}

const MASTERY_STATES: Array<{
  value: MasteryStatus;
  label: string;
  bg: string;
  text: string;
}> = [
  { value: 'mastered', label: 'Mastered', bg: '#ECFDF5', text: '#065F46' },
  { value: 'confident', label: 'Confident', bg: '#E0F2FE', text: '#0369A1' },
  { value: 'practicing', label: 'Practicing', bg: '#FEF3C7', text: '#92400E' },
  { value: 'review_needed', label: 'Review Needed', bg: '#FFEDD5', text: '#C2410C' },
  { value: 'struggling', label: 'Struggling', bg: '#FEF2F2', text: '#DC2626' },
  { value: 'unseen', label: 'Unseen', bg: '#F4F4F5', text: '#52525B' },
];

interface HubDataPayload {
  progressMap: Record<string, MasteryStatus>;
  bookmarks: BookmarkItem[];
  tasks: StudyTaskItem[];
}

type PlanMutationState =
  | { status: 'idle' }
  | { status: 'generating' }
  | { status: 'error'; message: string };

type HubTab = 'resources' | 'topics' | 'plan' | 'saved';

function normalizeHubTab(tab?: string): HubTab {
  if (tab === 'topics' || tab === 'plan' || tab === 'saved') {
    return tab;
  }
  return 'resources';
}

function SubjectToolIcon({
  iconName,
}: {
  iconName: SubjectToolCard['iconName'];
}) {
  const common = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  };

  switch (iconName) {
    case 'questionbank':
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="3" />
          <path d="M8 9h8" />
          <path d="M8 13h5" />
          <path d="M8 17h3" />
        </svg>
      );
    case 'visualizations':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 4v3M12 17v3M4 12h3M17 12h3" />
        </svg>
      );
    case 'blurting':
      return (
        <svg {...common}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      );
    case 'teach_sprout':
      return (
        <svg {...common}>
          <path d="M7 20h10" />
          <path d="M12 20v-8" />
          <path d="M12 12c-3.5 0-6-2.5-6-6 3.5 0 6 2.5 6 6Z" />
          <path d="M12 13c3.5 0 6-2 6-5.5-3.5 0-6 2-6 5.5Z" />
        </svg>
      );
    case 'exam_builder':
      return (
        <svg {...common}>
          <circle cx="12" cy="13" r="8" />
          <path d="M12 9v4l2.5 2.5" />
          <path d="M9 3h6" />
        </svg>
      );
    case 'mistakes_log':
      return (
        <svg {...common}>
          <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      );
    case 'study_guide':
      return (
        <svg {...common}>
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
          <path d="M8 7h8" />
          <path d="M8 11h6" />
        </svg>
      );
    case 'flashcards':
      return (
        <svg {...common}>
          <rect x="3" y="6" width="14" height="12" rx="2" />
          <path d="M7 4h12a2 2 0 0 1 2 2v10" />
        </svg>
      );
    case 'cheatsheets':
      return (
        <svg {...common}>
          <path d="M13 2 4 14h7l-1 8 9-12h-7Z" />
        </svg>
      );
    case 'essay_studio':
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h8" />
          <path d="M8 17h5" />
        </svg>
      );
    case 'data_booklet':
      return (
        <svg {...common}>
          <path d="M9 3h6" />
          <path d="M10 3v5.5L5.5 17A2 2 0 0 0 7.2 20h9.6a2 2 0 0 0 1.7-3L14 8.5V3" />
          <path d="M7.5 14h9" />
        </svg>
      );
    case 'calc_checker':
      return (
        <svg {...common}>
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <path d="M8 7h8" />
          <path d="M8 12h2M12 12h4M8 16h2M12 16h4" />
        </svg>
      );
    case 'opcvl':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
          <path d="M8 11h6" />
        </svg>
      );
    case 'outline':
      return (
        <svg {...common}>
          <path d="M8 6h12M8 12h12M8 18h12" />
          <path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01" />
        </svg>
      );
    case 'timeline':
      return (
        <svg {...common}>
          <path d="M4 12h16" />
          <circle cx="7" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="17" cy="12" r="2" />
        </svg>
      );
    case 'literary_device':
      return (
        <svg {...common}>
          <path d="M20 4 9.5 14.5" />
          <path d="M20 4c-5.5 0-9.5 4-9.5 9.5 0 1.4.3 2.7.8 3.8L7 21l3.7-4.3c1.1.5 2.4.8 3.8.8 5.5 0 9.5-4 9.5-9.5V4Z" />
        </svg>
      );
    case 'global_issue':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a13 13 0 0 1 0 18a13 13 0 0 1 0-18Z" />
        </svg>
      );
    case 'text_type':
      return (
        <svg {...common}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
          <path d="M8 9h8M8 13h5" />
        </svg>
      );
    case 'grammar_lab':
      return (
        <svg {...common}>
          <path d="M4 7V4h16v3" />
          <path d="M9 20h6" />
          <path d="M12 4v16" />
        </svg>
      );
    case 'formula_booklet':
      return (
        <svg {...common}>
          <path d="M18 5H7l6 7-6 7h11" />
        </svg>
      );
    case 'walkthrough':
    default:
      return (
        <svg {...common}>
          <path d="M4 17 10 11l4 4 6-6" />
          <path d="M14 9h6v6" />
        </svg>
      );
  }
}

function ToolGridSection({
  heading,
  subheading,
  items,
}: {
  heading: string;
  subheading: string;
  items: SubjectToolCard[];
}) {
  return (
    <>
      <div
        className="text-[14px] font-semibold text-[#3F3F46] mt-[24px] mb-[10px] flex justify-between items-center gap-2 flex-wrap"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        <span>{heading}</span>
        <span className="font-sans text-[12px] font-normal text-[#71717A]">
          {subheading}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-[6px] gap-x-[24px]">
        {items.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="flex items-center gap-[13px] px-[12px] py-[10px] rounded-[14px] hover:bg-[#F4F4F5] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
          >
            <div
              className="w-[42px] h-[42px] rounded-[11px] flex items-center justify-center flex-shrink-0"
              style={{
                background: item.bgHex,
                color: item.colorHex,
              }}
            >
              <SubjectToolIcon iconName={item.iconName} />
            </div>
            <div className="min-w-0">
              <div className="text-[14px] font-semibold text-[#18181B] break-words">
                {item.title}
              </div>
              <div className="text-[12px] text-[#71717A] leading-[1.35] break-words">
                {item.description}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

class UnauthorizedError extends Error {}

export function SubjectHubClient({
  subject,
  topics,
  initialTab = 'resources',
}: SubjectHubClientProps) {
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;
  const [activeTab, setActiveTab] = useState<HubTab>(() =>
    normalizeHubTab(initialTab)
  );

  const [hubScreen, setHubScreen] = useState<ScreenState<HubDataPayload>>({
    status: 'loading',
  });
  const [reloadNonce, setReloadNonce] = useState(0);
  const [planMutation, setPlanMutation] = useState<PlanMutationState>({
    status: 'idle',
  });
  const [actionError, setActionError] = useState<string | null>(null);
  const mutationControllersRef = useRef<Set<AbortController>>(new Set());

  useEffect(() => {
    setActiveTab(normalizeHubTab(initialTab));
  }, [initialTab, subject.slug]);

  useEffect(() => {
    const controllers = mutationControllersRef.current;
    return () => {
      for (const controller of controllers) {
        controller.abort();
      }
      controllers.clear();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setHubScreen({ status: 'loading' });
    setActionError(null);

    async function fetchJsonOrThrow<T>(url: string): Promise<T> {
      const res = await fetch(url, { signal: controller.signal });
      if (res.status === 401) {
        routerRef.current.push('/login');
        throw new UnauthorizedError('Unauthorized');
      }
      if (!res.ok) {
        throw new Error(`Failed to fetch ${url}`);
      }
      return (await res.json()) as T;
    }

    Promise.all([
      fetchJsonOrThrow<{ progress?: Record<string, MasteryStatus> }>(
        '/api/progress'
      ),
      fetchJsonOrThrow<{ bookmarks?: BookmarkItem[] }>(
        `/api/bookmarks?subject=${subject.slug}`
      ),
      fetchJsonOrThrow<{ tasks?: StudyTaskItem[] }>('/api/planner'),
    ])
      .then(([progressRes, bookmarksRes, plannerRes]) => {
        if (controller.signal.aborted) return;
        const list = plannerRes.tasks ?? [];
        setHubScreen({
          status: 'success',
          data: {
            progressMap: progressRes.progress ?? {},
            bookmarks: bookmarksRes.bookmarks ?? [],
            tasks: list.filter(
              (t) => !t.subjectSlug || t.subjectSlug === subject.slug
            ),
          },
        });
      })
      .catch((err) => {
        if (err?.name === 'AbortError' || err instanceof UnauthorizedError) {
          return;
        }
        setHubScreen({
          status: 'error',
          message: `Unable to load ${subject.name} progress, plan, and saved items.`,
        });
      });

    return () => controller.abort();
  }, [subject.slug, subject.name, reloadNonce]);

  const progressMap =
    hubScreen.status === 'success' ? hubScreen.data.progressMap : {};
  const bookmarks =
    hubScreen.status === 'success' ? hubScreen.data.bookmarks : [];
  const tasks = hubScreen.status === 'success' ? hubScreen.data.tasks : [];

  async function runTrackedMutation(
    url: string,
    init: RequestInit
  ): Promise<Response> {
    const controller = new AbortController();
    mutationControllersRef.current.add(controller);
    try {
      return await fetch(url, { ...init, signal: controller.signal });
    } finally {
      mutationControllersRef.current.delete(controller);
    }
  }

  async function handleMasteryChange(topicId: string, status: MasteryStatus) {
    if (hubScreen.status !== 'success') return;
    const prevStatus = hubScreen.data.progressMap[topicId] ?? 'unseen';
    setActionError(null);
    setHubScreen((prev) =>
      prev.status === 'success'
        ? {
            status: 'success',
            data: {
              ...prev.data,
              progressMap: { ...prev.data.progressMap, [topicId]: status },
            },
          }
        : prev
    );
    try {
      const res = await runTrackedMutation('/api/progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId, status }),
      });
      if (res.status === 401) {
        routerRef.current.push('/login');
        return;
      }
      if (!res.ok) {
        throw new Error('Failed to update mastery status.');
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setHubScreen((prev) =>
        prev.status === 'success'
          ? {
              status: 'success',
              data: {
                ...prev.data,
                progressMap: { ...prev.data.progressMap, [topicId]: prevStatus },
              },
            }
          : prev
      );
      setActionError('Could not save topic mastery status. Please retry.');
    }
  }

  async function handleGenerateSubjectSchedule() {
    setPlanMutation({ status: 'generating' });
    setActionError(null);
    try {
      const res = await runTrackedMutation('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generateSchedule: true,
          subjectSlug: subject.slug,
        }),
      });
      if (res.status === 401) {
        routerRef.current.push('/login');
        return;
      }
      if (!res.ok) {
        throw new Error('Failed to generate schedule.');
      }
      const data = await res.json();
      const all = (data.tasks ?? []) as StudyTaskItem[];
      const subjectTasks = all.filter(
        (t) => !t.subjectSlug || t.subjectSlug === subject.slug
      );
      setHubScreen((prev) =>
        prev.status === 'success'
          ? {
              status: 'success',
              data: { ...prev.data, tasks: subjectTasks },
            }
          : {
              status: 'success',
              data: { progressMap: {}, bookmarks: [], tasks: subjectTasks },
            }
      );
      setPlanMutation({ status: 'idle' });
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setPlanMutation({
        status: 'error',
        message: `Could not generate a 7-day ${subject.name} plan right now.`,
      });
    }
  }

  async function handleToggleTask(task: StudyTaskItem) {
    if (hubScreen.status !== 'success') return;
    const prevCompleted = task.completed;
    const nextCompleted = task.completed ? 0 : 1;
    setActionError(null);
    setHubScreen((prev) =>
      prev.status === 'success'
        ? {
            status: 'success',
            data: {
              ...prev.data,
              tasks: prev.data.tasks.map((t) =>
                t.id === task.id ? { ...t, completed: nextCompleted } : t
              ),
            },
          }
        : prev
    );
    try {
      const res = await runTrackedMutation('/api/planner', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id, completed: Boolean(nextCompleted) }),
      });
      if (res.status === 401) {
        routerRef.current.push('/login');
        return;
      }
      if (!res.ok) {
        throw new Error('Failed to update task');
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setHubScreen((prev) =>
        prev.status === 'success'
          ? {
              status: 'success',
              data: {
                ...prev.data,
                tasks: prev.data.tasks.map((t) =>
                  t.id === task.id ? { ...t, completed: prevCompleted } : t
                ),
              },
            }
          : prev
      );
      setActionError('Could not update study task. Please retry.');
    }
  }

  async function handleRemoveBookmark(id: string) {
    if (hubScreen.status !== 'success') return;
    const prevBookmarks = hubScreen.data.bookmarks;
    setActionError(null);
    setHubScreen((prev) =>
      prev.status === 'success'
        ? {
            status: 'success',
            data: {
              ...prev.data,
              bookmarks: prev.data.bookmarks.filter((b) => b.id !== id),
            },
          }
        : prev
    );
    try {
      const res = await runTrackedMutation(
        `/api/bookmarks?id=${encodeURIComponent(id)}`,
        { method: 'DELETE' }
      );
      if (res.status === 401) {
        routerRef.current.push('/login');
        return;
      }
      if (!res.ok) {
        throw new Error('Failed to delete bookmark');
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setHubScreen((prev) =>
        prev.status === 'success'
          ? {
              status: 'success',
              data: { ...prev.data, bookmarks: prevBookmarks },
            }
          : prev
      );
      setActionError('Could not remove saved bookmark. Please retry.');
    }
  }

  // Group topics by unitCode
  const groupedUnits = useMemo(
    () =>
      topics.reduce<
        Array<{ unitCode: string; unitTitle: string; items: SyllabusTopic[] }>
      >((acc, t) => {
        const existing = acc.find((u) => u.unitCode === t.unitCode);
        if (existing) {
          existing.items.push(t);
        } else {
          acc.push({ unitCode: t.unitCode, unitTitle: t.unitTitle, items: [t] });
        }
        return acc;
      }, []),
    [topics]
  );

  return (
    <div
      style={
        {
          '--wash-1': subject.themeTokens.wash1,
          '--wash-2': subject.themeTokens.wash2,
          '--wash-3': subject.themeTokens.wash3,
          '--subj-accent': subject.themeTokens.accent,
          '--subj-soft': subject.themeTokens.soft,
        } as React.CSSProperties
      }
    >
      <div className="aurora-header !pb-0">
        <div className="col-center">
          <div className="flex items-baseline gap-[10px] pt-[10px]">
            <h1 className="h-title">{subject.name}</h1>
            <span className="h-sub">{subject.level}</span>
          </div>

          <div
            role="tablist"
            aria-label={`${subject.name} workspace tabs`}
            className="flex gap-[22px] border-b border-[#E4E4E7] mt-[16px] overflow-x-auto"
          >
            {[
              { id: 'resources', label: 'Resources' },
              { id: 'topics', label: 'Topics & Progress' },
              { id: 'plan', label: 'Study Plan' },
              { id: 'saved', label: 'Saved' },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`hub-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`hub-panel-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as HubTab)}
                  style={{
                    borderBottomColor: active
                      ? subject.themeTokens.accent
                      : 'transparent',
                  }}
                  className={`py-[9px] px-[2px] pb-[11px] text-[13px] border-b-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] rounded-sm whitespace-nowrap cursor-pointer ${
                    active
                      ? 'text-[#18181B] font-semibold'
                      : 'text-[#71717A] font-medium hover:text-[#18181B]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="main-pad">
        <div className="col-center">
          {activeTab === 'resources' && (
            <div
              role="tabpanel"
              id="hub-panel-resources"
              aria-labelledby="hub-tab-resources"
            >
              {/* Coursework IA Stepper Card */}
              <div className="my-[18px] mb-[22px] border border-[#E4E4E7] rounded-[14px] px-[18px] py-[14px] bg-[#FFFFFF] flex items-center justify-between gap-[14px] flex-wrap">
                <div className="min-w-0">
                  <div className="text-[11.5px] text-[#71717A]">
                    {subject.iaConfig.iaLabel}
                  </div>
                  <div className="text-[14.5px] font-semibold text-[#18181B]">
                    {subject.iaConfig.iaTitle}
                  </div>
                </div>

                <div className="flex gap-[14px] flex-wrap">
                  {subject.iaConfig.steps.map((step, i) => (
                    <span
                      key={step}
                      className="inline-flex items-center gap-[6px] text-[12.5px] text-[#52525B]"
                    >
                      <span className="w-[18px] h-[18px] rounded-full bg-[#F4F4F5] text-[#3F3F46] text-[11px] font-semibold inline-flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </span>
                  ))}
                </div>

                <Link
                  href={`/essay-studio?subject=${subject.slug}`}
                  className="pill-btn shrink-0"
                >
                  Setup &gt;
                </Link>
              </div>

              {/* Tailored Per-Subject Spotlight Strip */}
              <div
                className="mb-[24px] border border-[#E4E4E7] border-l-[3.5px] rounded-[12px] px-[16px] py-[13px] flex items-center justify-between gap-[14px] flex-wrap"
                style={{
                  borderLeftColor: subject.themeTokens.accent,
                  background: subject.themeTokens.soft,
                }}
              >
                <div className="text-[12.5px] font-semibold text-[#18181B] min-w-0">
                  {subject.spotlight.title}
                </div>
                <div className="flex gap-[6px] flex-wrap">
                  {subject.spotlight.pills.map((pill) => {
                    const tabPrefix = `/subjects/${subject.slug}?tab=`;
                    const targetTab = pill.href.startsWith(tabPrefix)
                      ? normalizeHubTab(pill.href.slice(tabPrefix.length))
                      : null;
                    return (
                      <Link
                        key={pill.label}
                        href={pill.href}
                        onClick={
                          targetTab ? () => setActiveTab(targetTab) : undefined
                        }
                        className="px-[10px] py-[4px] rounded-full bg-[#FFFFFF] border border-[#E4E4E7] text-[11.5px] font-medium text-[#18181B] hover:bg-[#F4F4F5] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
                      >
                        {pill.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <ToolGridSection
                heading="Practice"
                subheading="Active recall & testing"
                items={subject.practiceTools}
              />

              <ToolGridSection
                heading="Learn & Coursework"
                subheading={`Tailored to ${subject.name} ${subject.level}`}
                items={subject.learnTools}
              />
            </div>
          )}

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

          {activeTab === 'topics' && (
            <div
              role="tabpanel"
              id="hub-panel-topics"
              aria-labelledby="hub-tab-topics"
              className="mt-5 space-y-6"
            >
              {hubScreen.status === 'error' && (
                <div
                  role="alert"
                  className="flex items-center justify-between gap-3 flex-wrap rounded-[12px] border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[12.5px] text-[#B91C1C]"
                >
                  <span>{hubScreen.message}</span>
                  <button
                    type="button"
                    onClick={() => setReloadNonce((n) => n + 1)}
                    className="pill-btn"
                  >
                    Retry
                  </button>
                </div>
              )}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="min-w-0">
                  <h2
                    className="text-[16px] font-semibold text-[#18181B]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Official {subject.name} {subject.level} Syllabus &amp; Mastery Tracker
                  </h2>
                  <p className="text-[12.5px] text-[#71717A]">
                    First Assessment {subject.syllabusFirstAssessment} · Track your 6-state mastery per subtopic
                    {hubScreen.status === 'loading' ? ' · Syncing mastery...' : ''}
                  </p>
                </div>
                <Link
                  href={`/questions?subject=${subject.slug}`}
                  className="pill-btn-dark shrink-0"
                >
                  Practice All {subject.name} Questions →
                </Link>
              </div>

              {groupedUnits.map((unit) => (
                <div
                  key={unit.unitCode}
                  className="border border-[#E4E4E7] rounded-[14px] bg-[#FFFFFF] overflow-hidden"
                >
                  <div className="px-4 py-3 bg-[#FAFAFA] border-b border-[#E4E4E7] flex items-center justify-between gap-2 flex-wrap">
                    <div className="min-w-0">
                      <span className="font-mono text-[11.5px] font-semibold text-[#71717A] mr-2">
                        {unit.unitCode}
                      </span>
                      <span className="text-[14px] font-semibold text-[#18181B]">
                        {unit.unitTitle}
                      </span>
                    </div>
                    <span className="mini-tag shrink-0">
                      {unit.items.length} Subtopics
                    </span>
                  </div>

                  <div className="divide-y divide-[#F4F4F5]">
                    {unit.items.map((topic) => {
                      const currentStatus =
                        progressMap[topic.id] ?? 'unseen';
                      const badge =
                        MASTERY_STATES.find((m) => m.value === currentStatus) ??
                        MASTERY_STATES[5];

                      return (
                        <div
                          key={topic.id}
                          className="p-4 flex items-center justify-between gap-4 flex-wrap hover:bg-[#FAFAFA] transition-colors duration-150"
                        >
                          <div className="min-w-0 sm:min-w-[240px] flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-[12px] font-semibold px-2 py-0.5 rounded bg-[#F4F4F5] text-[#18181B]">
                                {topic.code}
                              </span>
                              <span className="text-[13.5px] font-semibold text-[#18181B]">
                                {topic.title}
                              </span>
                              <span className="mini-tag">{topic.levelScope}</span>
                              <span className="text-[11px] text-[#71717A]">
                                {topic.recommendedHours}h
                              </span>
                            </div>
                            {topic.guidingQuestions[0] && (
                              <p className="text-[12px] text-[#71717A] mt-1 break-words">
                                <KaTeXText text={topic.guidingQuestions[0]} as="span" />
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <select
                              aria-label={`Mastery status for ${topic.code} ${topic.title}`}
                              aria-busy={hubScreen.status === 'loading'}
                              disabled={hubScreen.status !== 'success'}
                              value={currentStatus}
                              onChange={(e) =>
                                handleMasteryChange(
                                  topic.id,
                                  e.target.value as MasteryStatus
                                )
                              }
                              style={{
                                background: badge.bg,
                                color: badge.text,
                              }}
                              className="px-2.5 py-1 rounded-full text-[11.5px] font-semibold border border-[#E4E4E7] cursor-pointer disabled:opacity-65 disabled:cursor-wait transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
                            >
                              {MASTERY_STATES.map((st) => (
                                <option key={st.value} value={st.value}>
                                  {st.label}
                                </option>
                              ))}
                            </select>

                            <Link
                              href={`/study-guides?subject=${subject.slug}&topic=${topic.id}`}
                              className="pill-btn"
                            >
                              Notes
                            </Link>
                            <Link
                              href={`/questions?subject=${subject.slug}&topicId=${topic.id}`}
                              className="pill-btn"
                            >
                              Questions
                            </Link>
                            <Link
                              href={`/tools/blurting?subject=${subject.slug}&topicId=${topic.id}`}
                              className="pill-btn"
                            >
                              Blurt
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'plan' && (
            <div
              role="tabpanel"
              id="hub-panel-plan"
              aria-labelledby="hub-tab-plan"
              className="mt-5"
            >
              <div className="hairline-card">
                <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                  <div>
                    <h2
                      className="text-[16px] font-semibold text-[#18181B]"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {subject.name} {subject.level} Revision Schedule
                    </h2>
                    <p className="text-[12.5px] text-[#71717A]">
                      Active recall blocks, past paper drills, and IA milestones for {subject.name}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={handleGenerateSubjectSchedule}
                      disabled={planMutation.status === 'generating'}
                      className="pill-btn-dark"
                    >
                      {planMutation.status === 'generating'
                        ? 'Generating...'
                        : `Generate 7-Day ${subject.name} Plan`}
                    </button>
                    <Link href="/planner" className="pill-btn">
                      Open Full Planner →
                    </Link>
                  </div>
                </div>

                {planMutation.status === 'error' && (
                  <div
                    role="alert"
                    className="mb-3 flex items-center justify-between gap-3 flex-wrap rounded-[10px] border border-[#FECACA] bg-[#FEF2F2] px-3.5 py-2.5 text-[12.5px] text-[#B91C1C]"
                  >
                    <span>{planMutation.message}</span>
                    <button
                      type="button"
                      onClick={handleGenerateSubjectSchedule}
                      className="pill-btn"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {hubScreen.status === 'loading' ? (
                  <div className="py-4 space-y-2.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-12 rounded-[10px] bg-[#F4F4F5] animate-pulse"
                      />
                    ))}
                  </div>
                ) : hubScreen.status === 'error' ? (
                  <div role="alert" className="py-8 text-center">
                    <p className="text-[13px] text-[#B91C1C] mb-3">
                      {hubScreen.message}
                    </p>
                    <button
                      type="button"
                      onClick={() => setReloadNonce((n) => n + 1)}
                      className="pill-btn-dark"
                    >
                      Retry Loading Plan
                    </button>
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-[13px] text-[#71717A] mb-3">
                      No study blocks scheduled specifically for {subject.name} yet.
                    </p>
                    <button
                      type="button"
                      onClick={handleGenerateSubjectSchedule}
                      disabled={planMutation.status === 'generating'}
                      className="pill-btn-dark"
                    >
                      {planMutation.status === 'generating'
                        ? 'Generating...'
                        : `Create 7-Day ${subject.name} Schedule`}
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-[#F4F4F5]">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="py-3 flex items-center justify-between flex-wrap gap-3"
                      >
                        <label className="flex items-center gap-3 cursor-pointer min-w-0 flex-1">
                          <input
                            type="checkbox"
                            checked={Boolean(task.completed)}
                            onChange={() => handleToggleTask(task)}
                            className="w-4 h-4 rounded border-[#E4E4E7] accent-[#18181B] shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
                          />
                          <div className="min-w-0">
                            <div
                              className={`text-[13.5px] font-medium break-words ${
                                task.completed
                                  ? 'line-through text-[#71717A]'
                                  : 'text-[#18181B]'
                              }`}
                            >
                              {task.title}
                            </div>
                            <div className="text-[11.5px] text-[#71717A] font-mono">
                              {task.scheduledDate} · {task.durationMinutes} min ·{' '}
                              {task.taskType}
                            </div>
                          </div>
                        </label>
                        <span className="mini-tag uppercase shrink-0">
                          {task.taskType}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'saved' && (
            <div
              role="tabpanel"
              id="hub-panel-saved"
              aria-labelledby="hub-tab-saved"
              className="mt-5"
            >
              <div className="hairline-card">
                <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                  <div>
                    <h2
                      className="text-[16px] font-semibold text-[#18181B]"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      Saved {subject.name} {subject.level} Resources
                    </h2>
                    <p className="text-[12.5px] text-[#71717A]">
                      Bookmarked questions, cheatsheets, and tools for quick exam review
                    </p>
                  </div>
                  <Link href="/saved" className="pill-btn">
                    All Saved Items →
                  </Link>
                </div>

                {hubScreen.status === 'loading' ? (
                  <div className="py-4 space-y-2.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-12 rounded-[10px] bg-[#F4F4F5] animate-pulse"
                      />
                    ))}
                  </div>
                ) : hubScreen.status === 'error' ? (
                  <div role="alert" className="py-8 text-center">
                    <p className="text-[13px] text-[#B91C1C] mb-3">
                      {hubScreen.message}
                    </p>
                    <button
                      type="button"
                      onClick={() => setReloadNonce((n) => n + 1)}
                      className="pill-btn-dark"
                    >
                      Retry Loading Saved Items
                    </button>
                  </div>
                ) : bookmarks.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-[13px] text-[#71717A] mb-3">
                      You haven&apos;t saved any {subject.name} items yet.
                    </p>
                    <Link
                      href={`/questions?subject=${subject.slug}`}
                      className="pill-btn-dark"
                    >
                      Explore {subject.name} Questionbank →
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-[#F4F4F5]">
                    {bookmarks.map((bm) => (
                      <div
                        key={bm.id}
                        className="py-3 flex items-center justify-between flex-wrap gap-3"
                      >
                        <div className="min-w-0">
                          <Link
                            href={bm.href}
                            className="text-[13.5px] font-semibold text-[#18181B] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] rounded"
                          >
                            {bm.title}
                          </Link>
                          <div className="text-[12px] text-[#71717A]">
                            {bm.subtitle}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Link href={bm.href} className="pill-btn">
                            Open →
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleRemoveBookmark(bm.id)}
                            aria-label={`Remove saved item ${bm.title}`}
                            className="pill-btn !text-[#DC2626]"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
