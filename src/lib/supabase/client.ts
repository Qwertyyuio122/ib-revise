import { createBrowserClient } from '@supabase/ssr';

const FALLBACK_URL = 'https://vrxgamuqaeqhkuvucpzv.supabase.co';
const FALLBACK_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyeGdhbXVxYWVxaGt1dnVjcHp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4ODA4NjcsImV4cCI6MjEwODQ1Njg2N30.jb1f6TN_z0KUXavCQADBMnFK82yss9D-CUl_ebYAiLA';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_ANON_KEY
  );
}
