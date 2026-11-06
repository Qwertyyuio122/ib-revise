'use client';

import React from 'react';
import Link from 'next/link';
import {
  Microscope,
  ScrollText,
  BookOpen,
  Sigma,
  Languages,
  FlaskConical,
  Lightbulb,
  FilePenLine,
  ClipboardCheck,
} from 'lucide-react';
import { DUMMY_SUBJECTS, DUMMY_USER } from '@/data/dummy-data';
import { cn } from '@/lib/utils';

interface SidebarProps {
  selectedSubjectCode: string | null;
  onSelectSubject: (code: string | null) => void;
  selectedCoreCategory: string | null;
  onSelectCoreCategory: (category: string | null) => void;
  onStartStudySession: () => void;
}

const SUBJECT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  BIO_HL: Microscope,
  HIST_HL: ScrollText,
  ENG_LIT_HL: BookOpen,
  MATH_AA_SL: Sigma,
  FR_B_SL: Languages,
  CHEM_SL: FlaskConical,
};

const CORE_NAV_ITEMS = [
  { label: 'Theory of Knowledge', icon: Lightbulb },
  { label: 'Extended Essay', icon: FilePenLine },
  { label: 'Internal Assessment', icon: ClipboardCheck },
];

export function Sidebar({
  selectedSubjectCode,
  onSelectSubject,
  selectedCoreCategory,
  onSelectCoreCategory,
  onStartStudySession,
}: SidebarProps) {
  return (
    <aside className="flex w-[260px] shrink-0 flex-col justify-between border-r border-border-subtle bg-surface-canvas px-4 py-6 select-none">
      <div className="space-y-7">
        <div className="px-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[20px] font-semibold tracking-[-0.02em] text-text-primary"
          >
            <span>ib revise</span>
            <span className="h-2 w-2 rounded-full bg-accent-blush shadow-[0_0_10px_#f4a7b9]" />
          </Link>
          <p className="mt-0.5 text-[13px] text-text-secondary">
            {DUMMY_USER.session}
          </p>
        </div>

        <div>
          <div className="mb-2.5 flex items-center justify-between px-3">
            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-text-secondary">
              Subjects
            </span>
            {selectedSubjectCode && (
              <button
                onClick={() => onSelectSubject(null)}
                className="text-[11px] text-accent-blush hover:underline"
              >
                All
              </button>
            )}
          </div>

          <nav className="space-y-1" aria-label="IB Subjects">
            {DUMMY_SUBJECTS.map((subject) => {
              const Icon = SUBJECT_ICONS[subject.code] || BookOpen;
              const isSelected = selectedSubjectCode === subject.code;

              return (
                <button
                  key={subject.id}
                  onClick={() => {
                    onSelectCoreCategory(null);
                    onSelectSubject(
                      isSelected ? null : subject.code
                    );
                  }}
                  className={cn(
                    'group flex w-full items-center justify-between rounded-full px-3.5 py-2.5 text-left text-[14px] transition-colors',
                    isSelected
                      ? 'bg-surface-raised font-medium text-text-primary'
                      : 'text-text-secondary hover:bg-surface-card hover:text-text-primary'
                  )}
                >
                  <span className="flex items-center gap-3 truncate">
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0 transition-colors',
                        isSelected
                          ? 'text-text-primary'
                          : 'text-text-secondary group-hover:text-text-primary'
                      )}
                    />
                    <span className="truncate">{subject.name}</span>
                  </span>

                  {isSelected && (
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-blush shrink-0" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mx-3 border-t border-border-subtle" />

        <div>
          <div className="mb-2.5 px-3">
            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-text-secondary">
              IB Core
            </span>
          </div>

          <nav className="space-y-1" aria-label="IB Core">
            {CORE_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedCoreCategory === item.label;

              return (
                <button
                  key={item.label}
                  onClick={() => {
                    onSelectSubject(null);
                    onSelectCoreCategory(isSelected ? null : item.label);
                  }}
                  className={cn(
                    'group flex w-full items-center justify-between rounded-full px-3.5 py-2.5 text-left text-[14px] transition-colors',
                    isSelected
                      ? 'bg-surface-raised font-medium text-text-primary'
                      : 'text-text-secondary hover:bg-surface-card hover:text-text-primary'
                  )}
                >
                  <span className="flex items-center gap-3 truncate">
                    <Icon className="h-4 w-4 shrink-0 text-text-secondary group-hover:text-text-primary" />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {isSelected && (
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-blush shrink-0" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="px-2 pt-1">
          <button
            onClick={onStartStudySession}
            className="flex w-full items-center justify-center gap-2.5 rounded-full border border-border-subtle bg-surface-card py-2.5 px-4 text-[13px] font-medium text-text-primary transition-all duration-200 hover:border-accent-blush/40 hover:bg-surface-raised"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent-blush" />
            <span>Study Session</span>
          </button>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3 px-3 pt-4 border-t border-border-subtle/60">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border-subtle bg-surface-raised text-[12px] font-medium text-accent-blush">
          AM
        </div>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-text-primary">
            {DUMMY_USER.name}
          </p>
          <p className="truncate text-[12px] text-text-secondary">
            {DUMMY_USER.session}
          </p>
        </div>
      </div>
    </aside>
  );
}
