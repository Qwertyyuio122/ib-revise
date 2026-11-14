import React from 'react';
import { EssayStudioClient } from '@/components/essay/EssayStudioClient';
import type { SubjectSlug } from '@/types/fsm';

const VALID_SUBJECTS: SubjectSlug[] = [
  'bio',
  'chem',
  'hist',
  'eng',
  'fr',
  'math',
];

const VALID_ASSIGNMENT_TYPES = [
  'Internal Assessment',
  'HL Essay',
  'Extended Essay',
  'Paper Essay',
] as const;

export default async function EssayStudioPage({
  searchParams,
}: {
  searchParams: Promise<{
    subject?: string;
    type?: string;
    rq?: string;
  }>;
}) {
  const resolved = await searchParams;
  const subjectParam = resolved.subject as SubjectSlug | undefined;
  const initialSubject =
    subjectParam && VALID_SUBJECTS.includes(subjectParam)
      ? subjectParam
      : undefined;
  const initialAssignmentType =
    resolved.type &&
    (VALID_ASSIGNMENT_TYPES as readonly string[]).includes(resolved.type)
      ? resolved.type
      : undefined;
  const initialResearchQuestion = resolved.rq?.trim() || undefined;

  return (
    <EssayStudioClient
      initialSubject={initialSubject}
      initialAssignmentType={initialAssignmentType}
      initialResearchQuestion={initialResearchQuestion}
    />
  );
}
