import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { z } from 'zod';
import { getCurrentUser } from './auth';

export const DEFAULT_GEMINI_FLASH_MODEL = 'gemini-3-flash-preview' as const;
export const GEMINI_BALANCED_MODEL = 'gemini-3.5-flash' as const;
export const DEFAULT_GEMINI_PRO_MODEL = 'gemini-3.1-pro-preview' as const;

export const SUPPORTED_GEMINI_MODELS = [
  'gemini-3-flash-preview',
  'gemini-3.5-flash',
  'gemini-3.8-flash',
  'gemini-3.1-pro-preview',
] as const;

export type SupportedGeminiModel = (typeof SUPPORTED_GEMINI_MODELS)[number];

export const LEGACY_GEMINI_MODEL_MAP: Record<string, SupportedGeminiModel> = {
  'gemini-2.5-flash': DEFAULT_GEMINI_FLASH_MODEL,
  'gemini-2.5-flash-lite': DEFAULT_GEMINI_FLASH_MODEL,
  'gemini-2.0-flash': DEFAULT_GEMINI_FLASH_MODEL,
  'gemini-flash-latest': DEFAULT_GEMINI_FLASH_MODEL,
  'gemini-2.5-pro': DEFAULT_GEMINI_PRO_MODEL,
  'gemini-pro-latest': DEFAULT_GEMINI_PRO_MODEL,
};

const GEMINI_FALLBACK_MODEL_CHAIN: readonly string[] = [
  DEFAULT_GEMINI_FLASH_MODEL,
  GEMINI_BALANCED_MODEL,
  'gemini-3.1-flash-lite',
];

const GEMINI_STRUCTURED_TIMEOUT_MS = 25_000;

export interface ResolvedGeminiConfig {
  apiKey: string | null;
  model: SupportedGeminiModel;
  userId: string | null;
}

export function normalizeGeminiModel(
  model?: string | null
): SupportedGeminiModel {
  const trimmed = model?.trim();
  if (!trimmed) return DEFAULT_GEMINI_FLASH_MODEL;
  if (trimmed in LEGACY_GEMINI_MODEL_MAP) {
    return LEGACY_GEMINI_MODEL_MAP[trimmed];
  }
  if ((SUPPORTED_GEMINI_MODELS as readonly string[]).includes(trimmed)) {
    return trimmed as SupportedGeminiModel;
  }
  return DEFAULT_GEMINI_FLASH_MODEL;
}

function unwrapZodDef(schema: z.ZodTypeAny): {
  inner: z.ZodTypeAny;
  optional: boolean;
} {
  let current: z.ZodTypeAny = schema;
  let optional = false;

  while (current && current._def) {
    const typeName = current._def.typeName;
    if (typeName === 'ZodOptional' || typeName === 'ZodDefault') {
      optional = true;
      current = current._def.innerType;
    } else if (typeName === 'ZodNullable') {
      current = current._def.innerType;
    } else if (typeName === 'ZodEffects') {
      current = current._def.schema;
    } else {
      break;
    }
  }

  return { inner: current, optional };
}

