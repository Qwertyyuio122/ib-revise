import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  label: string;
  active?: boolean;
  dotColor?: string;
  className?: string;
}

export function StatusBadge({
  label,
  active = false,
  dotColor,
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-medium leading-[16px] tracking-[0.005em] border transition-colors',
        active
          ? 'border-accent-blush/25 bg-accent-blush-glow text-accent-rose-hover'
          : 'border-border-subtle bg-surface-raised/70 text-text-secondary',
        className
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full shrink-0',
          dotColor ? dotColor : active ? 'bg-accent-blush' : 'bg-text-secondary/60'
        )}
      />
      {label}
    </span>
  );
}
