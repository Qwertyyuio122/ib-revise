'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Moon,
  Bell,
  Flag,
  Menu,
  X,
  LogOut,
  Bookmark,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  DUMMY_SUBJECTS,
  DUMMY_IB_CORE_ITEMS,
  DUMMY_SYLLABUS_TOPICS,
  DUMMY_USER,
} from '@/data/dummy-data';
import { IBCoreItem, SampleQuestion, Subject } from '@/types/database';
import { createClient } from '@/lib/supabase/client';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { PillButton } from '@/components/ui/PillButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MathMarkdown } from '@/components/ui/MathMarkdown';
import { SampleDrawer } from '@/components/questions/SampleDrawer';
import { cn } from '@/lib/utils';

type TopTab = 'Dashboard' | 'Revision Log' | 'Past Papers' | 'Milestones';

interface ActivityRow {
  question_id: string;
  status: 'BOOKMARKED' | 'ATTEMPTED' | 'MASTERED' | null;
  last_practiced_at: string | null;
}

interface DashboardWorkspaceProps {
  userId: string;
  initialUserName: string;
  initialUserSession: string;
  initialSubjectCode: string | null;
  initialCoreItems: IBCoreItem[];
}

export function DashboardWorkspace({
  userId,
  initialUserName,
  initialUserSession,
  initialSubjectCode,
  initialCoreItems,
}: DashboardWorkspaceProps) {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<TopTab>('Dashboard');
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string | null>(
    initialSubjectCode ?? 'BIO_HL'
  );
  const [selectedCoreCategory, setSelectedCoreCategory] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [focusMode, setFocusMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [remindersOpen, setRemindersOpen] = useState(false);

  const [drawerState, setDrawerState] = useState<{
    subject: Subject | null;
    mode: 'questions' | 'flashcards';
  }>({
    subject: null,
    mode: 'questions',
  });

  // Past Papers tab state
  const [paperFilter, setPaperFilter] = useState<'ALL' | 'P1' | 'P2' | 'P3'>(
    'ALL'
  );
  const [pastPapers, setPastPapers] = useState<SampleQuestion[]>([]);
  const [loadingPastPapers, setLoadingPastPapers] = useState(false);
  const [revealedSchemes, setRevealedSchemes] = useState<
    Record<string, boolean>
  >({});

  // Revision Log tab state
  const [activityRows, setActivityRows] = useState<ActivityRow[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(false);

  const coreItems =
    initialCoreItems.length > 0 ? initialCoreItems : DUMMY_IB_CORE_ITEMS;

  // Cmd+K / Ctrl+K shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Load Past Papers when Past Papers tab is active
  const fetchPastPapers = useCallback(async () => {
    setLoadingPastPapers(true);
    try {
      const params = new URLSearchParams();
      if (selectedSubjectCode) params.set('subject', selectedSubjectCode);
      if (paperFilter !== 'ALL') params.set('paper', paperFilter);
      if (searchQuery.trim()) params.set('q', searchQuery.trim());
      params.set('limit', '20');

      const res = await fetch(`/api/questions?${params.toString()}`);
      const payload = await res.json();
      setPastPapers(Array.isArray(payload.questions) ? payload.questions : []);
    } catch {
      setPastPapers([]);
    } finally {
      setLoadingPastPapers(false);
    }
  }, [selectedSubjectCode, paperFilter, searchQuery]);

  useEffect(() => {
    if (activeTab !== 'Past Papers') return;
    const timer = setTimeout(() => {
      fetchPastPapers();
    }, 200);
    return () => clearTimeout(timer);
  }, [activeTab, fetchPastPapers]);

  // Load Revision Log when Revision Log tab is active
  useEffect(() => {
    if (activeTab !== 'Revision Log') return;
    let cancelled = false;
    setLoadingActivity(true);

    const supabase = createClient();
    supabase
      .from('user_question_activity')
      .select('question_id, status, last_practiced_at')
      .eq('user_id', userId)
      .order('last_practiced_at', { ascending: false })
      .limit(30)
      .then(({ data }) => {
        if (cancelled) return;
        setActivityRows((data as ActivityRow[]) || []);
        setLoadingActivity(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab, userId]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const filteredSubjects = DUMMY_SUBJECTS.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.subtitle.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q)
    );
  });

  const openSampleDrawer = (
    subject: Subject,
    mode: 'questions' | 'flashcards'
  ) => {
    setSelectedSubjectCode(subject.code);
    setDrawerState({ subject, mode });
  };

  const handleStartStudySession = () => {
    const activeSub =
      DUMMY_SUBJECTS.find((s) => s.code === selectedSubjectCode) ||
      DUMMY_SUBJECTS[0];
    openSampleDrawer(activeSub, 'flashcards');
  };

  const handleSelectCoreFromSidebar = (cat: string | null) => {
    setSelectedCoreCategory(cat);
    if (cat) {
      setActiveTab('Dashboard');
    }
  };

  const selectedCoreItem = selectedCoreCategory
    ? coreItems.find((item) => item.categoryLabel === selectedCoreCategory) ||
      null
    : null;

  return (
    <div className="flex min-h-screen bg-surface-canvas text-text-primary">
      {!focusMode && (
        <div className="hidden lg:flex">
          <Sidebar
            selectedSubjectCode={selectedSubjectCode}
            onSelectSubject={(code) => {
              setSelectedSubjectCode(code);
              if (code) setSelectedCoreCategory(null);
            }}
            selectedCoreCategory={selectedCoreCategory}
            onSelectCoreCategory={handleSelectCoreFromSidebar}
            onStartStudySession={handleStartStudySession}
            userName={initialUserName}
            userSession={initialUserSession}
            isAuthenticated={true}
            onSignOut={handleSignOut}
          />
        </div>
      )}

      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-50 flex lg:hidden bg-black/70 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-full"
          >
            <Sidebar
              selectedSubjectCode={selectedSubjectCode}
              onSelectSubject={(code) => {
                setSelectedSubjectCode(code);
                if (code) setSelectedCoreCategory(null);
                setMobileMenuOpen(false);
              }}
              selectedCoreCategory={selectedCoreCategory}
              onSelectCoreCategory={(cat) => {
                handleSelectCoreFromSidebar(cat);
                setMobileMenuOpen(false);
              }}
              onStartStudySession={() => {
                setMobileMenuOpen(false);
                handleStartStudySession();
              }}
              userName={initialUserName}
              userSession={initialUserSession}
              isAuthenticated={true}
              onSignOut={handleSignOut}
            />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="m-4 h-9 w-9 flex items-center justify-center rounded-full border border-border-subtle bg-surface-card text-text-secondary"
              aria-label="Close navigation menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col min-w-0">
        <header className="border-b border-border-subtle px-6 lg:px-10 py-4">
          <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden rounded-full border border-border-subtle bg-surface-card p-2 text-text-secondary hover:text-text-primary"
                aria-label="Open navigation menu"
              >
                <Menu className="h-4 w-4" />
              </button>

              <nav
                aria-label="Workspace Views"
                className="flex items-center gap-6 text-[13px]"
              >
                {(
                  [
                    'Dashboard',
                    'Revision Log',
                    'Past Papers',
                    'Milestones',
                  ] as TopTab[]
                ).map((tab) => {
                  const isActive = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab);
                        if (tab !== 'Dashboard') {
                          setSelectedCoreCategory(null);
                        }
                      }}
                      className={cn(
                        'relative py-1.5 font-medium transition-colors',
                        isActive
                          ? 'text-text-primary'
                          : 'text-text-secondary hover:text-text-primary'
                      )}
                    >
                      {tab}
                      {isActive && (
                        <span className="absolute inset-x-0 -bottom-[17px] h-[2px] rounded-full bg-accent-blush" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="relative flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-secondary" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter topics (⌘K)..."
                  aria-label="Filter topics"
                  className="w-56 rounded-full border border-border-subtle bg-surface-card pl-9 pr-4 py-1.5 text-[13px] text-text-primary placeholder:text-text-secondary focus:border-accent-blush/40 focus:outline-none"
                />
              </div>

              <button
                onClick={() => setFocusMode((prev) => !prev)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors',
                  focusMode
                    ? 'border-accent-blush bg-accent-blush-glow text-accent-rose-hover'
                    : 'border-border-subtle bg-surface-card text-text-primary hover:bg-surface-raised'
                )}
              >
                <Moon className="h-3.5 w-3.5 text-accent-blush" />
                <span>{focusMode ? 'Exit Focus' : 'Focus Mode'}</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setRemindersOpen((prev) => !prev)}
                  className={cn(
                    'rounded-full p-2 transition-colors hover:bg-surface-card hover:text-text-primary',
                    remindersOpen ? 'text-accent-blush' : 'text-text-secondary'
                  )}
                  aria-label="Session reminders"
                  aria-expanded={remindersOpen}
                >
                  <Bell className="h-4 w-4" />
                </button>

                {remindersOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-border-subtle bg-surface-card p-4 shadow-2xl z-30">
                    <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-text-secondary">
                      Upcoming Deadlines
                    </p>
                    <div className="mt-3 divide-y divide-border-subtle">
                      {coreItems.map((item) => (
                        <div key={item.id} className="py-2.5 first:pt-0 last:pb-0">
                          <p className="text-[13px] font-medium text-text-primary">
                            {item.categoryLabel}
                          </p>
                          <p className="text-[12px] text-text-secondary">
                            {item.highlightNote}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface-card px-3 py-1.5 text-[12px] text-text-secondary transition-colors hover:border-accent-blush/35 hover:text-text-primary"
                title="Sign out"
              >
                <LogOut className="h-3.5 w-3.5 text-accent-blush" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1280px] flex-1 px-6 lg:px-10 py-10">
          {activeTab === 'Dashboard' && selectedCoreItem && (
            <div>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h1 className="text-[28px] font-semibold leading-[36px] tracking-[-0.015em] text-text-primary">
                    {selectedCoreItem.categoryLabel}
                  </h1>
                  <p className="mt-1 text-[15px] leading-[24px] text-text-secondary">
                    {selectedCoreItem.title}
                  </p>
                </div>
                <PillButton
                  size="sm"
                  variant="secondary"
                  onClick={() => setSelectedCoreCategory(null)}
                >
                  Back to All 6 Subjects
                </PillButton>
              </div>

              <div className="mt-8 rounded-2xl border border-border-subtle bg-surface-card p-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-border-subtle">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-accent-blush" />
                    <span className="text-[14px] font-medium text-text-primary">
                      {selectedCoreItem.statusSummary}
                    </span>
                  </div>
                  <StatusBadge
                    label={selectedCoreItem.draftStatus.replace('_', ' ')}
                    active={true}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <p className="text-[12px] text-text-secondary">Word Count</p>
                    <p className="mt-1 text-[20px] font-medium text-text-primary">
                      {selectedCoreItem.wordCount.toLocaleString()} /{' '}
                      {selectedCoreItem.targetWordCount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] text-text-secondary">
                      Target Deadline
                    </p>
                    <p className="mt-1 text-[20px] font-medium text-text-primary">
                      {selectedCoreItem.deadline || 'TBD'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] text-text-secondary">Milestone</p>
                    <p className="mt-1 text-[20px] font-medium text-accent-blush">
                      {selectedCoreItem.highlightNote}
                    </p>
                  </div>
                </div>

                {selectedCoreItem.supervisorFeedback && (
                  <div className="pt-5 border-t border-border-subtle">
                    <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-text-secondary">
                      Supervisor Notes
                    </p>
                    <p className="mt-2 text-[14px] leading-[22px] text-text-primary/90">
                      {selectedCoreItem.supervisorFeedback}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Dashboard' && !selectedCoreItem && (
            <>
              <div>
                <h1 className="text-[28px] font-semibold leading-[36px] tracking-[-0.015em] text-text-primary">
                  Subjects
                </h1>
                <p className="mt-1 text-[15px] leading-[24px] text-text-secondary">
                  Choose a discipline to start your active recall session.
                </p>
              </div>

              <section
                aria-label="Subject Revision Cards"
                className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
              >
                {filteredSubjects.map((subject) => {
                  const isHighlighted = selectedSubjectCode === subject.code;
                  const hasDue = subject.dueCardsCount > 0;
                  const subjectTopics = DUMMY_SYLLABUS_TOPICS.filter(
                    (t) => t.subjectId === subject.id
                  );

                  return (
                    <div
                      key={subject.id}
                      onClick={() => setSelectedSubjectCode(subject.code)}
                      className={cn(
                        'group flex min-h-[220px] cursor-pointer flex-col justify-between rounded-2xl border bg-surface-card p-6 transition-all duration-200 hover:-translate-y-0.5',
                        isHighlighted
                          ? 'border-accent-blush/35'
                          : 'border-border-subtle hover:border-accent-blush/30'
                      )}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <h2 className="text-[19px] font-medium leading-[26px] tracking-[-0.01em] text-text-primary">
                            {subject.name}
                          </h2>
                          <StatusBadge
                            label={subject.statusLabel}
                            active={hasDue}
                            className="shrink-0"
                          />
                        </div>
                        <p className="mt-1.5 text-[14px] leading-[20px] text-text-secondary">
                          {subject.subtitle}
                        </p>

                        {subjectTopics.length > 0 && (
                          <p className="mt-4 text-[12px] text-text-secondary/80">
                            Next syllabus focus: Topic{' '}
                            {subjectTopics[0].topicNumber} •{' '}
                            {subjectTopics[0].title}
                          </p>
                        )}
                      </div>

                      <div
                        className="mt-8 grid grid-cols-2 gap-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <PillButton
                          variant="secondary"
                          size="md"
                          onClick={() => openSampleDrawer(subject, 'questions')}
                          className="w-full text-center"
                        >
                          Question Bank
                        </PillButton>
                        <PillButton
                          variant="secondary"
                          size="md"
                          onClick={() =>
                            openSampleDrawer(subject, 'flashcards')
                          }
                          className="w-full text-center"
                        >
                          Flashcards
                        </PillButton>
                      </div>
                    </div>
                  );
                })}
              </section>

              <section
                aria-label="Core Diploma Milestones"
                className="mt-10 rounded-2xl border border-border-subtle bg-surface-card p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-5">
                  <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-text-secondary">
                    Core Diploma Milestones
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[12px] text-text-secondary">
                    <Flag className="h-3.5 w-3.5 text-text-secondary" />
                    {DUMMY_USER.sessionStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:divide-x md:divide-border-subtle">
                  {coreItems.map((item, idx) => (
                    <div
                      key={item.id}
                      onClick={() =>
                        setSelectedCoreCategory(item.categoryLabel)
                      }
                      className={cn(
                        'cursor-pointer transition-opacity hover:opacity-90',
                        idx > 0 && 'md:pl-6'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'h-2 w-2 rounded-full',
                            idx < 2
                              ? 'bg-accent-blush'
                              : 'bg-text-secondary/60'
                          )}
                        />
                        <h3 className="text-[14px] font-medium text-text-primary">
                          {item.categoryLabel}
                        </h3>
                      </div>

                      <p className="mt-1.5 pl-4 text-[13px] leading-[20px] text-text-secondary">
                        <span>{item.statusSummary}</span>
                        <span className="mx-1.5">•</span>
                        <span
                          className={cn(
                            idx === 1
                              ? 'text-accent-blush font-medium'
                              : 'text-text-primary'
                          )}
                        >
                          {item.highlightNote}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {activeTab === 'Past Papers' && (
            <div>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h1 className="text-[28px] font-semibold leading-[36px] tracking-[-0.015em] text-text-primary">
                    Past Papers
                  </h1>
                  <p className="mt-1 text-[15px] leading-[24px] text-text-secondary">
                    Search and practice past paper questions across your subjects.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {(['ALL', 'P1', 'P2', 'P3'] as const).map((paper) => (
                    <button
                      key={paper}
                      onClick={() => setPaperFilter(paper)}
                      className={cn(
                        'rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-colors',
                        paperFilter === paper
                          ? 'border-accent-blush bg-accent-blush-glow text-accent-rose-hover'
                          : 'border-border-subtle bg-surface-card text-text-secondary hover:text-text-primary'
                      )}
                    >
                      {paper === 'ALL' ? 'All Papers' : `Paper ${paper.slice(1)}`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSelectedSubjectCode(null)}
                  className={cn(
                    'rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-colors',
                    !selectedSubjectCode
                      ? 'border-accent-blush bg-accent-blush-glow text-accent-rose-hover'
                      : 'border-border-subtle bg-surface-card text-text-secondary hover:text-text-primary'
                  )}
                >
                  All Subjects
                </button>
                {DUMMY_SUBJECTS.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubjectCode(sub.code)}
                    className={cn(
                      'rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-colors',
                      selectedSubjectCode === sub.code
                        ? 'border-accent-blush bg-accent-blush-glow text-accent-rose-hover'
                        : 'border-border-subtle bg-surface-card text-text-secondary hover:text-text-primary'
                    )}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>

              <div className="mt-8 space-y-5">
                {loadingPastPapers ? (
                  <div className="rounded-2xl border border-border-subtle bg-surface-card p-6 text-center text-[13px] text-text-secondary">
                    Loading questions...
                  </div>
                ) : pastPapers.length === 0 ? (
                  <div className="rounded-2xl border border-border-subtle bg-surface-card p-8 text-center">
                    <p className="text-[14px] font-medium text-text-primary">
                      No questions match these filters
                    </p>
                    <p className="mt-1.5 text-[13px] text-text-secondary">
                      Try selecting another subject or clearing your search query.
                    </p>
                  </div>
                ) : (
                  pastPapers.map((q) => {
                    const isSchemeOpen = !!revealedSchemes[q.id];
                    return (
                      <div
                        key={q.id}
                        className="rounded-2xl border border-border-subtle bg-surface-card p-6"
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
                          <StatusBadge label={`${q.maxMarks} marks`} />
                        </div>

                        <div className="mt-4">
                          <MathMarkdown content={q.promptMarkdown} />
                        </div>

                        <div className="mt-5 flex items-center justify-between pt-4 border-t border-border-subtle">
                          <span className="text-[12px] text-text-secondary">
                            Paper {q.paper} • Difficulty {q.difficulty}/7
                          </span>
                          <PillButton
                            size="sm"
                            variant="secondary"
                            onClick={() =>
                              setRevealedSchemes((prev) => ({
                                ...prev,
                                [q.id]: !prev[q.id],
                              }))
                            }
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
                          <div className="mt-4 border-t border-border-subtle pt-4">
                            <div className="text-[12px] font-medium uppercase tracking-wider text-accent-blush mb-2">
                              Official Examiner Mark Scheme Notes
                            </div>
                            <MathMarkdown
                              content={q.markSchemeMarkdown}
                              className="text-[14px] leading-[22px] text-text-primary/90"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === 'Revision Log' && (
            <div>
              <h1 className="text-[28px] font-semibold leading-[36px] tracking-[-0.015em] text-text-primary">
                Revision Log
              </h1>
              <p className="mt-1 text-[15px] leading-[24px] text-text-secondary">
                Your saved bookmarks and recent question practice history.
              </p>

              <div className="mt-8 rounded-2xl border border-border-subtle bg-surface-card p-6">
                {loadingActivity ? (
                  <p className="text-[13px] text-text-secondary">
                    Loading your revision log...
                  </p>
                ) : activityRows.length === 0 ? (
                  <div className="py-6 text-center">
                    <p className="text-[14px] font-medium text-text-primary">
                      No saved activity yet
                    </p>
                    <p className="mt-1.5 text-[13px] text-text-secondary">
                      Bookmark questions in any subject drawer to track them here.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border-subtle">
                    {activityRows.map((row) => (
                      <div
                        key={row.question_id}
                        className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3">
                          <Bookmark className="h-4 w-4 text-accent-blush shrink-0" />
                          <span className="text-[14px] font-medium text-text-primary">
                            {row.question_id}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge
                            label={row.status || 'BOOKMARKED'}
                            active={row.status === 'BOOKMARKED'}
                          />
                          {row.last_practiced_at && (
                            <span className="text-[12px] text-text-secondary">
                              {new Date(
                                row.last_practiced_at
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Milestones' && (
            <div>
              <h1 className="text-[28px] font-semibold leading-[36px] tracking-[-0.015em] text-text-primary">
                IB Core Milestones
              </h1>
              <p className="mt-1 text-[15px] leading-[24px] text-text-secondary">
                Track your Theory of Knowledge, Extended Essay, and Internal
                Assessment drafts.
              </p>

              <div className="mt-8 space-y-5">
                {coreItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-border-subtle bg-surface-card p-6"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-border-subtle">
                      <div>
                        <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-accent-blush">
                          {item.categoryLabel}
                        </p>
                        <h2 className="mt-1 text-[18px] font-medium text-text-primary">
                          {item.title}
                        </h2>
                      </div>
                      <StatusBadge
                        label={item.draftStatus.replace('_', ' ')}
                        active={item.draftStatus !== 'OUTLINE'}
                      />
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-[13px] text-text-secondary">
                      <span>
                        Word count: {item.wordCount.toLocaleString()} /{' '}
                        {item.targetWordCount.toLocaleString()}
                      </span>
                      <span>{item.highlightNote}</span>
                    </div>

                    {item.supervisorFeedback && (
                      <p className="mt-4 pt-4 border-t border-border-subtle text-[13px] leading-[20px] text-text-secondary">
                        {item.supervisorFeedback}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      <SampleDrawer
        subject={drawerState.subject}
        initialMode={drawerState.mode}
        userId={userId}
        onClose={() => setDrawerState((prev) => ({ ...prev, subject: null }))}
      />
    </div>
  );
}
