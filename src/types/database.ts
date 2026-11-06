export type SubjectLevel = 'HL' | 'SL';

export interface Subject {
  id: string;
  name: string;
  level: SubjectLevel;
  code: string;
  subtitle: string;
  dueCardsCount: number;
  statusLabel: string;
  accentDotColor?: string;
}

export interface SyllabusTopic {
  id: string;
  subjectId: string;
  topicNumber: string;
  title: string;
  subtopics: string[];
}

export type QuestionType = 'MCQ' | 'SHORT' | 'EXTENDED';

export interface SampleQuestion {
  id: string;
  subjectCode: string;
  topicId: string;
  topicLabel: string;
  paper: 'P1' | 'P2' | 'P3';
  session: string;
  questionType: QuestionType;
  promptMarkdown: string;
  options?: string[];
  correctOption?: string;
  markSchemeMarkdown: string;
  maxMarks: number;
  difficulty: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  status?: 'BOOKMARKED' | 'ATTEMPTED' | 'MASTERED';
}

export interface SampleFlashcard {
  id: string;
  subjectCode: string;
  topicId: string;
  topicLabel: string;
  frontPrompt: string;
  backAnswer: string;
  keyTerms: string[];
  nextReviewLabel: string;
  stability: number;
  difficulty: number;
}

export type IBCoreType = 'TOK_ESSAY' | 'TOK_EXHIBITION' | 'EXTENDED_ESSAY' | 'IA';
export type DraftStatus = 'OUTLINE' | 'FIRST_DRAFT' | 'SUPERVISOR_REVIEW' | 'FINAL';

export interface IBCoreItem {
  id: string;
  categoryLabel: 'Theory of Knowledge' | 'Extended Essay' | 'Internal Assessment';
  type: IBCoreType;
  subjectCode?: string;
  title: string;
  statusSummary: string;
  highlightNote: string;
  draftStatus: DraftStatus;
  wordCount: number;
  targetWordCount: number;
  deadline: string;
  supervisorFeedback?: string;
}
