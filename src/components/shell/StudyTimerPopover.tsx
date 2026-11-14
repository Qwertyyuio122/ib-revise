'use client';

import React, { useState, useEffect, useRef } from 'react';

export function StudyTimerPopover() {
  const [open, setOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [presetMinutes, setPresetMinutes] = useState(25);
  const secondsLeftRef = useRef(secondsLeft);
  const endTimeRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    secondsLeftRef.current = secondsLeft;
  }, [secondsLeft]);

  useEffect(() => {
    if (!running) {
      endTimeRef.current = null;
      return;
    }
    endTimeRef.current = Date.now() + secondsLeftRef.current * 1000;
    const interval = setInterval(() => {
      if (endTimeRef.current === null) return;
      const remaining = Math.max(
        0,
        Math.ceil((endTimeRef.current - Date.now()) / 1000)
      );
      setSecondsLeft(remaining);
      if (remaining === 0) {
        setRunning(false);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    if (!open) return;
    function handleOutsideClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const mins = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, '0');
  const secs = (secondsLeft % 60).toString().padStart(2, '0');

  function applyPreset(m: number) {
    setRunning(false);
    setPresetMinutes(m);
    const nextSeconds = m * 60;
    secondsLeftRef.current = nextSeconds;
    setSecondsLeft(nextSeconds);
  }

  function toggleRunning() {
    if (!running && secondsLeft === 0) {
      const resetSeconds = presetMinutes * 60;
      secondsLeftRef.current = resetSeconds;
      setSecondsLeft(resetSeconds);
      setRunning(true);
      return;
    }
    setRunning((r) => !r);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Study Timer"
        title="Study Timer"
        className={`h-[30px] px-1.5 sm:px-2 rounded-[8px] inline-flex items-center justify-center gap-1.5 text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] cursor-pointer ${
          running ? 'bg-[#ECFDF5] text-[#065F46] font-mono text-[11.5px] font-semibold' : ''
        }`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="12" cy="13" r="8" />
          <path d="M12 9v4l2 2" />
          <path d="M5 3 2 6" />
        </svg>
        {running && <span className="hidden sm:inline">{`${mins}:${secs}`}</span>}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Study Timer"
          className="fixed right-3 top-[58px] sm:absolute sm:right-0 sm:top-auto sm:mt-2 w-[264px] max-w-[calc(100vw-24px)] bg-[#FFFFFF] border border-[#E4E4E7] rounded-[14px] p-4 z-50"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-semibold text-[#18181B]">
              IB Study & Exam Timer
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[11px] text-[#71717A] hover:text-[#18181B] rounded px-1 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] cursor-pointer"
            >
              Close
            </button>
          </div>

          <div className="py-3 text-center bg-[#FAFAFA] border border-[#E4E4E7] rounded-[10px] mb-3">
            <div className="font-mono text-[28px] font-semibold tracking-tight text-[#18181B]">
              {mins}:{secs}
            </div>
            <div className="text-[11px] text-[#71717A]">
              {presetMinutes === 25
                ? 'Pomodoro Focus Block'
                : presetMinutes === 45
                ? 'Paper 2 Essay Sprint (45m)'
                : 'Full Paper Mock (90m)'}
            </div>
          </div>

          <div className="flex gap-1.5 mb-3">
            {[
              { label: '25m Focus', m: 25 },
              { label: '45m Essay', m: 45 },
              { label: '90m Paper', m: 90 },
            ].map((p) => (
              <button
                key={p.m}
                type="button"
                onClick={() => applyPreset(p.m)}
                className={`flex-1 py-1 px-2 rounded-[7px] text-[11px] font-medium border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] cursor-pointer ${
                  presetMinutes === p.m
                    ? 'bg-[#18181B] text-white border-[#18181B]'
                    : 'bg-white text-[#52525B] border-[#E4E4E7] hover:bg-[#F4F4F5]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={toggleRunning}
              className="flex-1 pill-btn-dark justify-center"
            >
              {running ? 'Pause' : 'Start Timer'}
            </button>
            <button
              type="button"
              onClick={() => {
                setRunning(false);
                const resetSeconds = presetMinutes * 60;
                secondsLeftRef.current = resetSeconds;
                setSecondsLeft(resetSeconds);
              }}
              className="pill-btn justify-center"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
