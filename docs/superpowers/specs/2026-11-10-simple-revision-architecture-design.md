# Simple Revision — Technical Architecture & System Design Specification

**Date:** 2026-11-10  
**Status:** Reviewed by Builder Check — Ready for User Approval  
**Canonical Visual Spec:** [DESIGN.md](file:///Users/harrismiao/Coding%20Projects/Simple%20Revision/DESIGN.md)  
**Approved Interactive Reference:** [docs/design-references/unified-consistent-system.html](file:///Users/harrismiao/Coding%20Projects/Simple%20Revision/docs/design-references/unified-consistent-system.html)  
**Product Handoff Report:** [docs/HANDOFF.md](file:///Users/harrismiao/Coding%20Projects/Simple%20Revision/docs/HANDOFF.md)  
**Curriculum Research Specifications:** `docs/curriculum-research/*.md` (`biology-hl.md`, `chemistry-sl.md`, `history-hl.md`, `english-literature-hl.md`, `french-b-sl.md`, `math-aa-sl.md`)

---

## 1. Intent & Why

**Simple Revision** is a 100% free, single-tier, unlimited-use International Baccalaureate (IB) Diploma revision web application built specifically for a student taking **6 exact IB DP subjects**:
1. **Biology HL** (First Assessment 2025 — Themes A–D × Levels 1–4)
2. **Chemistry SL** *(strictly SL, not HL)* (First Assessment 2025 — Structure 1–3 & Reactivity 1–3)
3. **History HL** (Paper 1 OPCVL, Paper 2 World History, Paper 3 Regional HL, Historical Investigation IA)
4. **English Literature HL** (Paper 1 Unseen, Paper 2 Comparative, HL Essay, Individual Oral)
5. **French B SL** (5 IB Themes, Paper 1 Text-Type Writing, Paper 2 Reading, Individual Oral Stimulus)
6. **Math AA SL** (Topics 1–5, Paper 1 Non-Calculator, Paper 2 GDC, Mathematical Exploration IA)

It replaces commercial revision platforms (specifically RevisionDojo) by eliminating all paywalls, weekly energy/XP limits, upgrade banners, and filler video content while preserving high-density IB markscheme practice, spaced repetition, subject-specific reference tools, and a criterion-anchored AI Essay & Coursework Studio powered by the student's own free **Gemini API key (BYOK)** stored in their local account database.

---

## 2. Goals, Non-Goals & Anti-Goals

### Goals
- **Zero-Config Local Persistence & Mandatory Auth:** Every user signs up / signs in before reaching any application route. Accounts, encrypted/stored Gemini API keys, question attempts, mistakes log, spaced-repetition flashcard schedules, study notes, coursework drafts, inline essay annotations, and study planner tasks persist in a single local SQLite database (`data/simple-revision.db`).
- **Strict Visual Fidelity to `DESIGN.md` & `unified-consistent-system.html`:**
  - Global neutral chrome (`#FFFFFF` canvas, `#FAFAFA` `224px` sidebar, `#F4F4F5` pills/hovers, `#E4E4E7` `1px` hairlines and active nav rows, `1.8px` monochrome outline SVGs, `Plus Jakarta Sans` + `Inter` + `JetBrains Mono`).
  - Per-subject blurred nature aurora header wash dissolving to `#FFFFFF` below underline tabs (`Resources | Topics & Progress | Study Plan | Saved`), `1 → 2 → 3` Coursework IA stepper card, Subject Spotlight strip, and borderless 2-column tool grids (`42×42px` pastel icon tiles).
  - **Sprout** nature mascot SVG components across 4 pose states (*Guide Sprout*, *Snoozing Sprout*, *Baby Seed*, *Notepad Sprout*).
- **Repo-Validated Curriculum & Question Ingestion Pipeline:** A deterministic CLI seed pipeline (`npm run content:seed`) using **Zod** schemas and a Markdown/JSON adapter layer that ingests the structured curriculum specs in `docs/curriculum-research/*.md` and JSON packs in `content/` into SQLite.
- **Complete Interactive Feature Coverage Across All 6 Subjects:**
  - Question Bank Runner + Exam Builder + Mistakes Log
  - Subject-unique interactive tools (Chemistry SL Data Booklet + Periodic Table + Calculation Step Checker; Math AA SL Formula Booklet + Worked Step Walkthroughs; Biology HL Cell/Pathway Visualizations; History HL OPCVL Source Trainer + Essay Outline Builder + Historiography Timelines; English Lit HL Literary Device Drill + Global Issue Bank; French B SL Text-Type & Register Drills + Grammar & Conjugation Lab)
  - Active Recall Suite (SM-2 Spaced-Repetition Flashcards, Blurting, Teach Sprout)
  - Knowledge & Planning (Study Guides, Cheatsheets, 6-state Topics & Progress mastery tracker, My Notes with subject folders, Study Planner with `Focus | Week | Month` views)
  - Coursework Studio & `60% / 40%` Split-Pane AI Essay Editor with Criterion A–D/E scoring, passage highlight marks, inline `Accept Edit / Dismiss` diff suggestions, and advisory Originality/AI signal breakdown.

### Non-Goals
- Multi-tenant billing, subscription tiers, Stripe integration, or cloud OAuth providers.
- Any IB subjects outside the locked 6 subjects, MYP, or University curricula.
- Community question uploads or peer forums.

### Anti-Goals (Failure Conditions Even If Technically Working)
- **Dead or Stubbed UI Controls:** No button, tab, sidebar link, or topbar icon (`⌘K` search, timer, notifications, streak, `Gemini Key Ready` pill, `DP | My 6` toggle) may be a static placeholder.
- **In-App AI Question Generation:** Never generate practice questions on the fly via LLM at runtime; all questions come from the validated repository seed pipeline.
- **Visual Drift:** Never use saturated purple/indigo gradients, heavy drop shadows, emoji icons in navigation, or inconsistent serif/sans font mixing across views.
- **Boolean Flag Soup:** Never use loose `isLoading`/`isError` booleans; all asynchronous views must use explicit finite state machines (`type ScreenState = 'idle' | 'loading' | 'success' | 'error' | 'empty'`).
- **Any Video Elements:** Strictly zero `<video>`, YouTube embeds, or video walkthrough links.

---

## 3. Architectural Approaches Considered

1. **Approach 1 (Selected): Next.js 15 (App Router) + Local SQLite (`better-sqlite3` + Drizzle ORM) + Cookie Session Auth + TipTap + Zod Repo Seed Pipeline**
   - *Pros:* Runs 100% locally on macOS (`node v24.15.0`, `/usr/bin/sqlite3`) with zero cloud setup blockers; full relational SQL querying for questions, syllabus taxonomy, and user progress; server route handlers can read the user's Gemini API key directly from their authenticated SQLite profile; ProseMirror/TipTap marks keep inline essay highlights and diff replacements anchored even as the student edits elsewhere in the document.
   - *Cons:* Local single-machine database by default (though Drizzle schema is portable).
2. **Approach 2: Next.js 15 + Hosted Supabase (Auth + Postgres) + TipTap**
   - *Rejected because:* Requires external cloud project provisioning and credentials before Slice 1 can run locally.
3. **Approach 3: Vite SPA + IndexedDB (Dexie.js) + Custom Substring Essay Anchoring**
   - *Rejected because:* Browser-only storage is wiped if site data is cleared, and regex substring matching breaks inline essay diff replacements when text changes.

---

## 4. Technical Stack & Core Dependencies

- **Runtime & Framework:** Node.js `v24.x`, Next.js 15 (App Router, TypeScript strict mode)
- **Styling & Typography:** Tailwind CSS v4 + CSS custom properties mapped 1:1 to `DESIGN.md` tokens (`--bg-canvas`, `--bg-sidebar`, `--bg-hover`, `--border`, `--ink`, `--muted`, `--wash-1..3`, `--subj-accent`, `--subj-soft`), `next/font/google` for `Plus Jakarta Sans`, `Inter`, and `JetBrains Mono`.
- **Math & Chemical Notation:** `katex` (rendering inline `$...$` and block `$$...$$` LaTeX + `\ce{...}` mhchem formulas across Math AA SL, Chemistry SL, and Biology HL).
- **Database & ORM:** `better-sqlite3` + `drizzle-orm` + `drizzle-kit` storing data in `./data/simple-revision.db` locally (WAL mode enabled), with automatic Vercel serverless resilience: at build time `./data/simple-revision.db` is pre-seeded, and when running on Vercel (`process.env.VERCEL === '1'`), `src/db/index.ts` copies the pre-seeded database to `/tmp/simple-revision.db` (or auto-seeds `/tmp/simple-revision.db` on cold start) with `serverExternalPackages: ['better-sqlite3']` and `outputFileTracingIncludes` in `next.config.ts`.
- **Authentication:** Custom lightweight session auth using Node `crypto.scrypt` password hashing + `jose` signed HTTP-only session cookies (`sr_session`), backed by `users` and `sessions` tables in SQLite and enforced by Next.js `middleware.ts`. On Vercel serverless instances, the signed `sr_session` JWT also carries `{ userId, email, name, streakCount, preferredGeminiModel }` (and an optional signed `sr_gemini` cookie stores the user's Gemini key) so `getCurrentUser()` transparently re-hydrates the user row in `/tmp/simple-revision.db` across serverless cold starts without ever logging the user out.
- **Rich Text & Essay Studio:** `@tiptap/react`, `@tiptap/starter-kit`, plus two custom ProseMirror Mark extensions:
  - `CriterionHighlightMark` (`data-annotation-id`, `data-criterion`, warm amber underline `#FEF3C7` / `#D97706`)
  - `SuggestedEditMark` (`data-annotation-id`, `data-replacement`, renders original text with `#9CA3AF` strikethrough alongside an inline preview pill of the `#ECFDF5` / `#059669` replacement; clicking **Accept Edit** executes a TipTap transaction replacing the marked range with `data-replacement` and removing the mark; clicking **Dismiss** removes the mark while keeping original text).
- **AI SDK & Validation:** `@google/genai` (official Google Gen AI SDK, default model `gemini-2.5-flash`, fallback `gemini-2.5-pro` selectable in Settings) + `zod` for strict schema validation of all structured JSON outputs and curriculum seed files.
- **Testing:** `vitest` + `@testing-library/react` for unit/integration tests; Playwright / browser verification at `375px`, `768px`, and `1280px`.

---

## 5. Database Schema (`src/db/schema.ts`)

All tables reside in `./data/simple-revision.db`:

### 5.1 Auth & User Profile
- `users`:
  - `id` (text PK, UUID)
  - `email` (text unique, not null)
  - `name` (text, not null — e.g. `"Harris"`)
  - `passwordHash` (text, not null)
  - `geminiApiKey` (text, nullable — stored directly in SQLite per user decision so it persists across browsers/sessions)
  - `preferredGeminiModel` (text, default `'gemini-2.5-flash'`)
  - `streakCount` (integer, default `1`)
  - `lastActiveDate` (text, YYYY-MM-DD)
  - `createdAt`, `updatedAt` (integer timestamps)
- `sessions`:
  - `id` (text PK)
  - `userId` (text FK → `users.id` cascade)
  - `expiresAt` (integer timestamp)
- `notifications`:
  - `id` (text PK), `userId` (text FK), `title` (text), `body` (text), `href` (text), `isRead` (integer boolean), `createdAt` (integer)

### 5.2 Curriculum Taxonomy & Reference Content (Seeded via Repo Pipeline)
- `subjects`:
  - `slug` (text PK: `'bio' | 'chem' | 'hist' | 'eng' | 'fr' | 'math'`)
  - `name` (text: `'Biology'`, `'Chemistry'`, `'History'`, `'English Literature'`, `'French B'`, `'Math AA'`)
  - `level` (text: `'HL' | 'SL'`)
  - `syllabusFirstAssessment` (text: `'2025' | '2020' | '2021'`)
  - `themeTokensJson` (text JSON: `wash1`, `wash2`, `wash3`, `accent`, `soft`, `cardGradient`)
  - `iaConfigJson` (text JSON: `iaLabel`, `iaTitle`, `steps[]`, `criteria[]`, `wordLimit`)
  - `spotlightJson` (text JSON: `title`, `pills[]`)
- `syllabus_topics`:
  - `id` (text PK — e.g., `'bio-A1.1'`, `'chem-S1.1'`, `'math-SL1.1'`, `'hist-P2-T10'`, `'eng-P1'`, `'fr-T1'`)
  - `subjectSlug` (text FK → `subjects.slug`)
  - `unitCode` (text — e.g., `'Theme A'`, `'Structure 1'`, `'Topic 1'`)
  - `unitTitle` (text)
  - `code` (text — e.g., `'A1.1'`, `'S1.1'`, `'SL 1.1'`)
  - `title` (text — e.g., `'Water'`, `'Introduction to the particulate nature of matter'`)
  - `levelScope` (text — `'SL/Core' | 'HL Extension' | 'HL Only'`)
  - `recommendedHours` (real)
  - `guidingQuestionsJson` (text JSON `string[]`)
  - `understandingsJson` (text JSON `Array<{ code: string; text: string; isHL: boolean }>`)
  - `studyGuideMarkdown` (text — full structured study guide notes)
  - `cheatsheetMarkdown` (text — high-yield condensed formulas, definitions, traps)
  - `blurtChecklistJson` (text JSON `string[]` — canonical key concepts used as ground truth when grading Blurting recall)
- `questions`:
  - `id` (text PK — e.g., `'chem-s2-q001'`)
  - `subjectSlug` (text FK → `subjects.slug`)
  - `topicId` (text FK → `syllabus_topics.id`)
  - `paper` (text — `'Paper 1' | 'Paper 1A' | 'Paper 1B' | 'Paper 2' | 'Paper 3'`)
  - `questionType` (text — `'mcq' | 'short_answer' | 'data_based' | 'extended_response' | 'source_opcvl'`)
  - `calculatorPolicy` (text — `'allowed' | 'non_calculator' | 'gdc_required'`)
  - `difficulty` (text — `'foundation' | 'standard' | 'challenging'`)
  - `marks` (integer)
  - `commandTerm` (text — e.g., `'Explain'`, `'Calculate'`, `'Evaluate'`, `'To what extent'`)
  - `stemMarkdown` (text — supports KaTeX math/mhchem & source excerpts)
  - `stimulusMarkdown` (text, nullable — data table, historical source, literary passage, or French reading text)
  - `optionsJson` (text JSON, nullable — `Array<{ id: 'A'|'B'|'C'|'D'; text: string }>` for MCQs)
  - `correctOptionId` (text, nullable — `'A'|'B'|'C'|'D'`)
  - `markschemePointsJson` (text JSON — `Array<{ pointId: string; requirement: string; marks: number; notes?: string }>`)
  - `walkthroughStepsJson` (text JSON — `Array<{ stepNumber: number; title: string; explanationMarkdown: string }>`)
  - `commonPitfallsJson` (text JSON `string[]`)
  - `isDailyEligible` (integer boolean)
- `subject_reference_items`:
  - `id` (text PK)
  - `subjectSlug` (text FK)
  - `toolType` (text — `'data_booklet' | 'periodic_table' | 'calc_checker' | 'formula_booklet' | 'bio_diagram' | 'opcvl_source' | 'historiography_timeline' | 'essay_outline' | 'literary_device' | 'global_issue' | 'text_type_drill' | 'grammar_lab' | 'coursework_exemplar'`)
  - `category` (text)
  - `title` (text)
  - `codeOrSymbol` (text, nullable)
  - `payloadJson` (text JSON — structured interactive data for the specific tool)

### 5.3 User Learning State & Persistence
- `topic_progress`:
  - `id` (text PK), `userId` (text FK), `topicId` (text FK)
  - `status` (text — 6-state IB mastery tracker: `'mastered' | 'confident' | 'practicing' | 'review_needed' | 'struggling' | 'unseen'`)
  - `updatedAt` (integer)
- `question_attempts`:
  - `id` (text PK), `userId` (text FK), `questionId` (text FK)
  - `userAnswer` (text)
  - `awardedMarks` (integer), `maxMarks` (integer)
  - `matchedPointsJson` (text JSON `string[]`), `missedPointsJson` (text JSON `string[]`)
  - `aiFeedbackMarkdown` (text, nullable)
  - `durationSeconds` (integer)
  - `createdAt` (integer)
- `mistakes_log`:
  - `id` (text PK), `userId` (text FK), `questionId` (text FK)
  - `userAnswer` (text)
  - `missedConceptsJson` (text JSON `string[]`)
  - `userReflection` (text, nullable)
  - `resolved` (integer boolean, default `0`)
  - `createdAt` (integer)
- `exam_sessions`:
  - `id` (text PK), `userId` (text FK), `subjectSlug` (text FK)
  - `title` (text), `paperFilter` (text), `timeLimitMinutes` (integer)
  - `questionIdsJson` (text JSON `string[]`)
  - `answersJson` (text JSON `Record<string, string>`)
  - `scoresJson` (text JSON `Record<string, number>`)
  - `status` (text — `'in_progress' | 'submitted'`)
  - `createdAt`, `completedAt` (integer)
- `flashcard_decks` & `flashcards`:
  - `flashcard_decks`: `id` (PK), `userId` (nullable for system decks, set for custom decks), `subjectSlug`, `topicId` (nullable), `title`, `description`
  - `flashcards`: `id` (PK), `deckId` (FK), `userId` (nullable), `frontMarkdown`, `backMarkdown`, `tagsJson`, `easeFactor` (real, default `2.5`), `intervalDays` (integer, default `0`), `repetitions` (integer, default `0`), `dueAt` (integer timestamp)
- `recall_sessions` (Blurting & Teach Sprout history):
  - `id` (text PK), `userId` (text FK), `subjectSlug` (text FK), `topicId` (text FK)
  - `mode` (text — `'blurting' | 'teach_sprout'`)
  - `transcriptOrBlurtJson` (text JSON)
  - `scorePercent` (integer, nullable)
  - `feedbackJson` (text JSON — covered points, missed points, follow-up questions)
  - `createdAt` (integer)
- `notes`:
  - `id` (text PK), `userId` (text FK), `subjectSlug` (text FK), `topicId` (text FK, nullable)
  - `title` (text), `contentMarkdown` (text), `excerpt` (text), `isPinned` (integer boolean), `updatedAt` (integer)
- `essay_documents`:
  - `id` (text PK), `userId` (text FK), `subjectSlug` (text FK)
  - `documentType` (text — `'ia' | 'ee' | 'tok' | 'paper_essay' | 'french_writing'`)
  - `currentStep` (integer — `1 | 2 | 3`)
  - `title` (text), `researchQuestion` (text)
  - `contentJson` (text JSON — TipTap ProseMirror document JSON)
  - `plainText` (text — for word count & search)
  - `estimatedScore` (integer, nullable), `maxScore` (integer, default `24` or `25`)
  - `criteriaScoresJson` (text JSON — `Array<{ criterion: string; score: number; maxScore: number; rationale: string }>`)
  - `originalitySignalJson` (text JSON — `{ riskPercent: number; label: 'Low'|'Moderate'|'Elevated'; metrics: Array<{ name: string; value: string; note: string }>; advisoryNote: string }`)
  - `annotationsJson` (text JSON — `Array<{ id: string; type: 'comment'|'edit'; criterion: string; quote: string; comment: string; replacementText?: string; status: 'open'|'accepted'|'dismissed' }>`)
  - `updatedAt` (integer)
- `study_tasks`:
  - `id` (text PK), `userId` (text FK), `subjectSlug` (text FK, nullable), `topicId` (text FK, nullable)
  - `title` (text), `scheduledDate` (text YYYY-MM-DD), `startTime` (text HH:MM, nullable), `durationMinutes` (integer, default `45`)
  - `taskType` (text — `'questions' | 'flashcards' | 'blurting' | 'essay' | 'reading'`)
  - `completed` (integer boolean, default `0`)
- `bookmarks`:
  - `id` (text PK), `userId` (text FK), `subjectSlug` (text FK)
  - `itemType` (text — `'question' | 'topic' | 'note' | 'tool' | 'exemplar'`)
  - `itemId` (text), `title` (text), `subtitle` (text), `href` (text), `createdAt` (integer)

---

## 6. Route Map & Screen Architecture

Every sidebar link, topbar action, and Subject Hub tool card maps to a concrete route inside `src/app/`:

### 6.1 Public Auth Routes (`src/app/(auth)/`)
- `/login` & `/signup`: Clean centered card on `#FAFAFA` neutral background with Sprout emblem, email/name/password form, and automatic database seeding check on first boot.

### 6.2 Authenticated App Shell (`src/app/(app)/layout.tsx`)
Renders the persistent `54px` Top Utility Bar and `224px` `#FAFAFA` Left Sidebar (`drawer` below `768px`, collapsible `768px–1023px`, fixed `≥1024px`):
- **Top Utility Bar:**
  - Brand logo (`Simple Revision` → `/`)
  - Search pill (`Search syllabus, questions, notes...` + `⌘K`) → opens `CommandSearchModal` querying `syllabus_topics`, `questions`, `notes`, and `subject_reference_items`
  - `● Gemini Key Ready` / `○ Set Gemini Key` status pill → opens quick Gemini key modal or `/settings`
  - Study Timer button → opens interactive Pomodoro (`25:00`) / Custom Exam timer popover that stays running in the topbar across route transitions
  - Notifications bell → popover listing unread study reminders and milestone alerts (`notifications` table)
  - Streak flame pill (`🔥 N`) → shows daily activity streak
  - Sprout avatar → account menu & sign out
- **Left Sidebar (`DP | My 6` toggle + navigation groups):**
  - `/` — **Homepage (Neutral):** Sky-horizon aurora header, announcement bar (`Try the AI Essay Studio`), two-tone greeting (`Good evening, / [User Name]`), `SPROUT DAILY #N` 5-question cross-subject sprint card, and the 6 custom-illustrated Subject Cards (`Biology HL`, `Chemistry SL`, `History HL`, `English Literature HL`, `French B SL`, `Math AA SL`).
  - `/subjects/[slug]` — **Subject Hub (`bio`, `chem`, `hist`, `eng`, `fr`, `math`):**
    - Per-subject aurora wash header (`--wash-1..3`), two-tone `Subject / Level` heading, and 4 underline tabs:
      1. `Resources` (Default): Coursework IA `1 → 2 → 3` stepper card (`Setup >`), Subject Spotlight strip (clickable quick-launch pills), borderless 2-column **Practice** grid, and borderless 2-column **Learn & Coursework** grid.
      2. `Topics & Progress`: Complete syllabus tree for that subject with 6-state mastery selector (`Mastered` → `Unseen`), hour weights, HL/SL badges, and direct links to Topic Study Guide, Questions, and Blurting.
      3. `Study Plan`: Subject-filtered view of `study_tasks` with one-click "Generate 7-Day Revision Schedule" for this subject.
      4. `Saved`: Subject-filtered bookmarks (`bookmarks` table) with instant remove/open controls.
  - `/tutor` — **Sprout AI Tutor:** Dedicated Socratic IB tutor chat with subject/topic context selector, Snoozing Sprout empty state, and one-click "Explain Markscheme" / "Quiz Me" prompts.
  - `/planner` — **Study Planner:** `Focus (Today) | Week | Month` segmented views, task creation modal, syllabus topic linking, and completion checkboxes.
  - `/notes` & `/notes/[id]` — **My Notes:** Subject folders, note thumbnail grid, Markdown + KaTeX editor, and one-click "Generate Flashcards from Note" & "Open in Essay Studio".
  - `/questions` — **Question Bank Runner & Exam Builder:**
    - Filter bar: Subject (`All 6` or specific subject), Syllabus Topic, Paper (`Paper 1/1A/1B/2/3`), Calculator policy, Difficulty, and Mode (`Practice Runner` | `Exam Builder` | `Mistakes Log` | `Sprout Daily`).
    - **Question Runner:** Displays metadata tags (`SL Core`, `Paper 2`, `4 Marks`), command term highlight, KaTeX-rendered stem + stimulus, MCQ option cards or free-response textarea, live timer, `Reveal Markscheme`, `Step-by-Step Walkthrough`, `Save to Mistakes Log`, `Ask Sprout Tutor`, and `Grade My Answer` (awards point-by-point IB marks via Gemini or deterministic MCQ check).
  - `/study-guides` & `/cheatsheets` — **Study Notes & Cheatsheets:** Filterable by subject and syllabus subtopic, rendering structured understandings, exam traps, and KaTeX formulas with bookmarking.
  - `/flashcards` — **Spaced-Repetition Flashcards:** Deck browser by subject + interactive SM-2 review runner (`Again`, `Hard`, `Good`, `Easy`) with keyboard shortcuts (`Space` to flip, `1–4` to rate).
  - `/essay-studio` & `/essay-studio/[id]` — **AI Essay & Coursework Studio (`60% / 40%` Split View):**
    - Top bar: `1 Subject → 2 Assignment Type (IA / EE / TOK / Paper Essay / French Text) → 3 Draft Editor` stepper, `Originality Signal` pill, `Est. Score: X / Y` pill, and `Review Draft with Gemini` CTA.
    - Left (`60%`): TipTap document editor with title, research question input, word count, and inline amber highlights + emerald/strikethrough diff suggestions.
    - Right (`40%`): Tabbed rail (`Inline Feedback` | `Criterion Rubric` | `Originality & AI Signal` | `Ask Sprout`) with `Accept Edit` / `Dismiss` buttons on every edit card.
  - `/coursework` — **Coursework Guides & Exemplars:** Interactive `1 → 2 → 3` IA/EE/TOK setup guides, official IB criterion matrices (e.g., Biology/Chemistry `24 marks`, History `25 marks`, Math AA `20 marks`, English Lit HL Essay `20 marks`), and annotated high-scoring exemplar sections.
  - `/tools/[toolSlug]` — **Dedicated Interactive Subject & Recall Tools:**
    - `/tools/blurting` — **Blurting Studio** (Notepad Sprout pose, topic selector, timed blank-page recall, checklist comparison against `blurtChecklistJson` + Gemini synthesis).
    - `/tools/teach-sprout` — **Teach Sprout** (Baby Seed Sprout pose, Feynman 3-turn Socratic explanation loop where Sprout asks probing student questions and scores clarity).
    - `/tools/originality-check` — **Standalone Plagiarism & Advisory AI Signal Analyzer** (runs deterministic linguistic burstiness/uniformity heuristics + optional Gemini stylistic audit, always labeled as advisory).
    - `/tools/data-booklet` — **Chemistry SL Interactive IB Data Booklet & Periodic Table** (searchable constants, IR/NMR tables, bond enthalpies, interactive 118-element Periodic Table modal).
    - `/tools/calc-checker` — **Chemistry SL Calculation Step Checker** (checks unit conversions, significant figures, state symbols, and stoichiometry step-by-step).
    - `/tools/formula-booklet` — **Math AA SL Interactive Formula Booklet** (Topics 1–5 formulas in KaTeX with linked worked examples and "Not in Booklet — Must Memorize" toggle).
    - `/tools/bio-visualizations` — **Biology HL Interactive Cell & Pathway Diagrams** (interactive SVG diagrams for Membrane Transport, Chemiosmosis/Respiration, Photosynthesis Calvin/Light stages, and Sarcomere/Action Potential with clickable node explanations).
    - `/tools/opcvl-trainer` — **History HL Paper 1 OPCVL Source Trainer & Essay Outline Builder & Historiography Timelines**.
    - `/tools/english-studio` — **English Lit HL Literary Device Drill & Global Issue Matrix**.
    - `/tools/french-studio` — **French B SL Text-Type Register Studio & Grammar/Conjugation Lab**.
  - `/saved` — **Global Saved Items:** Unified bookmark view across all 6 subjects.
  - `/settings` — **Settings & Gemini Key:** Profile name editor, Gemini API Key input with **Test Connection** button (verifies key against `gemini-2.5-flash` and saves to `users.geminiApiKey` in SQLite), model selector, and database reset/re-seed utility.

---

## 7. Repo Curriculum & Question Ingestion Pipeline (`scripts/seed-content.ts`)

Because 6 sub-agents are generating deep curriculum markdown specifications in `docs/curriculum-research/*.md` (and future JSON packs can be dropped into `content/`), the seed pipeline works in two stages:

1. **Stage 1 — Structured Curriculum & Starter Pack Loader (`src/content/`):**
   - Contains strict Zod schemas (`SyllabusTopicSchema`, `QuestionItemSchema`, `ReferenceItemSchema`, `FlashcardDeckSchema`).
   - Ships with complete, Zod-validated canonical datasets for all 6 subjects derived directly from `docs/curriculum-research/*.md`:
     - All syllabus topics & subtopics across the 6 subjects (e.g., all 40 Biology HL subtopics `A1.1–D4.3`, all Chemistry SL subtopics `S1.1–R3.4`, all 51 Math AA SL subtopics `SL1.1–SL5.8`, History HL Paper 1/2/3 & IA topics, English Lit HL Paper 1/2/HL Essay/IO modules, French B SL 5 Themes & grammar/text-type modules).
     - Multi-question practice packs per subject covering MCQ, short-answer, data-based, OPCVL source, and extended essay prompts with point-by-point IB markschemes and step-by-step walkthroughs.
     - Complete interactive reference data for all subject tools (Chemistry SL Data Booklet tables + Periodic Table elements, Math AA SL Formula Booklet items, Biology HL interactive pathway nodes, History HL OPCVL sources & historiographical schools, English Lit HL literary devices & Global Issues, French B SL text-type conventions & verb conjugation tables, and IA/EE/TOK rubrics + annotated exemplars).
2. **Stage 2 — Custom Drop-In Adapter (`content/custom/*.json` & `docs/curriculum-research/*.md`):**
   - Running `npm run content:seed` parses both the built-in canonical TypeScript/JSON packs and any additional `.json` packs added to `content/questions/` through `QuestionItemSchema.safeParse()`, upserting valid items into SQLite and printing a clear validation summary.

---

## 8. BYOK Gemini AI Engine & Offline/No-Key Resilience

All AI endpoints (`/api/ai/grade-question`, `/api/ai/review-essay`, `/api/ai/tutor`, `/api/ai/blurting`, `/api/ai/teach-sprout`, `/api/ai/test-key`) share a single server helper (`src/lib/gemini.ts`):

1. **Key Resolution Order:**
   - First checks `users.geminiApiKey` in SQLite for the logged-in user.
   - Second checks an optional `x-gemini-key` request header (if testing a key before saving).
   - Third falls back to `process.env.GEMINI_API_KEY` if present in `.env.local`.
2. **Structured Output Contract:**
   - Every Gemini call specifies `responseMimeType: 'application/json'` and a `responseSchema`, then parses the response through a strict **Zod schema** before returning to the client.
3. **Deterministic Fallback / Key-Missing UX:**
   - If no Gemini key is configured yet, non-AI features (Question Bank, Markscheme reveal, Self-grading checklist, Flashcards, Study Guides, Cheatsheets, Data/Formula Booklets, Planner, Notes, Essay writing, Advisory Originality heuristic check) work 100% offline.
   - For AI actions (`Grade My Answer`, `Review Draft`, `Blurting Check`), if no Gemini key is saved, the UI offers both:
     1. An inline **Connect Gemini Key** modal to paste the key immediately without losing work on the current screen, AND
     2. A **Deterministic Rubric / Checklist Mode** (e.g., keyword & checklist matching against `markschemePointsJson` or `blurtChecklistJson`) so the feature can still be tested and used even before a live API key is entered.

---

## 9. Finite State Machine (FSM) & UI Quality Mandate

- Every screen/panel uses an explicit discriminated union state (`type ScreenState<T> = { status: 'idle' } | { status: 'loading' } | { status: 'success'; data: T } | { status: 'empty'; message: string } | { status: 'error'; message: string }`) or `useReducer`.
- All interactive elements include `transition-colors duration-150` and `focus-visible:ring-2`.
- Responsive layouts are verified at `375px` (mobile drawer), `768px` (tablet 2-col), and `1280px` (desktop `224px` sidebar + `820px`/`920px` centered workspace).
