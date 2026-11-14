'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import type { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import {
  Sparkles,
  Check,
  X,
  FileText,
  Plus,
  Save,
  ShieldCheck,
  MessageSquare,
  Edit3,
  Eye,
  Send,
} from 'lucide-react';
import type { ScreenState, SubjectSlug } from '@/types/fsm';
import {
  analyzeOriginalityHeuristic,
  type OriginalitySignal,
} from '@/lib/originality';
import { SproutMascot } from '@/components/mascot/SproutMascot';
import { KaTeXText } from '@/components/math/KaTeXText';
import { CriterionHighlightMark } from './extensions/CriterionHighlightMark';
import { SuggestedEditMark } from './extensions/SuggestedEditMark';
import {
  EMPTY_TIPTAP_DOC_JSON,
  acceptSuggestedEditInEditor,
  applyAnnotationsToEditor,
  buildAnnotatedParagraphBlocks,
  dismissAnnotationInEditor,
  docHasAllOpenAnnotationMarks,
  extractTextAndFormattingFromTipTapJson,
  parseTipTapContentJson,
  plainTextToTipTapDoc,
  type AnnotatedTextSlice,
  type EssayAnnotation,
} from './essayAnnotations';

export type { EssayAnnotation };

export interface CriterionScoreItem {
  criterion: string;
  title: string;
  score: number;
  maxScore: number;
  rationale: string;
}

export interface EssayDocumentRecord {
  id: string;
  subjectSlug: SubjectSlug;
  documentType: string;
  currentStep: number;
  title: string;
  researchQuestion: string;
  plainText: string;
  contentJson: string;
  estimatedScore: number | null;
  maxScore: number;
  criteriaScores: CriterionScoreItem[];
  annotations: EssayAnnotation[];
  originalitySignal: OriginalitySignal | null;
  updatedAt: number;
}

type EditorViewMode = 'annotated' | 'live_editor';
type MarginRailTab = 'feedback' | 'rubric' | 'originality' | 'sprout';
type OperationState =
  | { status: 'idle' }
  | { status: 'saving' }
  | { status: 'saved'; timestamp: string }
  | { status: 'reviewing' }
  | { status: 'error'; message: string };

type SproutRequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string };

interface SproutTurn {
  id: string;
  role: 'user' | 'sprout';
  text: string;
}

const SUBJECT_OPTIONS: {
  slug: SubjectSlug;
  label: string;
  defaultMaxScore: number;
  defaultDocType: string;
}[] = [
  {
    slug: 'hist',
    label: 'History HL',
    defaultMaxScore: 25,
    defaultDocType: 'Internal Assessment',
  },
  {
    slug: 'bio',
    label: 'Biology HL',
    defaultMaxScore: 24,
    defaultDocType: 'Internal Assessment',
  },
  {
    slug: 'chem',
    label: 'Chemistry SL',
    defaultMaxScore: 24,
    defaultDocType: 'Internal Assessment',
  },
  {
    slug: 'eng',
    label: 'English Lit HL',
    defaultMaxScore: 20,
    defaultDocType: 'HL Essay',
  },
  {
    slug: 'fr',
    label: 'French B SL',
    defaultMaxScore: 30,
    defaultDocType: 'Paper Essay',
  },
  {
    slug: 'math',
    label: 'Math AA SL',
    defaultMaxScore: 20,
    defaultDocType: 'Internal Assessment',
  },
];

const ASSIGNMENT_TYPES = [
  'Internal Assessment',
  'HL Essay',
  'Extended Essay',
  'Paper Essay',
];

export function createBlankEssayDraft(options?: {
  subjectSlug?: SubjectSlug;
  documentType?: string;
  researchQuestion?: string;
}): EssayDocumentRecord {
  const subjMeta =
    SUBJECT_OPTIONS.find((s) => s.slug === options?.subjectSlug) ??
    SUBJECT_OPTIONS[0];
  const resolvedDocType =
    options?.documentType && ASSIGNMENT_TYPES.includes(options.documentType)
      ? options.documentType
      : subjMeta.defaultDocType;

  return {
    id: `essay-${subjMeta.slug}-${Date.now()}`,
    subjectSlug: subjMeta.slug,
    documentType: resolvedDocType,
    currentStep: 1,
    title: `Untitled ${subjMeta.label} ${resolvedDocType}`,
    researchQuestion: options?.researchQuestion ?? '',
    plainText: '',
    contentJson: EMPTY_TIPTAP_DOC_JSON,
    estimatedScore: 0,
    maxScore: subjMeta.defaultMaxScore,
    criteriaScores: [],
    annotations: [],
    originalitySignal: null,
    updatedAt: Date.now(),
  };
}

function normalizeOriginalitySignal(raw: unknown): OriginalitySignal | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as Partial<OriginalitySignal>;
  if (
    typeof candidate.label !== 'string' ||
    typeof candidate.riskPercent !== 'number' ||
    !Array.isArray(candidate.metrics)
  ) {
    return null;
  }
  return candidate as OriginalitySignal;
}

function normalizeEssayRecord(raw: EssayDocumentRecord): EssayDocumentRecord {
  const subjMeta =
    SUBJECT_OPTIONS.find((s) => s.slug === raw.subjectSlug) ??
    SUBJECT_OPTIONS[0];
  return {
    ...raw,
    maxScore:
      typeof raw.maxScore === 'number' && raw.maxScore > 0
        ? raw.maxScore
        : subjMeta.defaultMaxScore,
    estimatedScore:
      typeof raw.estimatedScore === 'number' ? raw.estimatedScore : 0,
    criteriaScores: Array.isArray(raw.criteriaScores) ? raw.criteriaScores : [],
    annotations: Array.isArray(raw.annotations) ? raw.annotations : [],
    originalitySignal: normalizeOriginalitySignal(raw.originalitySignal),
    plainText: typeof raw.plainText === 'string' ? raw.plainText : '',
    contentJson:
      typeof raw.contentJson === 'string' && raw.contentJson.trim().length > 0
        ? raw.contentJson
        : JSON.stringify(plainTextToTipTapDoc(raw.plainText ?? '')),
  };
}

export function getOriginalityRiskBadgeMeta(
  signal: OriginalitySignal | null
): {
  badgeClass: string;
  iconClass: string;
  pillStyle: { background: string; color: string };
} {
  if (!signal) {
    return {
      badgeClass: 'bg-zinc-100 text-zinc-700 border border-zinc-200',
      iconClass: 'text-zinc-500',
      pillStyle: { background: '#F4F4F5', color: '#52525B' },
    };
  }
  const normalized = signal.label.toLowerCase();
  if (normalized === 'low') {
    return {
      badgeClass: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
      iconClass: 'text-emerald-600',
      pillStyle: { background: '#ECFDF5', color: '#065F46' },
    };
  }
  if (normalized === 'moderate') {
    return {
      badgeClass: 'bg-amber-50 text-amber-800 border border-amber-200',
      iconClass: 'text-amber-600',
      pillStyle: { background: '#FEF3C7', color: '#92400E' },
    };
  }
  return {
    badgeClass: 'bg-rose-50 text-rose-800 border border-rose-200',
    iconClass: 'text-rose-600',
    pillStyle: { background: '#FEF2F2', color: '#991B1B' },
  };
}

