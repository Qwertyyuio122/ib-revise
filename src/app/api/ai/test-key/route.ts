import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';
import {
  DEFAULT_GEMINI_FLASH_MODEL,
  SUPPORTED_GEMINI_MODELS,
  buildThinkingConfig,
  formatGeminiError,
  normalizeGeminiModel,
  resolveGeminiConfig,
} from '@/lib/gemini';
import { parseOptionalJsonBody } from '@/app/api/_lib/json';

const TestKeyRequestSchema = z.object({
  apiKey: z.string().optional(),
  model: z
    .enum([...SUPPORTED_GEMINI_MODELS, 'gemini-2.5-flash', 'gemini-2.5-pro'])
    .optional(),
});

const TEST_KEY_TIMEOUT_MS = 20_000;

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jsonBody = await parseOptionalJsonBody(request);
    if (!jsonBody.ok) {
      return NextResponse.json(
        {
          valid: false,
          model: DEFAULT_GEMINI_FLASH_MODEL,
          message: 'Invalid model or API key test payload.',
        },
        { status: 400 }
      );
    }

    const parsed = TestKeyRequestSchema.safeParse(jsonBody.data);
    if (!parsed.success) {
      return NextResponse.json(
        {
          valid: false,
          model: DEFAULT_GEMINI_FLASH_MODEL,
          message: 'Invalid model or API key test payload.',
        },
        { status: 400 }
      );
    }

    const candidateKey = parsed.data.apiKey?.trim();
    const resolved = await resolveGeminiConfig(candidateKey || null, user);
    const activeKey = candidateKey || resolved.apiKey;
    const modelToTest = parsed.data.model
      ? normalizeGeminiModel(parsed.data.model)
      : resolved.model;

    if (!activeKey) {
      return NextResponse.json({
        valid: false,
        model: modelToTest,
        message:
          'No Gemini API key provided. Enter a Google AI Studio key (starts with AIza... or AQ....) or continue using the built-in IB Rubric Engine.',
      });
    }

    try {
      const ai = new GoogleGenAI({ apiKey: activeKey });
      let timer: NodeJS.Timeout | undefined;
      const timeoutPromise = new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error(`Gemini API test timed out after ${TEST_KEY_TIMEOUT_MS / 1000}s`)),
          TEST_KEY_TIMEOUT_MS
        );
      });

      const thinkingConfig = buildThinkingConfig(modelToTest);

      let response;
      try {
        response = await Promise.race([
          ai.models.generateContent({
            model: modelToTest,
            contents: 'Reply with the single word READY.',
            config: {
              ...thinkingConfig,
            },
          }),
          timeoutPromise,
        ]);
      } finally {
        if (timer) clearTimeout(timer);
      }

      const reply = (response.text ?? '').trim();
      return NextResponse.json({
        valid: true,
        model: modelToTest,
        message: `Connected to ${modelToTest} (${reply.slice(0, 24) || 'OK'}). Live Gemini grading & Socratic tutoring active.`,
      });
    } catch (err) {
      return NextResponse.json({
        valid: false,
        model: modelToTest,
        message: `Gemini API test failed: ${formatGeminiError(err, modelToTest)}`,
      });
    }
  } catch {
    return NextResponse.json(
      {
        valid: false,
        model: DEFAULT_GEMINI_FLASH_MODEL,
        message: 'Could not validate API key payload.',
      },
      { status: 400 }
    );
  }
}
