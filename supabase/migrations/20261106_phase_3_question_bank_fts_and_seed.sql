-- Phase 3: 30,000+ Question Bank Full-Text Search (tsvector + GIN) & Sample Seed

ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS session TEXT DEFAULT 'M24-TZ1',
  ADD COLUMN IF NOT EXISTS difficulty INT CHECK (difficulty BETWEEN 1 AND 7) DEFAULT 4;

ALTER TABLE public.questions
  ADD COLUMN IF NOT EXISTS search_tokens TSVECTOR
  GENERATED ALWAYS AS (
    to_tsvector(
      'english',
      coalesce(prompt_text, '') || ' ' ||
      coalesce(official_markscheme_text, '') || ' ' ||
      coalesce(session, '') || ' ' ||
      coalesce(command_term, '')
    )
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_questions_search_tokens
  ON public.questions USING GIN (search_tokens);

CREATE INDEX IF NOT EXISTS idx_questions_subject_topic_paper
  ON public.questions (subject_id, topic_id, paper_number);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'subjects' AND policyname = 'Public read subjects'
  ) THEN
    CREATE POLICY "Public read subjects" ON public.subjects FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'topics' AND policyname = 'Public read topics'
  ) THEN
    CREATE POLICY "Public read topics" ON public.topics FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'questions' AND policyname = 'Public read questions'
  ) THEN
    CREATE POLICY "Public read questions" ON public.questions FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'flashcards' AND policyname = 'Public read default flashcards'
  ) THEN
    CREATE POLICY "Public read default flashcards" ON public.flashcards FOR SELECT USING (is_custom = false OR auth.uid() = user_id);
  END IF;
END
$$;
