'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SproutMascot } from '@/components/mascot/SproutMascot';

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  href: string;
  isRead: number;
}

interface TopUtilityBarProps {
  userName: string;
  streakCount: number;
  mobileMenuOpen?: boolean;
  onOpenSearch: () => void;
  onToggleMobileMenu: () => void;
}

export function TopUtilityBar({
  userName,
  streakCount,
  mobileMenuOpen = false,
  onOpenSearch,
  onToggleMobileMenu,
}: TopUtilityBarProps) {
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notifError, setNotifError] = useState<string | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);
  const avatarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/notifications', { signal: controller.signal })
      .then((r) => {
        if (r.status === 401) {
          routerRef.current.push('/login');
          return null;
        }
        if (!r.ok) {
          throw new Error('Failed to load notifications');
        }
        return r.json();
      })
      .then((d) => {
        if (!d) return;
        setNotifications(d.notifications ?? []);
        setNotifError(null);
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return;
        setNotifError('Could not load notifications right now.');
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!notifOpen && !avatarOpen) return;
    function handleOutsideClick(e: MouseEvent) {
      const target = e.target as Node;
      if (notifOpen && notifRef.current && !notifRef.current.contains(target)) {
        setNotifOpen(false);
      }
      if (avatarOpen && avatarRef.current && !avatarRef.current.contains(target)) {
        setAvatarOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setNotifOpen(false);
        setAvatarOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [notifOpen, avatarOpen]);

  const unreadCount = notifications.filter((n) => n.isRead === 0).length;

  async function handleMarkAllRead() {
    const previous = notifications;
    setNotifError(null);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: 1 })));
    try {
      const res = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      });
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      if (!res.ok) {
        setNotifications(previous);
        setNotifError('Failed to mark notifications as read.');
      }
    } catch {
      setNotifications(previous);
      setNotifError('Failed to mark notifications as read.');
    }
  }

  async function handleSignOut() {
    setAvatarOpen(false);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.push('/login');
      router.refresh();
    }
  }

  return (
    <header className="h-[54px] border-b border-[#F4F4F5] bg-[#FFFFFF] px-2.5 sm:px-[18px] flex items-center justify-between gap-1.5 sm:gap-4 flex-shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-1.5 sm:gap-3.5 min-w-0">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          aria-expanded={mobileMenuOpen}
          aria-label="Open Navigation Menu"
          className="lg:hidden w-[30px] h-[30px] rounded-[8px] inline-flex items-center justify-center text-[#3F3F46] hover:bg-[#F4F4F5] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] cursor-pointer shrink-0"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Link
          href="/"
          className="lg:w-[204px] shrink-0 flex items-center gap-2 sm:gap-[9px] font-bold text-[14.5px] sm:text-[15.5px] tracking-[-0.02em] text-[#18181B] whitespace-nowrap rounded-[8px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <SproutMascot pose="emblem" size={26} />
          <span>Simple Revision</span>
        </Link>

        <button
          type="button"
          onClick={onOpenSearch}
          className="hidden sm:flex w-[190px] md:w-[230px] lg:w-[260px] h-[32px] bg-[#F4F4F5] hover:bg-[#EFEFF1] rounded-full px-3 items-center justify-between text-[12.5px] text-[#71717A] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] cursor-pointer"
        >
          <span className="flex items-center gap-[7px] truncate">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <span>Search syllabus, questions, notes...</span>
          </span>
          <span className="font-mono text-[10.5px] px-1.5 py-[1px] rounded-[5px] bg-[#FFFFFF] border border-[#E4E4E7] text-[#71717A]">
            ⌘K
          </span>
        </button>
      </div>

      <div className="flex items-center gap-1 sm:gap-2.5 flex-shrink-0">
        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Search"
          className="sm:hidden w-[30px] h-[30px] rounded-[8px] inline-flex items-center justify-center text-[#71717A] hover:bg-[#F4F4F5] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] cursor-pointer"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>

        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen((v) => !v)}
            aria-expanded={notifOpen}
            aria-label="Notifications"
            title="Notifications"
            className="w-[30px] h-[30px] rounded-[8px] inline-flex items-center justify-center text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B] relative transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] cursor-pointer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-[5px] right-[5px] w-[6px] h-[6px] rounded-full bg-[#EF4444] border border-white" />
            )}
          </button>

          {notifOpen && (
            <div className="fixed right-3 top-[58px] sm:absolute sm:right-0 sm:top-auto sm:mt-2 w-[300px] max-w-[calc(100vw-24px)] bg-[#FFFFFF] border border-[#E4E4E7] rounded-[14px] p-3 z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F4F4F5]">
                <span className="text-[12px] font-semibold text-[#18181B]">
                  Study Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-[#059669] font-medium hover:underline rounded px-1 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#059669] cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              {notifError && (
                <div
                  role="alert"
                  className="mb-2 rounded-[8px] border border-[#FECACA] bg-[#FEF2F2] px-2.5 py-1.5 text-[11.5px] text-[#B91C1C]"
                >
                  {notifError}
                </div>
              )}
              <div className="space-y-1.5 max-h-[240px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-6 px-3 text-center">
                    <p className="text-[12px] font-medium text-[#71717A]">
                      No notifications yet.
                    </p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => {
                        setNotifOpen(false);
                        router.push(n.href);
                      }}
                      className={`w-full text-left p-2.5 rounded-[10px] hover:bg-[#F4F4F5] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] cursor-pointer block ${
                        n.isRead === 0 ? 'bg-[#FAFAFA]' : ''
                      }`}
                    >
                      <div className="text-[12.5px] font-semibold text-[#18181B]">
                        {n.title}
                      </div>
                      <div className="text-[11.5px] text-[#71717A] leading-snug mt-0.5">
                        {n.body}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <Link
          href="/planner"
          title="Daily Revision Streak"
          className="inline-flex items-center gap-[5px] px-2 sm:px-2.5 py-1 rounded-full bg-[#FAFAFA] border border-[#E4E4E7] text-[12px] font-semibold text-[#18181B] hover:bg-[#F4F4F5] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="#D97706"
            stroke="#D97706"
            strokeWidth="1.5"
          >
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
          </svg>
          <span>{streakCount}</span>
        </Link>

        <div ref={avatarRef} className="relative">
          <button
            type="button"
            onClick={() => setAvatarOpen((v) => !v)}
            aria-expanded={avatarOpen}
            aria-label={`${userName} Account & Settings`}
            title={`${userName} · Account & Settings`}
            className="w-[28px] h-[28px] rounded-full bg-[#ECFDF5] border-[1.5px] border-[#A7F3D0] flex items-center justify-center transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] cursor-pointer"
          >
            <SproutMascot pose="avatar" size={16} />
          </button>

          {avatarOpen && (
            <div className="fixed right-3 top-[58px] sm:absolute sm:right-0 sm:top-auto sm:mt-2 w-[210px] max-w-[calc(100vw-24px)] bg-[#FFFFFF] border border-[#E4E4E7] rounded-[14px] p-2 z-50">
              <div className="px-2.5 py-2 border-b border-[#F4F4F5] mb-1">
                <div className="text-[12.5px] font-semibold text-[#18181B]">
                  {userName}
                </div>
                <div className="text-[11px] text-[#71717A]">
                  IB Diploma Candidate · My 6
                </div>
              </div>
              <Link
                href="/settings"
                onClick={() => setAvatarOpen(false)}
                className="block px-2.5 py-1.5 rounded-[8px] text-[12.5px] text-[#3F3F46] hover:bg-[#F4F4F5] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
              >
                Settings & Gemini Key
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full text-left px-2.5 py-1.5 rounded-[8px] text-[12.5px] text-[#DC2626] hover:bg-[#FEF2F2] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626] cursor-pointer"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
