import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import type { QuestionItem, SubjectSlug } from '../../src/content/schemas';
import { ORDERED_SUBJECT_SLUGS } from './blueprints';
import type { PipelineManifest } from './types';

const SHARD_SIZE = 2500;

export function writeShardedQuestionPacks(
  questionsBySubject: Record<SubjectSlug, QuestionItem[]>,
  mode: 'hybrid' | 'gemini-only',
  outDir = path.join(process.cwd(), 'content', 'questions', 'generated')
): PipelineManifest {
  if (fs.existsSync(outDir)) {
    for (const f of fs.readdirSync(outDir)) {
      if (f.endsWith('.jsonl.gz') || f.endsWith('.jsonl') || f === 'manifest.json') {
        fs.unlinkSync(path.join(outDir, f));
      }
    }
  } else {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const shards: PipelineManifest['shards'] = [];
  const countsBySubject = {} as Record<SubjectSlug, number>;
  const diagramsBySubject = {} as Record<SubjectSlug, number>;
  let totalQuestions = 0;
  let totalDiagrams = 0;

  for (const slug of ORDERED_SUBJECT_SLUGS) {
    const list = questionsBySubject[slug] ?? [];
    countsBySubject[slug] = list.length;
    let subjDiagrams = 0;

    for (let start = 0, part = 1; start < list.length; start += SHARD_SIZE, part++) {
      const slice = list.slice(start, start + SHARD_SIZE);
      const ndjson = slice.map((item) => JSON.stringify(item)).join('\n') + '\n';
      const gzBuffer = zlib.gzipSync(Buffer.from(ndjson, 'utf-8'), { level: 9 });
      const fileName = `${slug}-${String(part).padStart(3, '0')}.jsonl.gz`;
      const fullPath = path.join(outDir, fileName);
      fs.writeFileSync(fullPath, gzBuffer);

      const sha256 = crypto.createHash('sha256').update(gzBuffer).digest('hex');
      const diagCount = slice.filter((q) => Boolean(q.diagramSpec)).length;
      subjDiagrams += diagCount;

      shards.push({
        file: fileName,
        subjectSlug: slug,
        count: slice.length,
        diagramCount: diagCount,
        sha256,
      });
    }

    diagramsBySubject[slug] = subjDiagrams;
    totalQuestions += list.length;
    totalDiagrams += subjDiagrams;
  }

  const manifest: PipelineManifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    mode,
    totalQuestions,
    totalDiagrams,
    countsBySubject,
    diagramsBySubject,
    shards,
  };

  fs.writeFileSync(
    path.join(outDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n',
    'utf-8'
  );
  return manifest;
}
