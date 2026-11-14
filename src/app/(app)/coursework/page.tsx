'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { KaTeXText } from '@/components/math/KaTeXText';
import type { SubjectSlug } from '@/types/fsm';

type CourseworkViewTab = 'rubrics' | 'exemplars' | 'core_ee_tok';

interface SubjectCourseworkGuide {
  slug: SubjectSlug;
  name: string;
  level: string;
  accent: string;
  softBg: string;
  iaLabel: string;
  iaTitle: string;
  weight: string;
  wordLimit: string;
  maxMarks: number;
  rubricNote?: string;
  steps: [string, string, string];
  companionTools: { label: string; href: string }[];
  criteria: {
    code: string;
    name: string;
    marks: string;
    descriptor: string;
  }[];
  exemplar: {
    title: string;
    scoreBadge: string;
    researchQuestion: string;
    excerpt: string;
    highlightedSpan: string;
    examinerNote: string;
  };
}

const COURSEWORK_GUIDES: SubjectCourseworkGuide[] = [
  {
    slug: 'bio',
    name: 'Biology',
    level: 'HL',
    accent: '#059669',
    softBg: '#F0FDF4',
    iaLabel: 'Biology IA',
    iaTitle: 'Scientific Investigation (2025 Syllabus)',
    weight: '20% of final grade',
    wordLimit: '3,000 words max',
    maxMarks: 24,
    steps: ['Choose focus', 'Set research question', 'Draft & AI review'],
    companionTools: [
      { label: 'Bio Visualizations', href: '/tools/bio-visualizations' },
    ],
    criteria: [
      {
        code: 'Criterion A',
        name: 'Research Design',
        marks: '6 marks',
        descriptor:
          'Define a focused biological research question, justify independent/dependent variable ranges, and specify controlled variables with monitoring protocols.',
      },
      {
        code: 'Criterion B',
        name: 'Data Analysis',
        marks: '6 marks',
        descriptor:
          'Record raw and processed quantitative data with SI units, instrumental uncertainties ($\\pm$), error bars, and appropriate statistical tests (ANOVA, $t$-test, $R^2$).',
      },
      {
        code: 'Criterion C',
        name: 'Conclusion',
        marks: '6 marks',
        descriptor:
          'Formulate a conclusion directly justified by processed data and compare findings against peer-reviewed biochemical literature.',
      },
      {
        code: 'Criterion D',
        name: 'Evaluation',
        marks: '6 marks',
        descriptor:
          'Evaluate specific methodological weaknesses (systematic vs random error) and propose realistic, quantified modifications.',
      },
    ],
    exemplar: {
      title: 'Sodium Bicarbonate & Photosynthetic Rate in Elodea canadensis',
      scoreBadge: '22 / 24 (Grade 7)',
      researchQuestion:
        'How does varying sodium bicarbonate concentration (0.1% to 1.0%) affect the rate of oxygen evolution in Elodea canadensis under 5,000 lux illumination?',
      excerpt:
        'Increasing sodium bicarbonate concentration from $0.1\\%$ to $0.8\\%$ w/v elevated the mean oxygen evolution rate from $1.4 \\pm 0.2$ to $6.8 \\pm 0.3\\text{ mL O}_2\\text{ min}^{-1}$ ($\\pm 0.05\\text{ mL}$ syringe uncertainty). At $1.0\\%\\ \\text{NaHCO}_3$, the rate plateaued at $6.7 \\pm 0.4\\text{ mL O}_2\\text{ min}^{-1}$, indicating active-site saturation of RuBisCO and rate limitation by RuBP regeneration.',
      highlightedSpan:
        'indicating active-site saturation of RuBisCO and rate limitation by RuBP regeneration.',
      examinerNote:
        'Examiner Annotation (Criterion C — 6/6): Directly connects the experimental plateau above $0.8\\%$ w/v to enzymatic saturation kinetics and Calvin cycle biochemistry.',
    },
  },
  {
    slug: 'chem',
    name: 'Chemistry',
    level: 'SL',
    accent: '#0D9488',
    softBg: '#F0FDFA',
    iaLabel: 'Chemistry IA',
    iaTitle: 'Scientific Investigation (SL)',
    weight: '20% of final grade',
    wordLimit: '3,000 words max',
    maxMarks: 24,
    steps: ['Select reaction system', 'Propagate % uncertainty', 'Draft & AI review'],
    companionTools: [
      { label: 'IB Data Booklet', href: '/tools/data-booklet' },
      { label: 'Calc Checker', href: '/tools/calc-checker' },
    ],
    criteria: [
      {
        code: 'Criterion A',
        name: 'Research Design',
        marks: '6 marks',
        descriptor:
          'Chemical context, reaction stoichiometry, molarity range justification, and safety/environmental risk assessment.',
      },
      {
        code: 'Criterion B',
        name: 'Data Analysis',
        marks: '6 marks',
        descriptor:
          'Full propagation of burette/balance/thermometer percentage uncertainties and linearized Arrhenius or rate-order plots.',
      },
      {
        code: 'Criterion C',
        name: 'Conclusion',
        marks: '6 marks',
        descriptor:
          'Compare experimental activation energy ($E_a$) or enthalpy against IB Data Booklet / NIST values and calculate percentage error.',
      },
      {
        code: 'Criterion D',
        name: 'Evaluation',
        marks: '6 marks',
        descriptor:
          'Compare percentage uncertainty against percentage error to distinguish apparatus precision from systematic heat loss or side reactions.',
      },
    ],
    exemplar: {
      title: 'Arrhenius Activation Energy of Sodium Thiosulfate & HCl',
      scoreBadge: '22 / 24 (Grade 7)',
      researchQuestion:
        'How does varying temperature (293.0 K to 333.0 K) affect the initial rate constant and activation energy of the reaction between 0.15 mol dm⁻³ Na₂S₂O₃ and 1.0 mol dm⁻³ HCl?',
      excerpt:
        'Linear regression of $\\ln(k)$ against $1/T$ yielded a gradient of $-5{,}410 \\pm 180\\text{ K}$ ($R^2 = 0.992$), corresponding to an experimental activation energy of $E_a = 45.0 \\pm 1.5\\text{ kJ mol}^{-1}$. Because the literature discrepancy ($4.3\\%$) exceeds the propagated instrumental uncertainty ($1.8\\%$), systematic thermal dissipation during mixing dominated.',
      highlightedSpan:
        'Because the literature discrepancy ($4.3\\%$) exceeds the propagated instrumental uncertainty ($1.8\\%$), systematic thermal dissipation during mixing dominated.',
      examinerNote:
        'Examiner Annotation (Criterion D — 6/6): Textbook IB Chemistry evaluation comparing percentage error against propagated percentage uncertainty.',
    },
  },
  {
    slug: 'hist',
    name: 'History',
    level: 'HL',
    accent: '#B45309',
    softBg: '#FFFBEB',
    iaLabel: 'Historical Investigation',
    iaTitle: '3-Section Source & Historiography Dossier',
    weight: '20% of final grade',
    wordLimit: '2,200 words max',
    maxMarks: 25,
    steps: [
      'Select 2 primary/secondary sources',
      'Draft Section 2 investigation',
      'Write Section 3 reflection',
    ],
    companionTools: [
      { label: 'OPCVL Trainer', href: '/tools/opcvl-trainer' },
    ],
    criteria: [
      {
        code: 'Criterion A',
        name: 'Identification & Evaluation of Sources',
        marks: '6 marks',
        descriptor:
          'Explicitly state the research question and analyze two sources for Origin, Purpose, Value, and Limitation (OPCVL) in relation to the inquiry.',
      },
      {
        code: 'Criterion B',
        name: 'Investigation',
        marks: '15 marks',
        descriptor:
          'Structured critical analysis sustained by primary archival evidence and contrasting schools of historiography (e.g. structuralist vs intentionalist).',
      },
      {
        code: 'Criterion C',
        name: 'Reflection',
        marks: '4 marks',
        descriptor:
          'Reflect on the specific methods and epistemological challenges faced by the historian during this investigation.',
      },
    ],
    exemplar: {
      title: 'Weimar Hyperinflation & the 1923 Ruhr Occupation',
      scoreBadge: '23 / 25 (Grade 7)',
      researchQuestion:
        'To what extent did the Ruhr Crisis of 1923 destabilize the Weimar Republic?',
      excerpt:
        'The occupation of the industrial heartland in January 1923 exposed the structural fiscal vulnerability of the Weimar Republic. By November 1923, Reichsbank discounting pushed the exchange rate to 4.2 trillion marks per US dollar, severely eroding the liquid savings and democratic allegiance of the German Mittelstand.',
      highlightedSpan:
        'By November 1923, Reichsbank discounting pushed the exchange rate to 4.2 trillion marks per US dollar, severely eroding the liquid savings and democratic allegiance of the German Mittelstand.',
      examinerNote:
        'Examiner Annotation (Criterion B — 14/15): Anchors structuralist historiography (Peukert) with exact Reichsbank figures and precise sociological terminology (Mittelstand).',
    },
  },
  {
    slug: 'eng',
    name: 'English Literature',
    level: 'HL',
    accent: '#1D4ED8',
    softBg: '#EFF6FF',
    iaLabel: 'HL Essay & IO',
    iaTitle: '1,200–1,500w HL Essay & 15-min Individual Oral',
    weight: '40% (20% HLE · 20% IO)',
    wordLimit: '1,200–1,500w HL Essay · 15-min IO',
    maxMarks: 20,
    rubricNote:
      'HL Essay is marked out of 20 (20% of final grade). The companion 15-minute Individual Oral (10m presentation + 5m Q&A) is marked out of 40 across the same 4 criteria (10 marks each, 20% weight) for a 40% combined coursework weighting.',
    steps: ['Choose literary lens', 'Formulate line of inquiry', 'Draft & AI review'],
    companionTools: [
      { label: 'English Lit Studio', href: '/tools/english-studio' },
    ],
    criteria: [
      {
        code: 'Criterion A',
        name: 'Knowledge, Understanding & Interpretation',
        marks: '5 marks',
        descriptor:
          'Perceptive understanding of the work and persuasive interpretation anchored in the chosen line of inquiry.',
      },
      {
        code: 'Criterion B',
        name: 'Analysis & Evaluation',
        marks: '5 marks',
        descriptor:
          'Insightful analysis of how authorial choices (narrative voice, syntax, motif, structure) shape meaning.',
      },
      {
        code: 'Criterion C',
        name: 'Focus, Organization & Development',
        marks: '5 marks',
        descriptor:
          'Cohesive argument with purposeful paragraph transitions and balanced integration of textual evidence.',
      },
      {
        code: 'Criterion D',
        name: 'Language',
        marks: '5 marks',
        descriptor:
          'Precise, varied academic register and accurate literary critical terminology.',
      },
    ],
    exemplar: {
      title: 'Fragmented Temporality & Rememory in Toni Morrison’s Beloved',
      scoreBadge: '19 / 20 (Grade 7)',
      researchQuestion:
        'In what ways does Morrison utilize fragmented non-linear temporality to represent intergenerational trauma?',
      excerpt:
        'Throughout Beloved, Morrison fractures chronological progression to mirror the psychological intrusion of "rememory" within post-emancipation consciousness. Sethe’s recollection of Sweet Home operates not as distant historical archive but as a spatial and sensory present that resists linear closure.',
      highlightedSpan:
        'Sethe’s recollection of Sweet Home operates not as distant historical archive but as a spatial and sensory present that resists linear closure.',
      examinerNote:
        'Examiner Annotation (Criterion B — 5/5): Evaluates narrative form ("rememory") as a structural enactment of trauma rather than mere plot summary.',
    },
  },
  {
    slug: 'fr',
    name: 'French B',
    level: 'SL',
    accent: '#0284C7',
    softBg: '#F0F9FF',
    iaLabel: 'Individual Oral (IA)',
    iaTitle: 'Visual Stimulus Presentation & Theme Conversation',
    weight: '25% of final grade',
    wordLimit: '12–15 min IO (15 min prep)',
    maxMarks: 30,
    rubricNote:
      'Individual Oral (IA) accounts for 25% of French B SL (30 marks, 12–15 minutes following 15 minutes of supervised prep). Practise Paper 1 written text types (250–400 words) in the French Studio.',
    steps: [
      'Pick 1 of 5 IB themes',
      'Build visual stimulus notes',
      'Practice Q&A & review',
    ],
    companionTools: [
      { label: 'French Studio', href: '/tools/french-studio' },
    ],
    criteria: [
      {
        code: 'Criterion A',
        name: 'Langue (Language)',
        marks: '12 marks',
        descriptor:
          'Varied idiomatic vocabulary, complex grammatical structures (subjonctif, conditionnel, pronoms relatifs), and clear pronunciation.',
      },
      {
        code: 'Criterion B1',
        name: 'Message — Visual Stimulus',
        marks: '6 marks',
        descriptor:
          '3–4 minute presentation covering explicit visual details, implicit social interpretation, and specific links to Francophone culture.',
      },
      {
        code: 'Criterion B2',
        name: 'Message — Conversation',
        marks: '6 marks',
        descriptor:
          'Scope, depth, and personal reflection across the stimulus theme (Part 2) and general discussion on a second IB theme (Part 3).',
      },
      {
        code: 'Criterion C',
        name: 'Interactive Skills — Communication',
        marks: '6 marks',
        descriptor:
          'Sustained comprehension, spontaneity, and autonomous repair strategies in French throughout Parts 2 and 3.',
      },
    ],
    exemplar: {
      title: 'Le télétravail et le droit à la déconnexion en France (Organisation sociale)',
      scoreBadge: '28 / 30 (Grade 7)',
      researchQuestion:
        'Dans quelle mesure la généralisation du télétravail transforme-t-elle l’équilibre entre vie professionnelle et vie privée dans le monde francophone ?',
      excerpt:
        'Au-delà de ce que l’on voit littéralement, cette scène met le doigt sur un enjeu contemporain majeur : l’effacement de la frontière entre la sphère professionnelle et la vie familiale. En France, la loi El Khomri a instauré le droit à la déconnexion afin que le télétravail ne nuise pas à la santé mentale des salariés, et il est essentiel que les employeurs respectent ce temps de repos.',
      highlightedSpan:
        'afin que le télétravail ne nuise pas à la santé mentale des salariés, et il est essentiel que les employeurs respectent ce temps de repos.',
      examinerNote:
        'Examiner Annotation (Criterion A & B1 — 17/18): Anchors the stimulus in French legislation (le droit à la déconnexion) while deploying subjunctive triggers ("afin que... ne nuise pas", "il est essentiel que... respectent").',
    },
  },
  {
    slug: 'math',
    name: 'Math AA',
    level: 'SL',
    accent: '#D97706',
    softBg: '#FFFBEB',
    iaLabel: 'Math Exploration',
    iaTitle: '12–20 Page Mathematical Modelling IA',
    weight: '20% of final grade',
    wordLimit: '12–20 pages',
    maxMarks: 20,
    steps: ['Choose modelling topic', 'Formulate equations & fit', 'Draft & AI review'],
    companionTools: [
      { label: 'Formula Booklet', href: '/tools/formula-booklet' },
    ],
    criteria: [
      {
        code: 'Criterion A',
        name: 'Presentation',
        marks: '4 marks',
        descriptor:
          'Coherent, concise mathematical narrative where graphs, tables, and derivations flow logically toward the aim.',
      },
      {
        code: 'Criterion B',
        name: 'Mathematical Communication',
        marks: '4 marks',
        descriptor:
          'Proper LaTeX notation, explicitly defined variables/domains, and multiple representations (analytic, graphical, tabular).',
      },
      {
        code: 'Criterion C',
        name: 'Personal Engagement',
        marks: '3 marks',
        descriptor:
          'Independent primary data collection, custom boundary assumptions, or original model comparison.',
      },
      {
        code: 'Criterion D',
        name: 'Reflection',
        marks: '3 marks',
        descriptor:
          'Critical evaluation of residual errors, asymptotic breakdown, and physical vs mathematical domain constraints.',
      },
      {
        code: 'Criterion E',
        name: 'Use of Mathematics',
        marks: '6 marks',
        descriptor:
          'Correct, thoroughly explained calculus, regression, or probability techniques commensurate with the AA SL syllabus.',
      },
    ],
    exemplar: {
      title: 'Logistic vs Gompertz Differential Modelling of Urban EV Adoption',
      scoreBadge: '18 / 20 (Grade 7)',
      researchQuestion:
        'How accurately do logistic and Gompertz differential equations model electric vehicle fleet saturation in Norway (2012–2025)?',
      excerpt:
        'Integrating $\\frac{\\mathrm{d}P}{\\mathrm{d}t} = rP\\ln\\!\\left(\\frac{K}{P}\\right)$ yields an inflection point at $P = \\frac{K}{e} \\approx 36.8\\%$ saturation, which captures Norway’s asymmetric early tax-incentive acceleration significantly better than the symmetric logistic inflection at $K/2$ ($R^2 = 0.994$ vs $0.971$).',
      highlightedSpan:
        'Integrating $\\frac{\\mathrm{d}P}{\\mathrm{d}t} = rP\\ln\\!\\left(\\frac{K}{P}\\right)$ yields an inflection point at $P = \\frac{K}{e} \\approx 36.8\\%$ saturation',
      examinerNote:
        'Examiner Annotation (Criterion E — 6/6): Derives the Gompertz inflection point analytically via second derivative $\\frac{\\mathrm{d}^2 P}{\\mathrm{d}t^2} = 0$ and interprets its real-world meaning.',
    },
  },
];

