import React from 'react';
import { notFound } from 'next/navigation';
import { getSubjectPackBySlug } from '@/content';
import { SubjectHubClient } from '@/components/subjects/SubjectHubClient';

export default async function SubjectHubPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { slug } = await params;
  const { tab } = await searchParams;

  const pack = getSubjectPackBySlug(slug);
  if (!pack) {
    notFound();
  }

  return (
    <SubjectHubClient
      subject={pack.subject}
      topics={pack.topics}
      initialTab={tab}
    />
  );
}
