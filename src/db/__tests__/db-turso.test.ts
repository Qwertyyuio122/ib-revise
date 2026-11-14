import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { eq } from 'drizzle-orm';
import { getTableConfig, type SQLiteTable } from 'drizzle-orm/sqlite-core';
import {
  db,
  ensureDbReady,
  getLibsqlClient,
  resetDbForTests,
  resolveLibsqlConfig,
  schema,
} from '@/db';
import { ensureSeeded, resetSeedCacheForTests } from '@/db/seed';

const ALL_18_TABLES = [
  'users',
  'sessions',
  'notifications',
  'subjects',
  'syllabus_topics',
  'questions',
  'subject_reference_items',
  'topic_progress',
  'question_attempts',
  'mistakes_log',
  'exam_sessions',
  'flashcard_decks',
  'flashcards',
  'recall_sessions',
  'notes',
  'essay_documents',
  'study_tasks',
  'bookmarks',
] as const;

const ALL_16_INDEXES = [
  'idx_syllabus_topics_subject',
  'idx_questions_subject_topic',
  'idx_questions_subject_paper_diff',
  'idx_questions_daily',
  'idx_questions_diagram',
  'idx_subject_ref_subject_tool',
  'idx_topic_progress_user_topic',
  'idx_question_attempts_user_question',
  'idx_mistakes_log_user_created',
  'idx_exam_sessions_user_created',
  'idx_flashcards_deck_due',
  'idx_notes_user_updated',
  'idx_essay_documents_user_updated',
  'idx_study_tasks_user_date',
  'idx_bookmarks_user_created',
  'idx_notifications_user_created',
] as const;

const TRACKED_ENV_KEYS = [
  'SIMPLE_REVISION_DB_PATH',
  'TURSO_DATABASE_URL',
  'TURSO_AUTH_TOKEN',
  'VERCEL',
] as const;

