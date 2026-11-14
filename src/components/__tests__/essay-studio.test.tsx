import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { analyzeOriginalityHeuristic } from '@/lib/originality';
import { CriterionHighlightMark } from '@/components/essay/extensions/CriterionHighlightMark';
import { SuggestedEditMark } from '@/components/essay/extensions/SuggestedEditMark';
import {
  EMPTY_TIPTAP_DOC,
  acceptSuggestedEditInEditor,
  applyAnnotationsToEditor,
  buildAnnotatedParagraphBlocks,
  buildDocTextIndex,
  dismissAnnotationInEditor,
  docHasAllOpenAnnotationMarks,
  extractTextAndFormattingFromTipTapJson,
  findQuoteRangeInDoc,
  parseTipTapContentJson,
  plainTextToTipTapDoc,
  type EssayAnnotation,
} from '@/components/essay/essayAnnotations';
import {
  EssayStudioClient,
  createBlankEssayDraft,
  getOriginalityRiskBadgeMeta,
  type EssayDocumentRecord,
} from '@/components/essay/EssayStudioClient';
import {
  QuestionRunnerClient,
  type QuestionRunnerItem,
} from '@/components/questions/QuestionRunnerClient';

const pushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
    replace: pushMock,
    refresh: vi.fn(),
  }),
}));

function makeTestEditor(content: Record<string, unknown>) {
  return new Editor({
    extensions: [StarterKit, CriterionHighlightMark, SuggestedEditMark],
    content,
  });
}

function makeEssayRecord(
  overrides: Partial<EssayDocumentRecord> = {}
): EssayDocumentRecord {
  const plainText =
    overrides.plainText ??
    'The occupation of the Ruhr exposed structural fragility.\n\nHyperinflation destroyed middle-class savings across Weimar Germany.';
  return {
    id: 'essay-hist-1',
    subjectSlug: 'hist',
    documentType: 'Internal Assessment',
    currentStep: 3,
    title: 'Ruhr Crisis Draft',
    researchQuestion:
      'To what extent did the Ruhr Crisis destabilize the Weimar Republic?',
    plainText,
    contentJson: JSON.stringify({
      type: 'doc',
      content: plainText.split('\n\n').map((p) => ({
        type: 'paragraph',
        content: [{ type: 'text', text: p }],
      })),
    }),
    estimatedScore: 19,
    maxScore: 25,
    criteriaScores: [
      {
        criterion: 'Criterion A',
        title: 'Sources',
        score: 5,
        maxScore: 6,
        rationale: 'Good primary source selection.',
      },
    ],
    annotations: [
      {
        id: 'ann-edit-1',
        type: 'edit',
        criterion: 'Criterion B',
        quote: 'exposed structural fragility',
        comment: 'Use sharper historical terminology.',
        replacementText: 'exposed acute fiscal and constitutional fragility',
        status: 'open',
      },
    ],
    originalitySignal: analyzeOriginalityHeuristic(plainText),
    updatedAt: 1_700_000_000_000,
    ...overrides,
  };
}

function makeQuestion(
  overrides: Partial<QuestionRunnerItem> = {}
): QuestionRunnerItem {
  return {
    id: 'chem-r1-q001',
    subjectSlug: 'chem',
    topicId: 'chem-r1',
    topicCode: 'R1.1',
    topicTitle: 'Measuring Enthalpy Changes',
    unitCode: 'Reactivity 1.1',
    levelScope: 'SL/Core',
    paper: 'Paper 2',
    questionType: 'short_answer',
    calculatorPolicy: 'calculator_allowed',
    difficulty: 'standard',
    marks: 2,
    commandTerm: 'Explain',
    stemMarkdown:
      'Explain why the experimental $\\Delta H_c^\\ominus$ of ethanol differs from average bond enthalpy calculations.',
    options: null,
    correctOptionId: null,
    markschemePoints: [
      {
        pointId: 'M1',
        requirement: 'Bond enthalpies apply to gaseous molecules only.',
        marks: 1,
      },
      {
        pointId: 'M2',
        requirement: 'Bond enthalpies are average values across compounds.',
        marks: 1,
      },
    ],
    walkthroughSteps: [
      {
        stepNumber: 1,
        title: 'Compare physical states',
        explanationMarkdown: 'Ethanol and water are liquids under standard conditions.',
      },
    ],
    commonPitfalls: ['Forgetting standard states at 298 K.'],
    ...overrides,
  };
}

