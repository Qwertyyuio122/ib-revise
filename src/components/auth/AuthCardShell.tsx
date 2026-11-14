'use client';

import React from 'react';
import { SproutMascot } from '@/components/mascot/SproutMascot';

interface AuthCardShellProps {
  title: string;
  subtitle: string;
  maxWidthClass?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const AUTH_SHELL_CSS = `
  @keyframes srAuthCardIn {
    from {
      opacity: 0;
      transform: translateY(8px) scale(0.975);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes srAuthSproutIn {
    from {
      opacity: 0;
      transform: translateY(4px) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes srAuthFadeOnly {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes srAuthShimmerSweep {
    from { transform: translateX(-100%); }
    to { transform: translateX(100%); }
  }

  .sr-auth-grid {
    background-image:
      linear-gradient(to right, rgba(24, 24, 27, 0.032) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(24, 24, 27, 0.032) 1px, transparent 1px);
    background-size: 32px 32px;
    -webkit-mask-image: radial-gradient(ellipse 78% 72% at 50% 48%, #000 35%, transparent 100%);
    mask-image: radial-gradient(ellipse 78% 72% at 50% 48%, #000 35%, transparent 100%);
  }

  .sr-auth-card-enter {
    animation: srAuthCardIn 220ms cubic-bezier(0.23, 1, 0.32, 1) both;
  }

  .sr-auth-sprout-enter {
    animation: srAuthSproutIn 200ms cubic-bezier(0.23, 1, 0.32, 1) 40ms both;
  }

  .sr-auth-sprout {
    transition: transform 180ms cubic-bezier(0.23, 1, 0.32, 1), border-color 150ms ease, background-color 150ms ease;
  }

  .sr-auth-link-arrow {
    display: inline-block;
    transition: transform 160ms cubic-bezier(0.23, 1, 0.32, 1);
  }

  .sr-auth-alert {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 180ms cubic-bezier(0.23, 1, 0.32, 1), transform 180ms cubic-bezier(0.23, 1, 0.32, 1);
  }

  @starting-style {
    .sr-auth-alert {
      opacity: 0;
      transform: translateY(-4px);
    }
  }

  .sr-auth-shimmer {
    position: relative;
    overflow: hidden;
  }

  .sr-auth-shimmer::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.72) 50%, transparent 100%);
    animation: srAuthShimmerSweep 1.5s linear infinite;
  }

  @media (hover: hover) and (pointer: fine) {
    .sr-auth-sprout:hover {
      transform: translateY(-1px) rotate(-3deg) scale(1.04);
      border-color: rgba(16, 185, 129, 0.45);
    }
    .sr-auth-link:hover .sr-auth-link-arrow {
      transform: translateX(2px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .sr-auth-card-enter,
    .sr-auth-sprout-enter {
      animation: srAuthFadeOnly 160ms ease both;
    }
    .sr-auth-sprout,
    .sr-auth-link-arrow {
      transition: border-color 150ms ease, background-color 150ms ease;
    }
    .sr-auth-sprout:hover,
    .sr-auth-link:hover .sr-auth-link-arrow {
      transform: none;
    }
    .sr-auth-alert {
      transition: opacity 160ms ease;
      transform: none;
    }
    @starting-style {
      .sr-auth-alert {
        opacity: 0;
        transform: none;
      }
    }
    .sr-auth-shimmer::after {
      animation: none;
      display: none;
    }
  }
`;

function AuthBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 72% 52% at 50% -6%, rgba(167, 243, 208, 0.22), transparent 72%)',
        }}
      />
      <div className="sr-auth-grid absolute inset-0" />

      <svg
        viewBox="0 0 260 260"
        fill="none"
        className="absolute -top-8 -left-10 w-[210px] h-[210px] sm:w-[270px] sm:h-[270px] text-[#065F46] opacity-[0.055]"
      >
        <path
          d="M28 214C56 154 102 104 176 58"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M112 106C82 88 76 56 96 34C122 46 128 78 112 106Z"
          stroke="currentColor"
          strokeWidth="1.1"
        />
        <path
          d="M138 86C174 88 198 66 206 38C174 36 150 56 138 86Z"
          stroke="currentColor"
          strokeWidth="1.1"
        />
        <path
          d="M78 142C46 130 34 100 48 76C76 86 88 114 78 142Z"
          stroke="currentColor"
          strokeWidth="1.1"
        />
        <circle cx="196" cy="112" r="2.2" fill="currentColor" />
        <circle cx="62" cy="186" r="1.8" fill="currentColor" />
      </svg>

      <svg
        viewBox="0 0 260 260"
        fill="none"
        className="absolute -bottom-10 -right-10 w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] text-[#065F46] opacity-[0.055]"
      >
        <path
          d="M234 44C202 108 156 158 82 204"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M148 154C178 172 184 204 164 226C138 214 132 182 148 154Z"
          stroke="currentColor"
          strokeWidth="1.1"
        />
        <path
          d="M120 174C84 172 60 194 52 222C84 224 108 204 120 174Z"
          stroke="currentColor"
          strokeWidth="1.1"
        />
        <path
          d="M182 118C214 130 226 160 212 184C184 174 172 146 182 118Z"
          stroke="currentColor"
          strokeWidth="1.1"
        />
        <circle cx="66" cy="146" r="2.2" fill="currentColor" />
      </svg>
    </div>
  );
}

