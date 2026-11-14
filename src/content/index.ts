import { biologyHlPack } from './subjects/biology-hl';
import { chemistrySlPack } from './subjects/chemistry-sl';
import { historyHlPack } from './subjects/history-hl';
import { englishLitHlPack } from './subjects/english-literature-hl';
import { frenchBSlPack } from './subjects/french-b-sl';
import { mathAaSlPack } from './subjects/math-aa-sl';
import type { SubjectPack } from './schemas';
import type { QuestionRunnerItem } from '@/components/questions/QuestionRunnerClient';

export const ALL_SUBJECT_PACKS: SubjectPack[] = [
  biologyHlPack,
  chemistrySlPack,
  historyHlPack,
  englishLitHlPack,
  frenchBSlPack,
  mathAaSlPack,
];

const SUBJECT_PACK_BY_SLUG = new Map<string, SubjectPack>(
  ALL_SUBJECT_PACKS.map((p) => [p.subject.slug, p])
);

export function getSubjectPackBySlug(slug: string): SubjectPack | undefined {
  return SUBJECT_PACK_BY_SLUG.get(slug);
}

let cachedAllQuestionsWithMeta: QuestionRunnerItem[] | null = null;

export function getAllQuestionsWithTopicMeta(): QuestionRunnerItem[] {
  if (cachedAllQuestionsWithMeta) {
    return cachedAllQuestionsWithMeta;
  }
  const result: QuestionRunnerItem[] = [];
  for (const pack of ALL_SUBJECT_PACKS) {
    const topicMap = new Map(pack.topics.map((t) => [t.id, t]));
    for (const q of pack.questions) {
      const topic = topicMap.get(q.topicId);
      result.push({
        id: q.id,
        subjectSlug: q.subjectSlug,
        topicId: q.topicId,
        subtopicCode: q.subtopicCode ?? null,
        topicCode: topic?.code ?? '',
        topicTitle: topic?.title ?? '',
        unitCode: topic?.unitCode ?? '',
        levelScope: topic?.levelScope ?? 'SL/Core',
        paper: q.paper,
        questionType: q.questionType,
        calculatorPolicy: q.calculatorPolicy,
        difficulty: q.difficulty,
        marks: q.marks,
        commandTerm: q.commandTerm,
        stemMarkdown: q.stemMarkdown,
        stimulusMarkdown: q.stimulusMarkdown ?? null,
        diagramSpec: q.diagramSpec ?? null,
        options: q.options ?? null,
        correctOptionId: q.correctOptionId ?? null,
        markschemePoints: q.markschemePoints,
        walkthroughSteps: q.walkthroughSteps,
        commonPitfalls: q.commonPitfalls,
        isDailyEligible: q.isDailyEligible ?? true,
      });
    }
  }
  cachedAllQuestionsWithMeta = result;
  return cachedAllQuestionsWithMeta;
}