describe('Originality Signal & Essay Studio Contracts', () => {
  it('computes burstiness, lexical diversity, and advisory originality breakdown', () => {
    const sampleHistoryDraft = `
      The occupation of the Ruhr industrial heartland in January 1923 exposed the structural fragility of the Weimar Republic.
      Passive resistance spearheaded by Chancellor Wilhelm Cuno triggered hyperinflationary pressures across regional industries, pushing the Reichsbank exchange rate to 4.2 trillion marks per US dollar by November 1923.
      While traditional historiography emphasized external Allied reparations, post-revisionist scholars such as Peukert argue that domestic fiscal choices severely eroded the savings and confidence of the German Mittelstand.
    `;
    const result = analyzeOriginalityHeuristic(sampleHistoryDraft);
    expect(result.label).toBe('Low');
    expect(result.metrics).toHaveLength(3);
    expect(result.advisoryNote).toContain('Advisory');
  });

  it('flags stock cliché transitions in formulaic prose', () => {
    const formulaicText = `
      Furthermore, it is important to note that enzymes play a crucial role in metabolism.
      Moreover, we must delve into the tapestry of cellular respiration.
      In conclusion, this is a testament to biological complexity.
    `;
    const result = analyzeOriginalityHeuristic(formulaicText);
    expect(result.flaggedPassages.length).toBeGreaterThan(0);
    expect(result.riskPercent).toBeGreaterThan(20);
  });
});

