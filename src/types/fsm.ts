export type ScreenState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'empty'; message: string }
  | { status: 'error'; message: string };

export type SubjectSlug = 'bio' | 'chem' | 'hist' | 'eng' | 'fr' | 'math';

export type MasteryStatus =
  | 'mastered'
  | 'confident'
  | 'practicing'
  | 'review_needed'
  | 'struggling'
  | 'unseen';
