# Simple Revision Unified Master Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and ship **Simple Revision**, a 100% free, single-tier, unlimited-use IB Diploma revision web application for 6 exact subjects (**Biology HL**, **Chemistry SL**, **History HL**, **English Literature HL**, **French B SL**, **Math AA SL**) with mandatory authentication, BYOK Gemini AI grading/tutoring/essay studio, repo-validated curriculum & question packs, and full Vercel production deployment connected to GitHub.

**Architecture:** Next.js 15 (App Router, TypeScript strict mode) + Tailwind CSS v4 mapped 1:1 to `DESIGN.md` tokens + `better-sqlite3` and Drizzle ORM (`./data/simple-revision.db` locally, auto-copied/auto-seeded to `/tmp/simple-revision.db` on Vercel serverless) + `scrypt` & `jose` signed HTTP-only cookie authentication (`sr_session` with serverless user/key re-hydration) + TipTap split-pane Essay Studio with custom ProseMirror marks (`CriterionHighlightMark` and `SuggestedEditMark`) + `katex` math/chemistry rendering + `@google/genai` BYOK engine with deterministic offline fallback.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, `better-sqlite3`, `drizzle-orm`, `jose`, `zod`, `@tiptap/react`, `@tiptap/starter-kit`, `katex`, `@google/genai`, `vitest`, `@testing-library/react`.

**Spec:** `docs/superpowers/specs/2026-11-10-simple-revision-architecture-design.md`, `DESIGN.md`, `docs/HANDOFF.md`, `docs/design-references/unified-consistent-system.html`, and `docs/curriculum-research/*.md` (`biology-hl.md`, `chemistry-sl.md`, `history-hl.md`, `english-literature-hl.md`, `french-b-sl.md`, `math-aa-sl.md`).

## Global Constraints

- **Exact 6 Subjects Only:** `Biology HL` (`bio`), `Chemistry SL` (`chem` — strictly SL, never HL), `History HL` (`hist`), `English Literature HL` (`eng`), `French B SL` (`fr`), `Math AA SL` (`math`). No MYP, no University, no other subjects.
- **Zero Monetization or Video Noise:** Zero paywalls, zero energy/XP limits, zero `Upgrade` or `PRO` badges, and zero `<video>` or video walkthrough links anywhere.
- **Visual Fidelity (`DESIGN.md` & `unified-consistent-system.html`):**
  - Neutral global shell: `#FFFFFF` primary canvas, `#FAFAFA` `224px` left sidebar, `#F4F4F5` hover/pill surfaces, `1px solid #E4E4E7` hairlines, `#E4E4E7` neutral active nav highlight, `1.8px` monochrome outline SVGs (no emoji icons in sidebar navigation).
  - One unified font stack across all screens: `Plus Jakarta Sans` (`--font-display`), `Inter` (`--font-body`), `JetBrains Mono` (`--font-mono`).
  - Per-subject nature aurora header wash dissolving to `#FFFFFF` below underline tabs (`Resources | Topics & Progress | Study Plan | Saved`), `1 → 2 → 3` Coursework IA stepper card, Subject Spotlight strip (`3.5px` left accent border), and borderless 2-column tool rows (`42×42px` rounded-`11px` pastel icon tiles).
- **Finite State Machine (FSM) Mandate:** Every asynchronous screen/panel must model state using an explicit discriminated union (`type ScreenState<T> = { status: 'idle' } | { status: 'loading' } | { status: 'success'; data: T } | { status: 'empty'; message: string } | { status: 'error'; message: string }`) or `useReducer` — never loose boolean flags (`isLoading`, `isError`).
- **Strict Zod Contracts:** Every external payload (seed files, API request bodies, Gemini JSON responses) must be parsed through Zod schemas before use.
- **No In-App AI Question Generation:** All practice questions come from the repository seed pipeline (`src/content/subjects/*.ts` and `content/questions/*.json`), never generated on the fly by an LLM.

## Review Focus

