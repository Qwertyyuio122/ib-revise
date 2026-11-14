import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import {
  SubjectCardArtwork,
  type SubjectArtworkSlug,
} from '@/components/home/SubjectCardArtwork';

const HOMEPAGE_SUBJECT_CARDS: ReadonlyArray<{
  slug: SubjectArtworkSlug;
  title: string;
  gradient: string;
}> = [
  {
    slug: 'bio',
    title: 'Biology HL',
    gradient: 'linear-gradient(135deg,#1D6E45,#49AD78)',
  },
  {
    slug: 'chem',
    title: 'Chemistry SL',
    gradient: 'linear-gradient(135deg,#0F766E,#2DD4BF)',
  },
  {
    slug: 'hist',
    title: 'History HL',
    gradient: 'linear-gradient(135deg,#5A3626,#8D5E47)',
  },
  {
    slug: 'eng',
    title: 'English Literature HL',
    gradient: 'linear-gradient(135deg,#1E40AF,#3B82F6)',
  },
  {
    slug: 'fr',
    title: 'French B SL',
    gradient: 'linear-gradient(135deg,#0369A1,#38BDF8)',
  },
  {
    slug: 'math',
    title: 'Math AA SL',
    gradient: 'linear-gradient(135deg,#B45309,#F59E0B)',
  },
];

const HOME_PAGE_STYLES = `
@keyframes srHomeCardEnter {
  from {
    opacity: 0;
    transform: translate3d(0, 8px, 0) scale(0.985);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
}
@keyframes srHomeCardFade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.sr-home-card-enter {
  animation: srHomeCardEnter 240ms cubic-bezier(0.23, 1, 0.32, 1) both;
}
.sr-subj-card {
  transition:
    transform 200ms cubic-bezier(0.23, 1, 0.32, 1),
    border-color 180ms ease;
}
.sr-subj-card:active {
  transform: scale(0.985);
  transition-duration: 120ms;
}
.sr-open-chevron,
.sr-cta-arrow,
.sr-daily-sprout {
  transition: transform 180ms cubic-bezier(0.23, 1, 0.32, 1);
}
.sr-daily-card {
  transition: border-color 180ms ease;
}
.sr-press-pill {
  transition:
    background-color 150ms ease,
    border-color 150ms ease,
    opacity 150ms ease,
    transform 140ms cubic-bezier(0.23, 1, 0.32, 1);
}
.sr-press-pill:active {
  transform: scale(0.97);
  transition-duration: 110ms;
}
@media (hover: hover) and (pointer: fine) {
  .sr-subj-card:hover {
    transform: translate3d(0, -2px, 0);
    border-color: rgba(255, 255, 255, 0.34);
  }
  .sr-subj-card:hover:active {
    transform: scale(0.985);
  }
  .sr-subj-card:hover .sr-open-chevron {
    transform: translate3d(2px, 0, 0);
  }
  .sr-daily-card:hover {
    border-color: #D4D4D8;
  }
  .sr-daily-card:hover .sr-daily-sprout {
    transform: translate3d(0, -2px, 0);
  }
  .sr-cta-link:hover .sr-cta-arrow {
    transform: translate3d(2px, 0, 0);
  }
}
@media (prefers-reduced-motion: reduce) {
  .sr-home-card-enter {
    animation: srHomeCardFade 160ms ease both;
    animation-delay: 0ms !important;
  }
  .sr-subj-card,
  .sr-open-chevron,
  .sr-cta-arrow,
  .sr-daily-sprout,
  .sr-press-pill {
    transition-property: opacity, background-color, border-color;
    transition-duration: 150ms;
  }
  .sr-subj-card:hover,
  .sr-subj-card:active,
  .sr-subj-card:hover .sr-open-chevron,
  .sr-daily-card:hover .sr-daily-sprout,
  .sr-cta-link:hover .sr-cta-arrow,
  .sr-press-pill:active {
    transform: none;
  }
}
`;

export default async function HomePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  const userName = user.name;

  return (
    <div
      style={
        {
          '--wash-1': 'rgba(219, 234, 254, 0.55)',
          '--wash-2': 'rgba(224, 242, 254, 0.48)',
          '--wash-3': 'rgba(241, 245, 249, 0.45)',
          '--subj-accent': '#18181B',
          '--subj-soft': '#F4F4F5',
        } as React.CSSProperties
      }
    >
      <style href="sr-home-page-motion" precedence="default">
        {HOME_PAGE_STYLES}
      </style>

      <div className="aurora-header">
        <div className="max-w-[820px] mx-auto mb-[22px] flex items-center justify-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-[10px] px-[14px] py-2 sm:py-[6px] rounded-2xl sm:rounded-full bg-white/85 border border-[#E4E4E7] shadow-[inset_0_1px_0_rgba(255,255,255,0.92)] text-[12.5px] text-[#3F3F46] text-center max-w-full">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#71717A] shrink-0 hidden sm:inline-block"
              aria-hidden="true"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
            <span>Working on your IA, EE, or TOK? Try the AI Essay Studio</span>
            <Link href="/essay-studio" className="pill-btn sr-press-pill shrink-0">
              Open
            </Link>
          </div>
        </div>

        <div className="col-center">
          <div className="flex items-center justify-between gap-4 sm:gap-6 flex-wrap">
            <div className="min-w-0">
              <div className="h-title">Good evening,</div>
              <div className="h-sub break-words">{userName}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="main-pad">
        <div className="col-center">
          <div className="flex justify-between items-center text-[13px] text-[#71717A] flex-wrap gap-2">
            <span className="font-semibold text-[#18181B]">My subjects</span>
            <span>
              6 IB Diploma subjects · Click any card to view its tailored page
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[14px] mt-[12px]">
            {HOMEPAGE_SUBJECT_CARDS.map((card, index) => (
              <div
                key={card.slug}
                className="sr-home-card-enter"
                style={{ animationDelay: `${index * 36}ms` }}
              >
                <Link
                  href={`/subjects/${card.slug}`}
                  style={{ background: card.gradient }}
                  className="group sr-subj-card min-h-[118px] rounded-[14px] px-[16px] py-[15px] text-white flex flex-col justify-between relative overflow-hidden border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-white/30 via-white/15 to-transparent"
                  />
                  <div
                    className="text-[15.5px] font-semibold leading-[1.25] max-w-[72%] relative z-10"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {card.title}
                  </div>
                  <span className="self-start inline-flex items-center gap-[3px] bg-white text-[#18181B] text-[11.5px] font-semibold px-[11px] py-[4px] rounded-full relative z-10">
                    <span>Open</span>
                    <span
                      aria-hidden="true"
                      className="sr-open-chevron inline-block"
                    >
                      &gt;
                    </span>
                  </span>
                  <SubjectCardArtwork slug={card.slug} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
