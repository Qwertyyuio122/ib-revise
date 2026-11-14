import fs from 'fs';
import path from 'path';
import { Type, type Schema } from '@google/genai';
import type { QuestionItem, SubjectSlug } from '../../src/content/schemas';
import { SUBJECT_QUOTAS } from './blueprints';
import { generateStructuredWithGemini } from './gemini-client';
import { validateGeneratedQuestion } from './validators';

const QUESTION_BATCH_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          topicId: { type: Type.STRING },
          subtopicCode: { type: Type.STRING },
          paper: { type: Type.STRING },
          questionType: { type: Type.STRING },
          calculatorPolicy: { type: Type.STRING },
          difficulty: { type: Type.STRING },
          marks: { type: Type.INTEGER },
          commandTerm: { type: Type.STRING },
          stimulusMarkdown: { type: Type.STRING },
          stemMarkdown: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                text: { type: Type.STRING },
              },
              required: ['id', 'text'],
            },
          },
          correctOptionId: { type: Type.STRING },
          markschemePoints: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                pointId: { type: Type.STRING },
                requirement: { type: Type.STRING },
                marks: { type: Type.INTEGER },
                notes: { type: Type.STRING },
              },
              required: ['pointId', 'requirement', 'marks'],
            },
          },
          walkthroughSteps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stepNumber: { type: Type.INTEGER },
                title: { type: Type.STRING },
                explanationMarkdown: { type: Type.STRING },
              },
              required: ['stepNumber', 'title', 'explanationMarkdown'],
            },
          },
          commonPitfalls: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: [
          'topicId',
          'paper',
          'questionType',
          'calculatorPolicy',
          'difficulty',
          'marks',
          'commandTerm',
          'stemMarkdown',
          'markschemePoints',
          'walkthroughSteps',
          'commonPitfalls',
        ],
      },
    },
  },
  required: ['questions'],
};

const SUBJECT_INSTRUCTIONS: Record<SubjectSlug, string> = {
  fr: 'Generate authentic IB French B SL (2020) Paper 2 reading comprehension MCQs with rich 4-sentence Francophone cultural passages (Montréal, Dakar, Bruxelles, Genève, Paris) across Themes 1-5 and Paper 1 register/grammar.',
  bio: 'Generate IB Biology HL (2025) Paper 1B experimental data-analysis and Paper 2 mechanism questions across Themes A-D (enzymes, chemiosmosis, DNA replication, epigenetics, muscle sarcomere, immunity).',
  chem: 'Generate strictly IB Chemistry SL (2025) Structure 1-3 / Reactivity 1-3 questions. CRITICAL: STP molar volume is 22.7 dm^3 mol^-1 at 273.15 K, 100 kPa. NEVER use 22.4, NEVER include entropy/Gibbs/NMR/HL periodicity anomalies.',
  math: 'Generate IB Math AA SL (2021) Paper 1/2 questions strictly within SL 1.1-5.11. NEVER include AHL vectors/complex numbers/Bayes/LHopital/Voronoi/Markov.',
  hist: 'Generate IB History HL Paper 1 OPCVL source exercises and Paper 2/3 historiography prompts (1930s expansionism, Hitler/Mao, Cold War, Imperial Russia).',
  eng: 'Generate IB English Literature HL Paper 1 unseen prose/poetry close-reading questions with original brief literary extracts (no copyrighted works) and Paper 2/IO analytical prompts.',
};

function loadCheckpoint(filePath: string): QuestionItem[] {
  if (!fs.existsSync(filePath)) return [];
  const items: QuestionItem[] = [];
  const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const parsed = JSON.parse(line);
      const check = validateGeneratedQuestion(parsed);
      if (check.ok) items.push(check.data);
    } catch {
      // Skip corrupted checkpoint lines
    }
  }
  return items;
}

export async function runGeminiEnrichmentBatch(options: {
  slug: SubjectSlug;
  maxRequests: number;
  batchSize?: number;
  checkpointDir?: string;
}): Promise<{ items: QuestionItem[]; quotaExhausted: boolean }> {
  const checkpointDir =
    options.checkpointDir ??
    path.join(process.cwd(), 'content', 'questions', '.checkpoints');
  fs.mkdirSync(checkpointDir, { recursive: true });
  const cpPath = path.join(checkpointDir, `${options.slug}-gemini.jsonl`);
  const existing = loadCheckpoint(cpPath);

  const quotaConfig = SUBJECT_QUOTAS[options.slug];
  const batchSize = options.batchSize ?? 8;
  let quotaExhausted = false;
  let counter = existing.length;

  for (let reqIdx = 0; reqIdx < options.maxRequests; reqIdx++) {
    const topicId =
      quotaConfig.topicIds[(counter + reqIdx) % quotaConfig.topicIds.length];
    const prompt = `${SUBJECT_INSTRUCTIONS[options.slug]}
Return exactly ${batchSize} distinct IB questions for subjectSlug="${options.slug}" focused on topicId="${topicId}" (allowed topicIds: ${quotaConfig.topicIds.join(', ')}).
Rules:
- Valid paper values: "Paper 1", "Paper 1A", "Paper 1B", "Paper 2", "Paper 3"
- Valid questionType values: "mcq" (4 options A-D and correctOptionId) or "short_answer" / "data_based" / "extended_response" (omit options & correctOptionId)
- Valid calculatorPolicy: "allowed", "non_calculator", "gdc_required"
- Valid difficulty: "foundation", "standard", "challenging"
- Sum of markschemePoints[].marks MUST exactly equal marks
- Include at least 2 walkthroughSteps and 1 commonPitfall
- Escape all LaTeX backslashes properly in JSON.`;

    const res = await generateStructuredWithGemini<{
      questions?: Array<Record<string, unknown>>;
    }>({
      prompt,
      responseSchema: QUESTION_BATCH_SCHEMA,
    });

    if (!res.ok) {
      if (res.quotaExhausted) {
        quotaExhausted = true;
      }
      break;
    }

    const rawList = Array.isArray(res.data?.questions) ? res.data.questions : [];
    const acceptedLines: string[] = [];
    for (const rawItem of rawList) {
      counter++;
      const normalized = {
        ...rawItem,
        id: `${options.slug}-llm-${String(counter).padStart(5, '0')}`,
        subjectSlug: options.slug,
        topicId:
          typeof rawItem.topicId === 'string' &&
          quotaConfig.topicIds.includes(rawItem.topicId)
            ? rawItem.topicId
            : topicId,
        options:
          rawItem.questionType === 'mcq' ? rawItem.options ?? null : null,
        correctOptionId:
          rawItem.questionType === 'mcq' ? rawItem.correctOptionId ?? null : null,
        isDailyEligible: true,
      };
      const check = validateGeneratedQuestion(normalized);
      if (check.ok) {
        existing.push(check.data);
        acceptedLines.push(JSON.stringify(check.data));
      }
    }

    if (acceptedLines.length > 0) {
      fs.appendFileSync(cpPath, acceptedLines.join('\n') + '\n', 'utf-8');
    }
  }

  return { items: existing, quotaExhausted };
}