describe('TipTap Marks, Cross-Paragraph & Overlapping Annotations', () => {
  it('applies overlapping and cross-paragraph marks while preserving Bold/Italic', () => {
    const editor = makeTestEditor({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'First paragraph ends ' },
            { type: 'text', text: 'here.', marks: [{ type: 'bold' }] },
          ],
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Second ', marks: [{ type: 'italic' }] },
            { type: 'text', text: 'paragraph continues.' },
          ],
        },
      ],
    });

    const annotations: EssayAnnotation[] = [
      {
        id: 'ann-cross',
        type: 'comment',
        criterion: 'Criterion B',
        quote: 'here.\n\nSecond paragraph',
        comment: 'Strengthen transition across paragraphs.',
        status: 'open',
      },
      {
        id: 'ann-overlap',
        type: 'edit',
        criterion: 'Criterion C',
        quote: 'Second paragraph',
        comment: 'Make phrasing more precise.',
        replacementText: 'The subsequent analysis',
        status: 'open',
      },
    ];

    applyAnnotationsToEditor(editor, annotations);
    expect(docHasAllOpenAnnotationMarks(editor.state.doc, annotations)).toBe(
      true
    );

    // Accept the overlapping edit and verify bold/italic + cross-paragraph comment survive
    const result = acceptSuggestedEditInEditor(editor, annotations[1]);
    expect(result.applied).toBe(true);
    expect(result.plainText).toContain('The subsequent analysis continues.');
    expect(result.plainText).toContain('First paragraph ends here.');

    const extracted = extractTextAndFormattingFromTipTapJson(
      result.contentJson,
      result.plainText
    );
    expect(extracted.formattingSpans.some((s) => s.type === 'bold')).toBe(true);
    expect(extracted.formattingSpans.some((s) => s.type === 'italic')).toBe(
      true
    );

    // Dismissing the remaining comment removes only its mark
    const dismissed = dismissAnnotationInEditor(editor, 'ann-cross');
    expect(dismissed.plainText).toContain('First paragraph ends here.');
    editor.destroy();
  });

  it('builds annotated paragraph slices for cross-paragraph and overlapping quotes without dropping either', () => {
    const fullText = 'Alpha beta gamma.\n\nDelta epsilon zeta.';
    const annotations: EssayAnnotation[] = [
      {
        id: 'c1',
        type: 'comment',
        criterion: 'Criterion A',
        quote: 'gamma.\n\nDelta',
        comment: 'Cross-paragraph note',
        status: 'open',
      },
      {
        id: 'e1',
        type: 'edit',
        criterion: 'Criterion B',
        quote: 'Delta epsilon',
        comment: 'Tighten wording',
        replacementText: 'Delta theta',
        status: 'open',
      },
    ];

    const blocks = buildAnnotatedParagraphBlocks(fullText, annotations);
    expect(blocks).toHaveLength(2);
    const p1Ids = blocks[0].slices.flatMap((s) => s.annotations.map((a) => a.id));
    const p2Ids = blocks[1].slices.flatMap((s) => s.annotations.map((a) => a.id));
    expect(p1Ids).toContain('c1');
    expect(p2Ids).toContain('c1');
    expect(p2Ids).toContain('e1');

    const overlapSlice = blocks[1].slices.find((s) => s.text === 'Delta');
    expect(overlapSlice?.annotations.map((a) => a.id).sort()).toEqual([
      'c1',
      'e1',
    ]);
    const editEndSlice = blocks[1].slices.find((s) =>
      s.completedEdits.some((e) => e.id === 'e1')
    );
    expect(editEndSlice?.text).toBe(' epsilon');
  });

  it('parses TipTap JSON safely and converts plainText to TipTap docs', () => {
    expect(parseTipTapContentJson(null)).toBeNull();
    expect(parseTipTapContentJson('')).toBeNull();
    expect(parseTipTapContentJson('{invalid-json')).toBeNull();
    expect(parseTipTapContentJson('{"type":"paragraph"}')).toBeNull();

    const doc = plainTextToTipTapDoc('First paragraph.\r\n\r\nSecond paragraph.');
    expect(doc.type).toBe('doc');
    expect(doc.content).toHaveLength(2);
    expect(doc.content?.[0].content?.[0].text).toBe('First paragraph.');
    expect(doc.content?.[1].content?.[0].text).toBe('Second paragraph.');

    const roundTripped = parseTipTapContentJson(JSON.stringify(doc));
    expect(roundTripped).toEqual(doc);

    expect(plainTextToTipTapDoc('   \n\n  ')).toEqual(EMPTY_TIPTAP_DOC);
  });

  it('handles hardBreak, bulletList, stale mark detection, and multi-paragraph edit replacements', () => {
    const editor = makeTestEditor({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Line one' },
            { type: 'hardBreak' },
            { type: 'text', text: 'Line two needs clarity.' },
          ],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Bullet point evidence', marks: [{ type: 'italic' }] }],
                },
              ],
            },
          ],
        },
      ],
    });

    const { text: indexedText } = buildDocTextIndex(editor.state.doc);
    expect(indexedText).toContain('Line one\nLine two needs clarity.');
    expect(
      findQuoteRangeInDoc(editor.state.doc, 'Line one\nLine two')
    ).not.toBeNull();

    const extracted = extractTextAndFormattingFromTipTapJson(
      JSON.stringify(editor.getJSON()),
      editor.getText({ blockSeparator: '\n\n' })
    );
    expect(extracted.formattingSpans.some((s) => s.type === 'italic')).toBe(true);

    const editAnn: EssayAnnotation = {
      id: 'ann-split',
      type: 'edit',
      criterion: 'Criterion C',
      quote: 'Line two needs clarity.',
      comment: 'Split into two sharper analytical sentences.',
      replacementText: 'Line two introduces evidence.\n\nA new paragraph evaluates it.',
      status: 'open',
    };

    expect(applyAnnotationsToEditor(editor, [editAnn])).toBe(true);
    expect(docHasAllOpenAnnotationMarks(editor.state.doc, [editAnn])).toBe(true);
    // Stale mark left in doc when annotation is dismissed should be flagged as out-of-sync
    expect(
      docHasAllOpenAnnotationMarks(editor.state.doc, [
        { ...editAnn, status: 'dismissed' },
      ])
    ).toBe(false);

    // No-op re-apply returns false when no marks exist and none are open
    dismissAnnotationInEditor(editor, 'ann-split');
    expect(applyAnnotationsToEditor(editor, [])).toBe(false);

    // Multi-paragraph replacement splits cleanly without dropping surrounding text
    applyAnnotationsToEditor(editor, [editAnn]);
    const splitResult = acceptSuggestedEditInEditor(editor, editAnn);
    expect(splitResult.applied).toBe(true);
    expect(splitResult.plainText).toContain('Line two introduces evidence.');
    expect(splitResult.plainText).toContain('A new paragraph evaluates it.');

    // Missing quote returns applied: false without mutating text
    const missingResult = acceptSuggestedEditInEditor(editor, {
      ...editAnn,
      id: 'ann-missing',
      quote: 'nonexistent phrase in draft',
    });
    expect(missingResult.applied).toBe(false);

    editor.destroy();
    // Destroyed editor guard returns cleanly
    const destroyedResult = acceptSuggestedEditInEditor(editor, editAnn);
    expect(destroyedResult.applied).toBe(false);
  });
});

