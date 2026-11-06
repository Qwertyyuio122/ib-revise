/**
 * Phase 3: High-Volume 30,000+ Question Batch Ingestion Pipeline
 *
 * Usage:
 *   npx tsx scripts/seed-questions.ts ./path/to/questions-export.json
 *
 * Reads structured IB question JSON files and upserts them into Supabase
 * (`public.questions`) in chunked batches of 1,000 rows to prevent memory spikes
 * or statement timeouts.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

interface RawQuestionRecord {
  id?: string;
  subject_id: string;
  topic_id: string;
  paper_number: 1 | 2 | 3;
  session: string;
  prompt_text: string;
  mark_value: number;
  command_term: string;
  official_markscheme_text: string;
  question_type: 'ESSAY' | 'SHORT_ANSWER' | 'MCQ' | 'CALCULATION';
  mcq_options?: string[] | null;
  diagram_url?: string | null;
  difficulty?: number;
  difficulty_tier?: 'FOUNDATION' | 'STANDARD' | 'CHALLENGER';
}

const BATCH_SIZE = 1000;

async function runBatchSeed() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.'
    );
    process.exit(1);
  }

  const inputFilePath = process.argv[2];
  if (!inputFilePath) {
    console.log(
      'Usage: npx tsx scripts/seed-questions.ts <path-to-questions.json>'
    );
    console.log(
      'No external JSON specified — skipping bulk 30,000 question import (sample data is already seeded).'
    );
    return;
  }

  const resolvedPath = path.resolve(process.cwd(), inputFilePath);
  const rawContent = fs.readFileSync(resolvedPath, 'utf-8');
  const records: RawQuestionRecord[] = JSON.parse(rawContent);

  console.log(
    `Loaded ${records.length.toLocaleString()} questions from ${path.basename(
      resolvedPath
    )}. Starting ${BATCH_SIZE}-row chunked ingestion...`
  );

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  let insertedCount = 0;
  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from('questions').upsert(batch);

    if (error) {
      console.error(
        `Batch failed at offset ${i}: ${error.message}`
      );
      process.exit(1);
    }

    insertedCount += batch.length;
    console.log(
      `Upserted ${insertedCount.toLocaleString()} / ${records.length.toLocaleString()} questions`
    );
  }

  console.log('Batch ingestion complete.');
}

runBatchSeed().catch((err) => {
  console.error(err);
  process.exit(1);
});
