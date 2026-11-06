'use client';

import React, { useState } from 'react';
import {
  Search,
  Moon,
  Bell,
  UserCircle2,
  Flag,
  Menu,
  X,
} from 'lucide-react';
import {
  DUMMY_SUBJECTS,
  DUMMY_IB_CORE_ITEMS,
  DUMMY_SYLLABUS_TOPICS,
  DUMMY_USER,
} from '@/data/dummy-data';
import { Subject } from '@/types/database';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { PillButton } from '@/components/ui/PillButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SampleDrawer } from '@/components/questions/SampleDrawer';
import { cn } from '@/lib/utils';

type TopTab = 'Dashboard' | 'Revision Log' | 'Past Papers' | 'Milestones';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TopTab>('Dashboard');
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string | null>(
    'BIO_HL'
  );
  const [selectedCoreCategory, setSelectedCoreCategory] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [focusMode, setFocusMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [drawerState, setDrawerState] = useState<{
    subject: Subject | null;
    mode: 'questions' | 'flashcards';
  }>({
    subject: null,
    mode: 'questions',
  });

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

  return (
    <div className="flex min-h-screen bg-surface-canvas text-text-primary">
      {!focusMode && (
        <div className="hidden lg:flex">
          <Sidebar
            selectedSubjectCode={selectedSubjectCode}
            onSelectSubject={setSelectedSubjectCode}
            selectedCoreCategory={selectedCoreCategory}
            onSelectCoreCategory={setSelectedCoreCategory}
            onStartStudySession={handleStartStudySession}
          />
        </div>
      )}

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/70 backdrop-blur-xs">
          <div className="relative flex h-full">
            <Sidebar
              selectedSubjectCode={selectedSubjectCode}
              onSelectSubject={(code) => {
                setSelectedSubjectCode(code);
                setMobileMenuOpen(false);
              }}
              selectedCoreCategory={selectedCoreCategory}
              onSelectCoreCategory={(cat) => {
                setSelectedCoreCategory(cat);
                setMobileMenuOpen(false);
              }}
              onStartStudySession={() => {
                setMobileMenuOpen(false);
                handleStartStudySession();
              }}
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
                      onClick={() => setActiveTab(tab)}
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

            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-secondary" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter topics..."
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

              <button
                className="rounded-full p-2 text-text-secondary transition-colors hover:bg-surface-card hover:text-text-primary"
                aria-label="Session reminders"
              >
                <Bell className="h-4 w-4" />
              </button>
              <button
                className="rounded-full p-2 text-text-secondary transition-colors hover:bg-surface-card hover:text-text-primary"
                aria-label="Student profile"
              >
                <UserCircle2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1280px] flex-1 px-6 lg:px-10 py-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-[28px] font-semibold leading-[36px] tracking-[-0.015em] text-text-primary">
                {selectedCoreCategory ? selectedCoreCategory : 'Subjects'}
              </h1>
              <p className="mt-1 text-[15px] leading-[24px] text-text-secondary">
                {selectedCoreCategory
                  ? 'Review draft milestones, word count progress, and supervisor notes.'
                  : 'Choose a discipline to start your active recall session.'}
              </p>
            </div>

            {selectedCoreCategory && (
              <PillButton
                size="sm"
                variant="secondary"
                onClick={() => setSelectedCoreCategory(null)}
              >
                Back to All 6 Subjects
              </PillButton>
            )}
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
                        Next syllabus focus: Topic {subjectTopics[0].topicNumber}{' '}
                        • {subjectTopics[0].title}
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
                      onClick={() => openSampleDrawer(subject, 'flashcards')}
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
              {DUMMY_IB_CORE_ITEMS.map((item, idx) => {
                const isSelectedCore =
                  selectedCoreCategory === item.categoryLabel;

                return (
                  <div
                    key={item.id}
                    onClick={() =>
                      setSelectedCoreCategory(
                        isSelectedCore ? null : item.categoryLabel
                      )
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

                    {isSelectedCore && item.supervisorFeedback && (
                      <p className="mt-2.5 pl-4 text-[12px] text-text-secondary border-l border-accent-blush/40 ml-1">
                        {item.supervisorFeedback}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>

      <SampleDrawer
        subject={drawerState.subject}
        initialMode={drawerState.mode}
        onClose={() => setDrawerState((prev) => ({ ...prev, subject: null }))}
      />
    </div>
  );
}
