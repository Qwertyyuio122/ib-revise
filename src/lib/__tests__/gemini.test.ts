import { describe, it, expect, afterEach, vi } from 'vitest';
import { z } from 'zod';

const { mockGenerateContent } = vi.hoisted(() => ({
  mockGenerateContent: vi.fn(),
}));

vi.mock('@google/genai', async () => {
  const actual = await vi.importActual<typeof import('@google/genai')>('@google/genai');
  return {
    ...actual,
    GoogleGenAI: vi.fn().mockImplementation(() => ({
      models: {
        generateContent: mockGenerateContent,
      },
    })),
  };
});

import {
  DEFAULT_GEMINI_FLASH_MODEL,
  DEFAULT_GEMINI_PRO_MODEL,
  GEMINI_BALANCED_MODEL,
  callGeminiStructured,
  formatGeminiError,
  isGeminiAuthError,
  normalizeGeminiModel,
  resolveGeminiConfig,
  zodToGeminiJsonSchema,
} from '../gemini';

describe('Gemini Config & Helpers', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    mockGenerateContent.mockReset();
  });

  it('normalizes legacy and current model IDs cleanly', () => {
    expect(normalizeGeminiModel(undefined)).toBe(DEFAULT_GEMINI_FLASH_MODEL);
    expect(normalizeGeminiModel('')).toBe(DEFAULT_GEMINI_FLASH_MODEL);
    expect(normalizeGeminiModel('gemini-2.5-flash')).toBe(
      DEFAULT_GEMINI_FLASH_MODEL
    );
    expect(normalizeGeminiModel('gemini-2.5-pro')).toBe(
      DEFAULT_GEMINI_PRO_MODEL
    );
    expect(normalizeGeminiModel('gemini-flash-latest')).toBe(
      DEFAULT_GEMINI_FLASH_MODEL
    );
    expect(normalizeGeminiModel('gemini-pro-latest')).toBe(
      DEFAULT_GEMINI_PRO_MODEL
    );
    expect(normalizeGeminiModel('gemini-3.5-flash')).toBe(
      GEMINI_BALANCED_MODEL
    );
    expect(normalizeGeminiModel('gemini-3.8-flash')).toBe('gemini-3.8-flash');
    expect(normalizeGeminiModel('unknown-model-v99')).toBe(
      DEFAULT_GEMINI_FLASH_MODEL
    );
  });

  it('converts Zod schemas into Gemini-compatible JSON Schema', () => {
    const SampleSchema = z.object({
      awardedMarks: z.number().int().min(0).max(25),
      criterion: z.string(),
      status: z.enum(['open', 'accepted', 'dismissed']).default('open'),
      replacementText: z.string().optional(),
      points: z.array(z.string()),
    });

    const jsonSchema = zodToGeminiJsonSchema(SampleSchema);
    expect(jsonSchema).toEqual({
      type: 'object',
      properties: {
        awardedMarks: { type: 'integer', minimum: 0, maximum: 25 },
        criterion: { type: 'string' },
        status: { type: 'string', enum: ['open', 'accepted', 'dismissed'] },
        replacementText: { type: 'string' },
        points: { type: 'array', items: { type: 'string' } },
      },
      required: ['awardedMarks', 'criterion', 'points'],
      additionalProperties: false,
    });
  });

  it('formats Gemini API errors cleanly and identifies auth failures', () => {
    const authErr = new Error(
      JSON.stringify({
        error: {
          code: 400,
          message: 'API key not valid. Please pass a valid API key.',
          status: 'INVALID_ARGUMENT',
        },
      })
    );
    expect(isGeminiAuthError(authErr)).toBe(true);
    expect(formatGeminiError(authErr, 'gemini-3-flash-preview')).toMatch(
      /Invalid Gemini API key/i
    );

    const quotaErr = new Error(
      JSON.stringify({
        error: {
          code: 429,
          message:
            'Quota exceeded for metric: generate_content_free_tier_requests, limit: 0',
          status: 'RESOURCE_EXHAUSTED',
        },
      })
    );
    expect(isGeminiAuthError(quotaErr)).toBe(false);
    expect(formatGeminiError(quotaErr, 'gemini-3.1-pro-preview')).toMatch(
      /Free-tier quota/i
    );

    const overloadErr = new Error(
      JSON.stringify({
        error: {
          code: 503,
          message: 'This model is currently experiencing high demand.',
          status: 'UNAVAILABLE',
        },
      })
    );
    expect(formatGeminiError(overloadErr, 'gemini-3.8-flash')).toMatch(
      /503/
    );
  });

  it('resolves Gemini config priority and normalizes legacy user model', async () => {
    process.env.GEMINI_API_KEY = 'env-test-key';
    const baseUser = {
      id: 'user-1',
      email: 'ib@example.com',
      name: 'Student',
      passwordHash: 'hash',
      geminiApiKey: 'db-user-key',
      preferredGeminiModel: 'gemini-2.5-flash',
      streakCount: 3,
      lastActiveDate: '2026-11-11',
      createdAt: 1,
      updatedAt: 1,
    };

    const fromHeader = await resolveGeminiConfig('header-key', baseUser);
    expect(fromHeader).toEqual({
      apiKey: 'header-key',
      model: DEFAULT_GEMINI_FLASH_MODEL,
      userId: 'user-1',
    });

    const fromUser = await resolveGeminiConfig(null, baseUser);
    expect(fromUser.apiKey).toBe('db-user-key');

    const fromEnv = await resolveGeminiConfig(null, {
      ...baseUser,
      geminiApiKey: null,
      preferredGeminiModel: 'gemini-2.5-pro',
    });
    expect(fromEnv).toEqual({
      apiKey: 'env-test-key',
      model: DEFAULT_GEMINI_PRO_MODEL,
      userId: 'user-1',
    });
  });

  it('returns deterministic_fallback with reason when no API key is configured', async () => {
    delete process.env.GEMINI_API_KEY;
    const res = await callGeminiStructured({
      prompt: 'Test prompt',
      systemInstruction: 'Test sys',
      schema: z.object({ ok: z.boolean() }),
      currentUser: null,
      fallback: () => ({ ok: true }),
    });

    expect(res.mode).toBe('deterministic_fallback');
    expect(res.modelUsed).toBe('deterministic-rubric-engine');
    expect(res.data).toEqual({ ok: true });
    expect(res.fallbackReason).toMatch(/No Gemini API key/i);
  });

  it('walks the fallback model chain on transient errors and aborts early on auth failures', async () => {
    process.env.GEMINI_API_KEY = 'env-key-123';

    mockGenerateContent
      .mockRejectedValueOnce(
        new Error(
          JSON.stringify({
            error: { code: 503, status: 'UNAVAILABLE', message: 'Overloaded' },
          })
        )
      )
      .mockResolvedValueOnce({
        text: JSON.stringify({ ok: true, note: 'Recovered on fallback model' }),
      });

    const recovered = await callGeminiStructured({
      prompt: 'Test fallback',
      systemInstruction: 'Return JSON',
      schema: z.object({ ok: z.boolean(), note: z.string() }),
      currentUser: {
        id: 'u1',
        email: 'ib@example.com',
        name: 'IB',
        passwordHash: 'hash',
        geminiApiKey: null,
        preferredGeminiModel: 'gemini-3.1-pro-preview',
        streakCount: 0,
        lastActiveDate: '2026-11-11',
        createdAt: 1,
        updatedAt: 1,
      },
      fallback: () => ({ ok: false, note: 'fallback' }),
    });

    expect(recovered.mode).toBe('gemini');
    expect(recovered.modelUsed).toBe(DEFAULT_GEMINI_FLASH_MODEL);
    expect(recovered.data.note).toBe('Recovered on fallback model');
    expect(mockGenerateContent).toHaveBeenCalledTimes(2);
    expect(mockGenerateContent.mock.calls[0][0].model).toBe(
      DEFAULT_GEMINI_PRO_MODEL
    );
    expect(mockGenerateContent.mock.calls[1][0].model).toBe(
      DEFAULT_GEMINI_FLASH_MODEL
    );

    mockGenerateContent.mockReset();
    mockGenerateContent.mockRejectedValue(
      new Error(
        JSON.stringify({
          error: {
            code: 401,
            status: 'UNAUTHENTICATED',
            message: 'API key not valid',
          },
        })
      )
    );

    const authFailed = await callGeminiStructured({
      prompt: 'Test auth abort',
      systemInstruction: 'Return JSON',
      schema: z.object({ ok: z.boolean() }),
      headerKey: 'bad-key',
      currentUser: null,
      fallback: () => ({ ok: false }),
    });

    expect(authFailed.mode).toBe('deterministic_fallback');
    expect(authFailed.fallbackReason).toMatch(/Invalid Gemini API key/i);
    // Auth errors abort immediately instead of retrying the fallback chain
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
  });
});
