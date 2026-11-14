import { createClient, type Client, type Config } from '@libsql/client';
import { drizzle, type LibSQLDatabase } from 'drizzle-orm/libsql';
import fs from 'fs';
import path from 'path';
import * as schema from './schema';

const BOOTSTRAP_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  gemini_api_key TEXT,
  preferred_gemini_model TEXT NOT NULL DEFAULT 'gemini-3-flash-preview',
  streak_count INTEGER NOT NULL DEFAULT 0,
  last_active_date TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  href TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS subjects (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  level TEXT NOT NULL,
  syllabus_first_assessment TEXT NOT NULL,
  theme_tokens_json TEXT NOT NULL,
  ia_config_json TEXT NOT NULL,
  spotlight_json TEXT NOT NULL,
  practice_tools_json TEXT NOT NULL,
  learn_tools_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS syllabus_topics (
  id TEXT PRIMARY KEY,
  subject_slug TEXT NOT NULL REFERENCES subjects(slug) ON DELETE CASCADE,
  unit_code TEXT NOT NULL,
  unit_title TEXT NOT NULL,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  level_scope TEXT NOT NULL,
  recommended_hours REAL NOT NULL,
  guiding_questions_json TEXT NOT NULL,
  understandings_json TEXT NOT NULL,
  study_guide_markdown TEXT NOT NULL,
  cheatsheet_markdown TEXT NOT NULL,
  blurt_checklist_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  subject_slug TEXT NOT NULL REFERENCES subjects(slug) ON DELETE CASCADE,
  topic_id TEXT NOT NULL REFERENCES syllabus_topics(id) ON DELETE CASCADE,
  subtopic_code TEXT,
  paper TEXT NOT NULL,
  question_type TEXT NOT NULL,
  calculator_policy TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  marks INTEGER NOT NULL,
  command_term TEXT NOT NULL,
  stem_markdown TEXT NOT NULL,
  stimulus_markdown TEXT,
  diagram_spec_json TEXT,
  options_json TEXT,
  correct_option_id TEXT,
  markscheme_points_json TEXT NOT NULL,
  walkthrough_steps_json TEXT NOT NULL,
  common_pitfalls_json TEXT NOT NULL,
  is_daily_eligible INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS subject_reference_items (
  id TEXT PRIMARY KEY,
  subject_slug TEXT NOT NULL REFERENCES subjects(slug) ON DELETE CASCADE,
  tool_type TEXT NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  code_or_symbol TEXT,
  payload_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS topic_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL REFERENCES syllabus_topics(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'unseen',
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS question_attempts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  user_answer TEXT NOT NULL,
  awarded_marks INTEGER NOT NULL,
  max_marks INTEGER NOT NULL,
  matched_points_json TEXT NOT NULL,
  missed_points_json TEXT NOT NULL,
  ai_feedback_markdown TEXT,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS mistakes_log (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  user_answer TEXT NOT NULL,
  missed_concepts_json TEXT NOT NULL,
  user_reflection TEXT,
  resolved INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS exam_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_slug TEXT NOT NULL REFERENCES subjects(slug) ON DELETE CASCADE,
  title TEXT NOT NULL,
  paper_filter TEXT NOT NULL,
  time_limit_minutes INTEGER NOT NULL,
  question_ids_json TEXT NOT NULL,
  answers_json TEXT NOT NULL,
  scores_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress',
  created_at INTEGER NOT NULL,
  completed_at INTEGER
);

CREATE TABLE IF NOT EXISTS flashcard_decks (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  subject_slug TEXT NOT NULL REFERENCES subjects(slug) ON DELETE CASCADE,
  topic_id TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS flashcards (
  id TEXT PRIMARY KEY,
  deck_id TEXT NOT NULL REFERENCES flashcard_decks(id) ON DELETE CASCADE,
  user_id TEXT,
  front_markdown TEXT NOT NULL,
  back_markdown TEXT NOT NULL,
  tags_json TEXT NOT NULL DEFAULT '[]',
  ease_factor REAL NOT NULL DEFAULT 2.5,
  interval_days INTEGER NOT NULL DEFAULT 0,
  repetitions INTEGER NOT NULL DEFAULT 0,
  due_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS recall_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_slug TEXT NOT NULL REFERENCES subjects(slug) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  mode TEXT NOT NULL,
  transcript_or_blurt_json TEXT NOT NULL,
  score_percent INTEGER,
  feedback_json TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_slug TEXT NOT NULL REFERENCES subjects(slug) ON DELETE CASCADE,
  topic_id TEXT,
  title TEXT NOT NULL,
  content_markdown TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  is_pinned INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS essay_documents (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_slug TEXT NOT NULL REFERENCES subjects(slug) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  current_step INTEGER NOT NULL DEFAULT 3,
  title TEXT NOT NULL,
  research_question TEXT NOT NULL,
  content_json TEXT NOT NULL,
  plain_text TEXT NOT NULL,
  estimated_score INTEGER,
  max_score INTEGER NOT NULL DEFAULT 25,
  criteria_scores_json TEXT NOT NULL,
  originality_signal_json TEXT NOT NULL,
  annotations_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS study_tasks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_slug TEXT,
  topic_id TEXT,
  title TEXT NOT NULL,
  scheduled_date TEXT NOT NULL,
  start_time TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 45,
  task_type TEXT NOT NULL DEFAULT 'questions',
  completed INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS bookmarks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_slug TEXT NOT NULL REFERENCES subjects(slug) ON DELETE CASCADE,
  item_type TEXT NOT NULL,
  item_id TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  href TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_syllabus_topics_subject ON syllabus_topics(subject_slug);
CREATE INDEX IF NOT EXISTS idx_questions_subject_topic ON questions(subject_slug, topic_id);
CREATE INDEX IF NOT EXISTS idx_subject_ref_subject_tool ON subject_reference_items(subject_slug, tool_type);
CREATE INDEX IF NOT EXISTS idx_topic_progress_user_topic ON topic_progress(user_id, topic_id);
CREATE INDEX IF NOT EXISTS idx_question_attempts_user_question ON question_attempts(user_id, question_id);
CREATE INDEX IF NOT EXISTS idx_mistakes_log_user_created ON mistakes_log(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_user_created ON exam_sessions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_flashcards_deck_due ON flashcards(deck_id, due_at);
CREATE INDEX IF NOT EXISTS idx_notes_user_updated ON notes(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_essay_documents_user_updated ON essay_documents(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_study_tasks_user_date ON study_tasks(user_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_created ON bookmarks(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(user_id, created_at DESC);
`;

const EXPLICIT_URL_PREFIXES = [
  'file:',
  'libsql:',
  'https:',
  'http:',
  'ws:',
  'wss:',
  ':memory:',
] as const;

const globalForDb = globalThis as unknown as {
  libsqlClient?: Client;
  clientConfig?: Config;
  drizzleDb?: LibSQLDatabase<typeof schema>;
  initPromise?: Promise<void>;
  warnedNoTurso?: boolean;
};

function ensureParentDirForFilePath(filePath: string): void {
  const dir = path.dirname(filePath);
  if (dir && dir !== '.' && !fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function ensureParentDirForFileUrl(url: string): void {
  if (!url.toLowerCase().startsWith('file:')) return;
  const withoutScheme = url.slice('file:'.length).split('?')[0];
  if (!withoutScheme || withoutScheme === ':memory:') return;
  const normalized = withoutScheme.startsWith('///')
    ? withoutScheme.slice(2)
    : withoutScheme;
  ensureParentDirForFilePath(normalized);
}

function isMemoryUrl(url: string | undefined): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return lower === ':memory:' || lower.startsWith('file::memory:');
}

function isLocalFileUrl(url: string | undefined): boolean {
  if (!url) return false;
  return url.toLowerCase().startsWith('file:') && !isMemoryUrl(url);
}

export function resolveLibsqlConfig(): Config {
  const override = process.env.SIMPLE_REVISION_DB_PATH?.trim();
  if (override) {
    const lower = override.toLowerCase();
    if (EXPLICIT_URL_PREFIXES.some((prefix) => lower.startsWith(prefix))) {
      if (lower.startsWith('file:')) {
        ensureParentDirForFileUrl(override);
        return { url: override, timeout: 5000 };
      }
      if (lower.startsWith(':memory:')) {
        return { url: override };
      }
      return {
        url: override,
        authToken: process.env.TURSO_AUTH_TOKEN?.trim() || undefined,
      };
    }

    ensureParentDirForFilePath(override);
    return { url: `file:${override}`, timeout: 5000 };
  }

  const tursoUrl = process.env.TURSO_DATABASE_URL?.trim();
  if (tursoUrl) {
    const authToken = process.env.TURSO_AUTH_TOKEN?.trim() || undefined;
    if (tursoUrl.toLowerCase().startsWith('file:')) {
      ensureParentDirForFileUrl(tursoUrl);
      return { url: tursoUrl, authToken, timeout: 5000 };
    }
    return { url: tursoUrl, authToken };
  }

  const bundledPath = path.join(process.cwd(), 'data', 'simple-revision.db');
  if (process.env.VERCEL === '1') {
    if (!globalForDb.warnedNoTurso) {
      globalForDb.warnedNoTurso = true;
      console.warn(
        '[Simple Revision DB] TURSO_DATABASE_URL is not set; falling back to ephemeral /tmp/simple-revision.db on Vercel.'
      );
    }
    const tmpPath = '/tmp/simple-revision.db';
    if (!fs.existsSync(tmpPath) && fs.existsSync(bundledPath)) {
      try {
        fs.copyFileSync(bundledPath, tmpPath);
      } catch {
        // Fallback to fresh /tmp DB
      }
    }
    return { url: `file:${tmpPath}`, timeout: 5000 };
  }

  ensureParentDirForFilePath(bundledPath);
  return { url: `file:${bundledPath}`, timeout: 5000 };
}

export function getLibsqlClient(): Client {
  if (!globalForDb.libsqlClient) {
    const config = resolveLibsqlConfig();
    const clientConfig: Config = isLocalFileUrl(config.url)
      ? { ...config, concurrency: config.concurrency ?? 1 }
      : config;
    globalForDb.clientConfig = clientConfig;
    globalForDb.libsqlClient = createClient(clientConfig);
  }
  return globalForDb.libsqlClient;
}

async function ensureQuestionsSchemaMigrations(client: Client): Promise<void> {
  const colInfo = await client.execute('PRAGMA table_info(questions)');
  const existingCols = new Set(colInfo.rows.map((row) => String(row.name)));
  if (!existingCols.has('subtopic_code')) {
    await client.execute('ALTER TABLE questions ADD COLUMN subtopic_code TEXT');
  }
  if (!existingCols.has('diagram_spec_json')) {
    await client.execute(
      'ALTER TABLE questions ADD COLUMN diagram_spec_json TEXT'
    );
  }
  await client.executeMultiple(`
    CREATE INDEX IF NOT EXISTS idx_questions_subject_paper_diff ON questions(subject_slug, paper, difficulty);
    CREATE INDEX IF NOT EXISTS idx_questions_daily ON questions(is_daily_eligible, subject_slug);
    CREATE INDEX IF NOT EXISTS idx_questions_diagram ON questions(subject_slug) WHERE diagram_spec_json IS NOT NULL;
  `);
}

export async function ensureDbReady(): Promise<void> {
  if (!globalForDb.initPromise) {
    const client = getLibsqlClient();
    const useWal = isLocalFileUrl(globalForDb.clientConfig?.url);
    globalForDb.initPromise = (async () => {
      if (useWal) {
        try {
          await client.execute('PRAGMA journal_mode = WAL');
        } catch {
          // Ignore pragma errors in restricted environments
        }
      }
      try {
        await client.execute('PRAGMA foreign_keys = ON');
      } catch {
        // Ignore if remote libSQL manages or disallows PRAGMA foreign_keys
      }
      await client.executeMultiple(BOOTSTRAP_SQL);
      await ensureQuestionsSchemaMigrations(client);
    })().catch((err) => {
      globalForDb.initPromise = undefined;
      throw err;
    });
  }
  return globalForDb.initPromise;
}

function getDrizzleDb(): LibSQLDatabase<typeof schema> {
  if (!globalForDb.drizzleDb) {
    globalForDb.drizzleDb = drizzle(getLibsqlClient(), { schema });
  }
  return globalForDb.drizzleDb;
}

export const db: LibSQLDatabase<typeof schema> = new Proxy(
  {} as LibSQLDatabase<typeof schema>,
  {
    get(_target, prop) {
      const instance = getDrizzleDb();
      const value = Reflect.get(instance, prop, instance);
      return typeof value === 'function' ? value.bind(instance) : value;
    },
  }
);

export async function resetDbForTests(): Promise<void> {
  const client = globalForDb.libsqlClient;
  globalForDb.initPromise = undefined;
  globalForDb.drizzleDb = undefined;
  globalForDb.libsqlClient = undefined;
  globalForDb.clientConfig = undefined;
  globalForDb.warnedNoTurso = false;
  if (client) {
    try {
      client.close();
    } catch {
      // Ignore client close errors during test teardown
    }
  }
}

export { schema };