/** Shared card frame and brand header for authentication screens. */
export function AuthCardShell({
  title,
  subtitle,
  maxWidthClass = 'max-w-[420px]',
  children,
  footer,
}: AuthCardShellProps) {
  return (
    <div className="relative min-h-[100svh] bg-[#FAFAFA] flex flex-col justify-center items-center px-4 py-8 sm:py-12 overflow-x-hidden">
      <style>{AUTH_SHELL_CSS}</style>
      <AuthBackdrop />

      <div
        className={`sr-auth-card-enter relative z-10 w-full ${maxWidthClass} rounded-[20px] p-[5px] bg-[#F4F4F5]/85 border border-[#E4E4E7]`}
      >
        <div className="relative overflow-hidden w-full bg-[#FFFFFF] border border-[#E4E4E7] rounded-[15px] p-6 sm:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[2px]"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(5, 150, 105, 0.42) 22%, rgba(52, 211, 153, 0.78) 50%, rgba(5, 150, 105, 0.42) 78%, transparent 100%)',
            }}
          />

          <div className="flex items-center gap-3 pb-5 mb-5 border-b border-[#F4F4F5]">
            <div className="sr-auth-sprout-enter shrink-0">
              <div className="sr-auth-sprout inline-flex items-center justify-center rounded-[11px] p-[3px] bg-[#ECFDF5] border border-[#A7F3D0]/80">
                <SproutMascot pose="emblem" size={30} />
              </div>
            </div>
            <div className="min-w-0">
              <div
                className="text-[16px] font-bold tracking-[-0.02em] text-[#18181B] leading-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Simple Revision
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 text-[11.5px] font-medium text-[#71717A]">
                <span
                  aria-hidden="true"
                  className="inline-block h-1.5 w-1.5 rounded-full bg-[#10B981] shrink-0"
                />
                <span>IB Diploma Workspace</span>
              </div>
            </div>
          </div>

          <h1
            className="text-[21px] sm:text-[22px] font-semibold tracking-[-0.025em] text-[#18181B] mb-1.5 leading-[1.22]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {title}
          </h1>
          <p className="text-[13px] leading-[1.55] text-[#71717A] mb-6">
            {subtitle}
          </p>

          {children}

          {footer && (
            <div className="mt-6 pt-5 border-t border-[#F4F4F5] flex flex-wrap items-center justify-between gap-2 text-[12.5px] text-[#71717A]">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function AuthCardSkeleton({
  maxWidthClass = 'max-w-[420px]',
}: {
  maxWidthClass?: string;
}) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading authentication form"
      className="relative min-h-[100svh] bg-[#FAFAFA] flex flex-col justify-center items-center px-4 py-8 sm:py-12 overflow-x-hidden"
    >
      <style>{AUTH_SHELL_CSS}</style>
      <AuthBackdrop />

      <div
        className={`relative z-10 w-full ${maxWidthClass} rounded-[20px] p-[5px] bg-[#F4F4F5]/85 border border-[#E4E4E7]`}
      >
        <div className="relative overflow-hidden w-full bg-[#FFFFFF] border border-[#E4E4E7] rounded-[15px] p-6 sm:p-8 space-y-5">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-[#E4E4E7]/70"
          />

          <div className="flex items-center gap-3 pb-5 border-b border-[#F4F4F5]">
            <div className="sr-auth-shimmer h-[38px] w-[38px] rounded-[11px] bg-[#F4F4F5] shrink-0" />
            <div className="space-y-1.5">
              <div className="sr-auth-shimmer h-4 w-28 rounded-[6px] bg-[#F4F4F5]" />
              <div className="sr-auth-shimmer h-3 w-36 rounded-[6px] bg-[#F4F4F5]" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="sr-auth-shimmer h-6 w-52 rounded-[7px] bg-[#F4F4F5]" />
            <div className="sr-auth-shimmer h-3.5 w-full rounded-[6px] bg-[#F4F4F5]" />
            <div className="sr-auth-shimmer h-3.5 w-3/4 rounded-[6px] bg-[#F4F4F5]" />
          </div>

          <div className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <div className="sr-auth-shimmer h-3 w-24 rounded-[5px] bg-[#F4F4F5]" />
              <div className="sr-auth-shimmer h-[40px] w-full rounded-[10px] bg-[#F4F4F5]" />
            </div>
            <div className="space-y-1.5">
              <div className="sr-auth-shimmer h-3 w-16 rounded-[5px] bg-[#F4F4F5]" />
              <div className="sr-auth-shimmer h-[40px] w-full rounded-[10px] bg-[#F4F4F5]" />
            </div>
            <div className="sr-auth-shimmer h-[42px] w-full rounded-[10px] bg-[#E4E4E7]" />
          </div>

          <div className="pt-5 border-t border-[#F4F4F5] flex items-center justify-between">
            <div className="sr-auth-shimmer h-3.5 w-32 rounded-[5px] bg-[#F4F4F5]" />
            <div className="sr-auth-shimmer h-3.5 w-24 rounded-[5px] bg-[#F4F4F5]" />
          </div>
        </div>
      </div>
    </div>
  );
}
