'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { ScreenState } from '@/types/fsm';
import {
  KeyRound,
  User,
  Cpu,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

type PreferredGeminiModel =
  | 'gemini-3-flash-preview'
  | 'gemini-3.5-flash'
  | 'gemini-3.8-flash'
  | 'gemini-3.1-pro-preview';

interface UserSettingsPayload {
  id: string;
  name: string;
  email: string;
  hasGeminiKey: boolean;
  hasPersonalKey?: boolean;
  hasServerKey?: boolean;
  maskedKey: string | null;
  preferredGeminiModel: string;
  streakCount: number;
}

const MODEL_OPTIONS: Array<{
  id: PreferredGeminiModel;
  badge: string;
  description: string;
}> = [
  {
    id: 'gemini-3-flash-preview',
    badge: 'gemini-3-flash-preview (Recommended)',
    description:
      'Fast Socratic tutoring, Blurting recall evaluation, and Paper 2 markscheme grading (Free-Tier Verified).',
  },
  {
    id: 'gemini-3.5-flash',
    badge: 'gemini-3.5-flash (Balanced)',
    description:
      'Stable Flash reasoning for detailed markscheme analysis and IA/EE draft review (Free-Tier Verified).',
  },
  {
    id: 'gemini-3.8-flash',
    badge: 'gemini-3.8-flash (High-Speed Flash)',
    description:
      'Low-latency Flash model for rapid multi-turn Socratic feedback, Blurting checks, and essay markups.',
  },
  {
    id: 'gemini-3.1-pro-preview',
    badge: 'gemini-3.1-pro-preview (Pro · Paid Tier)',
    description:
      'Maximum reasoning depth for Extended Essay & TOK/History essays (requires paid AI Studio quota; falls back to Flash automatically).',
  },
];

function normalizeUiModel(model?: string | null): PreferredGeminiModel {
  const trimmed = model?.trim();
  if (trimmed === 'gemini-3.5-flash') return 'gemini-3.5-flash';
  if (trimmed === 'gemini-3.8-flash') return 'gemini-3.8-flash';
  if (
    trimmed === 'gemini-3.1-pro-preview' ||
    trimmed === 'gemini-2.5-pro' ||
    trimmed === 'gemini-pro-latest'
  ) {
    return 'gemini-3.1-pro-preview';
  }
  return 'gemini-3-flash-preview';
}

type KeyTestStatus =
  | { state: 'idle' }
  | { state: 'testing' }
  | { state: 'valid'; message: string }
  | { state: 'invalid'; message: string };

export default function SettingsPage() {
  const router = useRouter();
  const [screen, setScreen] = useState<ScreenState<UserSettingsPayload>>({
    status: 'loading',
  });
  const [nameInput, setNameInput] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [preferredModel, setPreferredModel] = useState<PreferredGeminiModel>(
    'gemini-3-flash-preview'
  );
  const [saveFeedback, setSaveFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [savingStatus, setSavingStatus] = useState<'idle' | 'saving' | 'clearing'>('idle');
  const [signingOut, setSigningOut] = useState(false);
  const [testResult, setTestResult] = useState<KeyTestStatus>({ state: 'idle' });
  const controllerRef = useRef<AbortController | null>(null);
  const testControllerRef = useRef<AbortController | null>(null);
  const routerRef = useRef(router);
  routerRef.current = router;

  const loadSettings = useCallback(() => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setScreen({ status: 'loading' });
    fetch('/api/settings', { signal: controller.signal })
      .then(async (res) => {
        if (res.status === 401) {
          routerRef.current.replace('/login');
          return null;
        }
        if (!res.ok) {
          throw new Error('Unable to load account settings.');
        }
        return (await res.json()) as UserSettingsPayload;
      })
      .then((data) => {
        if (!data) return;
        setScreen({ status: 'success', data });
        setNameInput(data.name);
        setPreferredModel(normalizeUiModel(data.preferredGeminiModel));
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return;
        setScreen({
          status: 'error',
          message: 'Unable to load account settings.',
        });
      });
  }, []);

  useEffect(() => {
    loadSettings();
    return () => {
      controllerRef.current?.abort();
      testControllerRef.current?.abort();
    };
  }, [loadSettings]);

  async function saveSettingsPayload(
    payload: Record<string, unknown>,
    successMessage: string,
    mode: 'saving' | 'clearing'
  ) {
    if (savingStatus !== 'idle') return;
    setSavingStatus(mode);
    setSaveFeedback(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) {
        router.replace('/login');
        return;
      }
      const updated = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSaveFeedback({
          type: 'error',
          message: updated.error || 'Could not save settings. Please try again.',
        });
        return;
      }
      setScreen((prev) =>
        prev.status === 'success'
          ? {
              status: 'success',
              data: {
                ...prev.data,
                name: updated.name,
                hasGeminiKey: updated.hasGeminiKey,
                hasPersonalKey: updated.hasPersonalKey,
                hasServerKey: updated.hasServerKey,
                maskedKey: updated.maskedKey,
                preferredGeminiModel: updated.preferredGeminiModel,
              },
            }
          : prev
      );
      setPreferredModel(normalizeUiModel(updated.preferredGeminiModel));
      setApiKeyInput('');
      setSaveFeedback({ type: 'success', message: successMessage });
      router.refresh();
    } catch {
      setSaveFeedback({
        type: 'error',
        message: 'Network error while saving settings.',
      });
    } finally {
      setSavingStatus('idle');
    }
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = nameInput.trim();
    if (!trimmedName) {
      setSaveFeedback({
        type: 'error',
        message: 'Display name cannot be empty.',
      });
      return;
    }
    const payload: Record<string, unknown> = {
      name: trimmedName,
      preferredGeminiModel: preferredModel,
    };
    if (apiKeyInput.trim()) {
      payload.geminiApiKey = apiKeyInput.trim();
    }
    await saveSettingsPayload(
      payload,
      'Settings saved! Your profile and Gemini configuration are active across all revision tools.',
      'saving'
    );
  }

  async function handleClearPersonalKey() {
    await saveSettingsPayload(
      { geminiApiKey: null },
      'Personal Gemini API key removed.',
      'clearing'
    );
  }

  async function handleTestConnection() {
    testControllerRef.current?.abort();
    const controller = new AbortController();
    testControllerRef.current = controller;
    setTestResult({ state: 'testing' });
    try {
      const res = await fetch('/api/ai/test-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          apiKey: apiKeyInput.trim() || undefined,
          model: preferredModel,
        }),
      });
      if (res.status === 401) {
        router.replace('/login');
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.valid) {
        setTestResult({ state: 'valid', message: data.message });
      } else {
        setTestResult({
          state: 'invalid',
          message:
            data.message || data.error || 'Gemini API connection test failed.',
        });
      }
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') return;
      setTestResult({
        state: 'invalid',
        message: 'Could not reach connection test endpoint.',
      });
    }
  }

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => null);
    router.push('/login');
    router.refresh();
  }

  return (
    <div className="main-pad !pt-[26px]">
      <div className="col-center">
        <div className="border-b border-[#E4E4E7] pb-5">
          <h1
            className="h-title !text-[24px]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Account Settings &amp; Gemini AI Configuration
          </h1>
          <p className="mt-1 text-[13px] text-[#71717A]">
            Configure your IB student profile, connect a Google AI Studio key (<code>AIza...</code> or <code>AQ....</code>), or choose your preferred Gemini 3 model.
          </p>
        </div>

        {screen.status === 'loading' && (
          <div className="mt-6 space-y-4">
            <div className="h-44 animate-pulse rounded-[14px] border border-[#E4E4E7] bg-white" />
            <div className="h-56 animate-pulse rounded-[14px] border border-[#E4E4E7] bg-white" />
          </div>
        )}

        {screen.status === 'error' && (
          <div
            role="alert"
            className="mt-6 flex items-center justify-between flex-wrap gap-3 rounded-[14px] border border-[#FECACA] bg-[#FEF2F2] p-4 text-[#B91C1C]"
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <AlertCircle className="h-5 w-5 shrink-0 text-[#DC2626]" />
              <span>{screen.message || 'Unable to load account settings.'}</span>
            </div>
            <button
              type="button"
              onClick={loadSettings}
              className="pill-btn"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Retry Loading Settings</span>
            </button>
          </div>
        )}

        {screen.status === 'success' && (
          <form onSubmit={handleSaveSettings} className="mt-6 space-y-6">
            {saveFeedback && (
              <div
                role="alert"
                className={`flex items-center gap-2 rounded-xl border p-4 text-xs font-semibold ${
                  saveFeedback.type === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                    : 'border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]'
                }`}
              >
                {saveFeedback.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#059669]" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0 text-[#DC2626]" />
                )}
                <span>{saveFeedback.message}</span>
              </div>
            )}

            {/* Profile Card */}
            <div className="hairline-card">
              <div className="flex items-center gap-2.5">
                <User className="h-4 w-4 text-[#18181B]" />
                <h2
                  className="text-base font-semibold text-[#18181B]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  IB Student Profile
                </h2>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="settings-display-name"
                    className="block text-xs font-semibold text-[#3F3F46]"
                  >
                    Display Name
                  </label>
                  <input
                    id="settings-display-name"
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#E4E4E7] px-3.5 py-2 text-sm text-[#18181B] transition-colors duration-150 focus:border-[#18181B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="settings-email"
                    className="block text-xs font-semibold text-[#3F3F46]"
                  >
                    Account Email
                  </label>
                  <input
                    id="settings-email"
                    type="email"
                    disabled
                    value={screen.data.email}
                    className="mt-1 w-full rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] px-3.5 py-2 text-sm text-[#71717A]"
                  />
                </div>
              </div>
            </div>

            {/* Free Gemini API Key Card */}
            <div className="hairline-card">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <KeyRound className="h-4 w-4 text-[#D97706]" />
                  <h2
                    className="text-base font-semibold text-[#18181B]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Google Gemini API Key (BYOK)
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                      screen.data.hasGeminiKey
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                        : 'border-[#E4E4E7] bg-[#F4F4F5] text-[#3F3F46]'
                    }`}
                  >
                    {screen.data.maskedKey
                      ? `Personal Key: ${screen.data.maskedKey}`
                      : screen.data.hasServerKey || screen.data.hasGeminiKey
                      ? 'Server Gemini Key Active'
                      : 'Built-In IB Rubric Engine Active'}
                  </span>
                  {screen.data.maskedKey && (
                    <button
                      type="button"
                      onClick={handleClearPersonalKey}
                      disabled={savingStatus !== 'idle'}
                      className="pill-btn"
                    >
                      {savingStatus === 'clearing' ? 'Clearing...' : 'Clear Key'}
                    </button>
                  )}
                </div>
              </div>

              <p className="mt-2 text-xs text-[#71717A]">
                Paste your key from Google AI Studio (<code>aistudio.google.com</code>) for live Gemini 3 grading, or leave blank to use the configured server key / built-in IB Markscheme Engine.
              </p>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  id="settings-gemini-key"
                  aria-label="Personal Google Gemini API Key"
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder={
                    screen.data.maskedKey
                      ? `Current key: ${screen.data.maskedKey} (Enter new AIza... or AQ.... key to replace)`
                      : 'AIza... or AQ....'
                  }
                  className="flex-1 rounded-xl border border-[#E4E4E7] px-3.5 py-2 font-mono text-xs text-[#18181B] transition-colors duration-150 focus:border-[#18181B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
                />
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testResult.state === 'testing'}
                  className="pill-btn justify-center !py-2 !px-4 disabled:opacity-50"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#D97706]" />
                  <span>
                    {testResult.state === 'testing'
                      ? 'Testing...'
                      : 'Test Connection'}
                  </span>
                </button>
              </div>

              {testResult.state === 'valid' && (
                <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#059669]" />
                  <span>{testResult.message}</span>
                </div>
              )}

              {testResult.state === 'invalid' && (
                <div
                  role="alert"
                  className="mt-3 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 text-[#D97706]" />
                  <span>{testResult.message}</span>
                </div>
              )}
            </div>

            {/* Preferred Model Selector */}
            <div className="hairline-card">
              <div className="flex items-center gap-2.5">
                <Cpu className="h-4 w-4 text-[#18181B]" />
                <h2
                  className="text-base font-semibold text-[#18181B]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Preferred Gemini Model
                </h2>
              </div>

              <div
                role="radiogroup"
                aria-label="Preferred Gemini Model"
                className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
              >
                {MODEL_OPTIONS.map((opt) => {
                  const isSelected = preferredModel === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setPreferredModel(opt.id)}
                      className={`rounded-xl border p-4 text-left transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B] ${
                        isSelected
                          ? 'border-[#18181B] bg-[#18181B] text-white'
                          : 'border-[#E4E4E7] bg-[#FAFAFA] text-[#18181B] hover:bg-[#F4F4F5]'
                      }`}
                    >
                      <div className="font-mono text-xs font-bold">{opt.badge}</div>
                      <p
                        className={`mt-1 text-xs ${
                          isSelected ? 'text-zinc-300' : 'text-[#71717A]'
                        }`}
                      >
                        {opt.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="inline-flex items-center gap-2 rounded-full border border-[#FECACA] bg-[#FEF2F2] px-4 py-2 text-xs font-semibold text-[#B91C1C] transition-colors duration-150 hover:bg-rose-100 disabled:opacity-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18181B]"
              >
                <LogOut className="h-4 w-4" />
                <span>{signingOut ? 'Signing out...' : 'Sign Out'}</span>
              </button>

              <button
                type="submit"
                disabled={savingStatus !== 'idle'}
                className="pill-btn-dark !py-2.5 !px-6"
              >
                <span>
                  {savingStatus === 'saving'
                    ? 'Saving...'
                    : 'Save Key & Profile Settings'}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
