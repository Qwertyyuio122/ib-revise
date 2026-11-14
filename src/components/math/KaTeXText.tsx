'use client';

import React, { useMemo } from 'react';
import katex from 'katex';
import 'katex/contrib/mhchem';

interface KaTeXTextProps {
  text: string;
  className?: string;
  as?: 'div' | 'span' | 'p';
}

const KATEX_HTML_CACHE = new Map<string, string>();
const MAX_KATEX_CACHE_SIZE = 300;
const ESCAPED_DOLLAR_TOKEN = '\u0000DLR\u0000';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isPrecededByBackslash(source: string, index: number): boolean {
  let backslashes = 0;
  for (let i = index - 1; i >= 0 && source[i] === '\\'; i--) {
    backslashes++;
  }
  return backslashes % 2 === 1;
}

function findClosingInlineDollar(source: string, start: number): number {
  for (let i = start; i < source.length; i++) {
    const ch = source[i];
    if (ch === '\n') return -1;
    if (ch === '$' && !isPrecededByBackslash(source, i)) {
      if (source[i + 1] === '$') {
        i++;
        continue;
      }
      return i;
    }
  }
  return -1;
}

function findClosingBraces(source: string, openBraceIndex: number): number {
  let depth = 0;
  for (let i = openBraceIndex; i < source.length; i++) {
    const ch = source[i];
    if (ch === '\\') {
      i++;
      continue;
    }
    if (ch === '{') {
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function tokenizeMathAndMhchem(
  source: string,
  pushMathToken: (expr: string, displayMode: boolean) => string
): string {
  let out = '';
  let i = 0;

  while (i < source.length) {
    // 1. Display math $$...$$
    if (source[i] === '$' && source[i + 1] === '$' && !isPrecededByBackslash(source, i)) {
      let closeIdx = -1;
      for (let j = i + 2; j < source.length - 1; j++) {
        if (source[j] === '$' && source[j + 1] === '$' && !isPrecededByBackslash(source, j)) {
          closeIdx = j;
          break;
        }
      }
      if (closeIdx !== -1 && closeIdx > i + 2) {
        out += pushMathToken(source.slice(i + 2, closeIdx), true);
        i = closeIdx + 2;
        continue;
      }
    }

    // 2. Escaped currency dollar \$ outside math
    if (source[i] === '\\' && source[i + 1] === '$') {
      out += ESCAPED_DOLLAR_TOKEN;
      i += 2;
      continue;
    }

    // 3. Inline math $...$ (single line, non-empty)
    if (source[i] === '$' && source[i + 1] !== '$') {
      const closeIdx = findClosingInlineDollar(source, i + 1);
      if (closeIdx > i + 1) {
        out += pushMathToken(source.slice(i + 1, closeIdx), false);
        i = closeIdx + 1;
        continue;
      }
    }

    // 4. Bare mhchem \ce{...} or \pu{...} outside $...$ delimiters
    if (
      (source.startsWith('\\ce', i) || source.startsWith('\\pu', i)) &&
      !isPrecededByBackslash(source, i)
    ) {
      let braceStart = i + 3;
      while (braceStart < source.length && (source[braceStart] === ' ' || source[braceStart] === '\t')) {
        braceStart++;
      }
      if (source[braceStart] === '{') {
        const closeBrace = findClosingBraces(source, braceStart);
        if (closeBrace !== -1) {
          out += pushMathToken(source.slice(i, closeBrace + 1), false);
          i = closeBrace + 1;
          continue;
        }
      }
    }

    out += source[i];
    i++;
  }

  return out;
}

function formatInlineMarkdown(line: string, codeTokens: string[]): string {
  const withCodeTokens = line.replace(/`([^`]+)`/g, (_, code: string) => {
    const token = `\u0000CODE${codeTokens.length}\u0000`;
    codeTokens.push(
      `<code class="px-1.5 py-0.5 rounded bg-[#F4F4F5] font-mono text-[12px]">${code}</code>`
    );
    return token;
  });

  return withCodeTokens
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

function renderWithKaTeX(raw: string): string {
  if (!raw) return '';

  const cached = KATEX_HTML_CACHE.get(raw);
  if (cached !== undefined) return cached;

  const cleanRaw = raw.replace(/\r\n?/g, '\n').replace(/\u0000/g, '');
  const mathTokens: string[] = [];

  const pushMathToken = (expr: string, displayMode: boolean): string => {
    let rendered: string;
    try {
      rendered = katex.renderToString(expr, {
        displayMode,
        throwOnError: false,
        trust: false,
        strict: 'ignore',
        maxExpand: 1000,
      });
    } catch {
      rendered = `<code>${escapeHtml(expr)}</code>`;
    }
    const token = `\u0000KTX${mathTokens.length}\u0000`;
    mathTokens.push(rendered);
    return token;
  };

  // Tokenize block/inline math and bare mhchem (\ce{...}, \pu{...}) BEFORE HTML escaping & markdown
  // so characters like `*` or `-` inside KaTeX/mhchem expressions are never corrupted.
  const withMathTokens = tokenizeMathAndMhchem(cleanRaw, pushMathToken);

  const escaped = escapeHtml(withMathTokens);
  const codeTokens: string[] = [];
  const lines = escaped.split('\n');
  const htmlParts: string[] = [];
  let listItems: string[] = [];
  let pendingBlank = false;

  const flushList = () => {
    if (listItems.length > 0) {
      htmlParts.push(
        `<ul class="list-disc pl-5 my-1.5 space-y-1">${listItems.join('')}</ul>`
      );
      listItems = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      if (htmlParts.length > 0) {
        pendingBlank = true;
      }
      continue;
    }

    const listMatch = line.match(/^\s*[-*]\s+(.+)$/);
    if (listMatch) {
      pendingBlank = false;
      listItems.push(
        `<li>${formatInlineMarkdown(listMatch[1], codeTokens)}</li>`
      );
      continue;
    }

    flushList();

    if (trimmed.startsWith('### ')) {
      pendingBlank = false;
      htmlParts.push(
        `<h4 class="font-semibold text-[13.5px] text-[#18181B] mt-3 mb-1">${formatInlineMarkdown(trimmed.slice(4), codeTokens)}</h4>`
      );
      continue;
    }

    if (trimmed.startsWith('## ')) {
      pendingBlank = false;
      htmlParts.push(
        `<h3 class="font-semibold text-[15px] text-[#18181B] mt-3.5 mb-1.5">${formatInlineMarkdown(trimmed.slice(3), codeTokens)}</h3>`
      );
      continue;
    }

    if (trimmed.startsWith('# ')) {
      pendingBlank = false;
      htmlParts.push(
        `<h2 class="font-semibold text-[16px] text-[#18181B] mt-4 mb-2">${formatInlineMarkdown(trimmed.slice(2), codeTokens)}</h2>`
      );
      continue;
    }

    const formatted = formatInlineMarkdown(line, codeTokens);
    const prev = htmlParts[htmlParts.length - 1];
    const prevIsBlock =
      prev !== undefined &&
      (prev.startsWith('<h') || prev.startsWith('<ul'));

    if (htmlParts.length > 0 && !prevIsBlock) {
      htmlParts.push(pendingBlank ? '<br/><br/>' : '<br/>');
    } else if (pendingBlank && prevIsBlock) {
      // Block elements already carry margin spacing
    }
    pendingBlank = false;
    htmlParts.push(formatted);
  }

  flushList();

  const processed = htmlParts
    .join('')
    .replace(/\u0000CODE(\d+)\u0000/g, (_, idx: string) => codeTokens[Number(idx)] ?? '')
    .replace(/\u0000KTX(\d+)\u0000/g, (_, idx: string) => mathTokens[Number(idx)] ?? '')
    .replaceAll(ESCAPED_DOLLAR_TOKEN, '$');

  if (KATEX_HTML_CACHE.size >= MAX_KATEX_CACHE_SIZE) {
    const oldestKey = KATEX_HTML_CACHE.keys().next().value;
    if (oldestKey !== undefined) {
      KATEX_HTML_CACHE.delete(oldestKey);
    }
  }
  KATEX_HTML_CACHE.set(raw, processed);

  return processed;
}

export const KaTeXText = React.memo(function KaTeXText({
  text,
  className = '',
  as: Component = 'div',
}: KaTeXTextProps) {
  const html = useMemo(() => renderWithKaTeX(text), [text]);

  return (
    <Component
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
});
