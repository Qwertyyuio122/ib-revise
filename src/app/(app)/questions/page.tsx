import React from 'react';
import { queryQuestionsPage } from '@/lib/question-queries';
import { QuestionRunnerClient } from '@/components/questions/QuestionRunnerClient';

export default async function QuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    subject?: string;
    topicId?: string;
    paper?: string;
    mode?: string;
    tab?: string;
    questionId?: string;
    hasDiagram?: string;
    q?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;

  const rawMode = params.mode?.trim().toLowerCase();
  const rawTab = params.tab?.trim().toLowerCase();
  const initialMode =
    rawMode === 'exam' ||
    rawMode === 'mistakes' ||
    rawMode === 'daily' ||
    rawMode === 'practice' ||
    rawMode === 'walkthrough'
      ? rawMode
      : rawTab === 'mistakes'
      ? 'mistakes'
      : 'practice';

  const initialSubject = params.subject?.trim() || 'all';
  const initialTopicId = params.topicId?.trim() || 'all';
  const initialPaper = params.paper?.trim() || 'all';
  const initialQuestionId = params.questionId?.trim() || undefined;
  const initialHasDiagram =
    params.hasDiagram === '1' || params.hasDiagram === 'true';
  const rawPage = Number.parseInt(params.page ?? '1', 10);
  const initialPage = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  const pageSize = initialMode === 'exam' ? 15 : 25;
  const result = await queryQuestionsPage({
    subject: initialSubject,
    topicId: initialTopicId,
    paper: initialPaper,
    hasDiagram: initialHasDiagram,
    q: params.q?.trim() || undefined,
    mode:
      initialMode === 'mistakes' || initialMode === 'walkthrough'
        ? 'practice'
        : initialMode,
    questionId: initialQuestionId,
    page: initialPage,
    limit: pageSize,
  });

  return (
    <QuestionRunnerClient
      initialQuestions={result.questions}
      initialSubject={initialSubject}
      initialTopicId={initialTopicId}
      initialPaper={initialPaper}
      initialMode={initialMode}
      initialQuestionId={initialQuestionId}
      initialHasDiagram={initialHasDiagram}
      serverPaginated={true}
      initialTotalCount={result.totalCount}
      initialPage={result.page}
      initialPageSize={result.limit}
      initialTotalPages={result.totalPages}
      availableTopics={result.topics}
    />
  );
}