1. **Vercel Serverless Read-Only Filesystem & Cold Starts:** `./data/simple-revision.db` is read-only inside Vercel Lambda `/var/task`; `src/db/index.ts` must copy the pre-seeded DB to `/tmp/simple-revision.db` (or auto-seed `/tmp/simple-revision.db` when empty) when `process.env.VERCEL === '1'`, and `getCurrentUser()` must re-hydrate the authenticated user row + Gemini key from the signed `sr_session` / `sr_gemini` cookies if a new serverless instance handles a subsequent request.
2. **Missing or Invalid Gemini API Key:** Clicking `Grade My Answer`, `Review Draft`, `Blurting Check`, or `Teach Sprout` without a saved Gemini API key must never crash or throw an unhandled 500; it must return a structured response using the deterministic rubric/checklist evaluator and prompt the user with a non-blocking "Connect Gemini Key for full AI analysis" banner/modal.
3. **Chemistry SL Scope Quarantine:** Chemistry must strictly display `Chemistry SL` everywhere (Homepage card, Subject Hub header, breadcrumbs, syllabus tree `S1.1–S3.2` and `R1.1–R3.4` excluding HL-only `R1.4` and d-orbital splitting), and its 2-column tool rows must be borderless on `#FFFFFF` matching the other 5 subjects.
4. **Inline Essay Edit Anchoring (`Accept Edit` / `Dismiss`):** Clicking `Accept Edit` on a suggested edit card in the AI Essay Studio must replace the exact target phrase in the editor document and update the annotation status to `'accepted'` without corrupting surrounding paragraphs; clicking `Dismiss` must restore the clean original phrase and mark the annotation `'dismissed'`.
5. **Zero Dead Navigation or Topbar Controls:** Every sidebar link, topbar button (`⌘K` search, `Gemini Key Ready` pill, Timer popover, Notifications popover, Streak pill, Sprout avatar menu), Subject Hub tab (`Resources`, `Topics & Progress`, `Study Plan`, `Saved`), Spotlight pill, and Tool row must navigate to or open a live, interactive view.

---

## Task Overview & Execution Waves

- **Wave 1 (Foundation & Core Database/Auth):**
  - **Task 1:** Next.js 15 Scaffolding, Design System CSS Tokens, SQLite + Drizzle Schema (`src/db/`), Serverless-Resilient Cookie Auth (`src/lib/auth.ts`), Middleware, and `/login` & `/signup`.
- **Wave 2 (6-Subject Curriculum Ingestion Pipeline — Parallel Sub-Agents):**
  - **Task 2A:** Zod Content Schemas (`src/content/schemas.ts`) + **Biology HL** (`src/content/subjects/biology-hl.ts`) & **Chemistry SL** (`src/content/subjects/chemistry-sl.ts`) Canonical Packs.
  - **Task 2B:** **History HL** (`src/content/subjects/history-hl.ts`) & **English Literature HL** (`src/content/subjects/english-literature-hl.ts`) Canonical Packs.
  - **Task 2C:** **French B SL** (`src/content/subjects/french-b-sl.ts`) & **Math AA SL** (`src/content/subjects/math-aa-sl.ts`) Canonical Packs + Master Seed Runner (`src/db/seed.ts` & `scripts/seed-content.ts`).
- **Wave 3 (Global Shell, Homepage, Subject Hubs & Core Engines — Parallel Sub-Agents):**
  - **Task 3:** Global Neutral Shell (`TopUtilityBar`, `LeftSidebar`, `SproutMascot` 4 poses, `CommandSearchModal` `⌘K`, Study Timer, Notifications), Neutral Homepage (`/`), and 6 Subject Hubs (`/subjects/[slug]` with `Resources`, `Topics & Progress`, `Study Plan`, and `Saved` tabs).
  - **Task 4:** KaTeX/mhchem Renderer (`KaTeXText`), Question Bank Runner, Exam Builder, Mistakes Log, Sprout Daily Sprint (`/questions`), Study Guides (`/study-guides`), and Cheatsheets (`/cheatsheets`).
  - **Task 5:** Subject-Unique Interactive Reference & Practice Tools (`/tools/[toolSlug]`: Chemistry Data Booklet & Periodic Table, Chemistry Calc Step Checker, Math AA Formula Booklet, Biology Cell/Pathway Visualizations, History OPCVL Trainer & Timelines, English Lit Device Drill & Global Issue Matrix, French B Text-Type & Grammar Lab).
  - **Task 6:** BYOK Gemini Engine (`src/lib/gemini.ts` + `/api/ai/*`), Active Recall Suite (`/flashcards` SM-2 runner, `/tools/blurting`, `/tools/teach-sprout`, `/tutor` Sprout AI Tutor), and Knowledge/Planning (`/notes`, `/planner`, `/saved`, `/settings`).
  - **Task 7:** Coursework Guides (`/coursework`), Advisory Originality & AI Signal Checker (`/tools/originality-check`), and `60% / 40%` Split-Pane AI Essay Studio (`/essay-studio` with TipTap `CriterionHighlightMark` & `SuggestedEditMark`, `Accept Edit / Dismiss`, and Criterion Rubric scoring).
