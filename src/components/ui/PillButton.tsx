import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  children: React.ReactNode;
}

export function PillButton({
  variant = 'secondary',
  size = 'md',
  href,
  className,
  children,
  ...props
}: PillButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blush/40';

  const variantStyles = {
    primary:
      'bg-accent-blush text-surface-canvas hover:bg-accent-rose-hover hover:shadow-blush-bloom active:translate-y-px',
    secondary:
      'border border-border-subtle bg-surface-card text-text-primary hover:bg-surface-raised hover:border-accent-blush/35 active:translate-y-px',
    ghost:
      'border border-transparent bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-raised/60',
  };

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-[13px] leading-[18px] tracking-[0.01em]',
    md: 'px-5 py-2.5 text-[13px] leading-[18px] tracking-[0.01em]',
    lg: 'px-6 py-3 text-[14px] leading-[20px] tracking-[0.01em]',
  };

  const classes = cn(baseStyles, variantStyles[variant], sizeStyles[size], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