describe('EssayStudioClient Integration & Blank-Slate Contracts', () => {
  beforeEach(() => {
    pushMock.mockReset();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('creates truly blank drafts with 0 score, empty criteria/annotations, and null originalitySignal', () => {
    const blank = createBlankEssayDraft({ subjectSlug: 'bio' });
    expect(blank.plainText).toBe('');
    expect(blank.estimatedScore).toBe(0);
    expect(blank.criteriaScores).toEqual([]);
    expect(blank.annotations).toEqual([]);
    expect(blank.originalitySignal).toBeNull();
    expect(blank.researchQuestion).toBe('');
  });

  it('maps originality badge colors by Low, Moderate, Elevated, and null levels', () => {
    expect(
      getOriginalityRiskBadgeMeta({
        riskPercent: 12,
        label: 'Low',
        metrics: [],
        flaggedPassages: [],
        advisoryNote: '',
      }).badgeClass
    ).toContain('emerald');
    expect(
      getOriginalityRiskBadgeMeta({
        riskPercent: 40,
        label: 'Moderate',
        metrics: [],
        flaggedPassages: [],
        advisoryNote: '',
      }).badgeClass
    ).toContain('amber');
    expect(
      getOriginalityRiskBadgeMeta({
        riskPercent: 75,
        label: 'Elevated',
        metrics: [],
        flaggedPassages: [],
        advisoryNote: '',
      }).badgeClass
    ).toContain('rose');
    expect(getOriginalityRiskBadgeMeta(null).badgeClass).toContain('zinc');
  });

  it('handles query params cleanly when loaded.length === 0 or subject not present without overwriting existing drafts', async () => {
    const existingHist = makeEssayRecord({
      id: 'hist-existing',
      subjectSlug: 'hist',
    });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ essays: [existingHist] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );

    render(
      <EssayStudioClient
        initialSubject="bio"
        initialAssignmentType="Internal Assessment"
        initialResearchQuestion="How does bicarbonate concentration affect Elodea photosynthesis?"
      />
    );

    await waitFor(() => {
      expect(
        screen.getByDisplayValue(
          'How does bicarbonate concentration affect Elodea photosynthesis?'
        )
      ).toBeInTheDocument();
    });

    // Both the new Bio draft and untouched History draft exist in switcher
    expect(
      screen.getByRole('button', { name: /History HL · Internal Assessment/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Biology HL · Internal Assessment/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Est\. Score: 0 \/ 24/i)).toBeInTheDocument();
  });

  it('handles ?subject=&type=&rq= when GET /api/essays returns []', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ essays: [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );

    render(
      <EssayStudioClient
        initialSubject="eng"
        initialAssignmentType="HL Essay"
        initialResearchQuestion="How does Morrison use fragmented chronology in Beloved?"
      />
    );

    await waitFor(() => {
      expect(
        screen.getByDisplayValue(
          'How does Morrison use fragmented chronology in Beloved?'
        )
      ).toBeInTheDocument();
    });
    expect(screen.getByText(/Originality Signal: Not analyzed/i)).toBeInTheDocument();
  });

  it('calls POST /api/ai/tutor in Ask Sprout with essay context and handles 401 redirect', async () => {
    const essay = makeEssayRecord();
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url === '/api/essays') {
        return new Response(JSON.stringify({ essays: [essay] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (url === '/api/ai/tutor') {
        return new Response(
          JSON.stringify({
            reply: 'Anchor Criterion B in Reichsbank data from November 1923.',
            keyTakeaways: ['Cite Rentenmark stabilization'],
            followUpQuestion: 'Which primary source proves Mittelstand erosion?',
            markschemeTip: 'Avoid narrative summary.',
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response('{}', { status: 404 });
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<EssayStudioClient />);
    await waitFor(() => {
      expect(screen.getByText(essay.researchQuestion)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('tab', { name: /Ask Sprout/i }));
    const input = screen.getByLabelText(/Ask Sprout Coursework Coach/i);
    fireEvent.change(input, {
      target: { value: 'How do I push Criterion B higher?' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: /Send message to Sprout/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Anchor Criterion B in Reichsbank data/i)
      ).toBeInTheDocument();
    });

    const tutorCall = fetchMock.mock.calls.find(
      (call) => call[0] === '/api/ai/tutor'
    );
    expect(tutorCall).toBeDefined();
    const sentBody = JSON.parse(String((tutorCall?.[1] as RequestInit).body));
    expect(sentBody.subjectSlug).toBe('hist');
    expect(sentBody.message).toContain(essay.researchQuestion);
    expect(sentBody.message).toContain('How do I push Criterion B higher?');

    // Verify 401 redirects to /login
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    );
    fireEvent.change(input, { target: { value: 'Second check?' } });
    fireEvent.click(
      screen.getByRole('button', { name: /Send message to Sprout/i })
    );
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/login');
    });
  });

  it('persists contentJson and does not blindly increment estimatedScore on Accept Edit', async () => {
    const essay = makeEssayRecord({
      estimatedScore: 19,
      maxScore: 25,
      contentJson: JSON.stringify({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'The occupation of the Ruhr ' },
              {
                type: 'text',
                text: 'exposed structural fragility',
                marks: [{ type: 'bold' }],
              },
              { type: 'text', text: '.' },
            ],
          },
        ],
      }),
      plainText: 'The occupation of the Ruhr exposed structural fragility.',
    });

    const fetchMock = vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
      if (url === '/api/essays' && (!init?.method || init.method === 'GET')) {
        return new Response(JSON.stringify({ essays: [essay] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (url === '/api/essays' && init?.method === 'PUT') {
        return new Response(JSON.stringify({ essay }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response('{}', { status: 404 });
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<EssayStudioClient />);
    await waitFor(() => {
      expect(screen.getByText(/Accept Edit/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Accept Edit/i }));

    await waitFor(() => {
      const putCall = fetchMock.mock.calls.find(
        (call) =>
          call[0] === '/api/essays' &&
          (call[1] as RequestInit | undefined)?.method === 'PUT'
      );
      expect(putCall).toBeDefined();
      const body = JSON.parse(String((putCall?.[1] as RequestInit).body));
      expect(body.contentJson).toBeTruthy();
      expect(body.plainText).toContain(
        'exposed acute fiscal and constitutional fragility'
      );
      expect(body.estimatedScore).toBe(19);
    });

    expect(screen.getByText(/Est\. Score: 19 \/ 25/i)).toBeInTheDocument();
  });

  it('fetches /api/essays once despite fresh router identities, handles 500 retry and 401 redirect', async () => {
    let fetchCount = 0;
    const fetchMock = vi.fn().mockImplementation(async () => {
      fetchCount += 1;
      if (fetchCount === 1) {
        return new Response(JSON.stringify({ error: 'Server unavailable' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ essays: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<EssayStudioClient />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Could not load saved essay drafts/i);
    });
    expect(fetchCount).toBe(1);

    fireEvent.click(screen.getByRole('button', { name: /Retry Loading Studio/i }));
    await waitFor(() => {
      expect(screen.getByText(/No Coursework Drafts Yet/i)).toBeInTheDocument();
    });
    expect(fetchCount).toBe(2);

    // 401 on initial fetch redirects to /login
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    );
    render(<EssayStudioClient />);
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/login');
    });
  });

  it('runs Review Draft with Gemini, persists marks, and resolves inline comments cleanly', async () => {
    const essay = makeEssayRecord({
      annotations: [],
      criteriaScores: [],
      estimatedScore: 0,
    });
    const reviewedAnnotation: EssayAnnotation = {
      id: 'rev-c1',
      type: 'comment',
      criterion: 'Criterion B',
      quote: 'exposed structural fragility',
      comment: 'Specify the Reichsbank exchange rate.',
      status: 'open',
    };

    const fetchMock = vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
      if (url === '/api/essays' && (!init?.method || init.method === 'GET')) {
        return new Response(JSON.stringify({ essays: [essay] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (url === '/api/ai/review-essay') {
        return new Response(
          JSON.stringify({
            estimatedScore: 21,
            maxScore: 25,
            mode: 'deterministic_fallback',
            modelUsed: 'built-in-ib-rubric',
            criteriaScores: [
              {
                criterion: 'Criterion B',
                title: 'Investigation',
                score: 12,
                maxScore: 15,
                rationale: 'Clear causal analysis.',
              },
            ],
            annotations: [reviewedAnnotation],
            originalitySignal: analyzeOriginalityHeuristic(essay.plainText),
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      if (url === '/api/essays' && init?.method === 'PUT') {
        return new Response(JSON.stringify({ essay }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response('{}', { status: 404 });
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<EssayStudioClient />);
    await waitFor(() => {
      expect(screen.getByText(essay.researchQuestion)).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole('button', { name: /Review Draft with Gemini/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Specify the Reichsbank exchange rate\./i)
      ).toBeInTheDocument();
    });
    expect(screen.getByText(/Est\. Score: 21 \/ 25/i)).toBeInTheDocument();

    // Resolve the inline comment and verify PUT persists dismissed status
    fireEvent.click(screen.getByRole('button', { name: /^Resolve$/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/All Inline Suggestions Resolved/i)
      ).toBeInTheDocument();
    });
    const putCalls = fetchMock.mock.calls.filter(
      (call) =>
        call[0] === '/api/essays' &&
        (call[1] as RequestInit | undefined)?.method === 'PUT'
    );
    expect(putCalls.length).toBeGreaterThanOrEqual(2);
    const lastPutBody = JSON.parse(
      String((putCalls[putCalls.length - 1]?.[1] as RequestInit).body)
    );
    expect(lastPutBody.annotations[0].status).toBe('dismissed');
  });
});

describe('QuestionRunnerClient Blank-Slate, Filtering & Persistence Contracts', () => {
  beforeEach(() => {
    pushMock.mockReset();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('leaves chem-r1-q001 answer textarea blank without auto-starting timer', () => {
    const q1 = makeQuestion({ id: 'chem-r1-q001' });
    render(<QuestionRunnerClient initialQuestions={[q1]} />);

    expect(screen.queryByText('00:00')).not.toBeInTheDocument();
    const textarea = screen.getByLabelText(/Your answer/i) as HTMLTextAreaElement;
    expect(textarea.value).toBe('');
  });

  it('computes initialQuestionId index against filteredQuestions, not initialQuestions', () => {
    const bioQ = makeQuestion({
      id: 'bio-a1-q001',
      subjectSlug: 'bio',
      topicId: 'bio-a1',
      stemMarkdown: 'Bio question 1',
    });
    const chemQ1 = makeQuestion({
      id: 'chem-r1-q001',
      subjectSlug: 'chem',
      stemMarkdown: 'Chem question 1',
    });
    const chemQ2 = makeQuestion({
      id: 'chem-r1-q002',
      subjectSlug: 'chem',
      stemMarkdown: 'Chem question 2 target',
    });

    render(
      <QuestionRunnerClient
        initialQuestions={[bioQ, chemQ1, chemQ2]}
        initialSubject="chem"
        initialQuestionId="chem-r1-q002"
      />
    );

    expect(screen.getByText('Chem question 2 target')).toBeInTheDocument();
    expect(screen.getByText('Q2 of 2')).toBeInTheDocument();
  });

  it('renders an explicit empty state with Reset filters CTA instead of falling back to all questions', () => {
    const chemQ = makeQuestion({
      id: 'chem-r1-q001',
      subjectSlug: 'chem',
      paper: 'Paper 2',
      stemMarkdown: 'Chem Paper 2 question',
    });

    render(
      <QuestionRunnerClient
        initialQuestions={[chemQ]}
        initialSubject="chem"
        initialPaper="Paper 3"
      />
    );

    expect(
      screen.getByText(/No IB Questions Match These Filters/i)
    ).toBeInTheDocument();
    expect(screen.queryByText('Chem Paper 2 question')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Reset filters/i }));
    expect(screen.getByText('Chem Paper 2 question')).toBeInTheDocument();
  });

  it('persists MCQ attempts to POST /api/questions/attempt and surfaces mistakes POST failures', async () => {
    const mcq = makeQuestion({
      id: 'bio-mcq-1',
      subjectSlug: 'bio',
      questionType: 'mcq',
      marks: 1,
      stemMarkdown: 'Which organelle synthesizes ATP via chemiosmosis?',
      options: [
        { id: 'A', text: 'Golgi apparatus' },
        { id: 'B', text: 'Mitochondrion' },
        { id: 'C', text: 'Lysosome' },
        { id: 'D', text: 'Ribosome' },
      ],
      correctOptionId: 'B',
    });

    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url === '/api/questions/attempt') {
        return new Response(JSON.stringify({ attempt: { id: 'att-1' } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (url === '/api/mistakes') {
        return new Response(JSON.stringify({ error: 'Database offline' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response('{}', { status: 404 });
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<QuestionRunnerClient initialQuestions={[mcq]} />);

    fireEvent.click(screen.getByRole('button', { name: /B\s*Mitochondrion/i }));
    fireEvent.click(screen.getByRole('button', { name: /Grade My Answer/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/questions/attempt',
        expect.objectContaining({ method: 'POST' })
      );
    });
    expect(screen.getByText(/Score: 1 \/ 1 Marks/i)).toBeInTheDocument();

    // Mistakes Log failure must show error alert and NOT print saved message
    fireEvent.click(screen.getByRole('button', { name: /Mistakes Log/i }));
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Database offline/i);
    });
    expect(
      screen.queryByText(/Saved to Mistakes Log/i)
    ).not.toBeInTheDocument();
  });
});
