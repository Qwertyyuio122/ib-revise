import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { AppShell } from '@/components/shell/AppShell';
import { ensureSeeded } from '@/db/seed';

export default async function AuthenticatedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await ensureSeeded();
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <AppShell
      initialUserName={user.name}
      initialStreakCount={user.streakCount}
      initialHasGeminiKey={Boolean(user.geminiApiKey || process.env.GEMINI_API_KEY)}
    >
      {children}
    </AppShell>
  );
}
