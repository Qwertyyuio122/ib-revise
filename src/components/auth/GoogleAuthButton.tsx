'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { PillButton } from '@/components/ui/PillButton';

interface GoogleAuthButtonProps {
  nextPath?: string;
  label?: string;
  onError?: (message: string) => void;
}

export function GoogleAuthButton({
  nextPath = '/dashboard',
  label = 'Continue with Google',
  onError,
}: GoogleAuthButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const safeNext =
        nextPath.startsWith('/') && !nextPath.startsWith('//')
          ? nextPath
          : '/dashboard';

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNext)}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });

      if (error) {
        onError?.(error.message);
        setLoading(false);
      }
    } catch (err) {
      onError?.(
        err instanceof Error
          ? err.message
          : 'Unable to start Google sign-in.'
      );
      setLoading(false);
    }
  };

  return (
    <PillButton
      type="button"
      variant="secondary"
      size="lg"
      disabled={loading}
      onClick={handleGoogleSignIn}
      className="w-full"
    >
      <svg
        className="h-4 w-4 shrink-0"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          fill="#EA4335"
          d="M12 10.2v3.9h5.4c-.2 1.2-.9 2.3-2 3l3.2 2.5c1.9-1.7 3-4.3 3-7.3 0-.7-.1-1.4-.2-2.1H12z"
        />
        <path
          fill="#34A853"
          d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.8-5.6-4.2H3.1v2.6C4.7 19.7 8.1 22 12 22z"
        />
        <path
          fill="#FBBC05"
          d="M6.4 13.8c-.2-.6-.3-1.2-.3-1.8s.1-1.2.3-1.8V7.6H3.1C2.4 9 2 10.4 2 12s.4 3 1.1 4.4l3.3-2.6z"
        />
        <path
          fill="#4285F4"
          d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9C17 3 14.7 2 12 2 8.1 2 4.7 4.3 3.1 7.6l3.3 2.6C7.2 7.8 9.4 6 12 6z"
        />
      </svg>
      <span>{loading ? 'Connecting to Google...' : label}</span>
    </PillButton>
  );
}
