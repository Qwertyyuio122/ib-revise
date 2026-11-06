-- Phase 2: Multi-User Authentication & Row-Level Security (RLS) Isolation

CREATE TABLE IF NOT EXISTS public.user_question_activity (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  status TEXT CHECK (status IN ('BOOKMARKED', 'ATTEMPTED', 'MASTERED')),
  user_notes TEXT,
  last_practiced_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, question_id)
);

ALTER TABLE public.user_question_activity ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.ib_core_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT CHECK (type IN ('TOK_ESSAY', 'TOK_EXHIBITION', 'EXTENDED_ESSAY', 'IA')) NOT NULL,
  subject_id TEXT,
  title TEXT NOT NULL,
  draft_status TEXT NOT NULL DEFAULT 'OUTLINE',
  word_count INT DEFAULT 0,
  target_word_count INT DEFAULT 1600,
  deadline DATE,
  supervisor_feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ib_core_items ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_question_activity' AND policyname = 'Users manage own question activity'
  ) THEN
    CREATE POLICY "Users manage own question activity"
      ON public.user_question_activity FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'ib_core_items' AND policyname = 'Users manage own ib_core_items'
  ) THEN
    CREATE POLICY "Users manage own ib_core_items"
      ON public.ib_core_items FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users manage own profile'
  ) THEN
    CREATE POLICY "Users manage own profile"
      ON public.profiles FOR ALL
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_flashcard_reviews' AND policyname = 'Users manage own flashcard reviews'
  ) THEN
    CREATE POLICY "Users manage own flashcard reviews"
      ON public.user_flashcard_reviews FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;
