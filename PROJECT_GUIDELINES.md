# Simple Revision — Complete Project Guidelines & System Specification

> **Purpose:** Single exhaustive specification of **Simple Revision**—what the product is, every locked user requirement, exact curriculum scope, visual design rules, database schema, route/API/component inventory, AI & content pipelines, and current implementation status. Every agent and sub-agent should consult this document alongside [GEMINI.md](./GEMINI.md) and [DESIGN.md](./DESIGN.md).

---

## 1. Product Vision & Locked Non-Negotiables

**Simple Revision** is a 100% free, single-tier, distraction-free International Baccalaureate (IB) Diploma revision workspace built to replace commercial IB platforms (specifically RevisionDojo) without paywalls, weekly energy limits, upgrade prompts, or video filler.

### Non-Negotiable Product Decisions

| Area | Exact Requirement |
| :--- | :--- |
| **Pricing & Access** | **Free-only single tier.** Every feature, subject, cheatsheet, exam builder, and coursework tool is unlocked. Strictly zero `Upgrade`, `PRO`, `XP`, `Energy ⚡`, or paywall banners. |
| **Authentication** | **Mandatory authentication from day one.** No guest mode, no skip button, and no `demoLogin` bypass. All user progress, notes, flashcards, essay drafts, mistakes, bookmarks, and study plans persist per account. |
| **Exact 6 IB Subjects** | **1. Biology HL** · **2. Chemistry SL** *(strictly SL, never HL)* · **3. History HL** · **4. English Literature HL** · **5. French B SL** · **6. Math AA SL**. No MYP, no University, no TOK homepage card, and no other IB subjects. |
| **Zero Video Policy** | **Strictly zero videos.** No `<video>` tags, YouTube embeds, or explainer video links. Walkthroughs and explanations must be clean step-by-step text and KaTeX math. |
| **No Community Uploads** | **Repo-managed content only.** No peer forums or user-submitted public question banks. |
| **AI Cost Model (BYOK)** | **Zero-server-bill BYOK:** Students supply their own Google AI Studio **Gemini API key** in `/settings` (or optionally during `/signup`), stored on their account (`users.geminiApiKey` + HTTP-only `sr_gemini` cookie) with optional `.env.local` `GEMINI_API_KEY` server fallback. Every AI endpoint must work offline via a deterministic local/rubric fallback when no key is active. |
| **Question Content Model** | **No runtime LLM question generation.** Practice questions are never generated on the fly by Gemini. All questions enter through the Zod-validated repository seed pipeline (`src/content/` + `content/questions/*.json` → `npm run content:seed`). |
| **Originality Policy** | **Advisory only.** Any AI/originality check (`src/lib/originality.ts`, `/tools/originality-check`, Essay Studio signal) must be explicitly labeled as an advisory linguistic/stylistic signal, never definitive proof of authorship. |

---

## 2. Exact 6 IB Diploma Subjects & Curriculum Inventory

All 6 subjects are defined in `src/content/subjects/*.ts`, validated by `SubjectPackSchema` (`src/content/schemas.ts`), and researched in depth in `docs/curriculum-research/*.md`.

| Slug | Subject & Level | Syllabus Version | Accent / Soft | IA / Coursework Config | Current Seeded Pack vs. Full Curriculum Spec |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `bio` | **Biology HL** | First Assessment **2025** | `#059669` / `#F0FDF4` | `Biology IA` · Scientific Investigation · `24 marks` · `3,000 words max` · `20%` | **8** topics, **6** questions, **3** ref items, **2** decks (**8** cards). Full 40-subtopic Themes A–D × Levels 1–4 spec in `docs/curriculum-research/biology-hl.md`. |
| `chem` | **Chemistry SL** | First Assessment **2025** | `#0D9488` / `#F0FDFA` | `Chemistry IA` · Scientific Investigation (SL) · `24 marks` · `3,000 words max` · `20%` | **6** topics, **6** questions, **3** ref items, **2** decks (**8** cards). Full Structure 1–3 & Reactivity 1–3 SL spec in `docs/curriculum-research/chemistry-sl.md`. |
| `hist` | **History HL** | 2017 Guide + **2020** Amendments | `#B45309` / `#FFFBEB` | `History IA` · Historical Investigation · `25 marks` · `2,200 words max` · `20%` | **6** topics, **6** questions, **4** ref items, **1** deck (**6** cards). Full Paper 1/2/3 & HL Europe spec in `docs/curriculum-research/history-hl.md`. |
| `eng` | **English Literature HL** | First Assessment **2021** | `#1D4ED8` / `#EFF6FF` | `English Lit HL` · Individual Oral & HL Essay · `20 marks` · `1,200–1,500w HL Essay · 15-min IO` · `40%` | **6** topics, **6** questions, **3** ref items, **1** deck (**6** cards). Full AOE 1–3, Paper 1/2, HLE, IO spec in `docs/curriculum-research/english-literature-hl.md`. |
| `fr` | **French B SL** | First Assessment **2020** | `#0284C7` / `#F0F9FF` | `French B SL` · Individual Oral Stimulus · `30 marks` · `12–15 minutes (15 min prep)` · `25%` | **7** topics, **7** questions, **8** ref items, **2** decks (**14** cards). Full 5 Themes, 29 subtopics, text types & grammar spec in `docs/curriculum-research/french-b-sl.md`. |
| `math` | **Math AA SL** | First Assessment **2021** | `#D97706` / `#FFFBEB` | `Math AA IA` · Mathematical Exploration · `20 marks` · `12–20 pages` · `20%` | **6** topics, **6** questions, **3** ref items, **1** deck (**5** cards). Full 51-subtopic Topics 1–5 SL spec in `docs/curriculum-research/math-aa-sl.md`. |

