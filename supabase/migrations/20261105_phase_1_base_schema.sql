-- Phase 1 Base Schema: Core tables referenced by Phase 2 RLS and Phase 3 FTS

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  exam_session TEXT DEFAULT 'May 2026 Session',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.subjects (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  level TEXT CHECK (level IN ('HL', 'SL')) NOT NULL,
  subtitle TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

INSERT INTO public.subjects (id, code, name, level, subtitle)
VALUES
  ('biology_hl', 'BIO_HL', 'Biology HL', 'HL', 'Cell Biology & Genetics'),
  ('history_hl', 'HIST_HL', 'History HL', 'HL', 'Authoritarian States & Cold War'),
  ('english_lit_hl', 'ENG_LIT_HL', 'English Literature HL', 'HL', 'Guided Literary Analysis'),
  ('math_aa_sl', 'MATH_AA_SL', 'Mathematics AA SL', 'SL', 'Calculus & Functions'),
  ('french_b_sl', 'FR_B_SL', 'French B SL', 'SL', 'Language & Text Handling'),
  ('chemistry_sl', 'CHEM_SL', 'Chemistry SL', 'SL', 'Stoichiometry & Structure')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.topics (
  id TEXT PRIMARY KEY,
  subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  topic_number TEXT NOT NULL,
  title TEXT NOT NULL,
  subtopics TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.questions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  paper_number INT CHECK (paper_number IN (1, 2, 3)) NOT NULL,
  prompt_text TEXT NOT NULL,
  mark_value INT NOT NULL DEFAULT 1,
  command_term TEXT DEFAULT '',
  official_markscheme_text TEXT NOT NULL,
  question_type TEXT CHECK (question_type IN ('ESSAY', 'SHORT_ANSWER', 'MCQ', 'CALCULATION')) NOT NULL DEFAULT 'SHORT_ANSWER',
  mcq_options TEXT[],
  diagram_url TEXT,
  difficulty_tier TEXT CHECK (difficulty_tier IN ('FOUNDATION', 'STANDARD', 'CHALLENGER')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.flashcards (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  topic_id TEXT REFERENCES public.topics(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_custom BOOLEAN NOT NULL DEFAULT false,
  front_prompt TEXT NOT NULL,
  back_answer TEXT NOT NULL,
  key_terms TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.user_flashcard_reviews (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  flashcard_id TEXT NOT NULL REFERENCES public.flashcards(id) ON DELETE CASCADE,
  stability DOUBLE PRECISION NOT NULL DEFAULT 0,
  difficulty DOUBLE PRECISION NOT NULL DEFAULT 0,
  reps INT NOT NULL DEFAULT 0,
  lapses INT NOT NULL DEFAULT 0,
  last_review_at TIMESTAMPTZ,
  next_review_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, flashcard_id)
);

ALTER TABLE public.user_flashcard_reviews ENABLE ROW LEVEL SECURITY;