describe('Turso / libSQL Database Routing, Bootstrap & Persistence', () => {
  const originalEnv: Record<string, string | undefined> = {};
  const tempDirs: string[] = [];

  function makeTempDir(prefix: string): string {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
    tempDirs.push(dir);
    return dir;
  }

  beforeEach(async () => {
    for (const key of TRACKED_ENV_KEYS) {
      originalEnv[key] = process.env[key];
      delete process.env[key];
    }
    resetSeedCacheForTests();
    await resetDbForTests();
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    resetSeedCacheForTests();
    await resetDbForTests();

    for (const key of TRACKED_ENV_KEYS) {
      const value = originalEnv[key];
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }

    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    }
  });

  it('initializes local file DB via SIMPLE_REVISION_DB_PATH and creates all 18 tables idempotently', async () => {
    const tempDir = makeTempDir('sr-db-init-');
    const nestedDbPath = path.join(tempDir, 'nested', 'dir', 'local.db');
    process.env.SIMPLE_REVISION_DB_PATH = nestedDbPath;

    const config = resolveLibsqlConfig();
    expect(config.url).toBe(`file:${nestedDbPath}`);
    expect(fs.existsSync(path.dirname(nestedDbPath))).toBe(true);

    // Run ensureDbReady twice to verify idempotency
    await ensureDbReady();
    await ensureDbReady();

    const client = getLibsqlClient();
    const tablesResult = await client.execute(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    );
    const tableNames = tablesResult.rows.map((row) => String(row.name));

    expect(tableNames).toHaveLength(ALL_18_TABLES.length);
    for (const expectedTable of ALL_18_TABLES) {
      expect(tableNames).toContain(expectedTable);
    }

    const fkResult = await client.execute('PRAGMA foreign_keys');
    expect(Number(fkResult.rows[0]?.foreign_keys)).toBe(1);
  });

  it('resolves TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, overrides, and Vercel fallback cleanly', async () => {
    // 1. Remote Turso URL + trimmed auth token
    process.env.TURSO_DATABASE_URL = '  libsql://simple-revision-prod.turso.io  ';
    process.env.TURSO_AUTH_TOKEN = '  turso-token-secret  ';
    expect(resolveLibsqlConfig()).toEqual({
      url: 'libsql://simple-revision-prod.turso.io',
      authToken: 'turso-token-secret',
    });

    // Blank auth token normalizes to undefined
    process.env.TURSO_AUTH_TOKEN = '   ';
    expect(resolveLibsqlConfig()).toEqual({
      url: 'libsql://simple-revision-prod.turso.io',
      authToken: undefined,
    });

    // 2. SIMPLE_REVISION_DB_PATH takes precedence over TURSO_DATABASE_URL
    const tempDir = makeTempDir('sr-db-precedence-');
    const overrideFileUrl = `file:${path.join(tempDir, 'override.db')}`;
    process.env.SIMPLE_REVISION_DB_PATH = overrideFileUrl;
    process.env.TURSO_AUTH_TOKEN = 'turso-token-secret';
    expect(resolveLibsqlConfig()).toMatchObject({
      url: overrideFileUrl,
    });

    // 3. Explicit remote/memory prefixes on SIMPLE_REVISION_DB_PATH are preserved
    process.env.SIMPLE_REVISION_DB_PATH = 'libsql://custom-override.turso.io';
    expect(resolveLibsqlConfig()).toEqual({
      url: 'libsql://custom-override.turso.io',
      authToken: 'turso-token-secret',
    });

    process.env.SIMPLE_REVISION_DB_PATH = ':memory:';
    expect(resolveLibsqlConfig()).toEqual({ url: ':memory:' });

    // 4. TURSO_DATABASE_URL with file: URL initializes and swaps cleanly after resetDbForTests
    delete process.env.SIMPLE_REVISION_DB_PATH;
    const tursoLocalPath = path.join(tempDir, 'turso-file', 'cloud-sim.db');
    process.env.TURSO_DATABASE_URL = `file:${tursoLocalPath}`;
    process.env.TURSO_AUTH_TOKEN = 'local-sim-token';

    const fileTursoConfig = resolveLibsqlConfig();
    expect(fileTursoConfig).toMatchObject({
      url: `file:${tursoLocalPath}`,
      authToken: 'local-sim-token',
    });

    await ensureDbReady();
    await db
      .insert(schema.users)
      .values({
        id: 'turso-file-user',
        email: 'turso-file@example.com',
        name: 'Turso Sim',
        passwordHash: 'hash',
        createdAt: 1_700_000_000_000,
        updatedAt: 1_700_000_000_000,
        lastActiveDate: '2026-11-11',
      })
      .run();

    const stored = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, 'turso-file-user'))
      .get();
    expect(stored?.email).toBe('turso-file@example.com');

    await resetDbForTests();

    // 5. VERCEL=1 without TURSO_DATABASE_URL logs a single warning and uses /tmp fallback
    delete process.env.TURSO_DATABASE_URL;
    delete process.env.TURSO_AUTH_TOKEN;
    process.env.VERCEL = '1';

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const vercelConfigFirst = resolveLibsqlConfig();
    const vercelConfigSecond = resolveLibsqlConfig();

    expect(vercelConfigFirst.url).toBe('file:/tmp/simple-revision.db');
    expect(vercelConfigSecond.url).toBe('file:/tmp/simple-revision.db');
    expect(warnSpy).toHaveBeenCalledTimes(1);

    // 6. Default local fallback without any overrides
    delete process.env.VERCEL;
    expect(resolveLibsqlConfig().url).toBe(
      `file:${path.join(process.cwd(), 'data', 'simple-revision.db')}`
    );
  });

  it('persists user, topic progress, mistakes, and notes across resetDbForTests() reconnects', async () => {
    const tempDir = makeTempDir('sr-db-persist-');
    const sharedDbPath = path.join(tempDir, 'shared-persistent.db');
    process.env.SIMPLE_REVISION_DB_PATH = sharedDbPath;

    // Device / cold start #1
    const firstClient = getLibsqlClient();
    const seedFirst = await ensureSeeded();
    expect(seedFirst.subjectsCount).toBe(6);

    const firstTopic = await db.select().from(schema.syllabusTopics).limit(1).get();
    const firstQuestion = await db.select().from(schema.questions).limit(1).get();
    expect(firstTopic).toBeDefined();
    expect(firstQuestion).toBeDefined();

    const now = Date.now();
    await db
      .insert(schema.users)
      .values({
        id: 'user-persist-1',
        email: 'harris@example.com',
        name: 'Harris',
        passwordHash: 'scrypt-hash-1',
        preferredGeminiModel: 'gemini-3-flash-preview',
        streakCount: 12,
        lastActiveDate: '2026-11-11',
        createdAt: now,
        updatedAt: now,
      })
      .run();

    await db
      .insert(schema.topicProgress)
      .values({
        id: 'tp-persist-1',
        userId: 'user-persist-1',
        topicId: firstTopic!.id,
        status: 'mastered',
        updatedAt: now,
      })
      .run();

    await db
      .insert(schema.mistakesLog)
      .values({
        id: 'mistake-persist-1',
        userId: 'user-persist-1',
        questionId: firstQuestion!.id,
        userAnswer: 'Incomplete stoichiometry step',
        missedConceptsJson: JSON.stringify(['IB STP 22.7 dm3 mol-1']),
        userReflection: 'Remember molar volume at STP is 22.7 dm3 mol-1.',
        resolved: 0,
        createdAt: now,
      })
      .run();

    await db
      .insert(schema.notes)
      .values({
        id: 'note-persist-1',
        userId: 'user-persist-1',
        subjectSlug: firstTopic!.subjectSlug,
        topicId: firstTopic!.id,
        title: 'Persistent Revision Note',
        contentMarkdown: '# Key takeaway\n\nData persists across serverless cold starts.',
        excerpt: 'Data persists across serverless cold starts.',
        isPinned: 1,
        updatedAt: now,
      })
      .run();

    // Simulate serverless cold start / second device opening a fresh client to the same DB
    resetSeedCacheForTests();
    await resetDbForTests();

    const secondClient = getLibsqlClient();
    expect(secondClient).not.toBe(firstClient);

    await ensureDbReady();
    const seedSecond = await ensureSeeded();
    expect(seedSecond.subjectsCount).toBe(6);

    const persistedUser = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, 'user-persist-1'))
      .get();
    expect(persistedUser?.email).toBe('harris@example.com');
    expect(persistedUser?.streakCount).toBe(12);

    const persistedProgress = await db
      .select()
      .from(schema.topicProgress)
      .where(eq(schema.topicProgress.userId, 'user-persist-1'))
      .all();
    expect(persistedProgress).toHaveLength(1);
    expect(persistedProgress[0].topicId).toBe(firstTopic!.id);
    expect(persistedProgress[0].status).toBe('mastered');

    const persistedMistakes = await db
      .select()
      .from(schema.mistakesLog)
      .where(eq(schema.mistakesLog.userId, 'user-persist-1'))
      .all();
    expect(persistedMistakes).toHaveLength(1);
    expect(persistedMistakes[0].questionId).toBe(firstQuestion!.id);
    expect(persistedMistakes[0].userReflection).toContain('22.7 dm3 mol-1');

    const persistedNotes = await db
      .select()
      .from(schema.notes)
      .where(eq(schema.notes.userId, 'user-persist-1'))
      .all();
    expect(persistedNotes).toHaveLength(1);
    expect(persistedNotes[0].title).toBe('Persistent Revision Note');
    expect(persistedNotes[0].isPinned).toBe(1);
  });

  it('defaults users.streak_count to 0 and force-reseed upserts curriculum without touching user flashcards', async () => {
    const tempDir = makeTempDir('sr-db-seed-force-');
    const dbPath = path.join(tempDir, 'seed-force.db');
    process.env.SIMPLE_REVISION_DB_PATH = dbPath;

    await ensureSeeded();
    const client = getLibsqlClient();
    const now = Date.now();

    // Verify column DDL default for streak_count is 0
    await client.execute({
      sql: `INSERT INTO users (id, email, name, password_hash, last_active_date, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: ['user-default-streak', 'streak0@example.com', 'Zero Streak', 'hash', '2026-11-11', now, now],
    });
    const insertedUser = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, 'user-default-streak'))
      .get();
    expect(insertedUser?.streakCount).toBe(0);

    // Grab a seeded card and create both a per-user override and a custom user card
    const seededCard = await db.select().from(schema.flashcards).limit(1).get();
    expect(seededCard).toBeDefined();
    expect(seededCard?.userId).toBeNull();

    const overrideId = `user-default-streak::${seededCard!.id}`;
    await db
      .insert(schema.flashcards)
      .values({
        id: overrideId,
        deckId: seededCard!.deckId,
        userId: 'user-default-streak',
        frontMarkdown: seededCard!.frontMarkdown,
        backMarkdown: seededCard!.backMarkdown,
        tagsJson: seededCard!.tagsJson,
        easeFactor: 2.9,
        intervalDays: 14,
        repetitions: 3,
        dueAt: now + 86_400_000,
      })
      .run();

    await db
      .insert(schema.flashcards)
      .values({
        id: 'card-custom-user-1',
        deckId: seededCard!.deckId,
        userId: 'user-default-streak',
        frontMarkdown: 'Custom User Prompt',
        backMarkdown: 'Custom User Answer',
        tagsJson: JSON.stringify(['Custom']),
        easeFactor: 2.75,
        intervalDays: 7,
        repetitions: 2,
        dueAt: now + 43_200_000,
      })
      .run();

    // Mutate seeded card text directly to verify ensureSeeded(true) upserts seeded content
    await db
      .update(schema.flashcards)
      .set({ frontMarkdown: 'Stale Seeded Prompt' })
      .where(eq(schema.flashcards.id, seededCard!.id))
      .run();

    const reseeded = await ensureSeeded(true);
    expect(reseeded.subjectsCount).toBe(6);
    expect(reseeded.flashcardsCount).toBeGreaterThan(0);

    const refreshedSeeded = await db
      .select()
      .from(schema.flashcards)
      .where(eq(schema.flashcards.id, seededCard!.id))
      .get();
    expect(refreshedSeeded?.frontMarkdown).toBe(seededCard!.frontMarkdown);
    expect(refreshedSeeded?.userId).toBeNull();

    const preservedOverride = await db
      .select()
      .from(schema.flashcards)
      .where(eq(schema.flashcards.id, overrideId))
      .get();
    expect(preservedOverride?.userId).toBe('user-default-streak');
    expect(preservedOverride?.easeFactor).toBe(2.9);
    expect(preservedOverride?.intervalDays).toBe(14);
    expect(preservedOverride?.repetitions).toBe(3);

    const preservedCustom = await db
      .select()
      .from(schema.flashcards)
      .where(eq(schema.flashcards.id, 'card-custom-user-1'))
      .get();
    expect(preservedCustom?.userId).toBe('user-default-streak');
    expect(preservedCustom?.frontMarkdown).toBe('Custom User Prompt');
    expect(preservedCustom?.easeFactor).toBe(2.75);
  });

  it('maintains strict parity between schema.ts (18 tables, columns, defaults, FKs) and BOOTSTRAP_SQL (tables + 16 indexes)', async () => {
    const tempDir = makeTempDir('sr-db-parity-');
    process.env.SIMPLE_REVISION_DB_PATH = path.join(tempDir, 'parity.db');

    await ensureDbReady();
    const client = getLibsqlClient();

    const indexResult = await client.execute(
      "SELECT name FROM sqlite_master WHERE type='index' AND name LIKE 'idx_%'"
    );
    const indexNames = indexResult.rows.map((row) => String(row.name));
    expect(indexNames).toHaveLength(ALL_16_INDEXES.length);
    for (const expectedIndex of ALL_16_INDEXES) {
      expect(indexNames).toContain(expectedIndex);
    }

    const schemaTables = Object.values(schema) as SQLiteTable[];
    expect(schemaTables).toHaveLength(ALL_18_TABLES.length);

    for (const table of schemaTables) {
      const cfg = getTableConfig(table);
      expect(ALL_18_TABLES).toContain(cfg.name);

      const pragmaCols = await client.execute(`PRAGMA table_info(${cfg.name})`);
      const actualCols = pragmaCols.rows.map((row) => ({
        name: String(row.name),
        type: String(row.type).toUpperCase(),
        notnull: Number(row.notnull) === 1,
        pk: Number(row.pk) > 0,
        dfltValue: row.dflt_value === null ? null : String(row.dflt_value),
      }));

      expect(actualCols.map((c) => c.name)).toEqual(cfg.columns.map((c) => c.name));

      for (const col of cfg.columns) {
        const actual = actualCols.find((c) => c.name === col.name);
        expect(actual).toBeDefined();
        expect(actual!.type).toBe(col.getSQLType().toUpperCase());
        if (!col.primary) {
          expect(actual!.notnull).toBe(col.notNull);
        }
        expect(actual!.pk).toBe(col.primary);

        const expectedDefault = !col.hasDefault
          ? null
          : typeof col.default === 'string'
            ? `'${col.default}'`
            : String(col.default);
        expect(actual!.dfltValue).toBe(expectedDefault);
      }

      const pragmaFks = await client.execute(`PRAGMA foreign_key_list(${cfg.name})`);
      const actualFks = pragmaFks.rows
        .map((row) => ({
          from: String(row.from),
          table: String(row.table),
          to: String(row.to),
          onDelete: String(row.on_delete).toLowerCase(),
        }))
        .sort((a, b) => `${a.from}:${a.table}`.localeCompare(`${b.from}:${b.table}`));

      const expectedFks = cfg.foreignKeys
        .map((fk) => {
          const ref = fk.reference();
          return {
            from: ref.columns[0].name,
            table: getTableConfig(ref.foreignTable).name,
            to: ref.foreignColumns[0].name,
            onDelete: (fk.onDelete ?? 'no action').toLowerCase(),
          };
        })
        .sort((a, b) => `${a.from}:${a.table}`.localeCompare(`${b.from}:${b.table}`));

      expect(actualFks).toEqual(expectedFks);
    }
  });

  it('enables WAL mode, enforces foreign keys across concurrent queries, and cascades user deletion', async () => {
    const tempDir = makeTempDir('sr-db-wal-fk-');
    process.env.SIMPLE_REVISION_DB_PATH = path.join(tempDir, 'wal-fk.db');

    await ensureSeeded();
    const client = getLibsqlClient();

    const walRes = await client.execute('PRAGMA journal_mode');
    expect(String(walRes.rows[0]?.journal_mode).toLowerCase()).toBe('wal');

    // Run concurrent queries to verify single-connection local pool keeps foreign_keys=ON
    const fkChecks = await Promise.all([
      client.execute('PRAGMA foreign_keys'),
      client.execute('PRAGMA foreign_keys'),
      client.execute('PRAGMA foreign_keys'),
    ]);
    for (const res of fkChecks) {
      expect(Number(res.rows[0]?.foreign_keys)).toBe(1);
    }

    const now = Date.now();
    await expect(
      db
        .insert(schema.notes)
        .values({
          id: 'orphan-note',
          userId: 'nonexistent-user',
          subjectSlug: 'bio',
          topicId: null,
          title: 'Orphan',
          contentMarkdown: 'Should fail FK',
          excerpt: 'Should fail FK',
          isPinned: 0,
          updatedAt: now,
        })
        .run()
    ).rejects.toThrow();

    await db
      .insert(schema.users)
      .values({
        id: 'user-cascade-1',
        email: 'cascade@example.com',
        name: 'Cascade Test',
        passwordHash: 'hash',
        lastActiveDate: '2026-11-11',
        createdAt: now,
        updatedAt: now,
      })
      .run();

    await db
      .insert(schema.sessions)
      .values({ id: 'sess-cascade-1', userId: 'user-cascade-1', expiresAt: now + 60_000 })
      .run();
    await db
      .insert(schema.notifications)
      .values({
        id: 'notif-cascade-1',
        userId: 'user-cascade-1',
        title: 'Welcome',
        body: 'Hello',
        href: '/settings',
        createdAt: now,
      })
      .run();
    await db
      .insert(schema.bookmarks)
      .values({
        id: 'bm-cascade-1',
        userId: 'user-cascade-1',
        subjectSlug: 'chem',
        itemType: 'tool',
        itemId: 'data-booklet',
        title: 'Data Booklet',
        subtitle: 'Chem SL',
        href: '/tools/data-booklet',
        createdAt: now,
      })
      .run();

    await db.delete(schema.users).where(eq(schema.users.id, 'user-cascade-1')).run();

    const [remainingSessions, remainingNotifs, remainingBookmarks] = await Promise.all([
      db.select().from(schema.sessions).where(eq(schema.sessions.userId, 'user-cascade-1')).all(),
      db.select().from(schema.notifications).where(eq(schema.notifications.userId, 'user-cascade-1')).all(),
      db.select().from(schema.bookmarks).where(eq(schema.bookmarks.userId, 'user-cascade-1')).all(),
    ]);
    expect(remainingSessions).toHaveLength(0);
    expect(remainingNotifs).toHaveLength(0);
    expect(remainingBookmarks).toHaveLength(0);
  });

  it('copies bundled DB to /tmp on VERCEL=1 when missing and skips copy when already present', () => {
    process.env.VERCEL = '1';
    const bundledPath = path.join(process.cwd(), 'data', 'simple-revision.db');
    const tmpPath = '/tmp/simple-revision.db';

    const existsSpy = vi.spyOn(fs, 'existsSync').mockImplementation((target) => {
      if (target === tmpPath) return false;
      if (target === bundledPath) return true;
      return false;
    });
    const copySpy = vi.spyOn(fs, 'copyFileSync').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const first = resolveLibsqlConfig();
    expect(first).toEqual({ url: `file:${tmpPath}`, timeout: 5000 });
    expect(copySpy).toHaveBeenCalledTimes(1);
    expect(copySpy).toHaveBeenCalledWith(bundledPath, tmpPath);

    existsSpy.mockImplementation((target) => target === tmpPath || target === bundledPath);
    const second = resolveLibsqlConfig();
    expect(second).toEqual({ url: `file:${tmpPath}`, timeout: 5000 });
    expect(copySpy).toHaveBeenCalledTimes(1);
  });

  it('coalesces concurrent ensureSeeded calls, seeds Stage 2 drop-in questions, and preserves FK-linked user data on force reseed', async () => {
    const tempDir = makeTempDir('sr-db-seed-concurrency-');
    process.env.SIMPLE_REVISION_DB_PATH = path.join(tempDir, 'seed-concurrent.db');

    const [s1, s2, s3] = await Promise.all([
      ensureSeeded(false),
      ensureSeeded(true),
      ensureSeeded(false),
    ]);
    expect(s1.subjectsCount).toBe(6);
    expect(s2.subjectsCount).toBe(6);
    expect(s3.subjectsCount).toBe(6);

    // Stage 2 drop-in question from content/questions/custom-pack-example.json
    const customQuestion = await db
      .select()
      .from(schema.questions)
      .where(eq(schema.questions.id, 'chem-custom-q099'))
      .get();
    expect(customQuestion).toBeDefined();
    expect(customQuestion?.subjectSlug).toBe('chem');

    // Fresh cache on already-seeded DB takes fast-path without rewriting
    resetSeedCacheForTests();
    const fastSummary = await ensureSeeded(false);
    expect(fastSummary).toEqual({
      subjectsCount: 6,
      topicsCount: 0,
      questionsCount: 0,
      referenceCount: 0,
      flashcardsCount: 0,
    });

    // Attach user FK child rows referencing seeded subjects/topics/questions
    const topic = await db.select().from(schema.syllabusTopics).limit(1).get();
    const question = await db.select().from(schema.questions).limit(1).get();
    expect(topic).toBeDefined();
    expect(question).toBeDefined();

    const now = Date.now();
    await db
      .insert(schema.users)
      .values({
        id: 'user-reseed-preserve',
        email: 'preserve@example.com',
        name: 'Preserve User',
        passwordHash: 'hash',
        lastActiveDate: '2026-11-11',
        createdAt: now,
        updatedAt: now,
      })
      .run();

    await db
      .insert(schema.topicProgress)
      .values({
        id: 'tp-preserve-1',
        userId: 'user-reseed-preserve',
        topicId: topic!.id,
        status: 'confident',
        updatedAt: now,
      })
      .run();

    await db
      .insert(schema.questionAttempts)
      .values({
        id: 'qa-preserve-1',
        userId: 'user-reseed-preserve',
        questionId: question!.id,
        userAnswer: 'Answer',
        awardedMarks: 2,
        maxMarks: question!.marks,
        matchedPointsJson: '[]',
        missedPointsJson: '[]',
        createdAt: now,
      })
      .run();

    await db
      .insert(schema.mistakesLog)
      .values({
        id: 'ml-preserve-1',
        userId: 'user-reseed-preserve',
        questionId: question!.id,
        userAnswer: 'Wrong',
        missedConceptsJson: '["Concept"]',
        createdAt: now,
      })
      .run();

    await db
      .insert(schema.notes)
      .values({
        id: 'note-preserve-1',
        userId: 'user-reseed-preserve',
        subjectSlug: topic!.subjectSlug,
        topicId: topic!.id,
        title: 'Keep Note',
        contentMarkdown: 'Body',
        excerpt: 'Body',
        updatedAt: now,
      })
      .run();

    await ensureSeeded(true);

    const [tp, qa, ml, note] = await Promise.all([
      db.select().from(schema.topicProgress).where(eq(schema.topicProgress.userId, 'user-reseed-preserve')).all(),
      db.select().from(schema.questionAttempts).where(eq(schema.questionAttempts.userId, 'user-reseed-preserve')).all(),
      db.select().from(schema.mistakesLog).where(eq(schema.mistakesLog.userId, 'user-reseed-preserve')).all(),
      db.select().from(schema.notes).where(eq(schema.notes.userId, 'user-reseed-preserve')).all(),
    ]);
    expect(tp).toHaveLength(1);
    expect(qa).toHaveLength(1);
    expect(ml).toHaveLength(1);
    expect(note).toHaveLength(1);
  });

  it('migrates legacy questions table missing subtopic_code and diagram_spec_json columns idempotently', async () => {
    const tempDir = makeTempDir('sr-db-legacy-migrate-');
    const legacyDbPath = path.join(tempDir, 'legacy.db');
    process.env.SIMPLE_REVISION_DB_PATH = legacyDbPath;

    const rawClient = getLibsqlClient();
    await rawClient.executeMultiple(`
      CREATE TABLE subjects (
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
      CREATE TABLE syllabus_topics (
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
      CREATE TABLE questions (
        id TEXT PRIMARY KEY,
        subject_slug TEXT NOT NULL REFERENCES subjects(slug) ON DELETE CASCADE,
        topic_id TEXT NOT NULL REFERENCES syllabus_topics(id) ON DELETE CASCADE,
        paper TEXT NOT NULL,
        question_type TEXT NOT NULL,
        calculator_policy TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        marks INTEGER NOT NULL,
        command_term TEXT NOT NULL,
        stem_markdown TEXT NOT NULL,
        stimulus_markdown TEXT,
        options_json TEXT,
        correct_option_id TEXT,
        markscheme_points_json TEXT NOT NULL,
        walkthrough_steps_json TEXT NOT NULL,
        common_pitfalls_json TEXT NOT NULL,
        is_daily_eligible INTEGER NOT NULL DEFAULT 1
      );
    `);

    await ensureDbReady();
    const cols = await rawClient.execute('PRAGMA table_info(questions)');
    const colNames = cols.rows.map((r) => String(r.name));
    expect(colNames).toContain('subtopic_code');
    expect(colNames).toContain('diagram_spec_json');
  });
});
