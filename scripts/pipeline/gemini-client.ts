import fs from 'fs';
import path from 'path';
import { GoogleGenAI, type Schema } from '@google/genai';

const MODEL_POOL = [
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-flash-lite-latest',
] as const;

export function loadGeminiApiKey(): string | null {
  if (process.env.GEMINI_API_KEY?.trim()) {
    return process.env.GEMINI_API_KEY.trim();
  }
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return null;
  const line = fs
    .readFileSync(envPath, 'utf-8')
    .split('\n')
    .find((l) => l.startsWith('GEMINI_API_KEY='));
  if (!line) return null;
  const val = line
    .slice('GEMINI_API_KEY='.length)
    .trim()
    .replace(/^['"]|['"]$/g, '');
  return val || null;
}

/**
 * Repairs unescaped single backslashes inside JSON strings produced by LLMs
 * emitting LaTeX commands like \frac, \text, \circ, \sin, \right, \Delta.
 */
export function repairJsonBackslashes(raw: string): string {
  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  // Replace backslashes that are NOT valid JSON escapes (\", \\, \/, \b, \f, \n, \r, \t, \uXXXX)
  // OR common LaTeX tokens (\text, \theta, \times, \frac, \beta, \binom, \nu, \neq, \rho, \right)
  let out = cleaned.replace(
    /\\(?!["\\/]|u[0-9a-fA-F]{4}|(?:n(?![a-zA-Z])|r(?![a-zA-Z])|t(?![a-zA-Z])|b(?![a-zA-Z])|f(?![a-zA-Z])))/g,
    '\\\\'
  );
  // Also repair common LaTeX words whose first letter collided with \t, \f, \b, \r, \n
  out = out.replace(
    /(?<!\\)\\(text|times|tan|theta|to|tau|frac|forall|beta|binom|bar|right|rho|neq|nu|nabla|natural)/g,
    '\\\\$1'
  );
  return out;
}

export async function generateStructuredWithGemini<T>(options: {
  prompt: string;
  responseSchema: Schema;
  apiKey?: string | null;
  maxRetries?: number;
}): Promise<{ ok: true; data: T; model: string } | { ok: false; reason: string; quotaExhausted: boolean }> {
  const key = options.apiKey ?? loadGeminiApiKey();
  if (!key) {
    return {
      ok: false,
      reason: 'Missing GEMINI_API_KEY',
      quotaExhausted: false,
    };
  }

  const ai = new GoogleGenAI({ apiKey: key });
  const maxRetries = options.maxRetries ?? MODEL_POOL.length;
  let allQuotaExhausted = true;
  let lastReason = 'No Gemini models attempted';

  for (let i = 0; i < Math.min(maxRetries, MODEL_POOL.length); i++) {
    const model = MODEL_POOL[i];
    try {
      const res = await ai.models.generateContent({
        model,
        contents: options.prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: options.responseSchema,
          httpOptions: { timeout: 35_000 },
        },
      });
      const text = res.text ?? '';
      let parsed: T;
      try {
        parsed = JSON.parse(text) as T;
      } catch {
        parsed = JSON.parse(repairJsonBackslashes(text)) as T;
      }
      return { ok: true, data: parsed, model };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      lastReason = `${model}: ${msg.slice(0, 140)}`;
      const isQuota =
        msg.includes('429') ||
        msg.includes('RESOURCE_EXHAUSTED') ||
        msg.includes('FreeTier');
      if (!isQuota) {
        allQuotaExhausted = false;
      }
    }
  }

  return {
    ok: false,
    reason: lastReason,
    quotaExhausted: allQuotaExhausted,
  };
}
