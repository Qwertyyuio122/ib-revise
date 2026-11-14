import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/(auth)/login/page';
import SignupPage from '@/app/(auth)/signup/page';

const pushMock = vi.fn();
const refreshMock = vi.fn();
let currentSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
  useSearchParams: () => currentSearchParams,
}));

describe('Auth Pages UI Hardening', () => {
  beforeEach(() => {
    pushMock.mockReset();
    refreshMock.mockReset();
    currentSearchParams = new URLSearchParams();
    vi.restoreAllMocks();
  });

  it('renders clean LoginPage without demo shortcut, prefilled credentials, or promotional tags', () => {
    render(<LoginPage />);

    expect(screen.queryByText(/100% Free/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/6 Subjects Unlocked/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Continue as Harris/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/or sign in with email/i)).not.toBeInTheDocument();

    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;

    expect(emailInput.value).toBe('');
    expect(passwordInput.value).toBe('');
    expect(emailInput.placeholder).toBe('student@example.com');
    expect(emailInput.getAttribute('autocomplete')).toBe('email');
    expect(passwordInput.getAttribute('autocomplete')).toBe('current-password');
    expect(passwordInput.type).toBe('password');

    const toggleBtn = screen.getByRole('button', { name: /show password/i });
    fireEvent.click(toggleBtn);
    expect(passwordInput.type).toBe('text');
    expect(screen.getByRole('button', { name: /hide password/i })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });

  it('redirects safely on login using sanitized next parameter', async () => {
    currentSearchParams = new URLSearchParams('next=/subjects/bio?tab=overview');
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ user: { id: 'u1' } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'student@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'IBStudy2026!' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        '/api/auth/login',
        expect.objectContaining({ method: 'POST' })
      );
      expect(pushMock).toHaveBeenCalledWith('/subjects/bio?tab=overview');
    });
  });

  it('blocks unsafe external next redirect on login', async () => {
    currentSearchParams = new URLSearchParams('next=//evil.com');
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ user: { id: 'u1' } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'student@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'IBStudy2026!' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/');
    });
  });

  it('renders SignupPage with neutral placeholders, strong password guidance, and mismatch validation', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    render(<SignupPage />);

    expect(screen.queryByPlaceholderText(/Harris/i)).not.toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText(/harris@simplerevision\.org/i)
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/minimum 4 characters/i)).not.toBeInTheDocument();

    const nameInput = screen.getByLabelText(/^name$/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
    const confirmInput = screen.getByLabelText(/^confirm password$/i) as HTMLInputElement;

    expect(nameInput.getAttribute('autocomplete')).toBe('name');
    expect(emailInput.getAttribute('autocomplete')).toBe('email');
    expect(passwordInput.getAttribute('autocomplete')).toBe('new-password');
    expect(confirmInput.getAttribute('autocomplete')).toBe('new-password');

    fireEvent.change(nameInput, { target: { value: 'Maya' } });
    fireEvent.change(emailInput, { target: { value: 'maya@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'StudyIB2026!' } });
    fireEvent.change(confirmInput, { target: { value: 'Different2026!' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /passwords do not match/i
    );
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
