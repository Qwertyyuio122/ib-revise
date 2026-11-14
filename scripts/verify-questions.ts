import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import zlib from 'zlib';
import type { PipelineManifest } from './pipeline/types';
import {
  normalizeQuestionFingerprint,
  validateGeneratedQuestion,
} from './pipeline/validators';

async function main() {
  const genDir = path.join(
    process.cwd(),
    'content',
    'questions',
    'generated'
  );
  const manifestPath = path.join(genDir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Missing manifest at ${manifestPath}`);
  }

  const manifest = JSON.parse(
    fs.readFileSync(manifestPath, 'utf-8')
  ) as PipelineManifest;

  const seenIds = new Set<string>();
  const seenFingerprints = new Set<string>();
  let totalVerified = 0;
  let totalDiagrams = 0;
  const failures: Array<{ id: string; reason: string }> = [];

  for (const shard of manifest.shards) {
    const fullPath = path.join(genDir, shard.file);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Missing shard file: ${shard.file}`);
    }
    const buf = fs.readFileSync(fullPath);
    const sha = crypto.createHash('sha256').update(buf).digest('hex');
    if (sha !== shard.sha256) {
      throw new Error(`Checksum mismatch on ${shard.file}`);
    }

    let shardCount = 0;
    const rl = readline.createInterface({
      input: fs.createReadStream(fullPath).pipe(zlib.createGunzip()),
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const raw = JSON.parse(trimmed);
      const res = validateGeneratedQuestion(raw);
      if (!res.ok) {
        failures.push({ id: String(raw?.id ?? 'unknown'), reason: res.reason });
        continue;
      }
      const q = res.data;
      if (seenIds.has(q.id)) {
        failures.push({ id: q.id, reason: 'Duplicate question id' });
        continue;
      }
      const fp = normalizeQuestionFingerprint(q);
      if (seenFingerprints.has(fp)) {
        failures.push({ id: q.id, reason: 'Duplicate question fingerprint' });
        continue;
      }
      seenIds.add(q.id);
      seenFingerprints.add(fp);
      shardCount++;
      totalVerified++;
      if (q.diagramSpec) totalDiagrams++;
    }

    if (shardCount !== shard.count) {
      throw new Error(
        `Shard ${shard.file} expected ${shard.count} questions, found ${shardCount}`
      );
    }
  }

  if (failures.length > 0) {
    console.error('[Verify] Sample failures:', failures.slice(0, 10));
    throw new Error(`Verification failed for ${failures.length} questions.`);
  }

  if (totalVerified !== manifest.totalQuestions) {
    throw new Error(
      `Total verified ${totalVerified} !== manifest.totalQuestions ${manifest.totalQuestions}`
    );
  }

  console.log(
    `[Verify] PASSED: ${totalVerified} questions verified (0 duplicates, 0 schema/KaTeX/quarantine failures, ${totalDiagrams} interactive Math diagrams).`
  );
}

main().catch((err) => {
  console.error('[Verify] Failed:', err);
  process.exit(1);
});
