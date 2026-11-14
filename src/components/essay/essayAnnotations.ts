import type { Editor, JSONContent } from '@tiptap/core';
import {
  Fragment,
  Slice,
  type Mark as ProseMirrorMark,
  type Node as ProseMirrorNode,
} from '@tiptap/pm/model';

export interface EssayAnnotation {
  id: string;
  type: 'comment' | 'edit';
  criterion: string;
  quote: string;
  comment: string;
  replacementText?: string;
  status: 'open' | 'accepted' | 'dismissed';
}

export interface TextIndexEntry {
  textStart: number;
  textEnd: number;
  pmFrom: number;
  pmTo: number;
}

export interface FormattingSpan {
  type: 'bold' | 'italic';
  start: number;
  end: number;
}

export interface AnnotatedTextSlice {
  start: number;
  end: number;
  text: string;
  bold: boolean;
  italic: boolean;
  annotations: EssayAnnotation[];
  completedEdits: EssayAnnotation[];
}

export interface AnnotatedParagraphBlock {
  start: number;
  end: number;
  slices: AnnotatedTextSlice[];
}

export const EMPTY_TIPTAP_DOC: JSONContent = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
};

export const EMPTY_TIPTAP_DOC_JSON = JSON.stringify(EMPTY_TIPTAP_DOC);

/**
 * Parses a stored TipTap JSON document string safely.
 */