const VALID_SLUGS: SubjectSlug[] = ['bio', 'chem', 'hist', 'eng', 'fr', 'math'];

const COURSEWORK_TABS: {
  id: CourseworkViewTab;
  getLabel: (maxMarks: number) => string;
}[] = [
  {
    id: 'rubrics',
    getLabel: (maxMarks) => `Official Criterion Rubric (${maxMarks} Marks)`,
  },
  {
    id: 'exemplars',
    getLabel: () => 'Annotated Grade 7 Exemplar',
  },
  {
    id: 'core_ee_tok',
    getLabel: () => 'Extended Essay & TOK Exhibition/Essay',
  },
];

function parseTabParam(raw: string | null): CourseworkViewTab {
  if (raw === 'exemplars' || raw === 'core_ee_tok' || raw === 'rubrics') {
    return raw;
  }
  return 'rubrics';
}

function parseSubjectParam(raw: string | null): SubjectSlug {
  if (raw && VALID_SLUGS.includes(raw as SubjectSlug)) {
    return raw as SubjectSlug;
  }
  return 'hist';
}

function buildCourseworkHref(
  slug: SubjectSlug,
  tab: CourseworkViewTab
): string {
  const params = new URLSearchParams();
  params.set('subject', slug);
  if (tab !== 'rubrics') {
    params.set('tab', tab);
  }
  return `/coursework?${params.toString()}`;
}

function CourseworkContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const subjectParam = searchParams.get('subject');

  const [selectedSlug, setSelectedSlug] = useState<SubjectSlug>(() =>
    parseSubjectParam(subjectParam)
  );
  const [activeTab, setActiveTab] = useState<CourseworkViewTab>(() =>
    parseTabParam(tabParam)
  );
  const tabRefs = useRef<Partial<Record<CourseworkViewTab, HTMLButtonElement | null>>>({});

  useEffect(() => {
    setActiveTab(parseTabParam(tabParam));
  }, [tabParam]);

  useEffect(() => {
    if (subjectParam && VALID_SLUGS.includes(subjectParam as SubjectSlug)) {
      setSelectedSlug(subjectParam as SubjectSlug);
    }
  }, [subjectParam]);

  const currentGuide =
    COURSEWORK_GUIDES.find((g) => g.slug === selectedSlug) ??
    COURSEWORK_GUIDES[0];

  const studioHref = `/essay-studio?subject=${currentGuide.slug}&type=${encodeURIComponent(
    currentGuide.slug === 'eng'
      ? 'HL Essay'
      : currentGuide.slug === 'fr'
      ? 'Paper Essay'
      : 'Internal Assessment'
  )}&rq=${encodeURIComponent(currentGuide.exemplar.researchQuestion)}`;

  const handleSelectSubject = (slug: SubjectSlug) => {
    setSelectedSlug(slug);
    router.replace(buildCourseworkHref(slug, activeTab), { scroll: false });
  };

  const handleSelectTab = (tab: CourseworkViewTab) => {
    setActiveTab(tab);
    router.replace(buildCourseworkHref(selectedSlug, tab), { scroll: false });
  };

  const handleTabKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    let nextIndex: number | null = null;
    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % COURSEWORK_TABS.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + COURSEWORK_TABS.length) % COURSEWORK_TABS.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = COURSEWORK_TABS.length - 1;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      const nextTab = COURSEWORK_TABS[nextIndex].id;
      handleSelectTab(nextTab);
      tabRefs.current[nextTab]?.focus();
    }
  };

  return (
    <div>
      {/* Aurora Header */}
      <div className="aurora-header">
        <div className="col-center">
          <div className="flex flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              <h1 className="h-title">Coursework Guides &amp; Exemplars</h1>
              <p
                className="mt-1 text-[15px] sm:text-[17px] font-medium leading-snug text-[#71717A]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Official IB IA, HL Essay, Extended Essay &amp; TOK Rubrics with
                Annotated Exemplars
              </p>
            </div>
            <Link
              href={studioHref}
              className="pill-btn-dark shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] focus-visible:ring-offset-2"
            >
              Open in AI Essay Studio <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Subject Pills Bar */}
          <div
            role="group"
            aria-label="Select IB subject"
            className="flex items-center gap-2 flex-wrap mt-5"
          >
            {COURSEWORK_GUIDES.map((guide) => {
              const isSelected = guide.slug === selectedSlug;
              return (
                <button
                  key={guide.slug}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleSelectSubject(guide.slug)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] focus-visible:ring-offset-2 ${
                    isSelected
                      ? 'bg-[#18181B] text-white'
                      : 'bg-white border border-[#E4E4E7] text-[#3F3F46] hover:bg-[#F4F4F5]'
                  }`}
                >
                  {guide.name} {guide.level}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-pad">
        <div className="col-center">
          {/* 1 -> 2 -> 3 IA Stepper Card matching unified-consistent-system.html */}
          <div
            className="hairline-card mb-5 flex flex-col gap-3.5"
            style={{ padding: '14px 18px' }}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="mini-tag shrink-0">{currentGuide.iaLabel}</span>
                  <span className="font-semibold text-[14.5px] text-[#18181B]">
                    {currentGuide.iaTitle}
                  </span>
                </div>
                <div className="flex items-center gap-x-3.5 gap-y-1.5 flex-wrap mt-2">
                  {currentGuide.steps.map((stepText, idx) => (
                    <span
                      key={stepText}
                      className="inline-flex items-center gap-1.5 text-[12.5px] text-[#52525B]"
                    >
                      <span className="w-[18px] h-[18px] rounded-full bg-[#F4F4F5] text-[#3F3F46] text-[11px] font-semibold inline-flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      {stepText}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Link
                  href={`/subjects/${currentGuide.slug}`}
                  className="pill-btn transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] focus-visible:ring-offset-2"
                >
                  Subject Hub
                </Link>
                {currentGuide.companionTools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="pill-btn transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] focus-visible:ring-offset-2"
                  >
                    {tool.label}
                  </Link>
                ))}
                <Link
                  href={studioHref}
                  className="pill-btn-dark transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] focus-visible:ring-offset-2"
                >
                  Setup in Studio <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-[#F4F4F5]">
              <span className="text-xs font-mono text-[#52525B] bg-[#F4F4F5] px-2.5 py-1 rounded-full">
                {currentGuide.wordLimit}
              </span>
              <span className="text-xs font-mono text-[#52525B] bg-[#F4F4F5] px-2.5 py-1 rounded-full">
                /{currentGuide.maxMarks} marks
              </span>
              <span className="text-xs font-mono text-[#52525B] bg-[#F4F4F5] px-2.5 py-1 rounded-full">
                {currentGuide.weight}
              </span>
            </div>
          </div>

          {/* Sub-navigation Tabs */}
          <div
            role="tablist"
            aria-label="Coursework sections"
            className="flex items-center gap-4 sm:gap-6 border-b border-[#E4E4E7] mb-5 overflow-x-auto"
          >
            {COURSEWORK_TABS.map((tab, index) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  ref={(el) => {
                    tabRefs.current[tab.id] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`coursework-tab-${tab.id}`}
                  aria-selected={isSelected}
                  aria-controls={`coursework-panel-${tab.id}`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => handleSelectTab(tab.id)}
                  onKeyDown={(e) => handleTabKeyDown(e, index)}
                  className={`px-1 py-2.5 text-[13px] transition-colors duration-150 border-b-2 whitespace-nowrap shrink-0 cursor-pointer rounded-t-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#18181B] ${
                    isSelected
                      ? 'border-[#18181B] text-[#18181B] font-semibold'
                      : 'border-transparent text-[#71717A] hover:text-[#18181B]'
                  }`}
                >
                  {tab.getLabel(currentGuide.maxMarks)}
                </button>
              );
            })}
          </div>

          {/* TAB 1: OFFICIAL CRITERION RUBRICS */}
          {activeTab === 'rubrics' && (
            <div
              role="tabpanel"
              id="coursework-panel-rubrics"
              aria-labelledby="coursework-tab-rubrics"
              className="space-y-3"
            >
              {currentGuide.rubricNote && (
                <div className="rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] px-4 py-2.5 text-xs text-[#52525B] leading-relaxed">
                  {currentGuide.rubricNote}
                </div>
              )}

              {currentGuide.criteria.map((crit) => (
                <div
                  key={crit.code}
                  className="hairline-card"
                  style={{
                    padding: '16px 20px',
                    borderLeft: `3.5px solid ${currentGuide.accent}`,
                  }}
                >
                  <div className="flex flex-wrap items-start sm:items-center justify-between gap-2 mb-1.5">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 min-w-0">
                      <span className="text-xs font-bold uppercase tracking-wide text-[#18181B]">
                        {crit.code}
                      </span>
                      <span className="text-sm font-semibold text-[#18181B]">
                        · {crit.name}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#F4F4F5] text-[#18181B] shrink-0 whitespace-nowrap">
                      {crit.marks}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#52525B] leading-relaxed">
                    <KaTeXText as="span" text={crit.descriptor} />
                  </p>
                </div>
              ))}

              <div className="hairline-card flex flex-wrap items-center justify-between gap-3 bg-[#FAFAFA]">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="text-sm font-semibold text-[#18181B]">
                    Ready to benchmark your {currentGuide.name}{' '}
                    {currentGuide.iaLabel} draft?
                  </div>
                  <p className="text-xs text-[#71717A] leading-relaxed">
                    Get criterion-by-criterion scoring and inline direct edits in
                    the Split-Pane Essay Studio. Originality signals are strictly
                    advisory stylistic indicators, never definitive proof.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <Link
                    href="/tools/originality-check"
                    className="pill-btn transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] focus-visible:ring-offset-2"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> Advisory Originality Check
                  </Link>
                  <Link
                    href={studioHref}
                    className="pill-btn-dark transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] focus-visible:ring-offset-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Open in AI Essay Studio{' '}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ANNOTATED GRADE 7 EXEMPLAR */}
          {activeTab === 'exemplars' && (
            <div
              role="tabpanel"
              id="coursework-panel-exemplars"
              aria-labelledby="coursework-tab-exemplars"
              className="space-y-4"
            >
              <div className="hairline-card">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="mini-tag">
                      {currentGuide.name} {currentGuide.level} Exemplar
                    </span>
                    <span className="text-xs font-semibold text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-0.5 rounded-full">
                      {currentGuide.exemplar.scoreBadge}
                    </span>
                  </div>
                  <Link
                    href={studioHref}
                    className="pill-btn-dark transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] focus-visible:ring-offset-2"
                  >
                    Load Exemplar into AI Essay Studio{' '}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="text-xs font-semibold uppercase tracking-wide text-[#71717A] mb-1">
                  {currentGuide.exemplar.title}
                </div>

                <h2
                  className="text-[#18181B] mb-3"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '19px',
                    fontWeight: 600,
                    lineHeight: 1.35,
                  }}
                >
                  {currentGuide.exemplar.researchQuestion}
                </h2>

                <p className="text-[14px] leading-[1.75] text-[#18181B] mb-4">
                  {currentGuide.exemplar.excerpt
                    .split(currentGuide.exemplar.highlightedSpan)
                    .map((part, i, arr) => (
                      <React.Fragment key={i}>
                        <KaTeXText as="span" text={part} />
                        {i < arr.length - 1 && (
                          <span
                            style={{
                              background: '#FEF3C7',
                              borderBottom: '2px solid #D97706',
                              padding: '1px 3px',
                            }}
                          >
                            <KaTeXText
                              as="span"
                              text={currentGuide.exemplar.highlightedSpan}
                            />
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                </p>

                <div
                  className="rounded-xl p-3.5"
                  style={{
                    background: '#FFFBEB',
                    borderLeft: '3.5px solid #D97706',
                  }}
                >
                  <div className="text-xs font-bold text-[#92400E] mb-1">
                    Senior IB Examiner Commentary
                  </div>
                  <p className="text-xs text-[#3F3F46] leading-relaxed">
                    <KaTeXText
                      as="span"
                      text={currentGuide.exemplar.examinerNote}
                    />
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CORE (EXTENDED ESSAY & TOK) */}
          {activeTab === 'core_ee_tok' && (
            <div
              role="tabpanel"
              id="coursework-panel-core_ee_tok"
              aria-labelledby="coursework-tab-core_ee_tok"
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="hairline-card flex flex-col justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="mini-tag">Extended Essay (EE)</span>
                    <span className="text-xs font-mono font-semibold text-[#3F3F46]">
                      34 Marks · 4,000 Words
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-[#18181B] mb-2">
                    IB Extended Essay Rubric (Criteria A–E)
                  </h3>
                  <ul className="space-y-2 text-xs text-[#52525B]">
                    <li>
                      <strong className="text-[#18181B]">
                        Criterion A (Focus &amp; Method · 6 marks):
                      </strong>{' '}
                      Sharp research question, disciplinary methodology, and source
                      selection.
                    </li>
                    <li>
                      <strong className="text-[#18181B]">
                        Criterion B (Knowledge &amp; Understanding · 6 marks):
                      </strong>{' '}
                      Subject-specific terminology and contextual mastery.
                    </li>
                    <li>
                      <strong className="text-[#18181B]">
                        Criterion C (Critical Thinking · 12 marks):
                      </strong>{' '}
                      Sustained synthesis, evaluation of counter-claims, and reasoned
                      argumentation.
                    </li>
                    <li>
                      <strong className="text-[#18181B]">
                        Criterion D (Presentation · 4 marks) &amp; E (Engagement · 6
                        marks):
                      </strong>{' '}
                      Academic layout and 500-word RPPF reflections.
                    </li>
                  </ul>
                </div>
                <div>
                  <Link
                    href={`/essay-studio?subject=${currentGuide.slug}&type=Extended%20Essay`}
                    className="pill-btn-dark transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] focus-visible:ring-offset-2"
                  >
                    Start {currentGuide.name} EE Draft{' '}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div className="hairline-card flex flex-col justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="mini-tag">Theory of Knowledge (TOK)</span>
                    <span className="text-xs font-mono font-semibold text-[#3F3F46]">
                      10 Marks · 1,600 Words
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-[#18181B] mb-2">
                    TOK Prescribed Title Essay &amp; Exhibition
                  </h3>
                  <ul className="space-y-2 text-xs text-[#52525B]">
                    <li>
                      <strong className="text-[#18181B]">
                        Driving Question:
                      </strong>{' '}
                      &ldquo;Does our knowledge depend on our interactions with
                      other knowers?&rdquo; across two Areas of Knowledge (AOKs).
                    </li>
                    <li>
                      <strong className="text-[#18181B]">
                        Real-Life Objects (Exhibition · 950 words):
                      </strong>{' '}
                      Anchor three specific personal/historical artifacts to one of
                      the 35 IA prompts.
                    </li>
                    <li>
                      <strong className="text-[#18181B]">
                        Counter-Claims &amp; Implications:
                      </strong>{' '}
                      Contrast Natural Sciences vs Human Sciences or History vs The
                      Arts.
                    </li>
                  </ul>
                </div>
                <div>
                  <Link
                    href="/essay-studio?subject=eng&type=Paper%20Essay"
                    className="pill-btn-dark transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] focus-visible:ring-offset-2"
                  >
                    Open TOK Draft in Studio{' '}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const SUBJECT_PILL_SKELETONS = ['w-24', 'w-28', 'w-24', 'w-36', 'w-24', 'w-24'];

function CourseworkSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading coursework guides">
      <div className="aurora-header">
        <div className="col-center">
          <div className="flex flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="space-y-2">
              <div className="h-8 w-72 max-w-full rounded-lg sr-shimmer" />
              <div className="h-5 w-96 max-w-full rounded-md sr-shimmer" />
            </div>
            <div className="h-8 w-44 rounded-full sr-shimmer shrink-0" />
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-5">
            {SUBJECT_PILL_SKELETONS.map((widthClass, idx) => (
              <div
                key={idx}
                className={`h-7 ${widthClass} rounded-full border border-[#E4E4E7] bg-white sr-shimmer`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="main-pad">
        <div className="col-center">
          <div
            className="hairline-card mb-5 space-y-3"
            style={{ padding: '14px 18px' }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-2 flex-1 min-w-0">
                <div className="h-5 w-64 max-w-full rounded sr-shimmer" />
                <div className="h-4 w-80 max-w-full rounded sr-shimmer" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-7 w-24 rounded-full sr-shimmer" />
                <div className="h-7 w-32 rounded-full sr-shimmer" />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2.5 border-t border-[#F4F4F5]">
              <div className="h-6 w-28 rounded-full sr-shimmer" />
              <div className="h-6 w-20 rounded-full sr-shimmer" />
              <div className="h-6 w-28 rounded-full sr-shimmer" />
            </div>
          </div>

          <div className="flex items-center gap-6 border-b border-[#E4E4E7] mb-5 pb-2.5">
            <div className="h-4 w-44 rounded sr-shimmer" />
            <div className="h-4 w-40 rounded sr-shimmer" />
            <div className="h-4 w-48 rounded sr-shimmer hidden sm:block" />
          </div>

          <div className="space-y-3">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="hairline-card space-y-2"
                style={{ padding: '16px 20px' }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="h-4 w-56 max-w-full rounded sr-shimmer" />
                  <div className="h-5 w-16 rounded-full sr-shimmer shrink-0" />
                </div>
                <div className="h-3.5 w-full rounded sr-shimmer" />
                <div className="h-3.5 w-4/5 rounded sr-shimmer" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CourseworkPage() {
  return (
    <Suspense fallback={<CourseworkSkeleton />}>
      <CourseworkContent />
    </Suspense>
  );
}
