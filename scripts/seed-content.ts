import fs from 'fs';
import path from 'path';
import { ensureDbReady, getLibsqlClient } from '../src/db';
import { ensureSeeded } from '../src/db/seed';
import { ALL_SUBJECT_PACKS } from '../src/content';

function getExpectedGeneratedCount(): number {
  const manifestPath = path.join(
    process.cwd(),
    'content',
    'questions',
    'generated',
    'manifest.json'
  );
  if (!fs.existsSync(manifestPath)) return 0;
  try {
    const raw = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    return typeof raw?.totalQuestions === 'number' ? raw.totalQuestions : 0;
  } catch {
    return 0;
  }
}

async function main() {
  const forceFlag = process.argv.includes('--force');
  await ensureDbReady();
  const client = getLibsqlClient();

  if (!forceFlag) {
    const expectedCore = ALL_SUBJECT_PACKS.reduce(
      (sum, pack) => sum + pack.questions.length,
      0
    );
    const expectedGenerated = getExpectedGeneratedCount();
    const minExpectedQuestions = expectedCore + expectedGenerated;

    try {
      const [subCountRes, qCountRes, diagRes] = await Promise.all([
        client.execute('SELECT COUNT(*) AS c FROM subjects'),
        client.execute('SELECT COUNT(*) AS c FROM questions'),
        client.execute(
          "SELECT COUNT(*) AS c FROM questions WHERE subject_slug = 'math' AND diagram_spec_json IS NOT NULL"
        ),
      ]);
      const existingSubjects = Number(subCountRes.rows[0]?.c ?? 0);
      const existingQuestions = Number(qCountRes.rows[0]?.c ?? 0);
      const existingDiagrams = Number(diagRes.rows[0]?.c ?? 0);
      const needsDiagrams = expectedGenerated > 0 && existingDiagrams === 0;

      if (
        existingSubjects === 6 &&
        existingQuestions >= minExpectedQuestions &&
        !needsDiagrams
      ) {
        console.log(
          `[Simple Revision Seed] Database already up-to-date (${existingSubjects} subjects, ${existingQuestions} questions, ${existingDiagrams} math diagrams). Pass --force to re-upsert.`
        );
        return;
      }
    } catch {
      // Fall through to full seed if pre-check query fails
    }
  }

  const summary = await ensureSeeded(true);
  try {
    await client.execute('PRAGMA wal_checkpoint(TRUNCATE)');
  } catch {
    // Ignore on remote Turso or in-memory databases
  }
  console.log(
    `[Simple Revision Seed] Seeded ${summary.subjectsCount} subjects, ${summary.topicsCount} syllabus topics, ${summary.questionsCount} questions, ${summary.referenceCount} reference items, and ${summary.flashcardsCount} flashcards.`
  );
}

main()
  .then(() => {
    try {
      getLibsqlClient().close();
    } catch {
      // Ignore client close errors on script exit
    }
    process.exit(0);
  })
  .catch((err) => {
    console.error('[Simple Revision Seed] Failed to seed content:', err);
    try {
      getLibsqlClient().close();
    } catch {
      // Ignore client close errors on script exit
    }
    process.exit(1);
  });