function renderAnnotatedSliceContent(
  slice: AnnotatedTextSlice,
  keyPrefix: string,
  activeAnnotationId: string | null,
  onSelectAnnotation: (id: string) => void
): React.ReactNode {
  let content: React.ReactNode = slice.text;
  if (slice.bold) {
    content = <strong>{content}</strong>;
  }
  if (slice.italic) {
    content = <em>{content}</em>;
  }

  const editChips = slice.completedEdits.map((editAnn) => (
    <span
      key={`${keyPrefix}-chip-${editAnn.id}`}
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        onSelectAnnotation(editAnn.id);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          onSelectAnnotation(editAnn.id);
        }
      }}
      title={`Suggested Edit: ${editAnn.comment}`}
      className="cursor-pointer rounded-xs transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#18181B] ml-1"
      style={{
        background: '#ECFDF5',
        borderBottom: '2px solid #059669',
        padding: '1px 4px',
        color: '#065F46',
        outline:
          activeAnnotationId === editAnn.id ? '2px solid #059669' : 'none',
      }}
    >
      {editAnn.replacementText || editAnn.quote}
    </span>
  ));

  if (slice.annotations.length === 0) {
    return <React.Fragment key={keyPrefix}>{content}</React.Fragment>;
  }

  const primary =
    slice.annotations.find((a) => a.id === activeAnnotationId) ??
    slice.annotations[0];
  const hasEdit = slice.annotations.some((a) => a.type === 'edit');
  const hasComment = slice.annotations.some((a) => a.type === 'comment');
  const isActive = slice.annotations.some((a) => a.id === activeAnnotationId);
  const titleText = slice.annotations
    .map((a) =>
      a.type === 'comment'
        ? `${a.criterion}: ${a.comment}`
        : `Suggested Edit (${a.criterion}): ${a.comment}`
    )
    .join(' | ');

  return (
    <React.Fragment key={keyPrefix}>
      <span
        role="button"
        tabIndex={0}
        data-annotation-ids={slice.annotations.map((a) => a.id).join(',')}
        onClick={() => {
          if (slice.annotations.length > 1 && activeAnnotationId) {
            const curIdx = slice.annotations.findIndex(
              (a) => a.id === activeAnnotationId
            );
            const nextAnn =
              curIdx >= 0
                ? slice.annotations[(curIdx + 1) % slice.annotations.length]
                : slice.annotations[0];
            onSelectAnnotation(nextAnn.id);
          } else {
            onSelectAnnotation(primary.id);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectAnnotation(primary.id);
          }
        }}
        title={titleText}
        className="cursor-pointer rounded-xs transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#18181B]"
        style={
          hasComment && !hasEdit
            ? {
                background: '#FEF3C7',
                borderBottom: '2px solid #D97706',
                padding: '1px 3px',
                outline: isActive ? '2px solid #D97706' : 'none',
              }
            : hasEdit && !hasComment
            ? {
                textDecoration: 'line-through',
                color: '#9CA3AF',
                outline: isActive ? '2px solid #059669' : 'none',
              }
            : {
                background: '#FEF3C7',
                borderBottom: '2px dashed #059669',
                padding: '1px 3px',
                outline: isActive ? '2px solid #18181B' : 'none',
              }
        }
      >
        {content}
      </span>
      {editChips}
    </React.Fragment>
  );
}

