'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  FileText,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import type { ScreenState } from '@/types/fsm';
import {
  analyzeOriginalityHeuristic,
  OriginalitySignalSchema,
  type OriginalitySignal,
} from '@/lib/originality';

const SAMPLE_PARAGRAPHS: {
  id: string;
  label: string;
  badge: string;
  text: string;
}[] = [
  {
    id: 'authentic-hist',
    label: 'Authentic IB History IA (Low Risk · 11%)',
    badge: 'Low Signal',
    text: 'The occupation of the industrial heartland in January 1923 exposed the vulnerability of the Weimar Republic. Passive resistance spearheaded by Chancellor Cuno triggered hyperinflationary pressures across regional industries. By November 1923, Reichsbank discounting pushed the exchange rate to 4.2 trillion marks per US dollar, severely eroding the liquid savings and confidence of the German Mittelstand. Yet Stresemann’s currency stabilization via the Rentenmark demonstrated that parliamentary survival remained viable when fiscal reform accompanied diplomatic negotiation.',
  },
  {
    id: 'formulaic-ai',
    label: 'Formulaic AI-Heavy Draft (Elevated Risk)',
    badge: 'Elevated Signal',
    text: 'In conclusion, it is important to note that the Ruhr Crisis plays a crucial role in understanding the rich tapestry of Weimar Germany. Furthermore, when we delve into the economic factors, we can see that hyperinflation was a testament to the instability of the government. Moreover, passive resistance further complicated the political landscape and plays a crucial role in how historians view this pivotal era.',
  },
  {
    id: 'authentic-bio',
    label: 'Authentic IB Biology HL Lab Evaluation (Low Risk)',
    badge: 'Low Signal',
    text: 'Increasing sodium bicarbonate concentration from 0.1% to 0.8% w/v elevated the mean oxygen evolution rate in Elodea canadensis from 1.4 ± 0.2 to 6.8 ± 0.3 mL O2 min⁻¹ (±0.05 mL syringe uncertainty). Above 0.8% w/v, the plateau at 6.7 ± 0.4 mL O2 min⁻¹ reflects active-site saturation of RuBisCO rather than apparatus leakage. One-way ANOVA (F = 48.6, p < 0.0001) confirms statistically significant variance across treatments.',
  },
];

