'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ScreenState, SubjectSlug } from '@/types/fsm';
import { KaTeXText } from '@/components/math/KaTeXText';
import { Bookmark, ExternalLink, Trash2, AlertCircle, RotateCcw } from 'lucide-react';

interface SavedBookmarkItem {
  id: string;
  subjectSlug: SubjectSlug;
  itemType: string;
  itemId: string;
  title: string;
  subtitle: string;
  href: string;
  createdAt: number;
}

const SUBJECT_FILTERS: Array<{ slug: 'all' | SubjectSlug; label: string }> = [
  { slug: 'all', label: 'All 6 Subjects' },
  { slug: 'bio', label: 'Biology HL' },
  { slug: 'chem', label: 'Chemistry SL' },
  { slug: 'hist', label: 'History HL' },
  { slug: 'eng', label: 'English Lit HL' },
  { slug: 'fr', label: 'French B SL' },
  { slug: 'math', label: 'Math AA SL' },
];

function normalizeBookmarkHref(rawHref: string): string {
  const trimmed = rawHref.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) {
    return '/';
  }
  return trimmed
    .replace(/^\/tools\/opcvl(?=[?#]|$)/, '/tools/opcvl-trainer')
    .replace(/^\/tools\/literary-devices(?=[?#]|$)/, '/tools/english-studio')
    .replace(/([?&])tab=mistakes(?=&|#|$)/, '$1mode=mistakes')
    .replace(/([?&])mode=walkthrough(?=&|#|$)/, '$1mode=practice');
}

export default function SavedItemsPage() {
  const router = useRouter();
  const [screen, setScreen] = useState<ScreenState<SavedBookmarkItem[]>>({
    status: 'loading',
  });
  const [activeFilter, setActiveFilter] = useState<'all' | SubjectSlug>('all');
  const [actionError, setActionError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const routerRef = useRef(router);
  routerRef.current = router;

  const loadBookmarks = useCallback(() => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setScreen({ status: 'loading' });
    setActionError(null);
    fetch('/api/settings', { signal: controller.signal })
      .then(async (res) => {
        if (res.status === 401) {
          routerRef.current.push('/login');
          return null;
        }
        if (!res.ok) {
          throw new Error('Unable to load saved items.');
        }
        return (await res.json()) as { bookmarks?: SavedBookmarkItem[] };
      })
      .then((json) => {
        if (!json) return;
        setScreen({ status: 'success', data: json.bookmarks ?? [] });
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return;
        setScreen({
          status: 'error',
          message: 'Unable to load saved items.',
        });
      });
  }, []);

  useEffect(() => {
    loadBookmarks();
    return () => controllerRef.current?.abort();
  }, [loadBookmarks]);

  const filteredItems = useMemo(() => {
    if (screen.status !== 'success') return [];
    if (activeFilter === 'all') return screen.data;
    return screen.data.filter((item) => item.subjectSlug === activeFilter);
  }, [screen, activeFilter]);

  async function handleRemoveBookmark(id: string) {
    if (screen.status !== 'success') return;
    const previous = screen.data;
    setActionError(null);
    setScreen({
      status: 'success',
      data: previous.filter((b) => b.id !== id),
    });
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'remove_bookmark', id }),
      });
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      if (!res.ok) {
        throw new Error('Failed to remove bookmark.');
      }
    } catch {
      setScreen({ status: 'success', data: previous });
      setActionError('Could not remove saved item. Please try again.');
    }
  }

  return (
    <div className="main-pad !pt-[26px]">
      <div className="col-center">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#E4E4E7] pb-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E4E4E7] bg-[#FAFAFA]">
              <Bookmark className="h-5 w-5 text-[#18181B]" />
            </div>
            <div>
              <h1
                className="h-title !text-[24px]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Saved &amp; Bookmarked Revision Items
              </h1>
              <p className="text-[13px] text-[#71717A] mt-0.5">
                Quick access to starred Paper 1/2 questions, syllabus topics, notes, and specialist labs.
              </p>
            </div>
          </div>
        </div>

        {/* Subject Filter Pills */}
        <div
          role="tablist"
          aria-label="Filter saved items by subject"
          className="mt-5 flex flex-wrap items-center gap-2"
        >
          {SUBJECT_FILTERS.map((pill) => {
            const isSelected = activeFilter === pill.slug;
            return (
              <button
                key={pill.slug}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveFilter(pill.slug)}
                className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] ${
                  isSelected
                    ? 'border-[#18181B] bg-[#18181B] text-white'
                    : 'border-[#E4E4E7] bg-white text-[#3F3F46] hover:bg-[#F4F4F5]'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
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

        {screen.status === 'loading' && (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="h-32 animate-pulse rounded-[14px] border border-[#E4E4E7] bg-white" />
            <div className="h-32 animate-pulse rounded-[14px] border border-[#E4E4E7] bg-white" />
          </div>
        )}

        {screen.status === 'error' && (
          <div
            role="alert"
            className="mt-6 flex items-center justify-between flex-wrap gap-3 rounded-[14px] border border-[#FECACA] bg-[#FEF2F2] p-4 text-[#B91C1C]"
          >
            <div className="flex items-center gap-2 text-[13px] font-medium">
              <AlertCircle className="h-5 w-5 shrink-0 text-[#DC2626]" />
              <span>{screen.message || 'Unable to load saved items.'}</span>
            </div>
            <button
              type="button"
              onClick={loadBookmarks}
              className="pill-btn"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {screen.status === 'success' && filteredItems.length === 0 && (
          <div className="mt-6 hairline-card p-10 text-center">
            <p className="text-[14px] font-semibold text-[#18181B]">
              No saved items in this filter
            </p>
            <p className="mt-1 text-[12.5px] text-[#71717A]">
              Switch back to All 6 Subjects or explore Question Banks to bookmark items.
            </p>
            <Link
              href={
                activeFilter === 'all'
                  ? '/questions?subject=bio'
                  : `/questions?subject=${activeFilter}`
              }
              className="pill-btn-dark mt-4"
            >
              Browse IB Question Bank →
            </Link>
          </div>
        )}

        {screen.status === 'success' && filteredItems.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="hairline-card flex flex-col justify-between transition-colors duration-150 hover:border-[#D4D4D8]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-[6px] bg-[#18181B] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                        {item.subjectSlug}
                      </span>
                      <span className="mini-tag">{item.itemType}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveBookmark(item.id)}
                      aria-label={`Remove saved item ${item.title}`}
                      className="rounded-lg p-1.5 text-[#71717A] transition-colors duration-150 hover:bg-[#FEF2F2] hover:text-[#DC2626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] cursor-pointer"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <KaTeXText
                    text={item.title}
                    className="mt-2.5 text-[14px] font-semibold leading-snug text-[#18181B]"
                  />
                  <KaTeXText
                    text={item.subtitle}
                    as="p"
                    className="mt-1 text-[12px] text-[#71717A]"
                  />
                </div>

                <div className="mt-4 border-t border-[#F4F4F5] pt-3">
                  <Link
                    href={normalizeBookmarkHref(item.href)}
                    className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#18181B] transition-colors duration-150 hover:text-[#52525B] rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
                  >
                    <span>Open Workspace</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