export function EssayStudioClient({
  initialSubject,
  initialAssignmentType,
  initialResearchQuestion,
}: {
  initialSubject?: SubjectSlug;
  initialAssignmentType?: string;
  initialResearchQuestion?: string;
}) {
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;
  const [screenState, setScreenState] = useState<
    ScreenState<EssayDocumentRecord[]>
  >({
    status: 'loading',
  });
  const [reloadTick, setReloadTick] = useState(0);
  const [activeEssayId, setActiveEssayId] = useState<string>('');
  const [viewMode, setViewMode] = useState<EditorViewMode>('annotated');
  const [marginTab, setMarginTab] = useState<MarginRailTab>('feedback');
  const [activeAnnotationId, setActiveAnnotationId] = useState<string | null>(
    null
  );
  const [opState, setOpState] = useState<OperationState>({ status: 'idle' });
  const [reviewMeta, setReviewMeta] = useState<{
    mode: string;
    modelUsed: string;
  } | null>(null);
  const [sproutInput, setSproutInput] = useState('');
  const [sproutStatus, setSproutStatus] = useState<SproutRequestState>({
    status: 'idle',
  });
  const [sproutChat, setSproutChat] = useState<SproutTurn[]>([
    {
      id: 'sprout-welcome',
      role: 'sprout',
      text: 'Hi! I am Sprout, your IB Coursework Coach. Click any highlighted sentence in your draft or ask me how to strengthen a specific IB rubric criterion.',
    },
  ]);

  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastLoadedDraftIdRef = useRef<string | null>(null);
  const isApplyingSyncRef = useRef<boolean>(false);
  const sproutAbortRef = useRef<AbortController | null>(null);
  const reviewAbortRef = useRef<AbortController | null>(null);
  const rqInputRef = useRef<HTMLTextAreaElement | null>(null);
  const focusRqPendingRef = useRef<boolean>(false);
  const activeEssayIdRef = useRef<string>('');

  const essays = useMemo(
    () => (screenState.status === 'success' ? screenState.data : []),
    [screenState]
  );

  const activeEssay = useMemo(
    () => essays.find((e) => e.id === activeEssayId) ?? essays[0] ?? null,
    [essays, activeEssayId]
  );
  activeEssayIdRef.current = activeEssay?.id ?? '';

  const annotatedData = useMemo(() => {
    if (!activeEssay) return { blocks: [] };
    const { text, formattingSpans } = extractTextAndFormattingFromTipTapJson(
      activeEssay.contentJson,
      activeEssay.plainText
    );
    return {
      blocks: buildAnnotatedParagraphBlocks(
        text,
        activeEssay.annotations,
        formattingSpans
      ),
    };
  }, [activeEssay?.plainText, activeEssay?.contentJson, activeEssay?.annotations]);

  const wordCount = useMemo(
    () =>
      (activeEssay?.plainText ?? '')
        .trim()
        .split(/\s+/)
        .filter(Boolean).length,
    [activeEssay?.plainText]
  );

  const openAnnotations = useMemo(
    () =>
      (activeEssay?.annotations ?? []).filter((a) => a.status === 'open'),
    [activeEssay?.annotations]
  );

  const resolvedAnnotations = useMemo(
    () =>
      (activeEssay?.annotations ?? []).filter((a) => a.status !== 'open'),
    [activeEssay?.annotations]
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, CriterionHighlightMark, SuggestedEditMark],
    content: '',
    editorProps: {
      handleClick: (_view, _pos, event) => {
        const target = event.target as HTMLElement | null;
        const markedEl = target?.closest?.('[data-annotation-id]');
        const annId = markedEl?.getAttribute('data-annotation-id');
        if (annId) {
          setActiveAnnotationId(annId);
          setMarginTab('feedback');
        }
        return false;
      },
    },
    onUpdate: ({ editor: tiptap }) => {
      if (isApplyingSyncRef.current) return;
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
      autosaveTimerRef.current = setTimeout(() => {
        autosaveTimerRef.current = null;
        const updatedPlain = tiptap.getText({ blockSeparator: '\n\n' });
        const updatedContentJson = JSON.stringify(tiptap.getJSON());
        updateActiveEssayLocal({
          plainText: updatedPlain,
          contentJson: updatedContentJson,
        });
      }, 150);
    },
  });

  // Cancel pending timers and in-flight Sprout/Review requests on draft switch or unmount.
  useEffect(() => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = null;
    }
    sproutAbortRef.current?.abort();
    reviewAbortRef.current?.abort();
    setSproutStatus({ status: 'idle' });
    setOpState((prev) =>
      prev.status === 'reviewing' || prev.status === 'error'
        ? { status: 'idle' }
        : prev
    );
  }, [activeEssay?.id]);

  useEffect(() => {
    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
        autosaveTimerRef.current = null;
      }
      sproutAbortRef.current?.abort();
      reviewAbortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (viewMode === 'live_editor' && focusRqPendingRef.current) {
      focusRqPendingRef.current = false;
      rqInputRef.current?.focus();
    }
  }, [viewMode]);

  useEffect(() => {
    if (viewMode !== 'live_editor') return;
    const syncRqHeight = () => {
      const el = rqInputRef.current;
      if (!el) return;
      el.style.height = 'auto';
      if (el.scrollHeight > 0) {
        el.style.height = `${el.scrollHeight}px`;
      }
    };
    syncRqHeight();
    window.addEventListener('resize', syncRqHeight);
    return () => {
      window.removeEventListener('resize', syncRqHeight);
    };
  }, [activeEssay?.id, activeEssay?.researchQuestion, viewMode]);

  function syncEditorToEssay(tiptap: Editor, essay: EssayDocumentRecord) {
    lastLoadedDraftIdRef.current = essay.id;
    isApplyingSyncRef.current = true;
    try {
      const parsedDoc = parseTipTapContentJson(essay.contentJson);
      if (parsedDoc) {
        tiptap.commands.setContent(parsedDoc, false);
      } else {
        tiptap.commands.setContent(
          plainTextToTipTapDoc(essay.plainText),
          false
        );
      }
      if (!docHasAllOpenAnnotationMarks(tiptap.state.doc, essay.annotations)) {
        applyAnnotationsToEditor(tiptap, essay.annotations);
      }
    } finally {
      isApplyingSyncRef.current = false;
    }
  }

  // Restore stored TipTap contentJson (preserving Bold, Italic, and annotation marks)
  // whenever the active draft changes.
  useEffect(() => {
    if (!editor || !activeEssay) return;
    if (lastLoadedDraftIdRef.current === activeEssay.id) return;
    syncEditorToEssay(editor, activeEssay);
  }, [editor, activeEssay]);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchEssays() {
      setScreenState({ status: 'loading' });
      try {
        const res = await fetch('/api/essays', { signal: controller.signal });
        if (res.status === 401) {
          routerRef.current.push('/login');
          return;
        }
        if (!res.ok) {
          throw new Error('Could not load saved essay drafts');
        }
        const json = await res.json();
        if (controller.signal.aborted) return;

        const loaded: EssayDocumentRecord[] = (
          Array.isArray(json.essays) ? json.essays : []
        ).map((item: EssayDocumentRecord) => normalizeEssayRecord(item));

        const hasQueryOverride = Boolean(
          initialSubject || initialAssignmentType || initialResearchQuestion
        );

        if (loaded.length === 0) {
          if (!hasQueryOverride) {
            setScreenState({
              status: 'empty',
              message: 'No coursework drafts yet. Create your first IB draft.',
            });
            return;
          }

          const newDraft = createBlankEssayDraft({
            subjectSlug: initialSubject ?? 'hist',
            documentType: initialAssignmentType,
            researchQuestion: initialResearchQuestion ?? '',
          });
          setScreenState({ status: 'success', data: [newDraft] });
          setActiveEssayId(newDraft.id);
          setViewMode('live_editor');
          return;
        }

        if (!hasQueryOverride) {
          setScreenState({ status: 'success', data: loaded });
          setActiveEssayId(loaded[0].id);
          return;
        }

        // Match only a non-conflicting existing draft so we never overwrite another
        // subject's draft or clobber an existing essay's RQ/documentType.
        const matching = loaded.find((doc) => {
          if (initialSubject && doc.subjectSlug !== initialSubject) {
            return false;
          }
          if (
            initialAssignmentType &&
            doc.documentType !== initialAssignmentType
          ) {
            return false;
          }
          if (
            initialResearchQuestion &&
            doc.researchQuestion.trim().toLowerCase() !==
              initialResearchQuestion.trim().toLowerCase()
          ) {
            return false;
          }
          return true;
        });

        if (matching) {
          setScreenState({ status: 'success', data: loaded });
          setActiveEssayId(matching.id);
          return;
        }

        const queryDraft = createBlankEssayDraft({
          subjectSlug: initialSubject ?? loaded[0].subjectSlug,
          documentType: initialAssignmentType,
          researchQuestion: initialResearchQuestion ?? '',
        });
        setScreenState({
          status: 'success',
          data: [queryDraft, ...loaded],
        });
        setActiveEssayId(queryDraft.id);
        setViewMode('live_editor');
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        if (!controller.signal.aborted) {
          setScreenState({
            status: 'error',
            message:
              err instanceof Error ? err.message : 'Failed to load Essay Studio',
          });
        }
      }
    }
    fetchEssays();
    return () => {
      controller.abort();
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
        autosaveTimerRef.current = null;
      }
    };
  }, [
    initialSubject,
    initialAssignmentType,
    initialResearchQuestion,
    reloadTick,
  ]);

  function updateEssayByIdLocal(
    targetId: string,
    patch: Partial<EssayDocumentRecord>
  ) {
    setScreenState((prev) => {
      if (prev.status !== 'success') return prev;
      const currentId = targetId || prev.data[0]?.id;
      const nextList = prev.data.map((item) => {
        if (item.id !== currentId) return item;
        const nextPlainText =
          patch.plainText !== undefined ? patch.plainText : item.plainText;
        const nextSignal =
          patch.originalitySignal !== undefined
            ? patch.originalitySignal
            : patch.plainText !== undefined
            ? nextPlainText.trim().length > 0
              ? analyzeOriginalityHeuristic(nextPlainText)
              : null
            : item.originalitySignal;
        return {
          ...item,
          ...patch,
          originalitySignal: nextSignal,
          updatedAt: Date.now(),
        };
      });
      return { status: 'success', data: nextList };
    });
  }

  function updateActiveEssayLocal(patch: Partial<EssayDocumentRecord>) {
    updateEssayByIdLocal(activeEssayIdRef.current, patch);
  }

  async function persistEssay(essayToSave: EssayDocumentRecord): Promise<boolean> {
    if (!essayToSave.researchQuestion.trim()) {
      setOpState({
        status: 'error',
        message: 'Enter a Research Question before saving this draft.',
      });
      focusRqPendingRef.current = true;
      setViewMode('live_editor');
      rqInputRef.current?.focus();
      return false;
    }

    setOpState({ status: 'saving' });
    try {
      const res = await fetch('/api/essays', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: essayToSave.id,
          subjectSlug: essayToSave.subjectSlug,
          documentType: essayToSave.documentType,
          currentStep: essayToSave.currentStep,
          title: essayToSave.title.trim() || 'Untitled Draft',
          researchQuestion: essayToSave.researchQuestion.trim(),
          plainText: essayToSave.plainText,
          contentJson: essayToSave.contentJson,
          annotations: essayToSave.annotations,
          criteriaScores: essayToSave.criteriaScores,
          ...(essayToSave.originalitySignal
            ? { originalitySignal: essayToSave.originalitySignal }
            : { originalitySignalJson: 'null' }),
          estimatedScore: essayToSave.estimatedScore ?? 0,
          maxScore: essayToSave.maxScore,
        }),
      });
      if (res.status === 401) {
        routerRef.current.push('/login');
        return false;
      }
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to save essay');
      }
      const timeLabel = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      setOpState({ status: 'saved', timestamp: timeLabel });
      return true;
    } catch (error) {
      setOpState({
        status: 'error',
        message: error instanceof Error ? error.message : 'Save error',
      });
      return false;
    }
  }

  /**
   * Flushes any pending debounced TipTap text or mark edits so actions always
   * see up-to-date `plainText` and `contentJson`.
   */
  function getLiveActiveEssay(): EssayDocumentRecord | null {
    if (!activeEssay) return null;
    if (!autosaveTimerRef.current || !editor) return activeEssay;
    clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = null;
    const livePlainText = editor.getText({ blockSeparator: '\n\n' });
    const liveContentJson = JSON.stringify(editor.getJSON());
    if (
      livePlainText === activeEssay.plainText &&
      liveContentJson === activeEssay.contentJson
    ) {
      return activeEssay;
    }
    const nextSignal =
      livePlainText.trim().length > 0
        ? analyzeOriginalityHeuristic(livePlainText)
        : null;
    updateActiveEssayLocal({
      plainText: livePlainText,
      contentJson: liveContentJson,
      originalitySignal: nextSignal,
    });
    return {
      ...activeEssay,
      plainText: livePlainText,
      contentJson: liveContentJson,
      originalitySignal: nextSignal,
    };
  }

  async function handleAcceptEdit(annotation: EssayAnnotation) {
    const current = getLiveActiveEssay();
    if (!current || !annotation.replacementText) return;

    let updatedPlainText = current.plainText;
    let updatedContentJson = current.contentJson;

    if (editor && !editor.isDestroyed) {
      isApplyingSyncRef.current = true;
      try {
        if (lastLoadedDraftIdRef.current !== current.id) {
          syncEditorToEssay(editor, current);
        }
        const result = acceptSuggestedEditInEditor(editor, annotation);
        if (!result.applied) {
          setOpState({
            status: 'error',
            message:
              'Could not locate that exact passage in your edited draft. Run a fresh review or dismiss this suggestion.',
          });
          return;
        }
        updatedPlainText = result.plainText;
        updatedContentJson = result.contentJson;
      } finally {
        isApplyingSyncRef.current = false;
      }
    }

    const updatedAnnotations = current.annotations.map((ann) =>
      ann.id === annotation.id ? { ...ann, status: 'accepted' as const } : ann
    );

    const nextEssay: EssayDocumentRecord = {
      ...current,
      plainText: updatedPlainText,
      contentJson: updatedContentJson,
      annotations: updatedAnnotations,
      originalitySignal:
        updatedPlainText.trim().length > 0
          ? analyzeOriginalityHeuristic(updatedPlainText)
          : null,
      updatedAt: Date.now(),
    };

    if (activeAnnotationId === annotation.id) {
      setActiveAnnotationId(null);
    }
    updateEssayByIdLocal(current.id, nextEssay);
    await persistEssay(nextEssay);
  }

  async function handleDismissAnnotation(annotation: EssayAnnotation) {
    const current = getLiveActiveEssay();
    if (!current) return;

    let updatedContentJson = current.contentJson;
    if (editor && !editor.isDestroyed) {
      isApplyingSyncRef.current = true;
      try {
        if (lastLoadedDraftIdRef.current !== current.id) {
          syncEditorToEssay(editor, current);
        }
        const result = dismissAnnotationInEditor(editor, annotation.id);
        if (result.contentJson) {
          updatedContentJson = result.contentJson;
        }
      } finally {
        isApplyingSyncRef.current = false;
      }
    }

    const updatedAnnotations = current.annotations.map((ann) =>
      ann.id === annotation.id ? { ...ann, status: 'dismissed' as const } : ann
    );

    const nextEssay: EssayDocumentRecord = {
      ...current,
      contentJson: updatedContentJson,
      annotations: updatedAnnotations,
      updatedAt: Date.now(),
    };

    if (activeAnnotationId === annotation.id) {
      setActiveAnnotationId(null);
    }
    updateEssayByIdLocal(current.id, nextEssay);
    await persistEssay(nextEssay);
  }

  async function handleReviewWithGemini() {
    const current = getLiveActiveEssay();
    if (!current) return;

    if (!current.researchQuestion.trim() || current.plainText.trim().length < 10) {
      setOpState({
        status: 'error',
        message:
          'Add a Research Question and at least a short draft paragraph before running an IB criterion review.',
      });
      focusRqPendingRef.current = !current.researchQuestion.trim();
      setViewMode('live_editor');
      return;
    }

    reviewAbortRef.current?.abort();
    const controller = new AbortController();
    reviewAbortRef.current = controller;

    setOpState({ status: 'reviewing' });
    try {
      const res = await fetch('/api/ai/review-essay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          essayId: current.id,
          subjectSlug: current.subjectSlug,
          documentType: current.documentType,
          researchQuestion: current.researchQuestion,
          plainText: current.plainText,
        }),
        signal: controller.signal,
      });
      if (res.status === 401) {
        setOpState({ status: 'idle' });
        routerRef.current.push('/login');
        return;
      }
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Essay review request failed');
      }
      const reviewData = await res.json();
      if (controller.signal.aborted || activeEssayIdRef.current !== current.id) {
        return;
      }

      setReviewMeta(
        reviewData.mode
          ? {
              mode: reviewData.mode,
              modelUsed: reviewData.modelUsed || 'gemini',
            }
          : null
      );

      const nextAnnotations: EssayAnnotation[] = Array.isArray(
        reviewData.annotations
      )
        ? reviewData.annotations
        : [];
      let nextContentJson = current.contentJson;

      if (editor && !editor.isDestroyed) {
        isApplyingSyncRef.current = true;
        try {
          if (lastLoadedDraftIdRef.current !== current.id) {
            syncEditorToEssay(editor, current);
          }
          applyAnnotationsToEditor(editor, nextAnnotations);
          nextContentJson = JSON.stringify(editor.getJSON());
        } finally {
          isApplyingSyncRef.current = false;
        }
      }

      const updatedEssay: EssayDocumentRecord = {
        ...current,
        contentJson: nextContentJson,
        estimatedScore:
          typeof reviewData.estimatedScore === 'number'
            ? reviewData.estimatedScore
            : current.estimatedScore,
        maxScore:
          typeof reviewData.maxScore === 'number' && reviewData.maxScore > 0
            ? reviewData.maxScore
            : current.maxScore,
        criteriaScores: Array.isArray(reviewData.criteriaScores)
          ? reviewData.criteriaScores
          : current.criteriaScores,
        annotations: nextAnnotations,
        originalitySignal: normalizeOriginalitySignal(
          reviewData.originalitySignal
        ),
        updatedAt: Date.now(),
      };
      updateEssayByIdLocal(current.id, updatedEssay);
      setViewMode('annotated');
      setMarginTab('feedback');
      await persistEssay(updatedEssay);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      setOpState({
        status: 'error',
        message:
          error instanceof Error ? error.message : 'Could not complete review',
      });
    }
  }

  function handleCreateNewDraft() {
    getLiveActiveEssay();
    const currentSlug = activeEssay?.subjectSlug ?? initialSubject ?? 'hist';
    const newDraft = createBlankEssayDraft({
      subjectSlug: currentSlug,
    });

    setScreenState((prev) => {
      const existing = prev.status === 'success' ? prev.data : [];
      return { status: 'success', data: [newDraft, ...existing] };
    });
    setActiveEssayId(newDraft.id);
    setActiveAnnotationId(null);
    setReviewMeta(null);
    setOpState({ status: 'idle' });
    setViewMode('live_editor');
  }

  async function handleSproutAsk(e: React.FormEvent) {
    e.preventDefault();
    const q = sproutInput.trim();
    if (!q || !activeEssay || sproutStatus.status === 'loading') return;

    const current = getLiveActiveEssay() ?? activeEssay;
    const userTurn: SproutTurn = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: q,
    };

    const historyPayload = sproutChat
      .filter((t) => t.id !== 'sprout-welcome')
      .slice(-10)
      .map((t) => ({
        role: t.role === 'sprout' ? ('assistant' as const) : ('user' as const),
        content: t.text,
      }));

    setSproutChat((prev) => [...prev, userTurn]);
    setSproutInput('');
    setSproutStatus({ status: 'loading' });

    const excerpt = current.plainText.trim().slice(0, 1200);
    const openNotes = current.annotations
      .filter((a) => a.status === 'open')
      .slice(0, 3)
      .map((a) => `${a.criterion}: ${a.comment}`)
      .join('; ');

    const contextualMessage = [
      `Essay Context — Title: ${current.title || 'Untitled Draft'}`,
      `Assignment Type: ${current.documentType}`,
      `Research Question: ${current.researchQuestion || '(Not set yet)'}`,
      excerpt ? `Draft Excerpt:\n"""\n${excerpt}\n"""` : 'Draft Excerpt: (Empty draft)',
      openNotes ? `Open Rubric Notes: ${openNotes}` : null,
      `Student Question: ${q}`,
    ]
      .filter(Boolean)
      .join('\n')
      .slice(0, 3900);

    sproutAbortRef.current?.abort();
    const controller = new AbortController();
    sproutAbortRef.current = controller;

    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectSlug: current.subjectSlug,
          topicTitle: `${current.documentType}${current.title ? ` — ${current.title}` : ''}`,
          message: contextualMessage,
          history: historyPayload,
        }),
        signal: controller.signal,
      });

      if (res.status === 401) {
        setOpState({ status: 'idle' });
        routerRef.current.push('/login');
        return;
      }
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Could not reach Sprout Coach.');
      }
      const data = await res.json();
      if (controller.signal.aborted || activeEssayIdRef.current !== current.id) {
        return;
      }

      const replyParts: string[] = [String(data.reply ?? '')];
      if (data.markschemeTip) {
        replyParts.push(`**IB Markscheme Tip:** ${data.markschemeTip}`);
      }
      if (data.followUpQuestion) {
        replyParts.push(`**Next Check:** ${data.followUpQuestion}`);
      }

      const sproutTurn: SproutTurn = {
        id: `s-${Date.now() + 1}`,
        role: 'sprout',
        text: replyParts.filter(Boolean).join('\n\n'),
      };
      setSproutChat((prev) => [...prev, sproutTurn]);
      setSproutStatus({ status: 'idle' });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      setSproutStatus({
        status: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Unable to reach Sprout Coach.',
      });
    }
  }

  if (screenState.status === 'loading' || screenState.status === 'idle') {
    return (
      <div
        className="main-pad"
        style={{ paddingTop: '26px' }}
        aria-busy="true"
        aria-label="Loading AI Essay Studio"
      >
        <div className="col-center-wide" style={{ maxWidth: '920px' }}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="h-7 w-28 rounded-full bg-zinc-100 animate-pulse" />
              <div className="h-7 w-40 rounded-full bg-zinc-100 animate-pulse" />
              <div className="h-7 w-28 rounded-full bg-zinc-100 animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-7 w-44 rounded-full bg-zinc-100 animate-pulse" />
              <div className="h-7 w-32 rounded-full bg-amber-100 animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1.45fr_1fr] gap-[18px]">
            <div className="hairline-card h-[420px] animate-pulse bg-zinc-50/60" />
            <div className="space-y-3">
              <div className="hairline-card h-36 animate-pulse bg-zinc-50/60" />
              <div className="hairline-card h-40 animate-pulse bg-zinc-50/60" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screenState.status === 'error') {
    return (
      <div className="main-pad" style={{ paddingTop: '26px' }}>
        <div className="col-center-wide" style={{ maxWidth: '920px' }}>
          <div role="alert" className="hairline-card text-center py-12">
            <p className="text-sm font-semibold text-zinc-900 mb-1">
              Unable to load AI Essay Studio
            </p>
            <p className="text-xs text-zinc-500 mb-4">{screenState.message}</p>
            <button
              type="button"
              onClick={() => setReloadTick((t) => t + 1)}
              className="pill-btn-dark focus-visible:ring-2 focus-visible:ring-zinc-900"
            >
              Retry Loading Studio
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screenState.status === 'empty' || !activeEssay) {
    return (
      <div className="main-pad" style={{ paddingTop: '26px' }}>
        <div className="col-center-wide" style={{ maxWidth: '920px' }}>
          <div className="hairline-card text-center py-12">
            <FileText className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
            <h2 className="text-base font-semibold text-zinc-900 mb-1">
              No Coursework Drafts Yet
            </h2>
            <p className="text-xs text-zinc-500 mb-4">
              Start an Internal Assessment, HL Essay, or Extended Essay with
              inline IB criterion feedback.
            </p>
            <button
              type="button"
              onClick={handleCreateNewDraft}
              className="pill-btn-dark focus-visible:ring-2 focus-visible:ring-zinc-900"
            >
              <Plus className="w-3.5 h-3.5" /> Create First IB Draft
            </button>
          </div>
        </div>
      </div>
    );
  }

  const riskBadgeMeta = getOriginalityRiskBadgeMeta(
    activeEssay.originalitySignal
  );

  return (
    <div className="main-pad" style={{ paddingTop: '26px' }}>
      <div className="col-center-wide">
        {/* Top Stepper & Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-3 min-w-0">
            {/* Step 1: Subject Selector */}
            <label className="inline-flex items-center gap-1.5 text-[12.5px] text-[#52525B] cursor-pointer max-w-full">
              <span className="w-[18px] h-[18px] shrink-0 rounded-full bg-[#F4F4F5] text-[#3F3F46] text-[11px] font-semibold inline-flex items-center justify-center">
                1
              </span>
              <select
                aria-label="Subject Selector"
                value={activeEssay.subjectSlug}
                onChange={(e) => {
                  const nextSlug = e.target.value as SubjectSlug;
                  const existingForSubj = essays.find(
                    (doc) => doc.subjectSlug === nextSlug && doc.id !== activeEssay.id
                  );
                  if (existingForSubj && activeEssay.plainText.trim().length > 0) {
                    getLiveActiveEssay();
                    setActiveEssayId(existingForSubj.id);
                    setActiveAnnotationId(null);
                    setReviewMeta(null);
                  } else {
                    const meta = SUBJECT_OPTIONS.find(
                      (s) => s.slug === nextSlug
                    );
                    const isBlankContent =
                      activeEssay.plainText.trim().length === 0 &&
                      !activeEssay.researchQuestion.trim();
                    const nextDocType =
                      isBlankContent && meta
                        ? meta.defaultDocType
                        : activeEssay.documentType;
                    const nextTitle =
                      activeEssay.title.startsWith('Untitled ') && meta
                        ? `Untitled ${meta.label} ${nextDocType}`
                        : activeEssay.title;
                    updateActiveEssayLocal({
                      subjectSlug: nextSlug,
                      documentType: nextDocType,
                      title: nextTitle,
                      maxScore: meta?.defaultMaxScore ?? 25,
                    });
                  }
                }}
                className="bg-transparent max-w-full font-medium text-[#52525B] hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 rounded cursor-pointer transition-colors duration-150"
              >
                {SUBJECT_OPTIONS.map((subj) => (
                  <option key={subj.slug} value={subj.slug}>
                    {subj.label}
                  </option>
                ))}
              </select>
            </label>

            {/* Step 2: Assignment Type Selector */}
            <label className="inline-flex items-center gap-1.5 text-[12.5px] text-[#52525B] cursor-pointer max-w-full">
              <span className="w-[18px] h-[18px] shrink-0 rounded-full bg-[#F4F4F5] text-[#3F3F46] text-[11px] font-semibold inline-flex items-center justify-center">
                2
              </span>
              <select
                aria-label="Assignment Type Selector"
                value={activeEssay.documentType}
                onChange={(e) => {
                  const nextDocType = e.target.value;
                  const subjMeta = SUBJECT_OPTIONS.find(
                    (s) => s.slug === activeEssay.subjectSlug
                  );
                  const nextTitle =
                    activeEssay.title.startsWith('Untitled ') && subjMeta
                      ? `Untitled ${subjMeta.label} ${nextDocType}`
                      : activeEssay.title;
                  updateActiveEssayLocal({
                    documentType: nextDocType,
                    title: nextTitle,
                  });
                }}
                className="bg-transparent max-w-full font-medium text-[#52525B] hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 rounded cursor-pointer transition-colors duration-150"
              >
                {ASSIGNMENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>

            {/* Step 3: Draft Editor */}
            <span
              className="inline-flex items-center gap-1.5 text-[12.5px]"
              style={{ fontWeight: 600, color: 'var(--ink)' }}
            >
              <span
                className="w-[18px] h-[18px] rounded-full text-[11px] font-semibold inline-flex items-center justify-center"
                style={{ background: '#18181B', color: '#fff' }}
              >
                3
              </span>
              Draft Editor
            </span>
          </div>

          {/* Right Status Pills + Review CTA */}
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-[11px] py-[5px] text-[12px] font-medium"
              style={riskBadgeMeta.pillStyle}
            >
              {activeEssay.originalitySignal
                ? `Originality Signal: ${activeEssay.originalitySignal.label} (${activeEssay.originalitySignal.riskPercent}%)`
                : 'Originality Signal: Not analyzed'}
            </span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-[11px] py-[5px] text-[12px] font-semibold"
              style={{
                background: '#FEF3C7',
                color: '#92400E',
                borderColor: 'transparent',
              }}
            >
              Est. Score: {activeEssay.estimatedScore ?? 0} /{' '}
              {activeEssay.maxScore}
            </span>
            <button
              type="button"
              onClick={handleReviewWithGemini}
              disabled={opState.status === 'reviewing'}
              className="pill-btn-dark transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-zinc-900"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {opState.status === 'reviewing'
                ? 'Reviewing Draft...'
                : 'Review Draft with Gemini'}
            </button>
          </div>
        </div>

        {/* Draft Switcher & Mode Controls Bar */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#E4E4E7]">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            {essays.map((doc) => {
              const isCurrent = doc.id === activeEssay.id;
              const subjMeta = SUBJECT_OPTIONS.find(
                (s) => s.slug === doc.subjectSlug
              );
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => {
                    getLiveActiveEssay();
                    setActiveEssayId(doc.id);
                    setActiveAnnotationId(null);
                  }}
                  className={`max-w-full truncate px-3 py-1 rounded-full text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 cursor-pointer ${
                    isCurrent
                      ? 'bg-zinc-900 text-white'
                      : 'bg-[#F4F4F5] text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  {subjMeta?.label ?? doc.subjectSlug.toUpperCase()} ·{' '}
                  {doc.documentType}
                </button>
              );
            })}
            <button
              type="button"
              onClick={handleCreateNewDraft}
              className="pill-btn text-xs py-1 px-2.5 focus-visible:ring-2 focus-visible:ring-zinc-900"
            >
              <Plus className="w-3 h-3" /> New Draft
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11.5px] text-zinc-500 font-mono">
              {wordCount} words
            </span>
            {opState.status === 'saved' && (
              <span className="text-[11px] text-emerald-700 font-medium">
                Saved {opState.timestamp}
              </span>
            )}
            {opState.status === 'saving' && (
              <span className="text-[11px] text-zinc-500">Saving...</span>
            )}
            {reviewMeta && (
              <span className="text-[11px] rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-zinc-600 font-medium">
                {reviewMeta.mode === 'gemini'
                  ? `Reviewed via Gemini (${reviewMeta.modelUsed})`
                  : 'Built-In IB Rubric'}
              </span>
            )}
            <Link
              href="/coursework"
              className="text-[11.5px] font-medium text-zinc-600 hover:text-zinc-900 underline underline-offset-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 rounded"
            >
              Exemplars &amp; Rubrics
            </Link>
          </div>
        </div>

        {opState.status === 'error' && (
          <div
            role="alert"
            className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-medium text-rose-800 flex items-center justify-between gap-2"
          >
            <span>{opState.message}</span>
            <button
              type="button"
              aria-label="Dismiss error"
              onClick={() => setOpState({ status: 'idle' })}
              className="text-rose-700 hover:text-rose-900 rounded p-0.5 focus-visible:ring-2 focus-visible:ring-rose-800 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 60% / 40% Split Essay View */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.45fr_1fr] gap-[18px] mt-4 items-start">
          {/* LEFT 60% PAPER CARD */}
          <div className="hairline-card min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Research Question &amp; Draft Canvas
              </span>
              <div
                role="tablist"
                aria-label="Draft Canvas Mode"
                className="inline-flex flex-wrap rounded-full bg-[#F4F4F5] p-0.5 border border-[#E4E4E7] max-w-full"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === 'annotated'}
                  onClick={() => {
                    getLiveActiveEssay();
                    setViewMode('annotated');
                  }}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 cursor-pointer ${
                    viewMode === 'annotated'
                      ? 'bg-white text-zinc-900 border border-[#E4E4E7]'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <Eye className="w-3 h-3" /> Annotated Review
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === 'live_editor'}
                  onClick={() => setViewMode('live_editor')}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 cursor-pointer ${
                    viewMode === 'live_editor'
                      ? 'bg-white text-zinc-900 border border-[#E4E4E7]'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <Edit3 className="w-3 h-3" /> Live Rich Text Editor
                </button>
              </div>
            </div>

            {/* Editable Research Question Heading */}
            {viewMode === 'annotated' ? (
              <h2
                className="break-words"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '20px',
                  fontWeight: 600,
                  lineHeight: 1.35,
                  marginBottom: '14px',
                  color: 'var(--ink)',
                }}
              >
                {activeEssay.researchQuestion ? (
                  activeEssay.researchQuestion
                ) : (
                  <span className="text-zinc-400 font-normal">
                    Untitled research question — switch to Live Rich Text Editor
                    to add your prompt
                  </span>
                )}
              </h2>
            ) : (
              <textarea
                ref={rqInputRef}
                rows={1}
                aria-label="Research Question"
                value={activeEssay.researchQuestion}
                placeholder="Enter your IB research question or essay prompt..."
                onChange={(e) => {
                  const el = e.currentTarget;
                  el.style.height = 'auto';
                  if (el.scrollHeight > 0) {
                    el.style.height = `${el.scrollHeight}px`;
                  }
                  updateActiveEssayLocal({ researchQuestion: el.value });
                }}
                className="w-full min-w-0 overflow-hidden resize-none font-semibold text-[20px] leading-[1.35] mb-3.5 text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal border-b border-zinc-200 pb-1.5 focus:outline-none focus:border-zinc-900 transition-colors duration-150"
                style={{ fontFamily: 'var(--font-display)' }}
              />
            )}

            {/* Annotated Review View vs Live Rich Text Editor */}
            {viewMode === 'annotated' ? (
              <div className="break-words">
                {annotatedData.blocks.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50/50 p-6 text-center">
                    <p className="text-xs text-zinc-500 mb-3">
                      Your draft canvas is empty. Start writing in the Live Rich
                      Text Editor to receive IB criterion annotations.
                    </p>
                    <button
                      type="button"
                      onClick={() => setViewMode('live_editor')}
                      className="pill-btn-dark text-xs focus-visible:ring-2 focus-visible:ring-zinc-900"
                    >
                      <Edit3 className="w-3 h-3" /> Open Live Rich Text Editor
                    </button>
                  </div>
                ) : (
                  annotatedData.blocks.map((block, pIdx) => (
                    <p
                      key={`${block.start}-${pIdx}`}
                      style={{
                        fontSize: '14px',
                        lineHeight: 1.75,
                        color: '#27272A',
                        marginBottom:
                          pIdx === annotatedData.blocks.length - 1
                            ? '0px'
                            : '12px',
                      }}
                    >
                      {block.slices.map((slice, sIdx) =>
                        renderAnnotatedSliceContent(
                          slice,
                          `p${pIdx}-s${sIdx}-${slice.start}`,
                          activeAnnotationId,
                          (id) => {
                            setActiveAnnotationId(id);
                            setMarginTab('feedback');
                          }
                        )
                      )}
                    </p>
                  ))
                )}
              </div>
            ) : (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-zinc-100">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-pressed={editor?.isActive('bold') ?? false}
                      onClick={() => editor?.chain().focus().toggleBold().run()}
                      className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-zinc-900 cursor-pointer ${
                        editor?.isActive('bold')
                          ? 'bg-zinc-900 text-white'
                          : 'text-zinc-700 hover:bg-zinc-100'
                      }`}
                    >
                      Bold
                    </button>
                    <button
                      type="button"
                      aria-pressed={editor?.isActive('italic') ?? false}
                      onClick={() =>
                        editor?.chain().focus().toggleItalic().run()
                      }
                      className={`px-2 py-0.5 rounded text-xs italic transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-zinc-900 cursor-pointer ${
                        editor?.isActive('italic')
                          ? 'bg-zinc-900 text-white'
                          : 'text-zinc-700 hover:bg-zinc-100'
                      }`}
                    >
                      Italic
                    </button>
                  </div>
                  <button
                    type="button"
                    disabled={opState.status === 'saving'}
                    onClick={() => {
                      const live = getLiveActiveEssay();
                      if (live) void persistEssay(live);
                    }}
                    className="pill-btn text-[11.5px] py-1 px-2.5 focus-visible:ring-2 focus-visible:ring-zinc-900"
                  >
                    <Save className="w-3 h-3" />{' '}
                    {opState.status === 'saving' ? 'Saving...' : 'Save Draft'}
                  </button>
                </div>

                <div className="rounded-lg border border-zinc-200/80 p-3 bg-zinc-50/30 min-w-0">
                  <EditorContent editor={editor} />
                </div>
              </div>
            )}

            {/* Footer bar inside Paper Card */}
            <div className="mt-5 pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
              <span>
                {openAnnotations.length} open inline suggestion
                {openAnnotations.length === 1 ? '' : 's'} ·{' '}
                {resolvedAnnotations.length} resolved
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={opState.status === 'saving'}
                  onClick={() => {
                    const live = getLiveActiveEssay();
                    if (live) void persistEssay(live);
                  }}
                  className="pill-btn text-[11.5px] py-1 px-3 focus-visible:ring-2 focus-visible:ring-zinc-900"
                >
                  <Save className="w-3 h-3" />{' '}
                  {opState.status === 'saving' ? 'Saving...' : 'Save Draft'}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT 40% MARGIN RAIL */}
          <div className="flex flex-col gap-3 min-w-0">
            {/* Margin Rail Navigation Tabs */}
            <div
              role="tablist"
              aria-label="Essay Feedback Panels"
              className="grid grid-cols-2 gap-1 bg-[#F4F4F5] p-1 rounded-xl border border-[#E4E4E7]"
            >
              <button
                type="button"
                role="tab"
                aria-selected={marginTab === 'feedback'}
                onClick={() => setMarginTab('feedback')}
                className={`w-full whitespace-nowrap py-1.5 px-2.5 rounded-lg text-[11.5px] font-semibold transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-zinc-900 cursor-pointer ${
                  marginTab === 'feedback'
                    ? 'bg-white text-zinc-900 border border-[#E4E4E7]'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Inline Feedback ({openAnnotations.length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={marginTab === 'rubric'}
                onClick={() => setMarginTab('rubric')}
                className={`w-full whitespace-nowrap py-1.5 px-2.5 rounded-lg text-[11.5px] font-semibold transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-zinc-900 cursor-pointer ${
                  marginTab === 'rubric'
                    ? 'bg-white text-zinc-900 border border-[#E4E4E7]'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Criterion Rubric
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={marginTab === 'originality'}
                onClick={() => setMarginTab('originality')}
                className={`w-full whitespace-nowrap py-1.5 px-2.5 rounded-lg text-[11.5px] font-semibold transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-zinc-900 cursor-pointer ${
                  marginTab === 'originality'
                    ? 'bg-white text-zinc-900 border border-[#E4E4E7]'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Originality &amp; AI
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={marginTab === 'sprout'}
                onClick={() => setMarginTab('sprout')}
                className={`w-full whitespace-nowrap py-1.5 px-2.5 rounded-lg text-[11.5px] font-semibold transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-zinc-900 cursor-pointer ${
                  marginTab === 'sprout'
                    ? 'bg-white text-zinc-900 border border-[#E4E4E7]'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Ask Sprout
              </button>
            </div>

            {/* TAB 1: INLINE FEEDBACK */}
            {marginTab === 'feedback' && (
              <div className="flex flex-col gap-3 min-w-0">
                {openAnnotations.length === 0 ? (
                  <div className="hairline-card text-center py-8">
                    <Check className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                    <div className="text-xs font-semibold text-zinc-900">
                      {resolvedAnnotations.length > 0
                        ? 'All Inline Suggestions Resolved'
                        : 'No Inline Suggestions Yet'}
                    </div>
                    <p className="text-xs text-zinc-500 mt-1 mb-3">
                      Click &ldquo;Review Draft with Gemini&rdquo; to generate
                      criterion-aligned passage feedback.
                    </p>
                    <button
                      type="button"
                      disabled={opState.status === 'reviewing'}
                      onClick={handleReviewWithGemini}
                      className="pill-btn-dark text-xs focus-visible:ring-2 focus-visible:ring-zinc-900"
                    >
                      <Sparkles className="w-3.5 h-3.5" />{' '}
                      {opState.status === 'reviewing'
                        ? 'Reviewing Draft...'
                        : 'Run New Criterion Pass'}
                    </button>
                  </div>
                ) : (
                  openAnnotations.map((ann) => {
                    if (ann.type === 'comment') {
                      return (
                        <article
                          key={ann.id}
                          onClick={() => setActiveAnnotationId(ann.id)}
                          className="hairline-card cursor-pointer transition-colors duration-150"
                          style={{
                            padding: '14px 16px',
                            borderLeft: '3.5px solid #D97706',
                            outline:
                              activeAnnotationId === ann.id
                                ? '2px solid #D97706'
                                : 'none',
                          }}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveAnnotationId(ann.id);
                              }}
                              className="text-left rounded focus-visible:ring-2 focus-visible:ring-[#18181B] cursor-pointer"
                              style={{
                                fontSize: '11.5px',
                                fontWeight: 700,
                                color: '#92400E',
                              }}
                            >
                              {ann.criterion} · Inline Comment
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                void handleDismissAnnotation(ann);
                              }}
                              className="text-[11px] text-zinc-400 hover:text-zinc-700 rounded px-1 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#18181B] cursor-pointer"
                            >
                              Resolve
                            </button>
                          </div>
                          <p
                            style={{
                              fontSize: '12.5px',
                              color: 'var(--muted)',
                              marginTop: '4px',
                            }}
                          >
                            {ann.comment}
                          </p>
                        </article>
                      );
                    }

                    return (
                      <article
                        key={ann.id}
                        onClick={() => setActiveAnnotationId(ann.id)}
                        className="hairline-card cursor-pointer transition-colors duration-150"
                        style={{
                          padding: '14px 16px',
                          borderLeft: '3.5px solid #059669',
                          outline:
                            activeAnnotationId === ann.id
                              ? '2px solid #059669'
                              : 'none',
                        }}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveAnnotationId(ann.id);
                          }}
                          className="text-left rounded focus-visible:ring-2 focus-visible:ring-[#18181B] cursor-pointer"
                          style={{
                            fontSize: '11.5px',
                            fontWeight: 700,
                            color: '#065F46',
                          }}
                        >
                          Suggested Direct Edit
                        </button>
                        <p
                          style={{
                            fontSize: '12.5px',
                            color: 'var(--muted)',
                            marginTop: '4px',
                          }}
                        >
                          {ann.comment}
                        </p>
                        {ann.replacementText && (
                          <div className="mt-2 rounded-lg bg-emerald-50/70 border border-emerald-200/70 px-2.5 py-1.5 text-[12px] text-[#065F46] break-words">
                            &ldquo;{ann.replacementText}&rdquo;
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              void handleAcceptEdit(ann);
                            }}
                            className="pill-btn-dark focus-visible:ring-2 focus-visible:ring-zinc-900"
                            style={{ padding: '5px 12px', fontSize: '11.5px' }}
                          >
                            Accept Edit
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              void handleDismissAnnotation(ann);
                            }}
                            className="pill-btn focus-visible:ring-2 focus-visible:ring-zinc-900"
                          >
                            Dismiss
                          </button>
                        </div>
                      </article>
                    );
                  })
                )}

                {resolvedAnnotations.length > 0 && (
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-3">
                    <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                      Resolved in This Session ({resolvedAnnotations.length})
                    </div>
                    <div className="space-y-1.5">
                      {resolvedAnnotations.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between text-xs text-zinc-600 gap-2"
                        >
                          <span className="truncate min-w-0">
                            {item.criterion}: {item.comment}
                          </span>
                          <span
                            className={`text-[11px] font-semibold shrink-0 ${
                              item.status === 'accepted'
                                ? 'text-emerald-700'
                                : 'text-zinc-400'
                            }`}
                          >
                            {item.status === 'accepted'
                              ? 'Accepted'
                              : 'Dismissed'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: CRITERION RUBRIC */}
            {marginTab === 'rubric' && (
              <div className="space-y-2.5 min-w-0">
                <div className="hairline-card" style={{ padding: '14px 16px' }}>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold text-zinc-900">
                      IB Rubric Breakdown ({activeEssay.documentType})
                    </span>
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      {activeEssay.estimatedScore ?? 0} / {activeEssay.maxScore}
                    </span>
                  </div>
                  <p className="text-[11.5px] text-zinc-500">
                    Calibrated to official IB Diploma assessment descriptors.
                  </p>
                </div>

                {activeEssay.criteriaScores.length === 0 ? (
                  <div className="hairline-card text-center py-6">
                    <p className="text-xs text-zinc-500 mb-3">
                      No criterion scores yet. Add draft text and run a review
                      to generate IB criterion breakdowns.
                    </p>
                    <button
                      type="button"
                      disabled={opState.status === 'reviewing'}
                      onClick={handleReviewWithGemini}
                      className="pill-btn-dark text-xs focus-visible:ring-2 focus-visible:ring-zinc-900"
                    >
                      <Sparkles className="w-3.5 h-3.5" />{' '}
                      {opState.status === 'reviewing'
                        ? 'Reviewing Draft...'
                        : 'Review Draft with Gemini'}
                    </button>
                  </div>
                ) : (
                  activeEssay.criteriaScores.map((c) => {
                    const pct =
                      c.maxScore > 0
                        ? Math.round((c.score / c.maxScore) * 100)
                        : 0;
                    return (
                      <div
                        key={c.criterion}
                        className="hairline-card"
                        style={{ padding: '14px 16px' }}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-zinc-900">
                              {c.criterion}
                            </span>
                            {c.title && (
                              <span className="text-xs text-zinc-500 ml-1.5">
                                · {c.title}
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-mono font-semibold text-zinc-900">
                            {c.score} / {c.maxScore}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden mb-2">
                          <div
                            className="h-full bg-zinc-900 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="text-[12px] text-zinc-600 leading-relaxed">
                          {c.rationale}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 3: ORIGINALITY & AI SIGNAL */}
            {marginTab === 'originality' && (
              <div className="space-y-2.5 min-w-0">
                {!activeEssay.originalitySignal ? (
                  <div className="hairline-card text-center py-6">
                    <ShieldCheck className="w-6 h-6 text-zinc-400 mx-auto mb-2" />
                    <div className="text-xs font-semibold text-zinc-900 mb-1">
                      Advisory Originality Signal Pending
                    </div>
                    <p className="text-[11.5px] text-zinc-500 leading-relaxed mb-3">
                      Write your draft paragraphs to compute sentence
                      burstiness, lexical diversity, and stock-phrase signals.
                    </p>
                    <Link
                      href="/tools/originality-check"
                      className="pill-btn text-xs"
                    >
                      Open Full Plagiarism &amp; AI Scanner →
                    </Link>
                  </div>
                ) : (
                  <>
                    <div
                      className="hairline-card"
                      style={{ padding: '14px 16px' }}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-semibold text-zinc-900 inline-flex items-center gap-1.5">
                          <ShieldCheck
                            className={`w-4 h-4 ${riskBadgeMeta.iconClass}`}
                          />
                          Advisory Originality Signal
                        </span>
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${riskBadgeMeta.badgeClass}`}
                        >
                          {activeEssay.originalitySignal.label} (
                          {activeEssay.originalitySignal.riskPercent}%)
                        </span>
                      </div>
                      <p className="text-[11.5px] text-zinc-500 leading-relaxed">
                        {activeEssay.originalitySignal.advisoryNote ||
                          'Advisory stylistic signal only — never definitive proof of authorship.'}
                      </p>
                    </div>

                    {activeEssay.originalitySignal.metrics.map((m) => (
                      <div
                        key={m.name}
                        className="hairline-card"
                        style={{ padding: '12px 15px' }}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-1.5 mb-0.5">
                          <span className="text-xs font-semibold text-zinc-900">
                            {m.name}
                          </span>
                          <span
                            className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
                              m.status === 'good'
                                ? 'bg-emerald-50 text-emerald-700'
                                : m.status === 'watch'
                                ? 'bg-amber-50 text-amber-800'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {m.value}
                          </span>
                        </div>
                        <p className="text-[11.5px] text-zinc-500">{m.note}</p>
                      </div>
                    ))}

                    <div className="flex items-center justify-between pt-1">
                      <Link
                        href="/tools/originality-check"
                        className="pill-btn text-xs"
                      >
                        Open Full Plagiarism &amp; AI Scanner →
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* TAB 4: ASK SPROUT */}
            {marginTab === 'sprout' && (
              <div
                className="hairline-card flex flex-col justify-between min-w-0"
                style={{ padding: '14px 16px', minHeight: '310px' }}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 pb-2.5 mb-2.5 border-b border-zinc-100">
                    <SproutMascot pose="avatar" size={26} />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-zinc-900 inline-flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 text-zinc-500" />
                        Sprout Coursework Coach
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        Context-aware of your RQ &amp; IB rubric
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5 max-h-[210px] overflow-y-auto pr-1">
                    {sproutChat.map((turn) => (
                      <div
                        key={turn.id}
                        className={`rounded-xl px-3 py-2 text-xs leading-relaxed break-words ${
                          turn.role === 'sprout'
                            ? 'bg-zinc-100 text-zinc-800'
                            : 'bg-zinc-900 text-white ml-6'
                        }`}
                      >
                        {turn.role === 'sprout' ? (
                          <KaTeXText text={turn.text} />
                        ) : (
                          turn.text
                        )}
                      </div>
                    ))}
                    {sproutStatus.status === 'loading' && (
                      <div
                        aria-live="polite"
                        className="rounded-xl px-3 py-2 text-xs bg-zinc-100 text-zinc-500 animate-pulse"
                      >
                        Sprout is reviewing your essay context...
                      </div>
                    )}
                    {sproutStatus.status === 'error' && (
                      <div
                        role="alert"
                        className="rounded-xl px-3 py-2 text-xs bg-rose-50 border border-rose-200 text-rose-800"
                      >
                        {sproutStatus.message}
                      </div>
                    )}
                  </div>
                </div>

                <form
                  onSubmit={handleSproutAsk}
                  className="mt-3 pt-2 border-t border-zinc-100 flex items-center gap-1.5 min-w-0"
                >
                  <input
                    type="text"
                    aria-label="Ask Sprout Coursework Coach"
                    value={sproutInput}
                    onChange={(e) => setSproutInput(e.target.value)}
                    placeholder="Ask how to improve Criterion B..."
                    className="flex-1 min-w-0 text-xs rounded-full border border-zinc-200 px-3 py-1.5 focus:outline-none focus:border-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900"
                  />
                  <button
                    type="submit"
                    aria-label="Send message to Sprout"
                    disabled={
                      sproutStatus.status === 'loading' || !sproutInput.trim()
                    }
                    className="pill-btn-dark py-1.5 px-3 text-xs shrink-0 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-zinc-900"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
