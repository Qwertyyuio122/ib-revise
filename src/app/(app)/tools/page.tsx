import React from 'react';
import Link from 'next/link';

interface ToolDirectoryEntry {
  slug: string;
  href: string;
  title: string;
  subtitle: string;
  subjectLabel: string;
  badgeBg: string;
  badgeText: string;
  iconStroke: string;
}

const SUBJECT_SPECIALIST_TOOLS: ToolDirectoryEntry[] = [
  {
    slug: 'data-booklet',
    href: '/tools/data-booklet',
    title: 'IB Chemistry SL Interactive Data Booklet',
    subtitle: 'Clickable Periodic Table, average bond enthalpies, molar enthalpy tables & 2025 SL constants.',
    subjectLabel: 'Chemistry SL',
    badgeBg: '#CCFBF1',
    badgeText: '#0F766E',
    iconStroke: '#0D9488',
  },
  {
    slug: 'calc-checker',
    href: '/tools/calc-checker',
    title: 'Chemistry SL Calculation Step Checker',
    subtitle: 'Audits PV=nRT unit conversions, calorimetry ΔH signs, mole ratios & significant figures.',
    subjectLabel: 'Chemistry SL',
    badgeBg: '#CCFBF1',
    badgeText: '#0F766E',
    iconStroke: '#0D9488',
  },
  {
    slug: 'formula-booklet',
    href: '/tools/formula-booklet',
    title: 'Math AA SL Interactive Formula Booklet',
    subtitle: 'Topics 1–5 formulas, Must-Memorize unstated identities, GDC traps & worked examples.',
    subjectLabel: 'Math AA SL',
    badgeBg: '#FEF3C7',
    badgeText: '#92400E',
    iconStroke: '#D97706',
  },
  {
    slug: 'bio-visualizations',
    href: '/tools/bio-visualizations',
    title: 'Biology HL Cell & Pathway Visualizations',
    subtitle: 'Interactive SVG hotspots for Fluid Mosaic Membrane, Chemiosmosis, Photosynthesis & Sarcomeres.',
    subjectLabel: 'Biology HL',
    badgeBg: '#DCFCE7',
    badgeText: '#065F46',
    iconStroke: '#059669',
  },
  {
    slug: 'opcvl-trainer',
    href: '/tools/opcvl-trainer',
    title: 'History HL OPCVL Source Trainer & Essay Builder',
    subtitle: 'Paper 1 4-mark OPCVL evaluator, Paper 2/3 comparative outline architect & Historiography matrix.',
    subjectLabel: 'History HL',
    badgeBg: '#FEF3C7',
    badgeText: '#92400E',
    iconStroke: '#B45309',
  },
  {
    slug: 'english-studio',
    href: '/tools/english-studio',
    title: 'English Literature HL Studio & PRL Planner',
    subtitle: 'Criterion B literary device drill, 5 Fields of Inquiry Global Issue builder & 13-Work PRL checker.',
    subjectLabel: 'English Lit HL',
    badgeBg: '#DBEAFE',
    badgeText: '#1E40AF',
    iconStroke: '#1D4ED8',
  },
  {
    slug: 'french-studio',
    href: '/tools/french-studio',
    title: 'French B SL Text-Type & Grammar Studio',
    subtitle: 'Paper 1 Criterion C conventions for 6 text types, Subjonctif triggers & Si-clause drills.',
    subjectLabel: 'French B SL',
    badgeBg: '#E0F2FE',
    badgeText: '#0369A1',
    iconStroke: '#0284C7',
  },
];

const CORE_RECALL_TOOLS: ToolDirectoryEntry[] = [
  {
    slug: 'blurting',
    href: '/tools/blurting',
    title: 'Active Recall Blurting Canvas',
    subtitle: 'Timed brain-dump against IB syllabus checkpoints with instant missing-concept gap analysis.',
    subjectLabel: 'All 6 Subjects',
    badgeBg: '#FEF3C7',
    badgeText: '#92400E',
    iconStroke: '#D97706',
  },
  {
    slug: 'teach-sprout',
    href: '/tools/teach-sprout',
    title: 'Teach Sprout (Feynman AI Method)',
    subtitle: 'Explain any syllabus concept in plain language while Sprout probes weak logical links.',
    subjectLabel: 'All 6 Subjects',
    badgeBg: '#DCFCE7',
    badgeText: '#065F46',
    iconStroke: '#059669',
  },
  {
    slug: 'originality-check',
    href: '/tools/originality-check',
    title: 'Coursework Originality & AI Signal Auditor',
    subtitle: 'Advisory sentence burstiness, lexical diversity & stock-phrase signal check for IA, HL Essay & TOK.',
    subjectLabel: 'IA / EE / TOK',
    badgeBg: '#F4F4F5',
    badgeText: '#18181B',
    iconStroke: '#18181B',
  },
];