*(Plus 1 example custom drop-in question `chem-custom-q099` in `content/questions/custom-pack-example.json` loaded by `src/db/seed.ts`.)*

### Per-Subject Tools, Spotlight & Seeded Topics

1. **Biology HL (`bio`)**
   - **Spotlight (`Biology HL Lab & Syllabus Focus`):** 2025 Syllabus (Themes A–D), 20% IA Lab Weight, 44% Paper 2 Essays, Cell & Pathway Diagrams (`/tools/bio-visualizations`).
   - **Practice Tools (6):** Questionbank, Visualizations (`/tools/bio-visualizations`), Blurting, Teach Sprout, Exam Builder, Mistakes Log.
   - **Learn Tools (4):** Study Guide, Flashcards, Cheatsheets, AI Essay & IA Studio.
   - **Seeded Topics:** `bio-A1.1` (Water), `bio-A1.2` (Nucleic Acids), `bio-B1.2` (Proteins), `bio-B2.1` (Membranes and Membrane Transport), `bio-C1.2` (Cell Respiration), `bio-C1.3` (Photosynthesis), `bio-D1.1` (DNA Replication), `bio-D1.2` (Protein Synthesis).
2. **Chemistry SL (`chem`)**
   - **Spotlight (`Chemistry SL Tools & Formula Reference`):** 2025 SL Structure & Reactivity, Interactive Data Booklet (`/tools/data-booklet`), Periodic Table (`/tools/data-booklet?tab=periodic`), Stoichiometry & Energetics (`/tools/calc-checker`).
   - **Practice Tools (6):** Questionbank, Calculation Step Checker (`/tools/calc-checker`), Blurting, Teach Sprout, Exam Builder, Mistakes Log.
   - **Learn Tools (4):** IB Data Booklet (`/tools/data-booklet`), Study Guide, Flashcards, AI IA Studio.
   - **Seeded Topics:** `chem-S1.4` (Mole Concept & Ideal Gases), `chem-S2.2` (Covalent Model, VSEPR & IMFs), `chem-S3.1` (Periodic Trends & Organic Functional Groups), `chem-R1.1` (Enthalpy, Hess's Law & Bond Enthalpies), `chem-R2.2` (Kinetics & Dynamic Equilibrium), `chem-R3.1` (Proton Transfer & Electron Transfer).
   - **IB Accuracy Note:** Use IB 2025 STP molar gas volume `22.7 dm³ mol⁻¹` at `273 K, 100 kPa` (never legacy `22.4`).
3. **History HL (`hist`)**
   - **Spotlight (`History HL Essay & Source Architecture`):** Paper 1 OPCVL Source Drills, Paper 2 & 3 Comparative Essays, Historiography Schools, Timeline Builder.
   - **Practice Tools (6):** Questionbank, OPCVL Source Trainer, Essay Outline Builder, Teach Sprout, Exam Builder, Mistakes Log.
   - **Learn Tools (4):** Historiography Timelines, Study Notes, Flashcards, AI Essay & IA Editor.
   - **Seeded Topics:** `hist-p1-ps3a` (Japanese Expansion 1931–1941), `hist-p1-ps3b` (German/Italian Expansion 1933–1940), `hist-p2-wh10a` (Mao & Hitler Emergence/Consolidation), `hist-p2-wh10b` (Hitler & Mao Domestic Policies), `hist-p2-wh12` (Cold War Origins, Crises & End), `hist-p3-hl-euro` (Imperial Russia/USSR 1855–1924 & Interwar Dictatorships).
4. **English Literature HL (`eng`)**
   - **Spotlight (`English Literature HL Works & Craft`):** Paper 1 Unseen Prose/Poetry, Paper 2 Comparative Essay, 1,200–1,500w HL Essay, Literary Device Matrix.
   - **Practice Tools (6):** Questionbank, Literary Device Drill, Blurting, Teach Sprout, Exam Builder, Mistakes Log.
   - **Learn Tools (4):** Text & Author Guides, Quote Flashcards, Global Issue Bank, AI Essay & HL Editor.
   - **Seeded Topics:** `eng-aoe-1` (Close Reading & Formal Craft), `eng-aoe-2` (Cultural Contexts & Translation), `eng-aoe-3` (Comparative Architecture & Mythic Revisionism), `eng-p1-unseen` (Paper 1 HL Unseen Commentary), `eng-p2-comp` (Paper 2 Comparative Synthesis), `eng-hle-io` (HL Essay Line of Inquiry & IO Global Issue).
5. **French B SL (`fr`)**
   - **Spotlight (`French B SL Themes & Text-Type Studio`):** 5 IB Themes, Paper 1 Text Types (`/tools/french-studio`), Paper 2 Reading, Subjonctif & Conditionnel (`/tools/french-studio?tab=grammar`).
   - **Practice Tools (6):** Questionbank, Text-Type & Register Drills (`/tools/french-studio`), Blurting in French, Teach Sprout (en français), Exam Builder, Mistakes Log.
   - **Learn Tools (4):** Grammar & Conjugation Lab (`/tools/french-studio?tab=grammar`), Thematic Vocab Decks, Connector Cheatsheets, AI French Writing Studio.
   - **Seeded Topics:** `fr-T1` (Identités), `fr-T2` (Expériences), `fr-T3` (Ingéniosité humaine), `fr-T4` (Organisation sociale), `fr-T5` (Partage de la planète), `fr-P1-TEXTS` (Text Types & Criterion C), `fr-GRAMMAR` (High-Yield Structures / Criterion A).
6. **Math AA SL (`math`)**
   - **Spotlight (`Math AA SL Paper Split & Formula Tools`):** Paper 1 Non-Calculator, Paper 2 GDC Permitted, Interactive Formula Booklet (`/tools/formula-booklet`), SL Topics 1–5.
   - **Practice Tools (6):** Questionbank, Worked Step Walkthroughs, Blurting Formulas, Teach Sprout, Exam Builder, Mistakes Log.
   - **Learn Tools (4):** Formula Booklet Reference (`/tools/formula-booklet`), Study Guide, Flashcards, AI Exploration Studio.
   - **Seeded Topics:** `math-sl-1` (Sequences/Series, Exponents, Logs, Binomial), `math-sl-2` (Functions, Quadratics, Rational, Transformations), `math-sl-3` (Radians, Trig Rules, Unit Circle, Identities), `math-sl-4` (Regression, Probability, Binomial & Normal), `math-sl-5a` (Differentiation & Optimization), `math-sl-5b` (Integration & 1D Kinematics).

---

## 3. Visual Design System & Reference Assets

Canonical specifications live in [DESIGN.md](./DESIGN.md), CSS variables in [src/app/globals.css](./src/app/globals.css), font loading in [src/app/layout.tsx](./src/app/layout.tsx), and the approved interactive prototype at [docs/design-references/unified-consistent-system.html](./docs/design-references/unified-consistent-system.html).

- **Global Neutral Tokens:**
  - `--bg-canvas: #FFFFFF`, `--bg-sidebar: #FAFAFA`, `--bg-hover / --bg-pill: #F4F4F5`, `--border: #E4E4E7`, `--border-soft: #F4F4F5`, `--ink: #18181B`, `--muted: #71717A`, `--nav-active: #E4E4E7`.
  - Default sky aurora wash on Homepage: `--wash-1: rgba(219, 234, 254, 0.55)`, `--wash-2: rgba(224, 242, 254, 0.48)`, `--wash-3: rgba(241, 245, 249, 0.45)`.
- **Semantic & Sprout Signals:**
  - Sprout leaf greens: `#065F46`, `#059669`, `#34D399`, `#A7F3D0` (positive ticks, accepted inline edits, avatar ring).
  - Warm amber: `#D97706` / soft `#FEF3C7` / ink `#92400E` (streak flame, `SPROUT DAILY #2`, Criterion highlight underline).
  - Alert / Mistakes: `#DC2626` / `#EF4444` / soft `#FEF2F2`.
- **Typography:**
  - `--font-display`: `'Plus Jakarta Sans', 'Inter', sans-serif` (`h-title`: `27px`, `600`, `-0.025em`; `h-sub`: `24px`, `500`, `-0.02em`, `--muted`).
  - `--font-body`: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif` (`13px–14px`, line-height `1.5`, `1.75` inside `.ProseMirror`).
  - `--font-mono`: `'JetBrains Mono', monospace`.
- **Layout Geometry:**
  - Top bar `54px`, Left sidebar `224px` (drawer `< 768px`, collapsible/sticky desktop `md:block`), `.main-pad` (`8px 44px 48px` desktop, `8px 16px 40px` mobile), `.col-center` (`820px`), `.col-center-wide` (`920px`).
  - Homepage subject cards (`118px` height, `14px` radius): gradient + right-bleeding SVG artwork + title + white `Open >` pill only.
  - Subject Hub (`SubjectHubClient.tsx`): Aurora header + two-tone heading + 4 underline tabs (`Resources`, `Topics & Progress`, `Study Plan`, `Saved`) + IA Stepper Card + Subject Spotlight Strip + borderless 2-column Practice (6) & Learn (4) grids.
- **Sprout Mascot (`src/components/mascot/SproutMascot.tsx`):**
  - Exported poses: `'emblem' | 'avatar' | 'guide' | 'snoozing' | 'baby' | 'notepad'`.
- **Design Reference Archives:**
  - `docs/design-references/revision-dojo/` (19 reference PNGs)
  - `docs/design-references/stitch-previews/` (`01-homepage.png` .. `04-question-runner.png`)
  - `docs/design-references/stitch-v2/` (`00-homepage-neutral.html/.png`, `01-biology-hl.png` .. `06-math-aa-sl.png`) — note `DESIGN.md` overrides (`00-homepage-neutral.png` Card 5 must be Math AA SL without ninja headband; `02-chemistry-hl.png` must be Chemistry SL with borderless tool rows).

---

## 4. Technical Stack & Runtime Architecture

| Layer | Technology & Implementation Details |
| :--- | :--- |
| **Framework** | Next.js `15.2.4` (App Router, `serverExternalPackages: ['better-sqlite3']`, `outputFileTracingIncludes` for `./data/**/*`), React `19.0.0`, TypeScript `5.8.2` (`strict: true`, `@/*` → `./src/*`). |
| **Styling** | Tailwind CSS `v4` (`@tailwindcss/postcss`), custom utilities in `src/app/globals.css` (`.aurora-header`, `.col-center`, `.col-center-wide`, `.main-pad`, `.h-title`, `.h-sub`, `.pill-btn`, `.pill-btn-dark`, `.hairline-card`, `.mini-tag`, `.ProseMirror`). |
| **Database** | `better-sqlite3` + `drizzle-orm/sqlite-core` (`src/db/schema.ts`, `src/db/index.ts`). Local path `./data/simple-revision.db` (WAL + `foreign_keys = ON`). On Vercel (`process.env.VERCEL === '1'`), copies bundled DB to `/tmp/simple-revision.db`. Overridable via `SIMPLE_REVISION_DB_PATH`. |
| **Authentication** | Node `crypto.scryptSync` (`salt:derived` + `timingSafeEqual`) in `src/lib/auth.ts`; `jose` HS256 JWT (`sr_session`, 30-day HTTP-only cookie) + optional `sr_gemini` HTTP-only cookie; Edge verification (`verifySessionEdge` via Web Crypto `crypto.subtle`) in `src/middleware.ts`; secret resolution in `src/lib/auth-secret.ts` (fails closed if `VERCEL_ENV === 'production'` without `SESSION_SECRET`); Zod validation & `sanitizeRedirectPath` in `src/lib/auth-validation.ts`; sliding-window rate limiting in `src/lib/rate-limit.ts`. |
| **Rich Text & Math** | `@tiptap/react` + `@tiptap/starter-kit` + custom marks `CriterionHighlightMark` and `SuggestedEditMark` (`src/components/essay/extensions/`). `katex` (`0.16.21`) rendered via memoized `<KaTeXText />` (`src/components/math/KaTeXText.tsx`, 300-entry LRU cache). |
| **Gemini AI Engine** | `@google/genai` via `src/lib/gemini.ts`: `callGeminiStructured()`, `resolveGeminiConfig()`, `zodToGeminiJsonSchema()`, `extractJsonFromResponse()`, `normalizeGeminiModel()`, `formatGeminiError()`, `isGeminiAuthError()`. Models: `gemini-3-flash-preview` (default), `gemini-3.5-flash`, `gemini-3.8-flash`, `gemini-3.1-pro-preview` (plus `LEGACY_GEMINI_MODEL_MAP` for `gemini-2.5-*` / `2.0-*` / `*-latest`). Fallback chain (`gemini-3-flash-preview` → `gemini-3.5-flash` → `gemini-3.1-flash-lite`), `25s` timeout, `deterministic_fallback` when offline/unconfigured/exhausted. |
| **Originality Heuristic** | `src/lib/originality.ts`: `OriginalitySignalSchema` + `analyzeOriginalityHeuristic()` computing sentence length burstiness (CV), lexical diversity, and cliché phrase matches, always marked advisory. |
| **FSM & Types** | `src/types/fsm.ts`: `ScreenState<T>`, `SubjectSlug`, `MasteryStatus`. |

### Environment Variables Used
- `SESSION_SECRET` — Required in deployed production (`VERCEL_ENV === 'production'`); local fallback used in dev/test/build.
- `GEMINI_API_KEY` — Optional server-level fallback key (per-user SQLite key and `x-gemini-key` header take priority).
- `SIMPLE_REVISION_DB_PATH` — Optional override for SQLite database path (used by tests).
- `VERCEL` / `VERCEL_ENV` / `NODE_ENV` / `NEXT_PHASE` — Runtime environment detection.

---

## 5. Complete Database Schema (`src/db/schema.ts` & `src/db/index.ts`)

All **18 SQLite tables** are defined in `src/db/schema.ts` and mirrored in `BOOTSTRAP_SQL` in `src/db/index.ts`:

1. **Auth & Account:**
   - `users` (`id`, `email`, `name`, `passwordHash`, `geminiApiKey`, `preferredGeminiModel`, `streakCount`, `lastActiveDate`, `createdAt`, `updatedAt`)
   - `sessions` (`id`, `userId`, `expiresAt`)
   - `notifications` (`id`, `userId`, `title`, `body`, `href`, `isRead`, `createdAt`)
2. **Curriculum & Reference Content (Seeded):**
   - `subjects` (`slug`, `name`, `level`, `syllabusFirstAssessment`, `themeTokensJson`, `iaConfigJson`, `spotlightJson`, `practiceToolsJson`, `learnToolsJson`)
   - `syllabus_topics` (`id`, `subjectSlug`, `unitCode`, `unitTitle`, `code`, `title`, `levelScope`, `recommendedHours`, `guidingQuestionsJson`, `understandingsJson`, `studyGuideMarkdown`, `cheatsheetMarkdown`, `blurtChecklistJson`)
   - `questions` (`id`, `subjectSlug`, `topicId`, `paper`, `questionType`, `calculatorPolicy`, `difficulty`, `marks`, `commandTerm`, `stemMarkdown`, `stimulusMarkdown`, `optionsJson`, `correctOptionId`, `markschemePointsJson`, `walkthroughStepsJson`, `commonPitfallsJson`, `isDailyEligible`)
   - `subject_reference_items` (`id`, `subjectSlug`, `toolType`, `category`, `title`, `codeOrSymbol`, `payloadJson`)
3. **User Learning State & Workspace Persistence:**
   - `topic_progress` (`id`, `userId`, `topicId`, `status`, `updatedAt`)
   - `question_attempts` (`id`, `userId`, `questionId`, `userAnswer`, `awardedMarks`, `maxMarks`, `matchedPointsJson`, `missedPointsJson`, `aiFeedbackMarkdown`, `durationSeconds`, `createdAt`)
   - `mistakes_log` (`id`, `userId`, `questionId`, `userAnswer`, `missedConceptsJson`, `userReflection`, `resolved`, `createdAt`)
   - `exam_sessions` (`id`, `userId`, `subjectSlug`, `title`, `paperFilter`, `timeLimitMinutes`, `questionIdsJson`, `answersJson`, `scoresJson`, `status`, `createdAt`, `completedAt`)
   - `flashcard_decks` (`id`, `userId`, `subjectSlug`, `topicId`, `title`, `description`)
   - `flashcards` (`id`, `deckId`, `userId`, `frontMarkdown`, `backMarkdown`, `tagsJson`, `easeFactor`, `intervalDays`, `repetitions`, `dueAt`)
   - `recall_sessions` (`id`, `userId`, `subjectSlug`, `topicId`, `mode`, `transcriptOrBlurtJson`, `scorePercent`, `feedbackJson`, `createdAt`)
   - `notes` (`id`, `userId`, `subjectSlug`, `topicId`, `title`, `contentMarkdown`, `excerpt`, `isPinned`, `updatedAt`)
   - `essay_documents` (`id`, `userId`, `subjectSlug`, `documentType`, `currentStep`, `title`, `researchQuestion`, `contentJson`, `plainText`, `estimatedScore`, `maxScore`, `criteriaScoresJson`, `originalitySignalJson`, `annotationsJson`, `updatedAt`)
   - `study_tasks` (`id`, `userId`, `subjectSlug`, `topicId`, `title`, `scheduledDate`, `startTime`, `durationMinutes`, `taskType`, `completed`)
   - `bookmarks` (`id`, `userId`, `subjectSlug`, `itemType`, `itemId`, `title`, `subtitle`, `href`, `createdAt`)

Plus **13 SQLite indexes** (`idx_syllabus_topics_subject`, `idx_questions_subject_topic`, `idx_subject_ref_subject_tool`, `idx_topic_progress_user_topic`, `idx_question_attempts_user_question`, `idx_mistakes_log_user_created`, `idx_exam_sessions_user_created`, `idx_flashcards_deck_due`, `idx_notes_user_updated`, `idx_essay_documents_user_updated`, `idx_study_tasks_user_date`, `idx_bookmarks_user_created`, `idx_notifications_user_created`).

---

## 6. Complete Route, Page & Component Inventory (`src/`)

### A. Public Auth Routes (`src/app/(auth)/`)
- `/login` (`src/app/(auth)/login/page.tsx`) — Email/password sign-in using `AuthCardShell` + `PasswordField` + `sanitizeRedirectPath` (`?next=`).
- `/signup` (`src/app/(auth)/signup/page.tsx`) — Account registration with live password checks (`getPasswordChecks`) + optional initial Gemini API key.

### B. Authenticated App Shell (`src/app/(app)/`)
- `layout.tsx` — Runs `ensureSeeded()`, enforces `getCurrentUser()`, renders `<AppShell>` (`TopUtilityBar`, `LeftSidebar`, `CommandSearchModal`, `StudyTimerPopover`).
- `error.tsx` & `loading.tsx` — App Router error boundary (`role="alert"` + `Try Again`) and skeleton loader (`aria-busy="true"`).
- `/` (`page.tsx`) — Neutral sky-aurora Homepage: Essay Studio banner, two-tone greeting, `SPROUT DAILY #2` card, and the 6 custom-illustrated Subject Cards.
- `/subjects/[slug]` (`subjects/[slug]/page.tsx` → `SubjectHubClient`) — Per-subject aurora header, 4 tabs (`Resources`, `Topics & Progress` with 6-state mastery selector, `Study Plan`, `Saved`), IA Stepper card, Subject Spotlight strip, and borderless 2-col Practice/Learn grids.
- `/questions` (`questions/page.tsx` → `QuestionRunnerClient`) — Supports `subject`, `topicId`, `paper`, `mode` (`practice | exam | mistakes | daily`), `questionId`; MCQ & free-response runner, KaTeX, markscheme reveal, step-by-step walkthroughs, Gemini/deterministic grading, Exam Builder, Mistakes Log.
- `/study-guides` (`study-guides/page.tsx`) — Filterable syllabus understandings, guiding questions, and full study guides.
- `/cheatsheets` (`cheatsheets/page.tsx`) — High-yield condensed formulas, definitions, and exam pitfalls.
- `/flashcards` (`flashcards/page.tsx`) — Subject deck browser, custom card creation, and SM-2 spaced-repetition runner.
- `/notes` (`notes/page.tsx`) — Subject-organized Markdown + KaTeX notes manager (create, edit, pin, delete, export to flashcards/Essay Studio).
- `/planner` (`planner/page.tsx`) — Study Planner (`Focus | Week | Month`) with task CRUD, completion state, and topic linking.
- `/tutor` (`tutor/page.tsx`) — Socratic Sprout AI Tutor chat with subject/topic context selector and `Snoozing Sprout` empty state.
- `/essay-studio` (`essay-studio/page.tsx` → `EssayStudioClient`) — `60% / 40%` split-pane TipTap workspace (`Subject → Assignment Type → Draft Editor`), `CriterionHighlightMark` (amber highlights), `SuggestedEditMark` (`Accept Edit` / `Dismiss` inline diffs), Criterion Rubric scores, Advisory Originality signal, and Ask Sprout rail.
- `/coursework` (`coursework/page.tsx`) — IA / EE / TOK guides, official rubric criteria, and annotated exemplars (`?tab=exemplars`, `?subject=...`).
- `/saved` (`saved/page.tsx`) — Unified bookmarks page across all 6 subjects.
- `/settings` (`settings/page.tsx`) — Profile name, Gemini API key setup/clear, live `Test Connection` (`/api/ai/test-key`), model picker (`gemini-3-flash-preview`, `gemini-3.5-flash`, `gemini-3.1-pro-preview`), and DB re-seed/starter actions.

### C. Tools Directory & Subject Interactive Tools (`src/app/(app)/tools/`)
- `/tools` (`tools/page.tsx`) — Directory linking all 7 subject-specific tools + 3 cross-subject study/writing tools.
- `/tools/blurting` (`tools/blurting/page.tsx`) — Blank-page active recall checked against `blurtChecklistJson` + Gemini (`Notepad Sprout`).
- `/tools/teach-sprout` (`tools/teach-sprout/page.tsx`) — Feynman technique Socratic loop (`Baby Seed` Sprout).
- `/tools/originality-check` (`tools/originality-check/page.tsx`) — Standalone advisory Originality & AI stylistic analyzer.
- `/tools/[toolSlug]` (`tools/[toolSlug]/page.tsx`) — Dynamic route statically generated for the 7 subject tools:
  - `data-booklet` → `ChemistryDataBookletTool` (Chemistry SL IB Data Booklet + 118-element Periodic Table)
  - `calc-checker` → `ChemistryCalcCheckerTool` (Chemistry SL sig figs, units, stoichiometry step checker)
  - `formula-booklet` → `MathFormulaBookletTool` (Math AA SL Topics 1–5 KaTeX Formula Booklet)
  - `bio-visualizations` → `BiologyVisualizationsTool` (Biology HL interactive SVG cell/pathway diagrams)
  - `opcvl-trainer` → `HistoryOpcvlTool` (History HL Paper 1 OPCVL trainer, essay outlines & historiography timelines)
  - `english-studio` → `EnglishLiteratureStudioTool` (English Lit HL literary devices, global issues & PRL studio)
  - `french-studio` → `FrenchLanguageStudioTool` (French B SL text-type register drills & grammar/conjugation lab)

---

## 7. Complete API Route Inventory (`src/app/api/`)

| Endpoint | Methods | Purpose & Rules |
| :--- | :--- | :--- |
| `/api/auth/signup` | `POST` | Validates `SignupSchema`, enforces rate limit, hashes password (`scrypt`), creates user + starter data, sets `sr_session` (+ optional `sr_gemini`). |
| `/api/auth/login` | `POST` | Rejects `demoLogin`, validates `LoginSchema`, enforces per-email & per-IP rate limits (`429` + `Retry-After`), verifies password, sets cookies. |
| `/api/auth/logout` | `POST` | Revokes DB session and clears `sr_session` and `sr_gemini`. |
| `/api/auth/me` | `GET` | Returns current authenticated user summary or `401`. |
| `/api/settings` | `GET`, `PUT`, `POST` | Reads/updates user name, personal Gemini key (masked in `GET`), `preferredGeminiModel`, refreshes session cookies; `POST` also handles bookmark add/remove actions. |
| `/api/search` | `GET` | Global `⌘K` search across `syllabus_topics`, `questions`, `notes`, and `subject_reference_items` scoped to auth user. |
| `/api/questions` | `GET` | Queries filtered `questions` + topic metadata. |
| `/api/questions/attempt` | `POST` | Persists `question_attempts` for authenticated user. |
| `/api/exams` | `GET`, `POST` | Lists/creates/submits timed `exam_sessions`. |
| `/api/mistakes` | `GET`, `POST`, `PUT` | Lists, logs, updates reflections, or resolves `mistakes_log` entries. |
| `/api/progress` | `GET`, `PUT` | Fetches and updates 6-state `topic_progress` (`mastered` → `unseen`). |
| `/api/flashcards` | `GET`, `POST`, `PUT` | Fetches decks/cards, creates custom cards, updates SM-2 scheduling (`Again`, `Hard`, `Good`, `Easy`). |
| `/api/notes` | `GET`, `POST`, `PUT`, `DELETE` | Full CRUD for user `notes`. |
| `/api/planner` | `GET`, `POST`, `PUT`, `DELETE` | Full CRUD & schedule generation for user `study_tasks`. |
| `/api/bookmarks` | `GET`, `POST`, `DELETE` | Subject/global `bookmarks` management. |
| `/api/notifications` | `GET`, `PUT` | Fetches and marks `notifications` read. |
| `/api/essays` | `GET`, `POST`, `PUT` | Lists, creates, and persists TipTap `essay_documents` + scores/annotations. |
| `/api/ai/test-key` | `POST` | Live connectivity check against selected Gemini model (`20s` timeout). |
| `/api/ai/grade-question` | `POST` | Criterion/markscheme grading via `callGeminiStructured` + deterministic fallback. |
| `/api/ai/review-essay` | `POST` | Criterion scoring, passage highlights, inline diff suggestions, and advisory originality via `callGeminiStructured` + fallback. |
| `/api/ai/tutor` | `POST` | Socratic IB tutor turn via `callGeminiStructured` + fallback. |
| `/api/ai/blurting` | `POST` | Evaluates student recall against `blurtChecklistJson` + Gemini synthesis (`recall_sessions`). |
| `/api/ai/teach-sprout` | `POST` | 3-turn Feynman teaching evaluation + follow-up questions (`recall_sessions`). |
| `/api/ai/originality` | `POST` | Advisory originality/stylistic signal calculation. |

---

## 8. Curriculum Seed Pipeline & Scaling Roadmap

- **Pipeline Entry (`scripts/seed-content.ts` & `src/db/seed.ts`):**
  - Run manually via `npm run content:seed`, automatically during `npm run build`, and lazily on first authenticated layout boot (`ensureSeeded()`).
  - **Stage 1:** Loads `ALL_SUBJECT_PACKS` (`src/content/index.ts`), validating against `SubjectPackSchema`.
  - **Stage 2:** Reads every `*.json` file in `content/questions/` (such as `content/questions/custom-pack-example.json`) and validates each question with `QuestionItemSchema.safeParse()`.
- **Scaling Path:** The 6 research documents under `docs/curriculum-research/*.md` contain full syllabus blueprints (e.g., all 40 Biology HL subtopics, all 51 Math AA SL subtopics, all 29 French B SL subtopics). Future content packs generated externally should be added as structured files under `src/content/subjects/` or `content/questions/*.json`, validated with Zod, and ingested via `npm run content:seed`.

---

## 9. Scripts & Automated Test Suite

- **npm scripts (`package.json`):**
  - `npm run dev` — Next.js dev server
  - `npm run build` — `tsx scripts/seed-content.ts && next build`
  - `npm run start` — Production Next.js server
  - `npm run lint` — `next lint`
  - `npm test` — `vitest run` (`vitest.config.ts`: `jsdom`, `bail: 1`, `src/test/setup.ts`)
  - `npm run content:seed` — `tsx scripts/seed-content.ts`
- **Existing Test Files (`src/**/__tests__/*`):**
  - `src/content/__tests__/curriculum-seed.test.ts`
  - `src/lib/__tests__/auth.test.ts`
  - `src/lib/__tests__/auth-routes.test.ts`
  - `src/lib/__tests__/gemini.test.ts`
  - `src/components/__tests__/auth-pages.test.tsx`
  - `src/components/__tests__/shell-and-hubs.test.tsx`
  - `src/components/__tests__/essay-studio.test.tsx`

---

## 10. Observed Codebase Discrepancies & Guardrails for Future Agents

When touching navigation links, tools, or starter bookmarks, note these exact live mismatches currently present in the codebase so they are resolved cleanly rather than copied:

1. **Tool Route Slug Mismatches:**
   - `src/app/(app)/tools/[toolSlug]/page.tsx` registers `'opcvl-trainer'` and `'english-studio'`.
   - `src/content/subjects/history-hl.ts` (and one starter bookmark in `src/app/api/settings/route.ts`) currently link to `/tools/opcvl`, and `src/content/subjects/english-literature-hl.ts` links to `/tools/literary-devices`. Update those links (or add clean canonical redirects) when working on History HL / English Lit HL tools.
2. **Question Runner Query Param Consistency:**
   - `src/app/(app)/questions/page.tsx` passes `params.mode` into `QuestionRunnerClient` (`'practice' | 'exam' | 'mistakes' | 'daily'`).
   - Some links in `history-hl.ts`, `english-literature-hl.ts`, and `math-aa-sl.ts` use `&tab=mistakes` or `&mode=walkthrough` instead of `&mode=mistakes`. Standardize on `mode=` or support both cleanly.
3. **Single-Page Studio Routes:**
   - `/notes` and `/essay-studio` currently handle document selection inside their main client views rather than dedicated `/notes/[id]` or `/essay-studio/[id]` sub-routes.
4. **Canonical Gemini Key UI:**
   - `GeminiKeyModal.tsx` was intentionally removed; all key entry, clearing, model selection, and live testing live in `/settings` (plus optional `/signup` onboarding).
