'use client';

import React from 'react';
import Link from 'next/link';
import { SproutMascot } from '@/components/mascot/SproutMascot';

export default function AppErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="main-pad">
      <div className="col-center py-10 sm:py-14">
        <div
          role="alert"
          className="rounded-[14px] border border-[#E4E4E7] bg-[#FFFFFF] max-w-[520px] mx-auto overflow-hidden sr-fade-in"
        >
          <div className="border-b border-[#F4F4F5] bg-[#FAFAFA] px-5 sm:px-6 py-3 flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9F1239]">
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#DC2626] shrink-0"
                aria-hidden="true"
              />
              <span>Workspace Error</span>
            </div>
            {error.digest ? (
              <span className="font-mono text-[11px] text-[#71717A] truncate">
                #{error.digest}
              </span>
            ) : (
              <span className="font-mono text-[11px] text-[#71717A]">
                Recovery
              </span>
            )}
          </div>

          <div className="px-6 py-7 sm:px-8 sm:py-8 text-center">
            <div className="w-20 h-20 rounded-2xl border border-[#F4F4F5] bg-[#FAFAFA] mx-auto mb-4 flex items-center justify-center">
              <SproutMascot pose="snoozing" size={64} />
            </div>

            <h2
              className="text-[20px] font-semibold tracking-[-0.02em] text-[#18181B] leading-[1.3]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Something interrupted this view
            </h2>
            <p className="text-[13px] text-[#71717A] mt-2 mb-6 leading-relaxed max-w-[390px] mx-auto">
              {error.message ||
                'An unexpected error occurred while rendering this workspace.'}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={reset}
                className="pill-btn-dark"
              >
                Try Again
              </button>
              <Link href="/" className="pill-btn">
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
