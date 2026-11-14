import React from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ChemistryDataBookletTool } from '@/components/tools/ChemistryDataBookletTool';
import { ChemistryCalcCheckerTool } from '@/components/tools/ChemistryCalcCheckerTool';
import { MathFormulaBookletTool } from '@/components/tools/MathFormulaBookletTool';
import { BiologyVisualizationsTool } from '@/components/tools/BiologyVisualizationsTool';
import { HistoryOpcvlTool } from '@/components/tools/HistoryOpcvlTool';
import { EnglishLiteratureStudioTool } from '@/components/tools/EnglishLiteratureStudioTool';
import { FrenchLanguageStudioTool } from '@/components/tools/FrenchLanguageStudioTool';

interface ToolRouteMeta {
  slug: string;
  title: string;
  levelSubtitle: string;
  subjectName: string;
  subjectHubHref: string;
  wash1: string;
  wash2: string;
  accentColor: string;
}

const TOOL_ROUTE_META: Record<string, ToolRouteMeta> = {
  'data-booklet': {
    slug: 'data-booklet',
    title: 'Interactive Data Booklet',
    levelSubtitle: 'Chemistry SL',
    subjectName: 'Chemistry SL',
    subjectHubHref: '/subjects/chem',
    wash1: 'rgba(153, 246, 228, 0.55)',
    wash2: 'rgba(204, 251, 241, 0.45)',
    accentColor: '#0D9488',
  },
  'calc-checker': {
    slug: 'calc-checker',
    title: 'Calculation Step Checker',
    levelSubtitle: 'Chemistry SL',
    subjectName: 'Chemistry SL',
    subjectHubHref: '/subjects/chem',
    wash1: 'rgba(153, 246, 228, 0.55)',
    wash2: 'rgba(204, 251, 241, 0.45)',
    accentColor: '#0D9488',
  },
  'formula-booklet': {
    slug: 'formula-booklet',
    title: 'Interactive Formula Booklet',
    levelSubtitle: 'Math AA SL',
    subjectName: 'Math AA SL',
    subjectHubHref: '/subjects/math',
    wash1: 'rgba(254, 240, 138, 0.52)',
    wash2: 'rgba(254, 243, 199, 0.45)',
    accentColor: '#D97706',
  },
  'bio-visualizations': {
    slug: 'bio-visualizations',
    title: 'Cell & Pathway Visualizations',
    levelSubtitle: 'Biology HL',
    subjectName: 'Biology HL',
    subjectHubHref: '/subjects/bio',
    wash1: 'rgba(167, 243, 208, 0.55)',
    wash2: 'rgba(209, 250, 229, 0.45)',
    accentColor: '#059669',
  },
  'opcvl-trainer': {
    slug: 'opcvl-trainer',
    title: 'OPCVL Source Trainer & Essay Builder',
    levelSubtitle: 'History HL',
    subjectName: 'History HL',
    subjectHubHref: '/subjects/hist',
    wash1: 'rgba(253, 230, 138, 0.52)',
    wash2: 'rgba(254, 243, 199, 0.45)',
    accentColor: '#B45309',
  },
  'english-studio': {
    slug: 'english-studio',
    title: 'Literary Device, Global Issue & PRL Studio',
    levelSubtitle: 'English Literature HL',
    subjectName: 'English Literature HL',
    subjectHubHref: '/subjects/eng',
    wash1: 'rgba(191, 219, 254, 0.58)',
    wash2: 'rgba(219, 234, 254, 0.45)',
    accentColor: '#1D4ED8',
  },
  'french-studio': {
    slug: 'french-studio',
    title: 'Text-Type, Register & Subjonctif Studio',
    levelSubtitle: 'French B SL',
    subjectName: 'French B SL',
    subjectHubHref: '/subjects/fr',
    wash1: 'rgba(186, 230, 253, 0.62)',
    wash2: 'rgba(224, 242, 254, 0.48)',
    accentColor: '#0284C7',
  },
};

const LEGACY_TOOL_REDIRECTS: Record<string, string> = {
  opcvl: '/tools/opcvl-trainer',
  'literary-devices': '/tools/english-studio',
};

export function generateStaticParams() {
  return Object.keys(TOOL_ROUTE_META).map((toolSlug) => ({ toolSlug }));
}

export default async function SubjectToolPage({
  params,
  searchParams,
}: {
  params: Promise<{ toolSlug: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { toolSlug } = await params;
  const { tab } = await searchParams;
  const legacyTarget = LEGACY_TOOL_REDIRECTS[toolSlug];
  if (legacyTarget) {
    redirect(tab ? `${legacyTarget}?tab=${encodeURIComponent(tab)}` : legacyTarget);
  }

  const meta = TOOL_ROUTE_META[toolSlug];

  if (!meta) {
    notFound();
  }

  return (
    <div
      style={
        {
          '--wash-1': meta.wash1,
          '--wash-2': meta.wash2,
          '--subj-accent': meta.accentColor,
        } as React.CSSProperties
      }
    >
      {/* Subject-Immersed Aurora Header */}
      <div className="aurora-header">
        <div className="col-center">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 text-[12px] text-[#71717A] font-medium">
              <Link
                href={meta.subjectHubHref}
                className="rounded hover:text-[#18181B] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
              >
                ← Back to {meta.subjectName} Hub
              </Link>
              <span>·</span>
              <Link
                href="/tools"
                className="rounded hover:text-[#18181B] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
              >
                All Tools
              </Link>
            </div>

            <Link href={meta.subjectHubHref} className="pill-btn text-[11.5px]">
              <span>Open {meta.subjectName} Hub</span>
              <span>→</span>
            </Link>
          </div>

          <h1 className="h-title">
            {meta.title} <span className="h-sub">/ {meta.levelSubtitle}</span>
          </h1>
        </div>
      </div>

      {/* Tool Body */}
      <div className="main-pad">
        <div className="col-center">
          {toolSlug === 'data-booklet' && <ChemistryDataBookletTool initialTab={tab} />}
          {toolSlug === 'calc-checker' && <ChemistryCalcCheckerTool />}
          {toolSlug === 'formula-booklet' && <MathFormulaBookletTool />}
          {toolSlug === 'bio-visualizations' && <BiologyVisualizationsTool />}
          {toolSlug === 'opcvl-trainer' && <HistoryOpcvlTool initialTab={tab} />}
          {toolSlug === 'english-studio' && <EnglishLiteratureStudioTool initialTab={tab} />}
          {toolSlug === 'french-studio' && <FrenchLanguageStudioTool initialTab={tab} />}
        </div>
      </div>
    </div>
  );
}