function convertZodNodeToJsonSchema(
  schema: z.ZodTypeAny
): Record<string, unknown> {
  const { inner } = unwrapZodDef(schema);
  const def = inner?._def;
  const typeName = def?.typeName;

  if (typeName === 'ZodString') {
    return { type: 'string' };
  }

  if (typeName === 'ZodBoolean') {
    return { type: 'boolean' };
  }

  if (typeName === 'ZodNumber') {
    const checks = Array.isArray(def.checks) ? def.checks : [];
    let isInt = false;
    let minimum: number | undefined;
    let maximum: number | undefined;

    for (const check of checks) {
      if (check.kind === 'int') {
        isInt = true;
      } else if (check.kind === 'min') {
        minimum = check.inclusive === false ? check.value + 1 : check.value;
      } else if (check.kind === 'max') {
        maximum = check.inclusive === false ? check.value - 1 : check.value;
      }
    }

    return {
      type: isInt ? 'integer' : 'number',
      ...(minimum !== undefined ? { minimum } : {}),
      ...(maximum !== undefined ? { maximum } : {}),
    };
  }

  if (typeName === 'ZodEnum') {
    return {
      type: 'string',
      enum: [...def.values],
    };
  }

  if (typeName === 'ZodArray') {
    return {
      type: 'array',
      items: convertZodNodeToJsonSchema(def.type),
    };
  }

  if (typeName === 'ZodObject') {
    const shape = typeof def.shape === 'function' ? def.shape() : def.shape;
    const properties: Record<string, unknown> = {};
    const required: string[] = [];

    for (const [key, fieldSchema] of Object.entries(shape)) {
      const typedField = fieldSchema as z.ZodTypeAny;
      const { optional } = unwrapZodDef(typedField);
      properties[key] = convertZodNodeToJsonSchema(typedField);
      if (!optional) {
        required.push(key);
      }
    }

    return {
      type: 'object',
      properties,
      ...(required.length > 0 ? { required } : {}),
      additionalProperties: false,
    };
  }

  return {};
}

export function zodToGeminiJsonSchema(
  schema: z.ZodTypeAny
): Record<string, unknown> | undefined {
  try {
    const converted = convertZodNodeToJsonSchema(schema);
    return Object.keys(converted).length > 0 ? converted : undefined;
  } catch {
    return undefined;
  }
}

function parseRawGeminiError(err: unknown): {
  code?: number;
  status?: string;
  message: string;
} {
  const raw = err instanceof Error ? err.message : String(err ?? '');
  try {
    const parsed = JSON.parse(raw) as {
      error?: { code?: number; status?: string; message?: string };
    };
    if (parsed?.error) {
      return {
        code: parsed.error.code,
        status: parsed.error.status,
        message: parsed.error.message || raw,
      };
    }
  } catch {
    // Plain error message
  }
  return { message: raw || 'Unknown Gemini API error' };
}

export function isGeminiAuthError(err: unknown): boolean {
  const parsed = parseRawGeminiError(err);
  const lower = parsed.message.toLowerCase();
  return (
    parsed.code === 401 ||
    parsed.code === 403 ||
    lower.includes('api key not valid') ||
    lower.includes('api_key_invalid') ||
    lower.includes('permission_denied') ||
    lower.includes('unauthenticated')
  );
}

export function formatGeminiError(err: unknown, model?: string): string {
  const parsed = parseRawGeminiError(err);
  const lower = parsed.message.toLowerCase();
  const modelLabel = model || 'selected Gemini model';

  if (isGeminiAuthError(err)) {
    return 'Invalid Gemini API key. Check your key in Settings (Google AI Studio keys start with AIza... or AQ....).';
  }
  if (parsed.code === 429 || parsed.status === 'RESOURCE_EXHAUSTED') {
    if (lower.includes('limit: 0') || lower.includes('free_tier')) {
      return `Free-tier quota is exhausted or 0 for ${modelLabel}. Switch to ${DEFAULT_GEMINI_FLASH_MODEL} or ${GEMINI_BALANCED_MODEL}, or enable billing for Pro models.`;
    }
    return `Rate limit reached for ${modelLabel}. Please wait a moment and try again.`;
  }
  if (parsed.code === 503 || parsed.status === 'UNAVAILABLE') {
    return `${modelLabel} is temporarily experiencing high demand (503). Try ${DEFAULT_GEMINI_FLASH_MODEL} or retry shortly.`;
  }
  if (parsed.code === 404 || parsed.status === 'NOT_FOUND') {
    return `Model ${modelLabel} is unavailable or deprecated on this API key.`;
  }
  if (lower.includes('timed out')) {
    return `${modelLabel} timed out before responding. Try ${DEFAULT_GEMINI_FLASH_MODEL}.`;
  }
  return parsed.message.slice(0, 180);
}

export function buildThinkingConfig(model: string) {
  if (model === DEFAULT_GEMINI_FLASH_MODEL || model === GEMINI_BALANCED_MODEL) {
    return { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } };
  }
  return {};
}

