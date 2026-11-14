import type { SubjectSlug } from '../../src/content/schemas';

export interface SubjectQuotaConfig {
  slug: SubjectSlug;
  name: string;
  targetCount: number;
  targetDiagramCount?: number;
  topicIds: readonly string[];
}

export interface PipelineManifest {
  version: number;
  generatedAt: string;
  mode: 'hybrid' | 'gemini-only';
  totalQuestions: number;
  totalDiagrams: number;
  countsBySubject: Record<SubjectSlug, number>;
  diagramsBySubject: Record<SubjectSlug, number>;
  shards: Array<{
    file: string;
    subjectSlug: SubjectSlug;
    count: number;
    diagramCount: number;
    sha256: string;
  }>;
}
