import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DUMMY_IB_CORE_ITEMS, DUMMY_SUBJECTS, DUMMY_USER } from '@/data/dummy-data';
import { DraftStatus, IBCoreItem, IBCoreType } from '@/types/database';
import { DashboardWorkspace } from '@/components/dashboard/DashboardWorkspace';

interface DashboardPageProps {
  searchParams: Promise<{ subject?: string }>;
}

const CORE_TYPE_TO_LABEL: Record<
  IBCoreType,
  'Theory of Knowledge' | 'Extended Essay' | 'Internal Assessment'
> = {
  TOK_ESSAY: 'Theory of Knowledge',
  TOK_EXHIBITION: 'Theory of Knowledge',
  EXTENDED_ESSAY: 'Extended Essay',
  IA: 'Internal Assessment',
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/dashboard');
  }

  const resolvedParams = await searchParams;
  const requestedSubject = resolvedParams.subject;
  const validSubjectCode =
    requestedSubject && DUMMY_SUBJECTS.some((s) => s.code === requestedSubject)
      ? requestedSubject
      : null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, exam_session')
    .eq('id', user.id)
    .maybeSingle();

  const userName =
    profile?.full_name ||
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email?.split('@')[0] ||
    DUMMY_USER.name;

  const userSession =
    profile?.exam_session ||
    (user.user_metadata?.exam_session as string | undefined) ||
    DUMMY_USER.session;

  const { data: coreRows } = await supabase
    .from('ib_core_items')
    .select(
      'id, type, subject_id, title, draft_status, word_count, target_word_count, deadline, supervisor_feedback'
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });

  const initialCoreItems: IBCoreItem[] =
    coreRows && coreRows.length > 0
      ? coreRows.map((row) => {
          const coreType = (row.type as IBCoreType) || 'TOK_ESSAY';
          const draftStatus = (row.draft_status as DraftStatus) || 'OUTLINE';
          return {
            id: row.id as string,
            categoryLabel: CORE_TYPE_TO_LABEL[coreType] || 'Theory of Knowledge',
            type: coreType,
            subjectCode: (row.subject_id as string | null) || undefined,
            title: row.title as string,
            statusSummary: `${draftStatus.replace('_', ' ')} • ${row.word_count ?? 0}/${row.target_word_count ?? 1600}w`,
            highlightNote: row.deadline ? `Due ${row.deadline}` : 'In progress',
            draftStatus,
            wordCount: (row.word_count as number) ?? 0,
            targetWordCount: (row.target_word_count as number) ?? 1600,
            deadline: (row.deadline as string | null) || '',
            supervisorFeedback:
              (row.supervisor_feedback as string | null) || undefined,
          };
        })
      : DUMMY_IB_CORE_ITEMS;

  return (
    <DashboardWorkspace
      userId={user.id}
      initialUserName={userName}
      initialUserSession={userSession}
      initialSubjectCode={validSubjectCode}
      initialCoreItems={initialCoreItems}
    />
  );
}
