# GEMINI.md: Instructions for AI Coding Assistants in `ib revise`

## Project Identity & Mission
**ib revise** is an ultra-minimalist, calm revision platform for International Baccalaureate (IB) Diploma candidates.
The platform is designed to replace stressful, cluttered, and gamified interfaces with clean, distraction-free study tools.

### Core Features
1. **6 Target Subjects**:
   - Biology HL
   - History HL
   - English Literature HL
   - Mathematics AA SL
   - French B SL
   - Chemistry SL
2. **Dedicated IB Core Category**:
   - Theory of Knowledge (TOK)
   - Extended Essay (EE)
   - Internal Assessment (IA Support)
3. **Core Study Engines**:
   - Interactive Active-Recall Flashcards with Spaced Repetition (FSRS/SM-2).
   - High-Volume Question Bank architected to search and filter 30,000+ past paper problems.
   - Multi-User Authentication and private progress isolation powered by Supabase.

---

## Architectural Guardrails for AI Assistants

### 1. Design System Enforcement (STRICT)
All components MUST strictly comply with DESIGN.md:
- **Base Surfaces**: Warm charcoal black (`#0e0e11`), card surface (`#141419`), raised hover surface (`#1b1b22`).
- **Typography**: **Plus Jakarta Sans** only. NEVER use monospaced fonts (`JetBrains Mono`, `Courier`, `Roboto Mono`) for headings or body copy.
- **Accent Color**: Single vibrant pop: **Blush Pink (`#f4a7b9`)** with gentle rose hover glow (`#ffd2dc`).
- **Geometry**: Generously rounded containers (`rounded-xl`, `rounded-2xl`) and full pill buttons (`rounded-full`). Never use sharp right-angle blocks (`rounded-none`).

### 2. Prohibited "Vibe-Coding" Anti-Patterns (Anti-AI-Slop Rules)
When writing frontend components, AI assistants MUST NOT fall into predictable LLM training-data clichés:
- **No Top Navigation Bloat**: Never add `WORKSPACE / Overview / All Subjects` breadcrumbs.
- **No Vanity KPI Widgets**: Never add fake progress percentages, arbitrary study clocks (`45m / 90m completed`), or 4-column SaaS stat rows.
- **No AI Slop Color Clichés**: Never use `indigo`/`purple`/`cyan` neon glows, floating background gradient blobs, or muddy `slate` backgrounds.
- **No Card-in-Card Redundancy**: Never nest bordered cards inside bordered cards; use whitespace and `1px` `#23232a` dividers instead.
- **No Sparkle/Emoji Badges or Generic Icon Grids**: Never use `✨` / `🚀` pill badges or repetitive 3-column generic icon blurbs; every preview card must display authentic IB syllabus context (e.g., `M23-TZ2-HL-P1-Q6`, `Cell Biology • Topic 1.2`).
- **No Uninvited Font Drift**: Never fall back to `Inter`, `Roboto`, or monospace fonts (`JetBrains Mono`, `Courier`); enforce **Plus Jakarta Sans** globally.

### 3. High-Volume Data Rules (30,000 Questions)
- **NEVER** import or load large JSON question arrays directly into client components.
- All question queries MUST go through server-side Supabase client routes using pagination (`limit(20)`) and indexed filters (`subject_id`, `topic_id`, `paper`, `difficulty`).
- Full-text search queries must use the PostgreSQL `tsvector` index (`search_tokens`).

### 4. Multi-User Security
- All user tables (`user_question_activity`, `user_flashcard_reviews`, `ib_core_items`) MUST have Row-Level Security (RLS) enabled.
- Always use `auth.uid()` in RLS policies to prevent cross-account data leakage.

### 5. Verification Before Claiming Completion
- Run TypeScript type checks (`npm run type-check` or `next build`) before reporting any task complete.
- Verify component responsiveness across desktop and mobile viewports.
