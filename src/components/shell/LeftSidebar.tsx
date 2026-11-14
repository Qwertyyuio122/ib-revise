'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface LeftSidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const MY_SIX_SUBJECTS = [
  { slug: 'bio', label: 'Biology HL', dot: '#059669' },
  { slug: 'chem', label: 'Chemistry SL', dot: '#0D9488' },
  { slug: 'hist', label: 'History HL', dot: '#B45309' },
  { slug: 'eng', label: 'English Lit HL', dot: '#1D4ED8' },
  { slug: 'fr', label: 'French B SL', dot: '#0284C7' },
  { slug: 'math', label: 'Math AA SL', dot: '#D97706' },
];

const COURSEWORK_NAV_ITEMS = [
  { href: '/essay-studio', label: 'AI Essay Studio', tabMatch: null as string | null },
  { href: '/coursework', label: 'Coursework Guides', tabMatch: 'guides' },
  { href: '/coursework?tab=exemplars', label: 'Exemplars', tabMatch: 'exemplars' },
];

function CourseworkNavItems({
  pathname,
  onCloseMobile,
}: {
  pathname: string;
  onCloseMobile: () => void;
}) {
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get('tab') ?? null;

  return (
    <>
      {COURSEWORK_NAV_ITEMS.map((item) => {
        const basePath = item.href.split('?')[0];
        let active = false;
        if (item.tabMatch === null) {
          active = pathname === basePath || pathname.startsWith(`${basePath}/`);
        } else if (item.tabMatch === 'exemplars') {
          active = pathname === '/coursework' && tabParam === 'exemplars';
        } else {
          active = pathname === '/coursework' && tabParam !== 'exemplars';
        }
        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={onCloseMobile}
            className={`py-[5.5px] pr-[10px] pl-[34px] text-[12.5px] rounded-[8px] flex items-center justify-between transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] ${
              active
                ? 'bg-[#E4E4E7] text-[#18181B] font-semibold'
                : 'text-[#52525B] hover:bg-[#EFEFF1] hover:text-[#18181B]'
            }`}
          >
            <span>{item.label}</span>
          </Link>
        );
      })}
    </>
  );
}

function CourseworkNavFallback({
  pathname,
  onCloseMobile,
}: {
  pathname: string;
  onCloseMobile: () => void;
}) {
  return (
    <>
      {COURSEWORK_NAV_ITEMS.map((item) => {
        const basePath = item.href.split('?')[0];
        const active =
          item.tabMatch === null
            ? pathname === basePath
            : item.tabMatch === 'guides' && pathname === '/coursework';
        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={onCloseMobile}
            className={`py-[5.5px] pr-[10px] pl-[34px] text-[12.5px] rounded-[8px] flex items-center justify-between transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] ${
              active
                ? 'bg-[#E4E4E7] text-[#18181B] font-semibold'
                : 'text-[#52525B] hover:bg-[#EFEFF1] hover:text-[#18181B]'
            }`}
          >
            <span>{item.label}</span>
          </Link>
        );
      })}
    </>
  );
}