- **Wave 4 (Verification, Responsive Polish & Production Deployment):**
  - **Task 8:** Full Integration Wiring, Vitest Suite, Production Build (`npm run build`), Multi-Viewport Browser Verification (`375px`, `768px`, `1280px`), Git Commit/Push, and Vercel Production Deployment (`https://simple-revision.vercel.app`).

---

### Task 1: Project Scaffolding, Design Tokens, SQLite + Drizzle Schema, and Mandatory Auth

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `vitest.config.ts`
- Create: `src/types/fsm.ts`
- Create: `src/app/globals.css`, `src/app/layout.tsx`
- Create: `src/db/schema.ts`, `src/db/index.ts`
- Create: `src/lib/auth.ts`, `src/middleware.ts`
- Create: `src/app/api/auth/signup/route.ts`, `src/app/api/auth/login/route.ts`, `src/app/api/auth/logout/route.ts`, `src/app/api/auth/me/route.ts`
- Create: `src/app/(auth)/login/page.tsx`, `src/app/(auth)/signup/page.tsx`
- Test: `src/lib/__tests__/auth.test.ts`

**Interfaces:**
- Produces:
  - `ScreenState<T>` discriminated union in `src/types/fsm.ts`
  - `db` Drizzle SQLite instance and `ensureDatabaseInitialized()` in `src/db/index.ts`
  - All 16 Drizzle tables in `src/db/schema.ts`: `users`, `sessions`, `notifications`, `subjects`, `syllabusTopics`, `questions`, `subjectReferenceItems`, `topicProgress`, `questionAttempts`, `mistakesLog`, `examSessions`, `flashcardDecks`, `flashcards`, `recallSessions`, `notes`, `essayDocuments`, `studyTasks`, `bookmarks`
  - `hashPassword(password: string): string`, `verifyPassword(password: string, stored: string): boolean`, `createSessionCookie(user: SessionUser): Promise<string>`, `getCurrentUser(): Promise<UserRecord | null>` in `src/lib/auth.ts`

