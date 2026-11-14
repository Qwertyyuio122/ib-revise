import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  geminiApiKey: text('gemini_api_key'),
  preferredGeminiModel: text('preferred_gemini_model').notNull().default('gemini-3-flash-preview'),
  streakCount: integer('streak_count').notNull().default(0),
  lastActiveDate: text('last_active_date').notNull(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at').notNull(),
});

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  body: text('body').notNull(),
  href: text('href').notNull(),
  isRead: integer('is_read').notNull().default(0),
  createdAt: integer('created_at').notNull(),
});

export const subjects = sqliteTable('subjects', {
  slug: text('slug').primaryKey(),
  name: text('name').notNull(),
  level: text('level').notNull(),
  syllabusFirstAssessment: text('syllabus_first_assessment').notNull(),
  themeTokensJson: text('theme_tokens_json').notNull(),
  iaConfigJson: text('ia_config_json').notNull(),
  spotlightJson: text('spotlight_json').notNull(),
  practiceToolsJson: text('practice_tools_json').notNull(),
  learnToolsJson: text('learn_tools_json').notNull(),
});

export const syllabusTopics = sqliteTable('syllabus_topics', {
  id: text('id').primaryKey(),
  subjectSlug: text('subject_slug')
    .notNull()
    .references(() => subjects.slug, { onDelete: 'cascade' }),
  unitCode: text('unit_code').notNull(),
  unitTitle: text('unit_title').notNull(),
  code: text('code').notNull(),
  title: text('title').notNull(),
  levelScope: text('level_scope').notNull(),
  recommendedHours: real('recommended_hours').notNull(),
  guidingQuestionsJson: text('guiding_questions_json').notNull(),
  understandingsJson: text('understandings_json').notNull(),
  studyGuideMarkdown: text('study_guide_markdown').notNull(),
  cheatsheetMarkdown: text('cheatsheet_markdown').notNull(),
  blurtChecklistJson: text('blurt_checklist_json').notNull(),
});

export const questions = sqliteTable('questions', {
  id: text('id').primaryKey(),
  subjectSlug: text('subject_slug')
    .notNull()
    .references(() => subjects.slug, { onDelete: 'cascade' }),
  topicId: text('topic_id')
    .notNull()
    .references(() => syllabusTopics.id, { onDelete: 'cascade' }),
  subtopicCode: text('subtopic_code'),
  paper: text('paper').notNull(),
  questionType: text('question_type').notNull(),
  calculatorPolicy: text('calculator_policy').notNull(),
  difficulty: text('difficulty').notNull(),
  marks: integer('marks').notNull(),
  commandTerm: text('command_term').notNull(),
  stemMarkdown: text('stem_markdown').notNull(),
  stimulusMarkdown: text('stimulus_markdown'),
  diagramSpecJson: text('diagram_spec_json'),
  optionsJson: text('options_json'),
  correctOptionId: text('correct_option_id'),
  markschemePointsJson: text('markscheme_points_json').notNull(),
  walkthroughStepsJson: text('walkthrough_steps_json').notNull(),
  commonPitfallsJson: text('common_pitfalls_json').notNull(),
  isDailyEligible: integer('is_daily_eligible').notNull().default(1),
});

export const subjectReferenceItems = sqliteTable('subject_reference_items', {
  id: text('id').primaryKey(),
  subjectSlug: text('subject_slug')
    .notNull()
    .references(() => subjects.slug, { onDelete: 'cascade' }),
  toolType: text('tool_type').notNull(),
  category: text('category').notNull(),
  title: text('title').notNull(),
  codeOrSymbol: text('code_or_symbol'),
  payloadJson: text('payload_json').notNull(),
});

export const topicProgress = sqliteTable('topic_progress', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  topicId: text('topic_id')
    .notNull()
    .references(() => syllabusTopics.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('unseen'),
  updatedAt: integer('updated_at').notNull(),
});

export const questionAttempts = sqliteTable('question_attempts', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  questionId: text('question_id')
    .notNull()
    .references(() => questions.id, { onDelete: 'cascade' }),
  userAnswer: text('user_answer').notNull(),
  awardedMarks: integer('awarded_marks').notNull(),
  maxMarks: integer('max_marks').notNull(),
  matchedPointsJson: text('matched_points_json').notNull(),
  missedPointsJson: text('missed_points_json').notNull(),
  aiFeedbackMarkdown: text('ai_feedback_markdown'),
  durationSeconds: integer('duration_seconds').notNull().default(0),
  createdAt: integer('created_at').notNull(),
});

