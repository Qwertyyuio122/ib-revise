'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TopUtilityBar } from './TopUtilityBar';
import { LeftSidebar } from './LeftSidebar';
import { CommandSearchModal } from './CommandSearchModal';

interface AppShellProps {
  initialUserName: string;
  initialStreakCount: number;
  initialHasGeminiKey?: boolean;
  children: React.ReactNode;
}

export function AppShell({
  initialUserName,
  initialStreakCount,
  children,
}: AppShellProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const toggleMobileNav = useCallback(() => setMobileMenuOpen((v) => !v), []);
  const closeMobileNav = useCallback(() => setMobileMenuOpen(false), []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF]">
      <TopUtilityBar
        userName={initialUserName}
        streakCount={initialStreakCount}
        mobileMenuOpen={mobileMenuOpen}
        onOpenSearch={openSearch}
        onToggleMobileMenu={toggleMobileNav}
      />

      <div className="flex-1 flex min-h-[calc(100vh-54px)]">
        <LeftSidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={closeMobileNav}
        />
        <main className="flex-1 bg-[#FFFFFF] overflow-x-hidden">
          {children}
        </main>
      </div>

      <CommandSearchModal
        isOpen={searchOpen}
        onClose={closeSearch}
      />
    </div>
  );
}