- [ ] **Step 1: Initialize Next.js 15 TypeScript project & install dependencies**
  - Install `next`, `react`, `react-dom`, `better-sqlite3`, `drizzle-orm`, `jose`, `zod`, `katex`, `@google/genai`, `@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`, `lucide-react`, `clsx`, and dev dependencies `typescript`, `@types/node`, `@types/react`, `@types/react-dom`, `@types/better-sqlite3`, `@types/katex`, `tailwindcss`, `@tailwindcss/postcss`, `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `tsx`.
- [ ] **Step 2: Write failing auth & database unit test in `src/lib/__tests__/auth.test.ts`**
  - Test password hashing/verification (`hashPassword` / `verifyPassword`), JWT session token signing/verification (`signSessionToken` / `verifySessionToken`), and SQLite schema table creation.
- [ ] **Step 3: Implement `src/types/fsm.ts`, `src/db/schema.ts`, `src/db/index.ts`, and `src/lib/auth.ts`**
  - Configure `better-sqlite3` with WAL mode locally (`./data/simple-revision.db`) and automatic `/tmp/simple-revision.db` copy/initialization on Vercel (`process.env.VERCEL === '1'`).
  - Implement `CREATE TABLE IF NOT EXISTS` bootstrap in `src/db/index.ts` so tables exist immediately on cold start without requiring external CLI migrations.
  - Implement `scrypt` password hashing and `jose` JWT cookies (`sr_session` + `sr_gemini`) with automatic user row re-hydration on serverless cold starts.
- [ ] **Step 4: Implement `src/middleware.ts`, `/api/auth/*` routes, and `/login` + `/signup` pages**
  - Enforce mandatory authentication in `src/middleware.ts` (redirecting unauthenticated requests outside `/login`, `/signup`, `/api/auth/*`, and static assets to `/login`, and providing a one-click "Demo Student Account (`Harris`)" quick-sign-in button alongside full email/password sign-up and sign-in so evaluation is effortless).
- [ ] **Step 5: Run Vitest to verify Task 1 passes**
  - Run: `npx vitest run src/lib/__tests__/auth.test.ts --silent --bail`
  - Expected: PASS

---

### Task 2: 6-Subject Curriculum Research Ingestion & Zod Seed Pipeline

**Files:**
- Create: `src/content/schemas.ts`
- Create: `src/content/subjects/biology-hl.ts`
- Create: `src/content/subjects/chemistry-sl.ts`
- Create: `src/content/subjects/history-hl.ts`
- Create: `src/content/subjects/english-literature-hl.ts`
- Create: `src/content/subjects/french-b-sl.ts`
- Create: `src/content/subjects/math-aa-sl.ts`
- Create: `src/content/index.ts`
- Create: `src/db/seed.ts`, `scripts/seed-content.ts`
- Create: `content/questions/custom-pack-example.json`
- Test: `src/content/__tests__/curriculum-seed.test.ts`

**Interfaces:**
- Consumes: `db`, schema tables from `src/db/schema.ts`
- Produces:
  - `ALL_SUBJECT_PACKS` in `src/content/index.ts` validated against `SubjectPackSchema`
  - `seedDatabaseIfNeeded()` in `src/db/seed.ts` (idempotent auto-seeder called automatically by `src/db/index.ts` on first boot and via `npm run content:seed`)

- [ ] **Step 1: Write `src/content/schemas.ts` and failing validation test `src/content/__tests__/curriculum-seed.test.ts`**
  - Assert that all 6 subjects (`bio`, `chem`, `hist`, `eng`, `fr`, `math`) exist, Chemistry level is strictly `'SL'`, every subject has complete syllabus topics, study guides, cheatsheets, blurt checklists, practice questions with markscheme points & walkthrough steps, flashcard decks, coursework IA configs/exemplars, and subject-specific reference tool items.
- [ ] **Step 2: Build the 6 canonical subject packs from `docs/curriculum-research/*.md`**
  - `biology-hl.ts`: All 40 subtopics (`A1.1–D4.3`), study guides, cheatsheets, Paper 1A/1B/2 questions, interactive Cell/Pathway diagram models (Membrane Transport, Chemiosmosis, Photosynthesis, Sarcomere/Action Potential), flashcards, 24-mark Scientific Investigation IA guide & exemplar.
  - `chemistry-sl.ts`: Strictly SL subtopics (`S1.1–S3.2`, `R1.1–R1.3`, `R2.1–R2.3`, `R3.1–R3.4` — excluding HL-only `R1.4`), Paper 1A/1B/2 questions, IB Data Booklet tables (constants, bond enthalpies, IR wavenumbers, 1H NMR chemical shifts, acid-base indicators), Periodic Table elements, Calculation Step Checker drills, flashcards, 24-mark SL IA guide & exemplar.
  - `history-hl.ts`: Paper 1 Prescribed Subjects (Move to Global War, Rights & Protest), Paper 2 World History Topics (Topic 10 Authoritarian States, Topic 11 20th-Century Wars, Topic 12 Cold War), Paper 3 Regional HL, OPCVL source sets with model Origin/Purpose/Value/Limitation breakdowns, Essay Outline Builder templates, Historiography Timelines (Orthodox, Revisionist, Post-Revisionist historians), flashcards, 25-mark Historical Investigation IA guide & exemplar.
  - `english-literature-hl.ts`: 3 Areas of Exploration, 7 Central Concepts, Paper 1 Unseen Prose/Poetry, Paper 2 Comparative, HL Essay (1,200–1,500w, 20 marks) & Individual Oral (40 marks), Literary Device Drill items, Global Issue Matrix across the 5 IB Fields of Inquiry, PRL Work Quota & No-Double-Dipping planner, Quote Flashcards.
  - `french-b-sl.ts`: 5 IB Themes (*Identités*, *Expériences*, *Ingéniosité humaine*, *Organisation sociale*, *Partage de la planète*), Paper 1 Text-Type & Register Drills (*article*, *blog*, *brochure*, *lettre formelle*, *discours*, *courriel officiel*), Paper 2 Reading Comprehension, Grammar & Conjugation Lab (*subjonctif présent*, *conditionnel*, *passé composé vs imparfait*, *pronoms relatifs*, *connecteurs logiques*), French flashcards, Individual Oral visual stimulus guide.
  - `math-aa-sl.ts`: All 51 SL subtopics across Topics 1–5 (`SL 1.1–SL 5.8`), Paper 1 Non-Calculator & Paper 2 GDC questions with KaTeX step-by-step walkthroughs, Interactive Formula Booklet items + "Not in Booklet — Must Memorize" identities/derivatives, flashcards, 20-mark Mathematical Exploration IA guide & exemplar.
- [ ] **Step 3: Implement `src/db/seed.ts` and `scripts/seed-content.ts`**
  - Seed all 6 subject packs + any drop-in JSON files in `content/questions/*.json` into SQLite, plus default starter notes, flashcards, study planner tasks, notifications, and sample annotated coursework drafts so every view has rich initial state immediately upon login.
- [ ] **Step 4: Run Vitest and `npm run content:seed` to verify**
  - Run: `npx vitest run src/content/__tests__/curriculum-seed.test.ts --silent --bail`
  - Expected: PASS

---

### Task 3: Global Neutral Shell, Sprout Mascot, Topbar Utilities, Homepage, and 6 Subject Hubs

**Files:**
- Create: `src/components/mascot/SproutMascot.tsx`
- Create: `src/components/math/KaTeXText.tsx`
- Create: `src/components/shell/AppShell.tsx`, `src/components/shell/TopUtilityBar.tsx`, `src/components/shell/LeftSidebar.tsx`, `src/components/shell/CommandSearchModal.tsx`, `src/components/shell/StudyTimerPopover.tsx`, `src/components/shell/GeminiKeyModal.tsx`
- Create: `src/app/api/search/route.ts`, `src/app/api/notifications/route.ts`, `src/app/api/progress/route.ts`, `src/app/api/bookmarks/route.ts`
- Create: `src/app/(app)/layout.tsx`, `src/app/(app)/page.tsx`
- Create: `src/app/(app)/subjects/[slug]/page.tsx`, `src/components/subjects/SubjectHubClient.tsx`
- Test: `src/components/__tests__/shell-and-hubs.test.tsx`

- [ ] **Step 1: Implement `SproutMascot.tsx` (all poses: `emblem`, `avatar`, `guide`, `snoozing`, `baby`, `notepad`) and `KaTeXText.tsx`**
- [ ] **Step 2: Implement `TopUtilityBar.tsx`, `LeftSidebar.tsx`, `CommandSearchModal.tsx` (`⌘K`), `StudyTimerPopover.tsx`, and `GeminiKeyModal.tsx`**
  - Match `unified-consistent-system.html` pixel-for-pixel: `54px` topbar, `224px` `#FAFAFA` sidebar, `DP | My 6` toggle (switches between viewing all DP resources vs quick-jumping directly into the 6 subjects in the sidebar), monochrome `1.8px` outline SVGs, neutral `#E4E4E7` active highlight, responsive drawer on mobile (`375px`).
- [ ] **Step 3: Implement Neutral Homepage (`src/app/(app)/page.tsx`) and Subject Hubs (`src/app/(app)/subjects/[slug]/page.tsx`)**
  - Homepage: Neutral sky-horizon aurora header, announcement bar (`Working on your IA, EE, or TOK? Try the AI Essay Studio`), two-tone greeting (`Good evening, / [User Name]`), `SPROUT DAILY #2` card, and the 6 custom-illustrated Subject Cards (`Biology HL`, `Chemistry SL`, `History HL`, `English Literature HL`, `French B SL`, `Math AA SL`) with exact gradients and SVG artwork from `unified-consistent-system.html`.
  - Subject Hub: Per-subject aurora header wash (`--wash-1..3`), two-tone `Subject / Level` title, and 4 interactive underline tabs:
    1. `Resources`: Coursework IA `1 → 2 → 3` stepper card (`Setup >`), Subject Spotlight strip (clickable pills), borderless 2-column **Practice** tool rows, and borderless 2-column **Learn & Coursework** tool rows (each linking to its exact route/tool).
    2. `Topics & Progress`: Full syllabus subtopic tree with 6-state mastery selector (`Mastered`, `Confident`, `Practicing`, `Review Needed`, `Struggling`, `Unseen`) persisted via `/api/progress`, recommended hours, HL/SL scope tags, and quick buttons to open Study Guide, Questions, or Blurting for that topic.
    3. `Study Plan`: Subject-specific study tasks + one-click "Generate 7-Day Revision Plan" button.
    4. `Saved`: Bookmarked items for that subject with remove/open actions.
- [ ] **Step 4: Run tests to verify Shell, Homepage, and all 6 Subject Hubs**
  - Run: `npx vitest run src/components/__tests__/shell-and-hubs.test.tsx --silent --bail`
  - Expected: PASS

---

### Task 4: Question Bank Runner, Exam Builder, Mistakes Log, Study Guides & Cheatsheets

**Files:**
- Create: `src/app/api/questions/route.ts`, `src/app/api/questions/attempt/route.ts`, `src/app/api/mistakes/route.ts`, `src/app/api/exams/route.ts`
- Create: `src/app/(app)/questions/page.tsx`, `src/components/questions/QuestionRunnerClient.tsx`
- Create: `src/app/(app)/study-guides/page.tsx`, `src/app/(app)/cheatsheets/page.tsx`
- Test: `src/components/__tests__/question-runner.test.tsx`

- [ ] **Step 1: Build `/api/questions`, `/api/questions/attempt`, `/api/mistakes`, and `/api/exams` route handlers**
  - Support filtering by `subject`, `topicId`, `paper`, `calculatorPolicy`, `difficulty`, `mode` (`practice`, `exam`, `mistakes`, `daily`).
- [ ] **Step 2: Build `QuestionRunnerClient.tsx` (`/questions`)**
  - Matches `04-question-runner.png` and `unified-consistent-system.html`:
    - Breadcrumb + live monospace timer (`14:22`)
    - Metadata tags (`SL Core`, `Paper 2`, `4 Marks`, calculator badge, command term pill)
    - KaTeX-rendered question stem + optional stimulus block (source excerpt, data table, French passage)
    - Interactive MCQ option cards (`A`, `B`, `C`, `D`) OR free-response textarea
    - Action bar: `Reveal Markscheme`, `Step-by-Step Walkthrough`, `Save to Mistakes Log`, `Ask Sprout Tutor`, and `Grade My Answer` (invokes `/api/ai/grade-question` which grades via Gemini BYOK or deterministic markscheme point matcher, showing point-by-point ticks `✓` and missed requirements)
    - Mode switcher tabs at top: `Practice Runner` | `Exam Builder (Timed Mock)` | `Mistakes Log` | `Sprout Daily #2`.
- [ ] **Step 3: Build `/study-guides` and `/cheatsheets` pages**
  - Subject + Topic filter bar, guiding questions, SL/HL understandings list, KaTeX-rendered study notes & high-yield exam traps, bookmark toggle, and "Practice Topic Questions →" button.
- [ ] **Step 4: Run Vitest on Question Runner & Study Guides**
  - Run: `npx vitest run src/components/__tests__/question-runner.test.tsx --silent --bail`
  - Expected: PASS

---

### Task 5: Subject-Unique Interactive Reference & Practice Tools (`/tools/[toolSlug]`)

**Files:**
- Create: `src/app/(app)/tools/page.tsx`, `src/app/(app)/tools/[toolSlug]/page.tsx`
- Create: `src/components/tools/ChemistryDataBookletTool.tsx`
- Create: `src/components/tools/ChemistryCalcCheckerTool.tsx`
- Create: `src/components/tools/MathFormulaBookletTool.tsx`
- Create: `src/components/tools/BiologyVisualizationsTool.tsx`
- Create: `src/components/tools/HistoryOpcvlTool.tsx`
- Create: `src/components/tools/EnglishLiteratureStudioTool.tsx`
- Create: `src/components/tools/FrenchLanguageStudioTool.tsx`
- Test: `src/components/__tests__/subject-tools.test.tsx`

- [ ] **Step 1: Implement Chemistry SL Tools (`data-booklet` & `calc-checker`)**
  - `ChemistryDataBookletTool`: Interactive searchable IB Chemistry SL Data Booklet (Physical Constants & Unit Conversions, Bond Enthalpies, IR Absorption Wavenumbers, 1H NMR Chemical Shifts, Acid-Base Indicators) + Interactive Periodic Table with element detail inspector.
  - `ChemistryCalcCheckerTool`: Step-by-step stoichiometry/energetics calculation verifier checking mole ratios, unit conversions ($\text{cm}^3 \to \text{dm}^3$, ${}^\circ\text{C} \to \text{K}$), sign conventions ($\Delta H$), and significant figures.
- [ ] **Step 2: Implement Math AA SL (`formula-booklet`) & Biology HL (`bio-visualizations`) Tools**
  - `MathFormulaBookletTool`: Interactive Topics 1–5 SL Formula Booklet rendered in KaTeX, filterable by topic, with a toggle for **"Not in Booklet — Must Memorize"** formulas and linked worked step examples.
  - `BiologyVisualizationsTool`: Interactive SVG cellular & metabolic pathway models (Fluid Mosaic Membrane Transport, Mitochondrial Chemiosmosis & ATP Synthase, Chloroplast Light-Dependent & Calvin Cycle, Sarcomere Sliding Filament & Neuron Action Potential) with clickable nodes revealing IB markscheme definitions.
- [ ] **Step 3: Implement History HL (`opcvl-trainer`), English Lit HL (`english-studio`), and French B SL (`french-studio`) Tools**
  - `HistoryOpcvlTool`: Interactive Paper 1 OPCVL Source Trainer (practice Origin, Purpose, Content, Value, Limitation with model comparison), Paper 2/3 Comparative Essay Outline Builder, and Historiography School Timelines (Orthodox, Revisionist, Post-Revisionist).
  - `EnglishLiteratureStudioTool`: Interactive Literary Device Drill (spot device + analyze reader effect), Global Issue Matrix across the 5 IB Fields of Inquiry, and PRL 13-Work Diversity & No-Double-Dipping Validator.
  - `FrenchLanguageStudioTool`: Paper 1 Text-Type & Register Studio (*article, blog, brochure, lettre formelle, discours, courriel* conventions + checklist) and Interactive Grammar & Conjugation Lab (*subjonctif*, *conditionnel*, *passé composé vs imparfait*, *connecteurs*).
- [ ] **Step 4: Run Vitest on all Subject Tools**
  - Run: `npx vitest run src/components/__tests__/subject-tools.test.tsx --silent --bail`
  - Expected: PASS

---

### Task 6: BYOK Gemini Engine, Active Recall Suite (Flashcards, Blurting, Teach Sprout, Tutor) & Knowledge/Planning (Notes, Planner, Saved, Settings)

**Files:**
- Create: `src/lib/gemini.ts`
- Create: `src/app/api/ai/test-key/route.ts`, `src/app/api/ai/grade-question/route.ts`, `src/app/api/ai/tutor/route.ts`, `src/app/api/ai/blurting/route.ts`, `src/app/api/ai/teach-sprout/route.ts`
- Create: `src/app/api/flashcards/route.ts`, `src/app/api/notes/route.ts`, `src/app/api/planner/route.ts`, `src/app/api/settings/route.ts`
- Create: `src/app/(app)/flashcards/page.tsx`
- Create: `src/app/(app)/tools/blurting/page.tsx`, `src/app/(app)/tools/teach-sprout/page.tsx`
- Create: `src/app/(app)/tutor/page.tsx`
- Create: `src/app/(app)/notes/page.tsx`, `src/app/(app)/planner/page.tsx`, `src/app/(app)/saved/page.tsx`, `src/app/(app)/settings/page.tsx`
- Test: `src/lib/__tests__/gemini-and-recall.test.ts`

- [ ] **Step 1: Implement `src/lib/gemini.ts` and `/api/ai/*` routes**
  - Resolve Gemini API key from `users.geminiApiKey` in SQLite (or `sr_gemini` cookie / `x-gemini-key` header / `process.env.GEMINI_API_KEY`).
  - Use `@google/genai` with `responseMimeType: 'application/json'` and validate every response with Zod.
  - Provide deterministic rubric/checklist evaluation whenever no live Gemini key is configured yet, returning `mode: 'deterministic_fallback'` so every button works out of the box and prompts the user with an optional "Connect Gemini Key" button.
- [ ] **Step 2: Implement `/flashcards` (SM-2 Spaced Repetition), `/tools/blurting`, `/tools/teach-sprout`, and `/tutor`**
  - `/flashcards`: Deck selector across all 6 subjects, interactive flip card with KaTeX support, SM-2 interval calculation (`Again`, `Hard`, `Good`, `Easy`), keyboard shortcuts, and custom card creator.
  - `/tools/blurting`: Notepad Sprout mascot pose, subject & syllabus topic selector, timed blank-page recall textarea, and instant check against canonical `blurtChecklistJson` + Gemini feedback showing **Covered Concepts** vs **Missed Markscheme Points**.
  - `/tools/teach-sprout`: Baby Seed Sprout mascot pose, Feynman explanation dialogue where Sprout asks student-like clarifying questions (including *en français* mode for French B SL) and scores conceptual clarity.
  - `/tutor`: Snoozing Sprout empty state, subject/topic context selector, Socratic IB tutor chat.
- [ ] **Step 3: Implement `/notes`, `/planner`, `/saved`, and `/settings`**
  - `/notes`: Subject folder filter, note cards, Markdown + KaTeX live preview editor, create/save/delete/pin notes, one-click "Send to Essay Studio".
  - `/planner`: `Focus (Today) | Week | Month` views, add study task modal linked to syllabus topics, toggle task completion, auto-generate balanced 6-subject revision schedule.
  - `/saved`: Global bookmarks view across all 6 subjects.
  - `/settings`: Edit display name, paste/save Gemini API Key (persisted to SQLite + signed `sr_gemini` cookie), **Test Gemini Connection** button, select preferred Gemini model (`gemini-2.5-flash` / `gemini-2.5-pro`), and Reset/Re-seed Demo Data button.
- [ ] **Step 4: Run Vitest on Gemini Engine & Active Recall Suite**
  - Run: `npx vitest run src/lib/__tests__/gemini-and-recall.test.ts --silent --bail`
  - Expected: PASS

---

### Task 7: Coursework Studio, Advisory Originality Check, and `60% / 40%` Split-Pane AI Essay Editor

**Files:**
- Create: `src/lib/originality.ts`
- Create: `src/app/api/essays/route.ts`, `src/app/api/ai/review-essay/route.ts`, `src/app/api/ai/originality/route.ts`
- Create: `src/components/essay/extensions/CriterionHighlightMark.ts`, `src/components/essay/extensions/SuggestedEditMark.ts`
- Create: `src/components/essay/EssayStudioClient.tsx`
- Create: `src/app/(app)/essay-studio/page.tsx`
- Create: `src/app/(app)/coursework/page.tsx`
- Create: `src/app/(app)/tools/originality-check/page.tsx`
- Test: `src/components/__tests__/essay-studio.test.tsx`

- [ ] **Step 1: Implement `src/lib/originality.ts` and `/tools/originality-check`**
  - Compute transparent linguistic metrics (sentence length burstiness, vocabulary type-token diversity, repetitive transition density, passive voice ratio) + optional Gemini stylistic audit, always displaying the explicit advisory notice required by `HANDOFF.md`.
- [ ] **Step 2: Implement `/coursework` (IA / EE / TOK Guides & Annotated Exemplars)**
  - Subject switcher across all 6 subjects + EE & TOK, interactive `1 → 2 → 3` workflow checklist, official IB criterion rubrics (`24` marks for Biology/Chemistry, `25` for History, `20` for Math AA, `20`/`40` for English Lit HL Essay/IO, `30` for French B IO),annotated exemplar sections, and "Open Draft in AI Essay Studio →" button.
- [ ] **Step 3: Implement `EssayStudioClient.tsx` (`/essay-studio`) matching `DESIGN.md` & `unified-consistent-system.html`**
  - Top bar: `1 [Subject] → 2 [Internal Assessment / HL Essay / EE / TOK] → 3 Draft Editor` stepper, `Originality Signal: Low (11%)` pill, `Est. Score: 21 / 25` warm-amber pill, and `Review Draft with Gemini` button.
  - `60% / 40%` (`1.45fr / 1fr`) split layout inside `920px` centered container:
    - Left (`60%`): White `#FFFFFF` hairline paper card with editable Research Question title (`Plus Jakarta Sans` `20px`), TipTap editor (`@tiptap/react`) + inline warm-amber passage highlights (`#FEF3C7` background, `2px solid #D97706` bottom border) and inline diff edits (`#9CA3AF` strikethrough old phrase + `#ECFDF5` / `#059669` replacement preview).
    - Right (`40%`): Aligned `1px` hairline annotation cards (`3.5px solid #D97706` left border for Criterion feedback; `3.5px solid #059669` left border for Suggested Direct Edits with working **Accept Edit** and **Dismiss** buttons that mutate the editor document and annotation status), plus tabs for `Inline Feedback`, `Criterion Rubric`, `Originality Signal`, and `Ask Sprout`.
- [ ] **Step 4: Run Vitest on Essay Studio & Originality Check**
  - Run: `npx vitest run src/components/__tests__/essay-studio.test.tsx --silent --bail`
  - Expected: PASS

---

### Task 8: Full Verification, Responsive Viewport Audit (`375px`, `768px`, `1280px`), GitHub Push & Vercel Production Deployment

**Files:**
- Modify: `next.config.ts`, `package.json`, `.gitignore`
- Test: Full Vitest test suite (`npm test -- --silent --bail`), `tsc --noEmit --pretty false`, `npm run build`

- [ ] **Step 1: Run `npm run content:seed`, full Vitest test suite, TypeScript check, and production Next.js build**
  - Run: `npm run content:seed && npx tsc --noEmit --pretty false && npm test -- --silent --bail && npm run build`
  - Expected: Zero errors, all tests pass, `.next` build succeeds, `./data/simple-revision.db` pre-seeded.
- [ ] **Step 2: Start local server and verify in Browser Subagent at `1280px`, `768px`, and `375px`**
  - Verify Auth (`/login`), Homepage (`/`) with all 6 subject cards (`Biology HL`, `Chemistry SL`, `History HL`, `English Literature HL`, `French B SL`, `Math AA SL`), Subject Hubs (`/subjects/bio`, `/subjects/chem`, etc.), Question Runner (`/questions`), AI Essay Studio (`/essay-studio` including clicking `Accept Edit`), Subject Tools (`/tools/data-booklet`, `/tools/formula-booklet`), Flashcards (`/flashcards`), Blurting (`/tools/blurting`), and Settings (`/settings`).
- [ ] **Step 3: Commit all work to Git, ensure GitHub connection, and deploy to Vercel Production (`https://simple-revision.vercel.app`)**
  - Run `NO_UPDATE_NOTIFIER=1 vercel deploy --prod --yes`
  - Verify the live production URL `https://simple-revision.vercel.app` loads and works end-to-end.