export const mistakesLog = sqliteTable('mistakes_log', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  questionId: text('question_id')
    .notNull()
    .references(() => questions.id, { onDelete: 'cascade' }),
  userAnswer: text('user_answer').notNull(),
  missedConceptsJson: text('missed_concepts_json').notNull(),
  userReflection: text('user_reflection'),
  resolved: integer('resolved').notNull().default(0),
  createdAt: integer('created_at').notNull(),
});

export const examSessions = sqliteTable('exam_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  subjectSlug: text('subject_slug')
    .notNull()
    .references(() => subjects.slug, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  paperFilter: text('paper_filter').notNull(),
  timeLimitMinutes: integer('time_limit_minutes').notNull(),
  questionIdsJson: text('question_ids_json').notNull(),
  answersJson: text('answers_json').notNull(),
  scoresJson: text('scores_json').notNull(),
  status: text('status').notNull().default('in_progress'),
  createdAt: integer('created_at').notNull(),
  completedAt: integer('completed_at'),
});

export const flashcardDecks = sqliteTable('flashcard_decks', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  subjectSlug: text('subject_slug')
    .notNull()
    .references(() => subjects.slug, { onDelete: 'cascade' }),
  topicId: text('topic_id'),
  title: text('title').notNull(),
  description: text('description').notNull(),
});

export const flashcards = sqliteTable('flashcards', {
  id: text('id').primaryKey(),
  deckId: text('deck_id')
    .notNull()
    .references(() => flashcardDecks.id, { onDelete: 'cascade' }),
  userId: text('user_id'),
  frontMarkdown: text('front_markdown').notNull(),
  backMarkdown: text('back_markdown').notNull(),
  tagsJson: text('tags_json').notNull().default('[]'),
  easeFactor: real('ease_factor').notNull().default(2.5),
  intervalDays: integer('interval_days').notNull().default(0),
  repetitions: integer('repetitions').notNull().default(0),
  dueAt: integer('due_at').notNull(),
});

export const recallSessions = sqliteTable('recall_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  subjectSlug: text('subject_slug')
    .notNull()
    .references(() => subjects.slug, { onDelete: 'cascade' }),
  topicId: text('topic_id').notNull(),
  mode: text('mode').notNull(),
  transcriptOrBlurtJson: text('transcript_or_blurt_json').notNull(),
  scorePercent: integer('score_percent'),
  feedbackJson: text('feedback_json').notNull(),
  createdAt: integer('created_at').notNull(),
});

export const notes = sqliteTable('notes', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  subjectSlug: text('subject_slug')
    .notNull()
    .references(() => subjects.slug, { onDelete: 'cascade' }),
  topicId: text('topic_id'),
  title: text('title').notNull(),
  contentMarkdown: text('content_markdown').notNull(),
  excerpt: text('excerpt').notNull(),
  isPinned: integer('is_pinned').notNull().default(0),
  updatedAt: integer('updated_at').notNull(),
});

export const essayDocuments = sqliteTable('essay_documents', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  subjectSlug: text('subject_slug')
    .notNull()
    .references(() => subjects.slug, { onDelete: 'cascade' }),
  documentType: text('document_type').notNull(),
  currentStep: integer('current_step').notNull().default(3),
  title: text('title').notNull(),
  researchQuestion: text('research_question').notNull(),
  contentJson: text('content_json').notNull(),
  plainText: text('plain_text').notNull(),
  estimatedScore: integer('estimated_score'),
  maxScore: integer('max_score').notNull().default(25),
  criteriaScoresJson: text('criteria_scores_json').notNull(),
  originalitySignalJson: text('originality_signal_json').notNull(),
  annotationsJson: text('annotations_json').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export const studyTasks = sqliteTable('study_tasks', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  subjectSlug: text('subject_slug'),
  topicId: text('topic_id'),
  title: text('title').notNull(),
  scheduledDate: text('scheduled_date').notNull(),
  startTime: text('start_time'),
  durationMinutes: integer('duration_minutes').notNull().default(45),
  taskType: text('task_type').notNull().default('questions'),
  completed: integer('completed').notNull().default(0),
});

export const bookmarks = sqliteTable('bookmarks', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  subjectSlug: text('subject_slug')
    .notNull()
    .references(() => subjects.slug, { onDelete: 'cascade' }),
  itemType: text('item_type').notNull(),
  itemId: text('item_id').notNull(),
  title: text('title').notNull(),
  subtitle: text('subtitle').notNull(),
  href: text('href').notNull(),
  createdAt: integer('created_at').notNull(),
});
