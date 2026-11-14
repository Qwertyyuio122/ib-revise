'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { ScreenState } from '@/types/fsm';

interface SearchResultItem {
  id: string;
  type: 'topic' | 'question' | 'note';
  subjectSlug: string;
  title: string;
  subtitle: string;
  href: string;
}

interface CommandSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandSearchModal({
  isOpen,
  onClose,
}: CommandSearchModalProps) {
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const [query, setQuery] = useState('');
  const [retryNonce, setRetryNonce] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchState, setSearchState] = useState<
    ScreenState<SearchResultItem[]>
  >({ status: 'idle' });

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onCloseRef.current();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const controller = new AbortController();
    setSearchState({ status: 'loading' });

    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`, {
        signal: controller.signal,
      })
        .then((r) => {
          if (r.status === 401) {
            onCloseRef.current();
            routerRef.current.push('/login');
            return null;
          }
          if (!r.ok) throw new Error('Search request failed');
          return r.json();
        })
        .then((data) => {
          if (!data) return;
          const list = Array.isArray(data.results)
            ? (data.results as SearchResultItem[])
            : [];
          setActiveIndex(0);
          if (list.length === 0) {
            setSearchState({
              status: 'empty',
              message: `No syllabus topics, questions, or notes matched "${query}".`,
            });
          } else {
            setSearchState({ status: 'success', data: list });
          }
        })
        .catch((err) => {
          if (err?.name === 'AbortError') return;
          setSearchState({
            status: 'error',
            message: 'Could not search syllabus right now.',
          });
        });
    }, 150);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, isOpen, retryNonce]);

  if (!isOpen) return null;

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (searchState.status !== 'success' || searchState.data.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((idx) => (idx + 1) % searchState.data.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(
        (idx) => (idx - 1 + searchState.data.length) % searchState.data.length
      );
    } else if (e.key === 'Enter') {
      const selected = searchState.data[activeIndex] ?? searchState.data[0];
      if (selected) {
        e.preventDefault();
        onCloseRef.current();
        routerRef.current.push(selected.href);
      }
    }
  }

  const subjectBadgeColor: Record<string, string> = {
    bio: '#059669',
    chem: '#0D9488',
    hist: '#B45309',
    eng: '#1D4ED8',
    fr: '#0284C7',
    math: '#D97706',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search syllabus, questions, and notes"
      className="fixed inset-0 z-50 bg-black/25 flex items-start justify-center pt-[10vh] p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[580px] bg-[#FFFFFF] border border-[#E4E4E7] rounded-[16px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E4E4E7]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#71717A"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            autoFocus
            aria-label="Search syllabus codes, questions, notes, and tools"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search syllabus codes (A1.1, S2.2, SL 5.2), questions, notes, tools..."
            className="flex-1 text-[13.5px] text-[#18181B] bg-transparent focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="px-2 py-0.5 rounded bg-[#F4F4F5] hover:bg-[#EFEFF1] border border-[#E4E4E7] font-mono text-[11px] text-[#71717A] hover:text-[#18181B] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] cursor-pointer"
          >
            ESC
          </button>
        </div>

        <div className="max-h-[380px] overflow-y-auto p-2">
          {searchState.status === 'loading' && (
            <div className="p-4 space-y-2">
              <div className="h-10 rounded-[10px] bg-[#F4F4F5] animate-pulse" />
              <div className="h-10 rounded-[10px] bg-[#F4F4F5] animate-pulse" />
              <div className="h-10 rounded-[10px] bg-[#F4F4F5] animate-pulse" />
            </div>
          )}

          {searchState.status === 'error' && (
            <div role="alert" className="p-6 text-center">
              <p className="text-[13px] text-[#9F1239] mb-3">
                {searchState.message}
              </p>
              <button
                type="button"
                onClick={() => setRetryNonce((n) => n + 1)}
                className="pill-btn"
              >
                Retry Search
              </button>
            </div>
          )}

          {searchState.status === 'empty' && (
            <div className="p-8 text-center">
              <p className="text-[13px] text-[#71717A] mb-3">
                {searchState.message}
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  router.push('/questions');
                }}
                className="pill-btn"
              >
                Browse Full Questionbank →
              </button>
            </div>
          )}

          {searchState.status === 'success' && (
            <div className="space-y-1">
              {searchState.data.map((item, index) => (
                <button
                  key={`${item.type}-${item.id}`}
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => {
                    onClose();
                    router.push(item.href);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-[10px] hover:bg-[#F4F4F5] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] flex items-center justify-between gap-3 cursor-pointer ${
                    index === activeIndex ? 'bg-[#F4F4F5]' : ''
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{
                          background:
                            subjectBadgeColor[item.subjectSlug] ?? '#18181B',
                        }}
                      />
                      <span className="text-[13px] font-semibold text-[#18181B] truncate">
                        {item.title}
                      </span>
                    </div>
                    <div className="text-[11.5px] text-[#71717A] truncate pl-4">
                      {item.subtitle}
                    </div>
                  </div>
                  <span className="mini-tag uppercase flex-shrink-0">
                    {item.type}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