export function extractJsonFromResponse(raw: string): unknown {
  const trimmed = raw.trim();
  try {
    return JSON.parse(trimmed);
  } catch {}

  // Strip code block fences if present
  const fenced = trimmed
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  try {
    return JSON.parse(fenced);
  } catch {}

  // Fallback to substring extraction of the outermost {...} or [...]
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
    } catch {}
  }

  const firstBracket = trimmed.indexOf('[');
  const lastBracket = trimmed.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket > firstBracket) {
    try {
      return JSON.parse(trimmed.slice(firstBracket, lastBracket + 1));
    } catch {}
  }

  throw new Error('Failed to extract JSON from Gemini response');
}

export async function resolveGeminiConfig(
  headerKey?: string | null,
  currentUser?: Awaited<ReturnType<typeof getCurrentUser>>
): Promise<ResolvedGeminiConfig> {
  const user = currentUser !== undefined ? currentUser : await getCurrentUser();
  const key =
    headerKey?.trim() ||
    user?.geminiApiKey?.trim() ||
    process.env.GEMINI_API_KEY?.trim() ||
    null;

  return {
    apiKey: key || null,
    model: normalizeGeminiModel(user?.preferredGeminiModel),
    userId: user?.id ?? null,
  };
}

export async function callGeminiStructured<T>({
  prompt,
  systemInstruction,
  schema,
  headerKey,
  fallback,
  currentUser,
}: {
  prompt: string;
  systemInstruction: string;
  schema: z.ZodType<T>;
  headerKey?: string | null;
  fallback: () => T;
  currentUser?: Awaited<ReturnType<typeof getCurrentUser>>;
}): Promise<{
  data: T;
  mode: 'gemini' | 'deterministic_fallback';
  modelUsed: string;
  fallbackReason?: string;
}> {
  const config = await resolveGeminiConfig(headerKey, currentUser);

  if (!config.apiKey) {
    return {
      data: fallback(),
      mode: 'deterministic_fallback',
      modelUsed: 'deterministic-rubric-engine',
      fallbackReason: 'No Gemini API key configured.',
    };
  }

  const ai = new GoogleGenAI({ apiKey: config.apiKey });
  const responseJsonSchema = zodToGeminiJsonSchema(schema);
  const candidateModels = Array.from(
    new Set([config.model, ...GEMINI_FALLBACK_MODEL_CHAIN])
  );

  let lastReason = 'Unable to reach Gemini API.';

  for (const model of candidateModels) {
    let timer: NodeJS.Timeout | undefined;
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        timer = setTimeout(
          () =>
            reject(
              new Error(
                `Gemini API call timed out after ${GEMINI_STRUCTURED_TIMEOUT_MS / 1000}s`
              )
            ),
          GEMINI_STRUCTURED_TIMEOUT_MS
        );
      });

      const response = await Promise.race([
        ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            ...(responseJsonSchema ? { responseJsonSchema } : {}),
            temperature: 0.2,
            ...buildThinkingConfig(model),
          },
        }),
        timeoutPromise,
      ]);

      const rawText = response.text ?? '{}';
      const parsedJson = extractJsonFromResponse(rawText);
      const validated = schema.safeParse(parsedJson);
      if (validated.success) {
        return {
          data: validated.data,
          mode: 'gemini',
          modelUsed: model,
        };
      }

      lastReason = `Schema validation failed for ${model}: ${validated.error.issues
        .slice(0, 2)
        .map((i) => `${i.path.join('.') || 'root'}: ${i.message}`)
        .join('; ')}`;
      console.warn('[Gemini]', lastReason);
    } catch (err) {
      lastReason = formatGeminiError(err, model);
      console.warn(`[Gemini] ${model} failed:`, lastReason);
      if (isGeminiAuthError(err)) {
        break;
      }
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  return {
    data: fallback(),
    mode: 'deterministic_fallback',
    modelUsed: 'deterministic-rubric-engine',
    fallbackReason: lastReason,
  };
}
