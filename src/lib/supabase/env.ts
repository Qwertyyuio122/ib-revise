/**
 * Validates and returns public Supabase environment configuration.
 * Throws a clear error if required environment variables are missing.
 */
export function getSupabaseEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables. Copy .env.example to .env.local and configure your Supabase project.'
    );
  }

  return { url, anonKey };
}
