import type { SubjectQuotaConfig } from './types';
import type { SubjectSlug } from '../../src/content/schemas';

export const TOTAL_TARGET_QUESTIONS = 30_000;

export const SUBJECT_QUOTAS: Record<SubjectSlug, SubjectQuotaConfig> = {
  math: {
    slug: 'math',
    name: 'Math AA SL',
    targetCount: 8000,
    targetDiagramCount: 4400,
    topicIds: [
      'math-sl-1',
      'math-sl-2',
      'math-sl-3',
      'math-sl-4',
      'math-sl-5a',
      'math-sl-5b',
    ],
  },
  chem: {
    slug: 'chem',
    name: 'Chemistry SL',
    targetCount: 7000,
    topicIds: [
      'chem-S1.4',
      'chem-S2.2',
      'chem-S3.1',
      'chem-R1.1',
      'chem-R2.2',
      'chem-R3.1',
    ],
  },
  bio: {
    slug: 'bio',
    name: 'Biology HL',
    targetCount: 6500,
    topicIds: [
      'bio-A1.1',
      'bio-A1.2',
      'bio-B1.2',
      'bio-B2.1',
      'bio-C1.2',
      'bio-C1.3',
      'bio-D1.1',
      'bio-D1.2',
    ],
  },
  fr: {
    slug: 'fr',
    name: 'French B SL',
    targetCount: 6500,
    topicIds: [
      'fr-T1',
      'fr-T2',
      'fr-T3',
      'fr-T4',
      'fr-T5',
      'fr-P1-TEXTS',
      'fr-GRAMMAR',
    ],
  },
  hist: {
    slug: 'hist',
    name: 'History HL',
    targetCount: 1000,
    topicIds: [
      'hist-p1-ps3a',
      'hist-p1-ps3b',
      'hist-p2-wh10a',
      'hist-p2-wh10b',
      'hist-p2-wh12',
      'hist-p3-hl-euro',
    ],
  },
  eng: {
    slug: 'eng',
    name: 'English Literature HL',
    targetCount: 1000,
    topicIds: [
      'eng-aoe-1',
      'eng-aoe-2',
      'eng-aoe-3',
      'eng-p1-unseen',
      'eng-p2-comp',
      'eng-hle-io',
    ],
  },
};

export const ORDERED_SUBJECT_SLUGS: readonly SubjectSlug[] = [
  'math',
  'chem',
  'bio',
  'fr',
  'hist',
  'eng',
] as const;
