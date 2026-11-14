import type { QuestionItem } from '../../../src/content/schemas';

export class SeededRng {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0 || 1;
  }

  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  pick<T>(arr: readonly T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }

  pickWeighted<T>(items: ReadonlyArray<{ item: T; weight: number }>): T {
    const total = items.reduce((s, x) => s + x.weight, 0);
    let r = this.next() * total;
    for (const x of items) {
      r -= x.weight;
      if (r <= 0) return x.item;
    }
    return items[items.length - 1].item;
  }

  shuffle<T>(arr: readonly T[]): T[] {
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function simplifyFraction(num: number, den: number): [number, number] {
  if (den < 0) {
    num = -num;
    den = -den;
  }
  const g = gcd(num, den);
  return [num / g, den / g];
}

export function formatFracLatex(num: number, den: number): string {
  const [n, d] = simplifyFraction(num, den);
  if (d === 1) return `${n}`;
  const sign = n < 0 ? '-' : '';
  return `${sign}\\frac{${Math.abs(n)}}{${d}}`;
}

export function roundSigFigs(value: number, sigFigs = 3): string {
  if (value === 0) return '0';
  const rounded = Number(value.toPrecision(sigFigs));
  return String(rounded);
}

export function buildMcqOptions(
  rng: SeededRng,
  correctText: string,
  distractorCandidates: string[]
): {
  options: Array<{ id: 'A' | 'B' | 'C' | 'D'; text: string }>;
  correctOptionId: 'A' | 'B' | 'C' | 'D';
} {
  const seen = new Set<string>([correctText.trim().toLowerCase()]);
  const distractors: string[] = [];
  for (const cand of distractorCandidates) {
    const norm = cand.trim().toLowerCase();
    if (!norm || seen.has(norm)) continue;
    seen.add(norm);
    distractors.push(cand.trim());
    if (distractors.length === 3) break;
  }
  let guard = 1;
  while (distractors.length < 3) {
    const fallback = `${correctText} (${guard++})`;
    const norm = fallback.toLowerCase();
    if (!seen.has(norm)) {
      seen.add(norm);
      distractors.push(fallback);
    }
  }

  const tagged = rng.shuffle([
    { text: correctText.trim(), isCorrect: true },
    ...distractors.map((text) => ({ text, isCorrect: false })),
  ]);
  const ids: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D'];
  let correctOptionId: 'A' | 'B' | 'C' | 'D' = 'A';
  const options = tagged.map((entry, idx) => {
    const id = ids[idx];
    if (entry.isCorrect) correctOptionId = id;
    return { id, text: entry.text };
  });
  return { options, correctOptionId };
}

export function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const y =
    1 -
    (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) *
      t +
      0.254829592) *
      t) *
      Math.exp(-ax * ax);
  return sign * y;
}

export function normalCdf(x: number, mean = 0, sd = 1): number {
  return 0.5 * (1 + erf((x - mean) / (sd * Math.SQRT2)));
}

export function nCr(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  let res = 1;
  const k = Math.min(r, n - r);
  for (let i = 1; i <= k; i++) {
    res = (res * (n - k + i)) / i;
  }
  return Math.round(res);
}

export function binomialPmf(n: number, k: number, p: number): number {
  return nCr(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

export function signedTerm(coeff: number, varPart: string, isFirst = false): string {
  if (coeff === 0) return '';
  const abs = Math.abs(coeff);
  const mag = abs === 1 && varPart ? varPart : `${abs}${varPart}`;
  if (isFirst) return coeff < 0 ? `-${mag}` : mag;
  return coeff < 0 ? ` - ${mag}` : ` + ${mag}`;
}

export function makeId(prefix: string, index: number): string {
  return `${prefix}-${String(index).padStart(5, '0')}`;
}

export type GeneratorFn = (count: number, seed?: number) => QuestionItem[];
