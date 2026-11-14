'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { cn } from '@/lib/utils';

interface MathMarkdownProps {
  content: string;
  className?: string;
}

export function MathMarkdown({ content, className }: MathMarkdownProps) {
  return (
    <div
      className={cn(
        'text-[15px] leading-[24px] text-text-primary space-y-2 [&_.katex]:text-text-primary [&_strong]:font-semibold [&_strong]:text-text-primary [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1',
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