export function parseTipTapContentJson(
  contentJson: string | undefined | null
): JSONContent | null {
  if (!contentJson || typeof contentJson !== 'string') return null;
  try {
    const parsed = JSON.parse(contentJson) as JSONContent;
    if (
      parsed &&
      typeof parsed === 'object' &&
      parsed.type === 'doc' &&
      Array.isArray(parsed.content)
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Converts plain text separated by blank lines into a valid TipTap JSON doc.
 */
export function plainTextToTipTapDoc(plainText: string): JSONContent {
  if (!plainText.trim()) {
    return { type: 'doc', content: [{ type: 'paragraph' }] };
  }
  const paragraphs = plainText
    .replace(/\r\n?/g, '\n')
    .split(/\n\n+/)
    .filter((p) => p.trim().length > 0);

  if (paragraphs.length === 0) {
    return { type: 'doc', content: [{ type: 'paragraph' }] };
  }

  return {
    type: 'doc',
    content: paragraphs.map((p) => ({
      type: 'paragraph',
      content: [{ type: 'text', text: p }],
    })),
  };
}

/**
 * Extracts plain text (using `\n\n` block separators) and bold/italic character ranges
 * from a TipTap JSON string, falling back cleanly to `fallbackPlainText`.
 */
export function extractTextAndFormattingFromTipTapJson(
  contentJson: string | undefined | null,
  fallbackPlainText: string
): { text: string; formattingSpans: FormattingSpan[] } {
  const doc = parseTipTapContentJson(contentJson);
  if (!doc || !Array.isArray(doc.content)) {
    return { text: fallbackPlainText, formattingSpans: [] };
  }

  let text = '';
  const formattingSpans: FormattingSpan[] = [];
  let hasVisitedBlock = false;

  const walk = (node: JSONContent) => {
    const isBlock =
      node.type === 'paragraph' ||
      node.type === 'heading' ||
      node.type === 'blockquote' ||
      node.type === 'bulletList' ||
      node.type === 'orderedList' ||
      node.type === 'listItem' ||
      node.type === 'codeBlock';

    if (isBlock) {
      if (hasVisitedBlock) {
        text += '\n\n';
      }
      hasVisitedBlock = true;
    }

    if (node.type === 'text' && typeof node.text === 'string') {
      const start = text.length;
      text += node.text;
      const end = text.length;
      if (Array.isArray(node.marks) && end > start) {
        for (const m of node.marks) {
          if (m.type === 'bold' || m.type === 'italic') {
            formattingSpans.push({ type: m.type, start, end });
          }
        }
      }
      return;
    }

    if (node.type === 'hardBreak') {
      text += '\n';
      return;
    }

    if (Array.isArray(node.content)) {
      for (const child of node.content) {
        walk(child);
      }
    }
  };

  for (const child of doc.content) {
    walk(child);
  }

  if (
    fallbackPlainText.trim().length > 0 &&
    text.trim() !== fallbackPlainText.trim()
  ) {
    return { text: fallbackPlainText, formattingSpans: [] };
  }

  return { text: text || fallbackPlainText, formattingSpans };
}

/**
 * Builds a character-offset index matching TipTap's `getText({ blockSeparator: '\n\n' })`.
 */
export function buildDocTextIndex(doc: ProseMirrorNode): {
  text: string;
  entries: TextIndexEntry[];
} {
  let text = '';
  const entries: TextIndexEntry[] = [];

  doc.nodesBetween(0, doc.content.size, (node, pos) => {
    if (node.isBlock && pos > 0) {
      text += '\n\n';
    }
    if (node.type.name === 'hardBreak') {
      text += '\n';
      return;
    }
    if (node.isText && node.text) {
      const textStart = text.length;
      const textEnd = textStart + node.text.length;
      entries.push({
        textStart,
        textEnd,
        pmFrom: pos,
        pmTo: pos + node.text.length,
      });
      text += node.text;
    }
  });

  return { text, entries };
}

/**
 * Finds the `[start, end)` character span of `quote` in `fullText`,
 * including quotes spanning `\n\n` paragraph breaks or whitespace variations.
 */
export function findQuoteCharRange(
  fullText: string,
  quote: string
): { start: number; end: number } | null {
  if (!fullText || !quote) return null;

  const exactIdx = fullText.indexOf(quote);
  if (exactIdx !== -1) {
    return { start: exactIdx, end: exactIdx + quote.length };
  }

  const trimmedQuote = quote.trim();
  if (!trimmedQuote) return null;
  const trimmedIdx = fullText.indexOf(trimmedQuote);
  if (trimmedIdx !== -1) {
    return { start: trimmedIdx, end: trimmedIdx + trimmedQuote.length };
  }

  // Fallback: tolerate single `\n` vs `\n\n` or collapsed whitespace runs
  const parts = trimmedQuote
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (parts.length === 0) return null;

  try {
    const pattern = new RegExp(parts.join('\\s+'));
    const match = pattern.exec(fullText);
    if (match && match.index !== undefined) {
      return { start: match.index, end: match.index + match[0].length };
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Maps a string quote (including cross-paragraph `\n\n` quotes) to ProseMirror `[from, to]`.
 */
export function findQuoteRangeInDoc(
  doc: ProseMirrorNode,
  quote: string
): { from: number; to: number } | null {
  const { text, entries } = buildDocTextIndex(doc);
  if (entries.length === 0) return null;

  const charRange = findQuoteCharRange(text, quote);
  if (!charRange) return null;

  const intersecting = entries.filter(
    (entry) => entry.textEnd > charRange.start && entry.textStart < charRange.end
  );
  if (intersecting.length === 0) return null;

  const first = intersecting[0];
  const last = intersecting[intersecting.length - 1];
  const from = first.pmFrom + Math.max(0, charRange.start - first.textStart);
  const to =
    last.pmFrom +
    Math.min(last.textEnd - last.textStart, charRange.end - last.textStart);

  if (to <= from) return null;
  return { from, to };
}

/**
 * Finds the ProseMirror `[from, to]` span currently carrying a mark with `annotationId`.
 */
export function findAnnotationMarkRangeInDoc(
  doc: ProseMirrorNode,
  annotationId: string
): { from: number; to: number } | null {
  let minFrom: number | null = null;
  let maxTo: number | null = null;

  doc.nodesBetween(0, doc.content.size, (node, pos) => {
    if (!node.isText) return;
    const hasMatch = node.marks.some(
      (m) =>
        (m.type.name === 'criterionHighlight' || m.type.name === 'suggestedEdit') &&
        m.attrs?.annotationId === annotationId
    );
    if (hasMatch) {
      const nodeFrom = pos;
      const nodeTo = pos + node.nodeSize;
      minFrom = minFrom === null ? nodeFrom : Math.min(minFrom, nodeFrom);
      maxTo = maxTo === null ? nodeTo : Math.max(maxTo, nodeTo);
    }
  });

  if (minFrom === null || maxTo === null || maxTo <= minFrom) return null;
  return { from: minFrom, to: maxTo };
}

/**
 * Checks whether the TipTap document already carries marks for all open annotations
 * that match the document text.
 */
export function docHasAllOpenAnnotationMarks(
  doc: ProseMirrorNode,
  annotations: EssayAnnotation[]
): boolean {
  const markedIds = new Set<string>();
  doc.nodesBetween(0, doc.content.size, (node) => {
    if (!node.isText) return;
    for (const m of node.marks) {
      if (
        (m.type.name === 'criterionHighlight' || m.type.name === 'suggestedEdit') &&
        typeof m.attrs?.annotationId === 'string'
      ) {
        markedIds.add(m.attrs.annotationId);
      }
    }
  });

  const openAnns = annotations.filter((a) => a.status === 'open' && a.quote.trim());
  const openIds = new Set(openAnns.map((a) => a.id));
  for (const markedId of markedIds) {
    if (!openIds.has(markedId)) {
      return false;
    }
  }
  for (const ann of openAnns) {
    if (!markedIds.has(ann.id) && findQuoteRangeInDoc(doc, ann.quote)) {
      return false;
    }
  }
  return true;
}

/**
 * Applies `CriterionHighlightMark` and `SuggestedEditMark` for open annotations
 * directly on the ProseMirror document while preserving Bold/Italic formatting.
 */
export function applyAnnotationsToEditor(
  editor: Editor,
  annotations: EssayAnnotation[]
): boolean {
  if (!editor || editor.isDestroyed) return false;

  const { state, view } = editor;
  const { schema, doc } = state;
  const criterionType = schema.marks.criterionHighlight;
  const editType = schema.marks.suggestedEdit;

  if (!criterionType && !editType) return false;

  let tr = state.tr;

  if (criterionType) {
    tr = tr.removeMark(0, doc.content.size, criterionType);
  }
  if (editType) {
    tr = tr.removeMark(0, doc.content.size, editType);
  }

  for (const ann of annotations) {
    if (ann.status !== 'open' || !ann.quote.trim()) continue;
    const range = findQuoteRangeInDoc(doc, ann.quote);
    if (!range) continue;

    if (ann.type === 'comment' && criterionType) {
      const mark = criterionType.create({
        annotationId: ann.id,
        criterion: ann.criterion,
        comment: ann.comment,
      });
      tr = tr.addMark(range.from, range.to, mark);
    } else if (ann.type === 'edit' && editType) {
      const mark = editType.create({
        annotationId: ann.id,
        replacementText: ann.replacementText ?? '',
        comment: ann.comment,
      });
      tr = tr.addMark(range.from, range.to, mark);
    }
  }

  if (tr.steps.length === 0) {
    return false;
  }

  tr.setMeta('addToHistory', false);
  view.dispatch(tr);
  return true;
}

/**
 * Replaces the ProseMirror range for a `SuggestedEditMark` (preserving Bold/Italic)
 * and returns updated `plainText` and `contentJson`.
 */
export function acceptSuggestedEditInEditor(
  editor: Editor,
  annotation: EssayAnnotation
): { applied: boolean; plainText: string; contentJson: string } {
  if (!editor || editor.isDestroyed) {
    return {
      applied: false,
      plainText: '',
      contentJson: EMPTY_TIPTAP_DOC_JSON,
    };
  }

  const fallbackPlain = editor.getText({ blockSeparator: '\n\n' });
  const fallbackJson = JSON.stringify(editor.getJSON());

  if (!annotation.replacementText) {
    return { applied: false, plainText: fallbackPlain, contentJson: fallbackJson };
  }

  const { state, view } = editor;
  const { doc, schema } = state;
  const range =
    findAnnotationMarkRangeInDoc(doc, annotation.id) ??
    findQuoteRangeInDoc(doc, annotation.quote);

  if (!range) {
    return { applied: false, plainText: fallbackPlain, contentJson: fallbackJson };
  }

  let startMarks: readonly ProseMirrorMark[] = [];
  let captured = false;
  doc.nodesBetween(range.from, range.to, (node) => {
    if (!captured && node.isText) {
      startMarks = node.marks;
      captured = true;
    }
  });
  const preservedMarks: ProseMirrorMark[] = startMarks.filter(
    (m) =>
      m.type.name !== 'suggestedEdit' &&
      m.attrs?.annotationId !== annotation.id
  );

  let tr = state.tr;

  // Remove the target suggestedEdit mark first if present
  doc.nodesBetween(0, doc.content.size, (node, pos) => {
    if (!node.isText) return;
    for (const m of node.marks) {
      if (m.type.name === 'suggestedEdit' && m.attrs?.annotationId === annotation.id) {
        tr = tr.removeMark(pos, pos + node.nodeSize, m);
      }
    }
  });

  const replacement = annotation.replacementText.replace(/\r\n?/g, '\n');
  if (replacement.includes('\n\n') && schema.nodes.paragraph) {
    const paragraphs = replacement
      .split(/\n\n+/)
      .filter((p) => p.length > 0)
      .map((p) =>
        schema.nodes.paragraph.create(
          null,
          p ? schema.text(p, preservedMarks) : undefined
        )
      );
    if (paragraphs.length > 0) {
      tr = tr.replace(
        range.from,
        range.to,
        new Slice(Fragment.fromArray(paragraphs), 1, 1)
      );
    }
  } else {
    tr = tr.replaceWith(
      range.from,
      range.to,
      schema.text(replacement, preservedMarks)
    );
  }

  view.dispatch(tr);

  return {
    applied: true,
    plainText: editor.getText({ blockSeparator: '\n\n' }),
    contentJson: JSON.stringify(editor.getJSON()),
  };
}

/**
 * Removes only the marks belonging to `annotationId` while keeping all other
 * overlapping annotations and Bold/Italic formatting intact.
 */
export function dismissAnnotationInEditor(
  editor: Editor,
  annotationId: string
): { plainText: string; contentJson: string } {
  if (!editor || editor.isDestroyed) {
    return { plainText: '', contentJson: EMPTY_TIPTAP_DOC_JSON };
  }

  const { state, view } = editor;
  const { doc } = state;
  let tr = state.tr;
  let changed = false;

  doc.nodesBetween(0, doc.content.size, (node, pos) => {
    if (!node.isText) return;
    for (const m of node.marks) {
      if (
        (m.type.name === 'criterionHighlight' || m.type.name === 'suggestedEdit') &&
        m.attrs?.annotationId === annotationId
      ) {
        tr = tr.removeMark(pos, pos + node.nodeSize, m);
        changed = true;
      }
    }
  });

  if (changed) {
    tr.setMeta('addToHistory', false);
    view.dispatch(tr);
  }

  return {
    plainText: editor.getText({ blockSeparator: '\n\n' }),
    contentJson: JSON.stringify(editor.getJSON()),
  };
}

/**
 * Splits `fullText` into paragraph blocks and performs an interval-boundary sweep
 * so cross-paragraph (`\n\n`) and overlapping annotations render cleanly without dropping spans.
 */
export function buildAnnotatedParagraphBlocks(
  fullText: string,
  annotations: EssayAnnotation[],
  formattingSpans: FormattingSpan[] = []
): AnnotatedParagraphBlock[] {
  if (!fullText.trim()) return [];

  // Compute exact paragraph [start, end) ranges matching \n\n+ splits
  const paraRanges: Array<{ start: number; end: number }> = [];
  const separatorRegex = /\n\n+/g;
  let cursor = 0;
  let sepMatch: RegExpExecArray | null;
  while ((sepMatch = separatorRegex.exec(fullText)) !== null) {
    if (sepMatch.index > cursor) {
      const rawSlice = fullText.slice(cursor, sepMatch.index);
      const leadingWs = rawSlice.length - rawSlice.trimStart().length;
      const trailingWs = rawSlice.length - rawSlice.trimEnd().length;
      const start = cursor + leadingWs;
      const end = sepMatch.index - trailingWs;
      if (end > start) {
        paraRanges.push({ start, end });
      }
    }
    cursor = sepMatch.index + sepMatch[0].length;
  }
  if (cursor < fullText.length) {
    const rawSlice = fullText.slice(cursor);
    const leadingWs = rawSlice.length - rawSlice.trimStart().length;
    const trailingWs = rawSlice.length - rawSlice.trimEnd().length;
    const start = cursor + leadingWs;
    const end = fullText.length - trailingWs;
    if (end > start) {
      paraRanges.push({ start, end });
    }
  }

  const openRangeAnns = annotations
    .filter((a) => a.status === 'open' && a.quote.trim().length > 0)
    .map((ann) => {
      const range = findQuoteCharRange(fullText, ann.quote);
      return range ? { ann, start: range.start, end: range.end } : null;
    })
    .filter(
      (item): item is { ann: EssayAnnotation; start: number; end: number } =>
        item !== null
    );

  return paraRanges.map((para) => {
    const intersectingAnns = openRangeAnns.filter(
      (item) => item.end > para.start && item.start < para.end
    );
    const intersectingFmt = formattingSpans.filter(
      (f) => f.end > para.start && f.start < para.end
    );

    const pointSet = new Set<number>([para.start, para.end]);
    for (const item of intersectingAnns) {
      pointSet.add(Math.max(para.start, item.start));
      pointSet.add(Math.min(para.end, item.end));
    }
    for (const fmt of intersectingFmt) {
      pointSet.add(Math.max(para.start, fmt.start));
      pointSet.add(Math.min(para.end, fmt.end));
    }

    const points = Array.from(pointSet).sort((a, b) => a - b);
    const slices: AnnotatedTextSlice[] = [];

    for (let i = 0; i < points.length - 1; i++) {
      const s = points[i];
      const e = points[i + 1];
      if (e <= s) continue;

      const covering = intersectingAnns
        .filter((item) => item.start <= s && item.end >= e)
        .sort((a, b) => (a.end - a.start) - (b.end - b.start))
        .map((item) => item.ann);

      const completedEdits = intersectingAnns
        .filter((item) => item.ann.type === 'edit' && item.end === e)
        .map((item) => item.ann);

      slices.push({
        start: s,
        end: e,
        text: fullText.slice(s, e),
        bold: intersectingFmt.some(
          (f) => f.type === 'bold' && f.start <= s && f.end >= e
        ),
        italic: intersectingFmt.some(
          (f) => f.type === 'italic' && f.start <= s && f.end >= e
        ),
        annotations: covering,
        completedEdits,
      });
    }

    // If a cross-paragraph edit spans beyond para.end, only render replacement chip at true end
    // (handled by `item.end === e` above).
    return {
      start: para.start,
      end: para.end,
      slices,
    };
  });
}