export function LeftSidebar({ mobileOpen, onCloseMobile }: LeftSidebarProps) {
  const pathname = usePathname();
  const isSubjectRoute = pathname.startsWith('/subjects/');
  const [subjectsExpanded, setSubjectsExpanded] = useState<boolean>(() =>
    pathname.startsWith('/subjects/')
  );

  useEffect(() => {
    if (isSubjectRoute) {
      setSubjectsExpanded(true);
    }
  }, [isSubjectRoute]);

  useEffect(() => {
    if (!mobileOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onCloseMobile();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen, onCloseMobile]);

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  }

  const sidebarContent = (
    <aside className="w-[224px] bg-[#FAFAFA] border-r border-[#F4F4F5] px-[10px] pt-[12px] pb-[14px] flex flex-col justify-between flex-shrink-0 h-full select-none">
      <div className="overflow-y-auto">
        <div className="flex items-center justify-end lg:hidden mx-[4px] mb-[8px]">
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close Navigation Menu"
            className="w-7 h-7 rounded-[8px] inline-flex items-center justify-center text-[#71717A] hover:bg-[#EFEFF1] hover:text-[#18181B] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] cursor-pointer"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-[1px]">
          <Link
            href="/"
            onClick={onCloseMobile}
            className={`flex items-center justify-between px-[10px] py-[6.5px] rounded-[8px] text-[13px] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#18181B] ${
              isActive('/')
                ? 'bg-[#E4E4E7] text-[#18181B] font-semibold'
                : 'text-[#3F3F46] font-medium hover:bg-[#EFEFF1]'
            }`}
          >
            <span className="flex items-center gap-[9px]">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
              <span>Home</span>
            </span>
          </Link>

          <div>
            <div
              className={`flex items-center justify-between px-[10px] py-[6.5px] rounded-[8px] text-[13px] transition-colors duration-150 ${
                isSubjectRoute
                  ? 'bg-[#E4E4E7] text-[#18181B] font-semibold'
                  : 'text-[#3F3F46] font-medium hover:bg-[#EFEFF1]'
              }`}
            >
              <Link
                href="/subjects/bio"
                onClick={onCloseMobile}
                className="flex items-center gap-[9px] flex-1 rounded transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#18181B]"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                <span>My Subjects</span>
              </Link>
              <button
                type="button"
                onClick={() => setSubjectsExpanded((v) => !v)}
                aria-expanded={subjectsExpanded}
                aria-label="Toggle 6 Subjects List"
                className="text-[#71717A] hover:text-[#18181B] p-1 rounded transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] cursor-pointer inline-flex items-center justify-center"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-150 ${
                    subjectsExpanded ? 'rotate-90' : ''
                  }`}
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>

            {subjectsExpanded && (
              <div className="mt-0.5 mb-1 flex flex-col gap-[1px]">
                {MY_SIX_SUBJECTS.map((subj) => {
                  const subjHref = `/subjects/${subj.slug}`;
                  const active = pathname === subjHref;
                  return (
                    <Link
                      key={subj.slug}
                      href={subjHref}
                      onClick={onCloseMobile}
                      className={`py-[5px] pr-[10px] pl-[34px] text-[12.5px] rounded-[8px] flex items-center justify-between transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#18181B] ${
                        active
                          ? 'bg-[#E4E4E7] text-[#18181B] font-semibold'
                          : 'text-[#52525B] hover:bg-[#EFEFF1] hover:text-[#18181B]'
                      }`}
                    >
                      <span>{subj.label}</span>
                      <span
                        className="w-[7px] h-[7px] rounded-full"
                        style={{ background: subj.dot }}
                      />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <Link
            href="/tutor"
            onClick={onCloseMobile}
            className={`flex items-center justify-between px-[10px] py-[6.5px] rounded-[8px] text-[13px] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#18181B] ${
              isActive('/tutor')
                ? 'bg-[#E4E4E7] text-[#18181B] font-semibold'
                : 'text-[#3F3F46] font-medium hover:bg-[#EFEFF1]'
            }`}
          >
            <span className="flex items-center gap-[9px]">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect width="16" height="12" x="4" y="8" rx="2" />
                <path d="M12 8V4H8" />
                <path d="M15 13v2" />
                <path d="M9 13v2" />
              </svg>
              <span>Sprout AI Tutor</span>
            </span>
          </Link>

          <Link
            href="/planner"
            onClick={onCloseMobile}
            className={`flex items-center justify-between px-[10px] py-[6.5px] rounded-[8px] text-[13px] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#18181B] ${
              isActive('/planner')
                ? 'bg-[#E4E4E7] text-[#18181B] font-semibold'
                : 'text-[#3F3F46] font-medium hover:bg-[#EFEFF1]'
            }`}
          >
            <span className="flex items-center gap-[9px]">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M3 10h18" />
              </svg>
              <span>Study Planner</span>
            </span>
          </Link>

          <Link
            href="/notes"
            onClick={onCloseMobile}
            className={`flex items-center justify-between px-[10px] py-[6.5px] rounded-[8px] text-[13px] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#18181B] ${
              isActive('/notes')
                ? 'bg-[#E4E4E7] text-[#18181B] font-semibold'
                : 'text-[#3F3F46] font-medium hover:bg-[#EFEFF1]'
            }`}
          >
            <span className="flex items-center gap-[9px]">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              </svg>
              <span>My Notes</span>
            </span>
          </Link>

          <div className="text-[10.5px] font-semibold tracking-[0.05em] uppercase text-[#A1A1AA] pt-[12px] px-[10px] pb-[4px]">
            All Resources
          </div>

          {[
            { href: '/questions', label: 'Question Bank' },
            { href: '/study-guides', label: 'Study Notes' },
            { href: '/cheatsheets', label: 'Cheatsheets', tag: 'Free' },
            { href: '/flashcards', label: 'Flashcards' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`py-[5.5px] pr-[10px] pl-[34px] text-[12.5px] rounded-[8px] flex items-center justify-between transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#18181B] ${
                isActive(item.href)
                  ? 'bg-[#E4E4E7] text-[#18181B] font-semibold'
                  : 'text-[#52525B] hover:bg-[#EFEFF1] hover:text-[#18181B]'
              }`}
            >
              <span>{item.label}</span>
              {item.tag && (
                <span className="text-[10px] font-semibold px-[6px] py-[1px] rounded-[6px] bg-[#EFEFF1] text-[#3F3F46]">
                  {item.tag}
                </span>
              )}
            </Link>
          ))}

          <div className="text-[10.5px] font-semibold tracking-[0.05em] uppercase text-[#A1A1AA] pt-[12px] px-[10px] pb-[4px]">
            IA / EE / TOK
          </div>

          <Suspense
            fallback={
              <CourseworkNavFallback
                pathname={pathname}
                onCloseMobile={onCloseMobile}
              />
            }
          >
            <CourseworkNavItems
              pathname={pathname}
              onCloseMobile={onCloseMobile}
            />
          </Suspense>

          <div className="text-[10.5px] font-semibold tracking-[0.05em] uppercase text-[#A1A1AA] pt-[12px] px-[10px] pb-[4px]">
            Tools
          </div>

          {[
            { href: '/tools/originality-check', label: 'Plagiarism & AI' },
            { href: '/tools/teach-sprout', label: 'Teach Sprout' },
            { href: '/tools/blurting', label: 'Blurting' },
            { href: '/tools', label: 'Subject Booklets & Labs' },
          ].map((item) => {
            const isSubjectToolRoute =
              item.href === '/tools' &&
              (pathname === '/tools' ||
                (pathname.startsWith('/tools/') &&
                  !['/tools/originality-check', '/tools/teach-sprout', '/tools/blurting'].includes(
                    pathname
                  )));
            const active = item.href === '/tools' ? isSubjectToolRoute : pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`py-[5.5px] pr-[10px] pl-[34px] text-[12.5px] rounded-[8px] flex items-center justify-between transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] ${
                  active
                    ? 'bg-[#E4E4E7] text-[#18181B] font-semibold'
                    : 'text-[#52525B] hover:bg-[#EFEFF1] hover:text-[#18181B]'
                }`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}

          <Link
            href="/saved"
            onClick={onCloseMobile}
            className={`mt-1 flex items-center justify-between px-[10px] py-[6.5px] rounded-[8px] text-[13px] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#18181B] ${
              isActive('/saved')
                ? 'bg-[#E4E4E7] text-[#18181B] font-semibold'
                : 'text-[#3F3F46] font-medium hover:bg-[#EFEFF1]'
            }`}
          >
            <span className="flex items-center gap-[9px]">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
              </svg>
              <span>Saved</span>
            </span>
          </Link>
        </nav>
      </div>

      <div className="border-t border-[#F4F4F5] pt-2 mt-2">
        <Link
          href="/settings"
          onClick={onCloseMobile}
          className={`flex items-center justify-between px-[10px] py-[6.5px] rounded-[8px] text-[13px] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#18181B] ${
            isActive('/settings')
              ? 'bg-[#E4E4E7] text-[#18181B] font-semibold'
              : 'text-[#3F3F46] font-medium hover:bg-[#EFEFF1]'
          }`}
        >
          <span className="flex items-center gap-[9px]">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span>Settings & Gemini Key</span>
          </span>
        </Link>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden lg:block h-[calc(100vh-54px)] sticky top-[54px]">
        {sidebarContent}
      </div>

      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="fixed inset-0 z-40 bg-black/30 lg:hidden flex"
          onClick={onCloseMobile}
        >
          <div
            className="h-full bg-[#FAFAFA]"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
