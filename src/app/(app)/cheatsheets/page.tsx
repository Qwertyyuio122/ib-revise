'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { KaTeXText } from '@/components/math/KaTeXText';
import { ALL_SUBJECT_PACKS } from '@/content';

function CheatsheetsContent() {
  const searchParams = useSearchParams();
  const initialSubject = searchParams.get('subject') ?? 'chem';

  const [subjectSlug, setSubjectSlug] = useState(
    ALL_SUBJECT_PACKS.some((p) => p.subject.slug === initialSubject)
      ? initialSubject
      : 'chem'
  );

  useEffect(() => {
    const paramSubject = searchParams.get('subject');
    if (
      paramSubject &&
      ALL_SUBJECT_PACKS.some((p) => p.subject.slug === paramSubject)
    ) {
      setSubjectSlug(paramSubject);
    }
  }, [searchParams]);

  const activePack =
    ALL_SUBJECT_PACKS.find((p) => p.subject.slug === subjectSlug) ??
    ALL_SUBJECT_PACKS[0];

  return (
    <div className="main-pad !pt-[26px]">
      <div className="col-center">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <h1
                className="text-[24px] font-semibold tracking-tight text-[#18181B]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                High-Yield IB Cheatsheets
              </h1>
              <span className="mini-tag">100% Free</span>
            </div>
            <p className="text-[13px] text-[#71717A]">
              Condensed equations, command-term traps, and must-memorize markscheme checklists
            </p>
          </div>
          <Link
            href={`/study-guides?subject=${subjectSlug}`}
            className="pill-btn"
          >
            Full Study Guides →
          </Link>
        </div>

        <div
          role="tablist"
          aria-label="Select IB subject"
          className="flex gap-1.5 flex-wrap mb-5"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activePack.topics.map((topic) => (
            <div key={topic.id} className="hairline-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-[11.5px] font-semibold px-2 py-0.5 rounded bg-[#F4F4F5] text-[#18181B]">
                    {topic.code}
                  </span>
                  <span className="mini-tag">{topic.levelScope}</span>
                </div>
                <h2
                  className="text-[16px] font-semibold text-[#18181B] mb-2"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  <KaTeXText text={topic.title} as="span" />
                </h2>
                <KaTeXText
                  text={topic.cheatsheetMarkdown}
                  className="text-[13px] text-[#3F3F46] leading-relaxed mb-3"
                />

                <div className="p-3 rounded-[10px] bg-[#FAFAFA] border border-[#F4F4F5]">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#71717A] mb-1">
                    Active Recall / Blurting Checklist
                  </div>
                  <ul className="list-disc pl-4 space-y-0.5 text-[12px] text-[#27272A]">
                    {topic.blurtChecklist.map((item, idx) => (
                      <li key={idx}>
                        <KaTeXText text={item} as="span" />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-4 border-t border-[#F4F4F5]">
                <Link
                  href={`/tools/blurting?subject=${activePack.subject.slug}&topicId=${topic.id}`}
                  className="pill-btn"
                >
                  Blurt This Topic
                </Link>
                <Link
                  href={`/questions?subject=${activePack.subject.slug}&topicId=${topic.id}`}
                  className="pill-btn-dark"
                >
                  Drill Questions →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CheatsheetsSkeleton() {
  return (
    <div className="main-pad !pt-[26px]">
      <div className="col-center">
        <div className="mb-5 space-y-2">
          <div className="h-8 w-64 animate-pulse rounded-lg bg-[#E4E4E7]" />
          <div className="h-4 w-80 max-w-full animate-pulse rounded bg-[#F4F4F5]" />
        </div>
        <div className="flex gap-1.5 flex-wrap mb-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 w-24 animate-pulse rounded-full bg-[#E4E4E7]" />
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-48 animate-pulse rounded-2xl border border-[#E4E4E7] bg-white" />
          <div className="h-48 animate-pulse rounded-2xl border border-[#E4E4E7] bg-white" />
        </div>
      </div>
    </div>
  );
}

export default function CheatsheetsPage() {
  return (
    <Suspense fallback={<CheatsheetsSkeleton />}>
      <CheatsheetsContent />
    </Suspense>
  );
}