function renderToolIcon(slug: string, stroke: string) {
  const props = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke,
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  switch (slug) {
    case 'data-booklet':
      return (
        <svg {...props}>
          <path d="M9 3h6" />
          <path d="M10 3v5l-4.5 7.8A2 2 0 0 0 7.2 19h9.6a2 2 0 0 0 1.7-3.2L14 8V3" />
          <path d="M8.5 14h7" />
        </svg>
      );
    case 'calc-checker':
      return (
        <svg {...props}>
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <path d="M8 6h8" />
          <path d="M8 10h2m4 0h2m-8 4h2m4 0h2m-8 4h2m4 0h2" />
        </svg>
      );
    case 'formula-booklet':
      return (
        <svg {...props}>
          <path d="M18 4H6l6 8-6 8h12" />
        </svg>
      );
    case 'bio-visualizations':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 4v3m0 10v3M4 12h3m10 0h3" />
        </svg>
      );
    case 'opcvl-trainer':
      return (
        <svg {...props}>
          <path d="M8 3h9a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6" />
          <path d="M8 3a2 2 0 0 0-2 2v12" />
          <path d="M10 8h5m-5 4h5m-5 4h3" />
        </svg>
      );
    case 'english-studio':
      return (
        <svg {...props}>
          <path d="M2 5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15a2 2 0 0 0-2-2H4a2 2 0 0 1-2-2V5Z" />
          <path d="M22 5a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v15a2 2 0 0 1 2-2h6a2 2 0 0 0 2-2V5Z" />
        </svg>
      );
    case 'french-studio':
      return (
        <svg {...props}>
          <path d="M4 5h7m-3.5-2v2c0 4-1.8 7.5-4.5 9.5" />
          <path d="M6 9c1.5 2 3.2 3.8 5.2 5" />
          <path d="M13 19l4-10 4 10" />
          <path d="M14.3 15.5h5.4" />
        </svg>
      );
    case 'blurting':
      return (
        <svg {...props}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      );
    case 'teach-sprout':
      return (
        <svg {...props}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M8 9h8m-8 4h5" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
  }
}

export default function ToolsDirectoryPage() {
  return (
    <div>
      {/* Neutral Top Aurora Header */}
      <div className="aurora-header">
        <div className="col-center">
          <div className="flex items-center gap-2 text-[12px] text-[#71717A] font-medium mb-2">
            <Link href="/" className="hover:text-[#18181B] transition-colors duration-150">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#18181B]">Interactive Tools & Reference Booklets</span>
          </div>

          <h1 className="h-title">
            Interactive Tools{' '}
            <span className="h-sub">/ Subject Booklets & Active Recall</span>
          </h1>
          <p className="text-[13.5px] text-[#71717A] mt-1.5 max-w-2xl">
            Purpose-built interactive reference booklets, markscheme calculation checkers, and active recall studios tailored to each of your 6 IB Diploma subjects.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-pad">
        <div className="col-center space-y-8">
          {/* Section 1: Subject-Unique Interactive Booklets & Studios */}
          <section className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-2.5">
              <h2
                className="text-[15px] font-semibold text-[#18181B]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Subject-Specific Interactive Reference & Practice Tools
              </h2>
              <span className="text-[11.5px] font-mono text-[#71717A]">
                7 Specialist Tools
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {SUBJECT_SPECIALIST_TOOLS.map((tool) => (
                <Link
                  key={tool.slug}
                  href={tool.href}
                  className="group flex items-start gap-3.5 p-3 rounded-[14px] bg-white hover:bg-[#F4F4F5] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
                >
                  <div
                    className="w-[42px] h-[42px] rounded-[11px] flex items-center justify-center shrink-0"
                    style={{ backgroundColor: tool.badgeBg }}
                  >
                    {renderToolIcon(tool.slug, tool.iconStroke)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="text-[14px] font-semibold text-[#18181B] truncate"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {tool.title}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-[6px] text-[10.5px] font-mono font-semibold shrink-0"
                        style={{
                          backgroundColor: tool.badgeBg,
                          color: tool.badgeText,
                        }}
                      >
                        {tool.subjectLabel}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#71717A] line-clamp-2 mt-0.5">
                      {tool.subtitle}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Section 2: Cross-Subject Recall & Coursework Tools */}
          <section className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-2.5">
              <h2
                className="text-[15px] font-semibold text-[#18181B]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Active Recall & Coursework Integrity Studios
              </h2>
              <span className="text-[11.5px] font-mono text-[#71717A]">
                Global IB Studios
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {CORE_RECALL_TOOLS.map((tool) => (
                <Link
                  key={tool.slug}
                  href={tool.href}
                  className="group flex items-start gap-3.5 p-3 rounded-[14px] bg-white hover:bg-[#F4F4F5] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
                >
                  <div
                    className="w-[42px] h-[42px] rounded-[11px] flex items-center justify-center shrink-0"
                    style={{ backgroundColor: tool.badgeBg }}
                  >
                    {renderToolIcon(tool.slug, tool.iconStroke)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="text-[14px] font-semibold text-[#18181B] truncate"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {tool.title}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-[6px] text-[10.5px] font-mono font-semibold shrink-0"
                        style={{
                          backgroundColor: tool.badgeBg,
                          color: tool.badgeText,
                        }}
                      >
                        {tool.subjectLabel}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#71717A] line-clamp-2 mt-0.5">
                      {tool.subtitle}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
