import { z } from 'zod';

export const OriginalitySignalSchema = z.object({
  riskPercent: z.number().min(0).max(100),
  label: z.enum(['Low', 'Moderate', 'Elevated']),
  metrics: z.array(
    z.object({
      name: z.string(),
      value: z.string(),
      status: z.enum(['good', 'watch', 'alert']),
      note: z.string(),
    })
  ),
  flaggedPassages: z.array(
    z.object({
      excerpt: z.string(),
      reason: z.string(),
      suggestion: z.string(),
    })
  ),
  advisoryNote: z.string(),
});

export type OriginalitySignal = z.infer<typeof OriginalitySignalSchema>;

export function analyzeOriginalityHeuristic(text: string): OriginalitySignal {
  const clean = text.trim();
  const words = clean.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const sentences = clean
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const sentenceLengths = sentences.map((s) => s.split(/\s+/).length);
  const avgLen =
    sentenceLengths.length > 0
      ? sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length
      : 16;

  const variance =
    sentenceLengths.length > 1
      ? sentenceLengths.reduce((acc, l) => acc + Math.pow(l - avgLen, 2), 0) /
        sentenceLengths.length
      : 25;
  const stdDev = Math.sqrt(variance);
  const burstiness = avgLen > 0 ? Number((stdDev / avgLen).toFixed(2)) : 0.42;

  const lowerWords = words.map((w) => w.toLowerCase().replace(/[^a-z0-9àâçéèêëîïôûùüÿñæœ]/g, '')).filter(Boolean);
  const uniqueWords = new Set(lowerWords);
  const lexicalDiversity =
    lowerWords.length > 0
      ? Math.round((uniqueWords.size / lowerWords.length) * 100)
      : 68;

  const genericTransitions = [
    'furthermore',
    'moreover',
    'in conclusion',
    'it is important to note',
    'delve into',
    'tapestry',
    'testament to',
    'plays a crucial role',
  ];
  const lowerText = clean.toLowerCase();
  const matchedCliches = genericTransitions.filter((phrase) =>
    lowerText.includes(phrase)
  );

  let riskPercent = 11;
  if (burstiness < 0.15) riskPercent += 14;
  if (lexicalDiversity < 42) riskPercent += 14;
  riskPercent += matchedCliches.length * 10;
  riskPercent = Math.max(6, Math.min(88, riskPercent));

  const label: 'Low' | 'Moderate' | 'Elevated' =
    riskPercent < 25 ? 'Low' : riskPercent < 55 ? 'Moderate' : 'Elevated';

  const flaggedPassages = sentences
    .filter((s) =>
      genericTransitions.some((phrase) => s.toLowerCase().includes(phrase))
    )
    .slice(0, 3)
    .map((s) => ({
      excerpt: s,
      reason: 'Contains formulaic transition phrasing frequently flagged by stylistic detectors.',
      suggestion:
        'Anchor the transition directly in specific IB evidence, data values, or named historiography.',
    }));

  return {
    riskPercent,
    label,
    metrics: [
      {
        name: 'Sentence Length Burstiness',
        value: `${burstiness} CV (${Math.round(avgLen)}w avg)`,
        status: burstiness >= 0.3 ? 'good' : 'watch',
        note:
          burstiness >= 0.3
            ? 'Natural human variation between short analytical claims and longer evidence clauses.'
            : 'Sentence lengths are unusually uniform; vary clause structure.',
      },
      {
        name: 'Lexical Type-Token Diversity',
        value: `${lexicalDiversity}% (${wordCount} words)`,
        status: lexicalDiversity >= 48 ? 'good' : 'watch',
        note: 'Measures vocabulary specificity across your draft.',
      },
      {
        name: 'Formulaic AI Phrase Density',
        value:
          matchedCliches.length === 0
            ? '0 clichés detected'
            : `${matchedCliches.length} stock phrase(s)`,
        status: matchedCliches.length === 0 ? 'good' : 'alert',
        note:
          matchedCliches.length === 0
            ? 'No stock LLM filler phrases found.'
            : `Replace generic phrases (${matchedCliches.join(', ')}) with direct disciplinary terms.`,
      },
    ],
    flaggedPassages,
    advisoryNote:
      'Advisory Writing & Originality Signal: This breakdown analyzes stylistic burstiness, lexical diversity, and stock phrasing to help you strengthen authentic academic voice. It is an advisory revision aid, not definitive proof of AI generation or plagiarism.',
  };
}
