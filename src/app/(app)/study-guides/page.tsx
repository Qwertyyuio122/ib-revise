'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check } from 'lucide-react';
import { KaTeXText } from '@/components/math/KaTeXText';
import { ALL_SUBJECT_PACKS } from '@/content';

type BookmarkState =
  | { status: 'idle' }
  | { status: 'saving' }
  | { status: 'error'; message: string };

function StudyGuidesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSubject = searchParams.get('subject') ?? 'bio';
  const initialTopic = searchParams.get('topic') ?? '';

  const [subjectSlug, setSubjectSlug] = useState(
    ALL_SUBJECT_PACKS.some((p) => p.subject.slug === initialSubject)
      ? initialSubject
      : 'bio'
  );

  const activePack =
    ALL_SUBJECT_PACKS.find((p) => p.subject.slug === subjectSlug) ??
    ALL_SUBJECT_PACKS[0];

  const [selectedTopicId, setSelectedTopicId] = useState(
    initialTopic && activePack.topics.some((t) => t.id === initialTopic)
      ? initialTopic
      : activePack.topics[0]?.id ?? ''
  );

  useEffect(() => {
    const paramSubject = searchParams.get('subject');
    const paramTopic = searchParams.get('topic');
    if (
      paramSubject &&
      ALL_SUBJECT_PACKS.some((p) => p.subject.slug === paramSubject)
    ) {
      setSubjectSlug(paramSubject);
      const pack = ALL_SUBJECT_PACKS.find(
        (p) => p.subject.slug === paramSubject
      );
      if (paramTopic && pack?.topics.some((t) => t.id === paramTopic)) {
        setSelectedTopicId(paramTopic);
      }
      return;
    }
    if (paramTopic) {
      const matchingPack = ALL_SUBJECT_PACKS.find((p) =>
        p.topics.some((t) => t.id === paramTopic)
      );
      if (matchingPack) {
        setSubjectSlug(matchingPack.subject.slug);
        setSelectedTopicId(paramTopic);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const pack =
      ALL_SUBJECT_PACKS.find((p) => p.subject.slug === subjectSlug) ??
      ALL_SUBJECT_PACKS[0];
    if (!pack.topics.some((t) => t.id === selectedTopicId)) {
      setSelectedTopicId(pack.topics[0]?.id ?? '');
    }
  }, [subjectSlug, selectedTopicId]);

  const currentTopic =
    activePack.topics.find((t) => t.id === selectedTopicId) ??
    activePack.topics[0];

  const [bookmarkedByItemId, setBookmarkedByItemId] = useState<
    Record<string, string>
  >({});
  const [bookmarkState, setBookmarkState] = useState<BookmarkState>({
    status: 'idle',
  });
  const bookmarkPendingRef = useRef(false);
  const routerRef = useRef(router);
  routerRef.current = router;

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/bookmarks', { signal: controller.signal })
      .then(async (res) => {
        if (res.status === 401) {
          routerRef.current.push('/login');
          return null;
        }
        if (!res.ok) {
          throw new Error('Could not load saved bookmark status.');
        }
        return (await res.json()) as {
          bookmarks?: Array<{ id: string; itemId: string }>;
        };
      })
      .then((json) => {
        if (!json) return;
        const map: Record<string, string> = {};
        for (const bm of json.bookmarks ?? []) {
          if (bm.itemId && bm.id) {
            map[bm.itemId] = bm.id;
          }
        }
        setBookmarkedByItemId(map);
        setBookmarkState((prev) =>
          prev.status === 'error' ? { status: 'idle' } : prev
        );
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return;
        setBookmarkState({
          status: 'error',
          message:
            err instanceof Error
              ? err.message
              : 'Could not load saved bookmark status.',
        });
      });
    return () => controller.abort();
  }, []);

  const existingBookmarkId = currentTopic
    ? bookmarkedByItemId[currentTopic.id]
    : undefined;
  const isBookmarked = Boolean(existingBookmarkId);

  async function handleBookmark() {
    if (!currentTopic || bookmarkPendingRef.current) return;
    bookmarkPendingRef.current = true;
    setBookmarkState({ status: 'saving' });

    try {
      if (existingBookmarkId) {
        const res = await fetch(
          `/api/bookmarks?id=${encodeURIComponent(existingBookmarkId)}`,
          { method: 'DELETE' }
        );
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        if (!res.ok) {
          throw new Error('Could not remove bookmark.');
        }
        setBookmarkedByItemId((prev) => {
          const next = { ...prev };
          delete next[currentTopic.id];
          return next;
        });
      } else {
        const res = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subjectSlug: activePack.subject.slug,
            itemType: 'topic',
            itemId: currentTopic.id,
            title: `${currentTopic.code} · ${currentTopic.title}`,
            subtitle: `${activePack.subject.name} ${activePack.subject.level} Study Guide`,
            href: `/study-guides?subject=${activePack.subject.slug}&topic=${currentTopic.id}`,
          }),
        });
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        const json = await res.json().catch(() => ({}));
        if (!res.ok || !json.bookmark?.id) {
          throw new Error(json.error || 'Could not save bookmark.');
        }
        setBookmarkedByItemId((prev) => ({
          ...prev,
          [currentTopic.id]: json.bookmark.id,
        }));
      }
      setBookmarkState({ status: 'idle' });
    } catch (err) {
      setBookmarkState({
        status: 'error',
        message:
          err instanceof Error ? err.message : 'Unable to update bookmark.',
      });
    } finally {
      bookmarkPendingRef.current = false;
    }
  }

  return (
    <div className="main-pad !pt-[26px]">
      <div className="col-center">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div>
            <h1
              className="text-[24px] font-semibold tracking-tight text-[#18181B]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              IB Study Guides &amp; Syllabus Notes
            </h1>
            <p className="text-[13px] text-[#71717A]">
              Structured understandings, guiding questions, and exam-ready explanations across all 6 subjects
            </p>
          </div>
          <Link
            href={`/cheatsheets?subject=${subjectSlug}`}
            className="pill-btn"
          >
            Switch to Condensed Cheatsheets →
          </Link>
        </div>

        {/* 6 Subject Switcher Pills */}
        <div
          role="tablist"
          aria-label="Select IB subject"
          className="flex gap-1.5 flex-wrap mb-4"
        >
          {ALL_SUBJECT_PACKS.map((p) => {
            const active = p.subject.slug === subjectSlug;
            return (
              <button
                key={p.subject.slug}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSubjectSlug(p.subject.slug)}
                className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold border transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] ${
                  active
                    ? 'bg-[#18181B] text-white border-[#18181B]'
                    : 'bg-white text-[#3F3F46] border-[#E4E4E7] hover:bg-[#F4F4F5]'
                }`}
              >
                {p.subject.name} {p.subject.level}
              </button>
            );
          })}
        </div>

        {/* Subtopic Selector + Reader */}
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
          <div className="border border-[#E4E4E7] rounded-[14px] p-2.5 bg-[#FAFAFA] max-h-[260px] lg:max-h-[620px] overflow-y-auto space-y-1">
            {activePack.topics.map((t) => {
              const active = t.id === currentTopic?.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setSelectedTopicId(t.id);
                    setBookmarkState((prev) =>
                      prev.status === 'error' ? { status: 'idle' } : prev
                    );
                  }}
                  className={`w-full text-left px-3 py-2 rounded-[10px] transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] ${
                    active
                      ? 'bg-[#E4E4E7] text-[#18181B] font-semibold'
                      : 'text-[#52525B] hover:bg-[#EFEFF1]'
                  }`}
                >
                  <div className="font-mono text-[11px] text-[#71717A]">
                    {t.code} · {t.levelScope}
                  </div>
                  <div className="text-[12.5px] leading-snug">
                    <KaTeXText text={t.title} as="span" />
                  </div>
                </button>
              );
            })}
          </div>

          {currentTopic && (
            <div className="hairline-card space-y-5">
              <div className="flex items-start justify-between gap-3 flex-wrap pb-4 border-b border-[#F4F4F5]">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-[12px] font-semibold px-2 py-0.5 rounded bg-[#F4F4F5] text-[#18181B]">
                      {currentTopic.code}
                    </span>
                    <span className="mini-tag">{currentTopic.levelScope}</span>
                    <span className="mini-tag">
                      {currentTopic.recommendedHours}h Recommended
                    </span>
                  </div>
                  <h2
                    className="text-[21px] font-semibold text-[#18181B]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    <KaTeXText text={currentTopic.title} as="span" />
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleBookmark}
                    disabled={bookmarkState.status === 'saving'}
                    aria-pressed={isBookmarked}
                    aria-label={
                      isBookmarked
                        ? 'Remove study guide bookmark'
                        : 'Bookmark study guide'
                    }
                    className={`pill-btn ${
                      isBookmarked
                        ? '!border-[#059669] !bg-[#ECFDF5] !text-[#065F46]'
                        : ''
                    }`}
                  >
                    {bookmarkState.status === 'saving' ? (
                      <span>{isBookmarked ? 'Removing...' : 'Saving...'}</span>
                    ) : isBookmarked ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <span>Bookmark</span>
                    )}
                  </button>
                  <Link
                    href={`/questions?subject=${activePack.subject.slug}&topicId=${currentTopic.id}`}
                    className="pill-btn-dark"
                  >
                    Practice Topic Questions →
                  </Link>
                </div>
              </div>

              {bookmarkState.status === 'error' && (
                <div
                  role="alert"
                  className="rounded-[10px] border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-[12px] text-[#B91C1C]"
                >
                  {bookmarkState.message}
                </div>
              )}

              {/* Guiding Questions */}
              <div className="p-3.5 rounded-[12px] bg-[#FAFAFA] border border-[#E4E4E7]">
                <div className="text-[12px] font-semibold uppercase tracking-wider text-[#71717A] mb-1.5">
                  Official IB Guiding Questions
                </div>
                <ul className="list-disc pl-4 space-y-1 text-[13px] text-[#18181B]">
                  {currentTopic.guidingQuestions.map((gq, idx) => (
                    <li key={idx}>
                      <KaTeXText text={gq} as="span" />
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Understandings */}
              <div>
                <h3
                  className="text-[15px] font-semibold text-[#18181B] mb-2.5"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Syllabus Understandings &amp; Assessment Statements
                </h3>
                <div className="space-y-2">
                  {currentTopic.understandings.map((u) => (
                    <div
                      key={u.code}
                      className="p-3 rounded-[10px] border border-[#E4E4E7] bg-[#FFFFFF] flex items-start gap-3"
                    >
                      <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-[#F4F4F5] text-[#3F3F46] whitespace-nowrap">
                        {u.code}
                      </span>
                      <div className="flex-1 text-[13px] text-[#27272A]">
                        <KaTeXText text={u.text} as="span" />
                      </div>
                      {u.isHL && (
                        <span className="px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] text-[10.5px] font-semibold">
                          HL
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Deep Study Guide Prose */}
              <div className="pt-2 border-t border-[#F4F4F5]">
                <h3
                  className="text-[15px] font-semibold text-[#18181B] mb-2"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Comprehensive Revision Notes
                </h3>
                <KaTeXText
                  text={currentTopic.studyGuideMarkdown}
                  className="text-[13.5px] text-[#27272A] leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StudyGuidesSkeleton() {
  return (
    <div className="main-pad !pt-[26px]">
      <div className="col-center">
        <div className="mb-5 space-y-2">
          <div className="h-8 w-72 animate-pulse rounded-lg bg-[#E4E4E7]" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded bg-[#F4F4F5]" />
        </div>
        <div className="flex gap-1.5 flex-wrap mb-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 w-24 animate-pulse rounded-full bg-[#E4E4E7]" />
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-40 animate-pulse rounded-2xl border border-[#E4E4E7] bg-white" />
          <div className="h-64 animate-pulse rounded-2xl border border-[#E4E4E7] bg-white" />
        </div>
      </div>
    </div>
  );
}

export default function StudyGuidesPage() {
  return (
    <Suspense fallback={<StudyGuidesSkeleton />}>
      <StudyGuidesContent />
    </Suspense>
  );
}