export default function OriginalityCheckPage() {
  const router = useRouter();
  const [inputText, setInputText] = useState<string>('');
  const [analysisState, setAnalysisState] = useState<
    ScreenState<OriginalitySignal>
  >({ status: 'idle' });
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  async function handleRunAnalysis(customText?: string) {
    const targetText = (customText ?? inputText).trim();
    if (!targetText) {
      setAnalysisState({
        status: 'empty',
        message: 'Paste or load an IB coursework passage above to analyze its stylistic originality signal.',
      });
      return;
    }

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setAnalysisState({ status: 'loading' });
    try {
      const res = await fetch('/api/ai/originality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({ text: targetText }),
      });
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.error || 'Failed to run originality analysis.'
        );
      }
      const parsed = OriginalitySignalSchema.safeParse(await res.json());
      if (!parsed.success) {
        throw new Error('Unexpected originality response format.');
      }
      setAnalysisState({ status: 'success', data: parsed.data });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setAnalysisState({
        status: 'error',
        message:
          err instanceof Error
            ? err.message
            : 'Unable to run originality analysis right now. Please retry.',
      });
    }
  }

  const wordCount = inputText
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return (
    <div>
      {/* Aurora Header */}
      <div className="aurora-header">
        <div className="col-center">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="h-title">
                Plagiarism &amp; Advisory AI Signal Check
              </h1>
              <p className="h-sub" style={{ fontSize: '18px', marginTop: '4px' }}>
                Analyze Sentence Burstiness, Lexical Diversity &amp; Stock AI
                Transitions Before IB Submission
              </p>
            </div>
            <Link
              href="/essay-studio"
              className="pill-btn-dark transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-zinc-900"
            >
              Open Split-Pane Essay Studio <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="main-pad">
        <div className="col-center">
          {/* Advisory Notice Banner */}
          <div
            className="rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] px-4 py-3 mb-5 flex items-start gap-3"
            style={{ borderLeft: '3.5px solid #18181B' }}
          >
            <ShieldCheck className="w-4 h-4 text-zinc-800 shrink-0 mt-0.5" />
            <div className="text-xs text-zinc-600 leading-relaxed">
              <strong className="text-zinc-900">
                Advisory Linguistic Signal Only (Not Proof of Authorship):
              </strong>{' '}
              This analyzer evaluates stylistic burstiness (sentence length
              variation), type-token lexical diversity, and stock LLM transition
              density. Results are strictly advisory and never constitute
              definitive evidence of AI generation or misconduct—use them to
              replace generic phrasing with concrete IB data, historiography,
              and citations.
            </div>
          </div>

          {/* Sample Paragraph Loader Pills */}
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-zinc-500 mr-1">
                Load Sample IB Passage:
              </span>
              {SAMPLE_PARAGRAPHS.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => {
                    setInputText(sample.text);
                    handleRunAnalysis(sample.text);
                  }}
                  className="pill-btn text-xs py-1 px-2.5 focus-visible:ring-2 focus-visible:ring-zinc-900"
                >
                  <FileText className="w-3 h-3" /> {sample.label}
                </button>
              ))}
            </div>
            <span className="text-xs font-mono text-zinc-500">
              {wordCount} words
            </span>
          </div>

          {/* Input Card */}
          <div className="hairline-card mb-5">
            <label
              htmlFor="originality-textarea"
              className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2"
            >
              Coursework Excerpt (IA / EE / TOK / HL Essay)
            </label>
            <textarea
              id="originality-textarea"
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your Internal Assessment, Extended Essay, or TOK paragraph here..."
              className="w-full text-[14px] leading-[1.75] text-zinc-800 bg-zinc-50/50 border border-zinc-200 rounded-xl p-3.5 focus:outline-none focus:border-zinc-900 transition-colors duration-150"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  abortControllerRef.current?.abort();
                  setInputText('');
                  setAnalysisState({
                    status: 'idle',
                  });
                }}
                className="pill-btn text-xs"
              >
                <RotateCcw className="w-3 h-3" /> Clear Text
              </button>
              <button
                type="button"
                onClick={() => handleRunAnalysis()}
                className="pill-btn-dark"
              >
                <Sparkles className="w-3.5 h-3.5" /> Analyze Originality &amp;
                Voice Signal
              </button>
            </div>
          </div>

          {/* Results Area via ScreenState FSM */}
          {analysisState.status === 'idle' && (
            <div className="hairline-card text-center py-10">
              <ShieldCheck className="w-7 h-7 text-[#71717A] mx-auto mb-2.5" />
              <p className="text-[13.5px] font-semibold text-[#18181B]">
                Paste an IA, EE, or TOK excerpt above to check stylistic originality
              </p>
              <p className="text-xs text-[#71717A] mt-1 mb-4 max-w-md mx-auto">
                Evaluates sentence burstiness, type-token lexical diversity, and stock LLM transitions without uploading drafts externally.
              </p>
              <button
                type="button"
                onClick={() => {
                  setInputText(SAMPLE_PARAGRAPHS[0].text);
                  handleRunAnalysis(SAMPLE_PARAGRAPHS[0].text);
                }}
                className="pill-btn"
              >
                <FileText className="w-3.5 h-3.5" /> Load Sample
              </button>
            </div>
          )}

          {analysisState.status === 'loading' && (
            <div
              aria-busy="true"
              aria-label="Analyzing originality signal"
              className="grid grid-cols-1 md:grid-cols-3 gap-3"
            >
              <div className="hairline-card h-28 animate-pulse bg-zinc-50" />
              <div className="hairline-card h-28 animate-pulse bg-zinc-50" />
              <div className="hairline-card h-28 animate-pulse bg-zinc-50" />
            </div>
          )}

          {analysisState.status === 'empty' && (
            <div className="hairline-card text-center py-10">
              <p className="text-xs text-zinc-500 mb-3">
                {analysisState.message}
              </p>
              <button
                type="button"
                onClick={() => {
                  setInputText(SAMPLE_PARAGRAPHS[0].text);
                  handleRunAnalysis(SAMPLE_PARAGRAPHS[0].text);
                }}
                className="pill-btn-dark"
              >
                Load Sample Weimar History IA Paragraph
              </button>
            </div>
          )}

          {analysisState.status === 'error' && (
            <div role="alert" className="hairline-card text-center py-8">
              <p className="text-xs text-[#B91C1C] font-medium mb-3">
                {analysisState.message}
              </p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleRunAnalysis()}
                  className="pill-btn-dark"
                >
                  Retry Analysis
                </button>
                {inputText.trim() && (
                  <button
                    type="button"
                    onClick={() =>
                      setAnalysisState({
                        status: 'success',
                        data: analyzeOriginalityHeuristic(inputText.trim()),
                      })
                    }
                    className="pill-btn"
                  >
                    Run Offline Heuristic Check
                  </button>
                )}
              </div>
            </div>
          )}

          {analysisState.status === 'success' && (
            <div className="space-y-4">
              {/* Summary Signal Header Card */}
              <div className="hairline-card flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Overall Advisory Stylistic Signal
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5 mt-1">
                    <span className="text-xl font-bold text-zinc-900">
                      Originality Signal: {analysisState.data.label} (
                      {analysisState.data.riskPercent}%)
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        analysisState.data.label === 'Low'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : analysisState.data.label === 'Moderate'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}
                    >
                      {analysisState.data.label === 'Low'
                        ? 'Authentic Academic Voice'
                        : analysisState.data.label === 'Moderate'
                        ? 'Review Stock Transitions'
                        : 'High Formulaic Phrase Density'}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed">
                    {analysisState.data.advisoryNote}
                  </p>
                </div>
                <Link href="/essay-studio" className="pill-btn shrink-0">
                  Edit with Inline Diffs in Essay Studio →
                </Link>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {analysisState.data.metrics.map((metric) => (
                  <div
                    key={metric.name}
                    className="hairline-card"
                    style={{ padding: '16px 18px' }}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-semibold text-zinc-900">
                        {metric.name}
                      </span>
                      <span
                        className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
                          metric.status === 'good'
                            ? 'bg-emerald-50 text-emerald-700'
                            : metric.status === 'watch'
                            ? 'bg-amber-50 text-amber-800'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {metric.value}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      {metric.note}
                    </p>
                  </div>
                ))}
              </div>

              {/* Flagged Passages */}
              <div className="hairline-card">
                <div className="text-xs font-semibold text-zinc-900 mb-2.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Flagged Formulaic Passages (
                  {analysisState.data.flaggedPassages.length})
                </div>
                {analysisState.data.flaggedPassages.length === 0 ? (
                  <p className="text-xs text-emerald-700 bg-emerald-50/70 border border-emerald-200/70 rounded-lg px-3 py-2">
                    No formulaic AI filler transitions detected. Your passage
                    relies on direct disciplinary vocabulary and varied sentence
                    cadence.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {analysisState.data.flaggedPassages.map((fp, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl p-3.5 bg-amber-50/60 border border-amber-200/80"
                        style={{ borderLeft: '3.5px solid #D97706' }}
                      >
                        <div className="text-xs font-medium text-zinc-900 mb-1">
                          &ldquo;{fp.excerpt}&rdquo;
                        </div>
                        <div className="text-[11.5px] text-amber-900 font-semibold">
                          Why flagged: {fp.reason}
                        </div>
                        <div className="text-[11.5px] text-zinc-600 mt-0.5">
                          Revision strategy: {fp.suggestion}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
