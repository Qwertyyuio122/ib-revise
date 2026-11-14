# Simple Revision — Planning & Design Handoff Report

**Prepared on:** 2026-11-10  
**Workspace:** `/Users/harrismiao/Coding Projects/Simple Revision`  
**Status:** Product scope, mascot, visual design system, and all 6 subject hub specifications are complete and approved. Technical architecture selection, implementation planning (`writing-plans`), and code scaffolding are intentionally deferred to the next implementation session ("Argon").

---

## 1. Executive Summary
**Simple Revision** is a 100% free, single-tier, unlimited-use International Baccalaureate (IB) Diploma revision web application built to eliminate paywalls, weekly energy limits, and upgrade gates.

During this planning session, we:
1. Audited RevisionDojo's live site and **19 reference screenshots** supplied by the user to extract exact layout proportions, spacing, borderless tool grids, and subtle UX polish.
2. Narrowed curriculum scope to the user's **6 exact IB DP subjects** (correcting Chemistry to **SL**).
3. Resolved recurring failure modes from the user's prior build attempts (generic/inconsistent UI, broken overlapping features, weak runtime AI-generated questions).
4. Designed the **Sprout** nature mascot and generated Stitch mockups + a unified interactive HTML prototype across all 6 subjects, locking in [DESIGN.md](file:///Users/harrismiao/Coding%20Projects/Simple%20Revision/DESIGN.md).

---

## 2. Locked Product Decisions & Non-Negotiables

| Area | Final Decision |
| :--- | :--- |
| **Pricing & Access** | **Free-only single tier** with every feature unlocked. Zero paywalls, zero energy/XP limits, zero Upgrade/PRO badges. |
| **Authentication** | **Mandatory login from day one** (no guest mode or skip button). Every user account persists progress, notes, study plans, and essay drafts. |
| **Exact 6 Subjects** | **1. Biology HL** · **2. Chemistry SL** *(not HL)* · **3. History HL** · **4. English Literature HL** · **5. French B SL** · **6. Math AA SL**. No MYP, no University, no other 34 subjects. |
| **Media Constraint** | **Strictly zero videos** (no explainer videos, no video walkthroughs). Past-paper walkthroughs and worked solutions are clean text/math step-by-step guides. |
| **Community Submissions** | **None.** All curriculum content is managed through the repo pipeline. |
| **AI Cost Model** | **Zero-server-bill BYOK:** Students supply their own free **Gemini API key** (with OpenRouter free-model key compatibility as an optional future adapter). |
| **Question Content Model** | **No in-app AI question generator.** Build a strict schema, validator, and batch seed/import pipeline in the codebase. Seed an initial high-quality batch; future large-scale question packs (aiming toward RevisionDojo-scale counts per subject) are generated externally via Antigravity and ingested through the repo pipeline. |

---

## 3. Complete Feature Inventory

### A. Core Shell & Navigation
- **Mandatory Auth Flow:** Sign up / sign in gate before accessing any app route, plus onboarding/settings check for connecting a free Gemini API key.
- **Neutral App Chrome:** Slim `224px` `#FAFAFA` sidebar with monochrome outline SVG icons (`Home`, `My Subjects`, `Sprout AI Tutor`, `Study Planner`, `My Notes`, `All Resources`, `IA/EE/TOK`, `Tools`, `Saved`, `Settings`), global search (`⌘K`), study timer, notifications, streak counter, `Gemini Key Ready` status pill, and Sprout avatar.
- **Homepage:** Neutral sky horizon wash, two-tone greeting (`Good evening, / [Name]`), `SPROUT DAILY` quick-practice card, and 6 distinct custom-illustrated subject cards (`Open >` pill only, no stat clutter).

### B. Per-Subject Hubs (Unique Nature Identity + Tailored Tools)
All 6 hubs share one strict template (per-subject blurred nature aurora header wash dissolving to `#FFFFFF`, two-tone `Subject / Level` heading, underline tabs `Resources | Topics & Progress | Study Plan | Saved`, `1 → 2 → 3` Coursework IA banner, Subject Spotlight strip, and borderless 2-column tool grids):
- **Biology HL:** Visualizations (cell/pathway diagrams), 2025 Themes A–D, Scientific Investigation IA.
- **Chemistry SL:** Interactive IB Data Booklet & Periodic Table, Calculation Step Checker (sig figs/units), Structure & Reactivity drills.
- **History HL:** Paper 1 OPCVL Source Trainer, Essay Outline Builder, Historiography Timelines, Historical Investigation IA.
- **English Literature HL:** Literary Device Drill, Global Issue Bank, Quote Flashcards, Individual Oral & HL Essay studio.
- **French B SL:** 5 IB Themes, Text-Type & Register Drills (article, lettre, blog, discours), Grammar & Conjugation Lab, Blurting in French.
- **Math AA SL:** Paper 1 Non-Calc vs. Paper 2 GDC split, Interactive Formula Booklet reference, Worked Step Walkthroughs, Mathematical Exploration IA.

### C. Practice, Learn & Planning Engines
- **Question Bank Runner:** Filter by Topic, Paper, SL/HL, Difficulty; free-response & MCQ input; Markscheme reveal; text walkthroughs; instant Gemini rubric grading; one-click save to **Mistakes Log**.
- **Exam Builder & Predicted Papers:** Custom timed mock exams calibrated per paper format.
- **Active Recall Suite:** **Spaced-Repetition Flashcards**, **Blurting** (blank-page recall checked by Gemini for missed points), and **Teach Sprout** (Feynman-technique dialogue with Baby Sprout).
- **Knowledge & Planning:** **Study Guide**, **Cheatsheets**, **Key Definitions & Grade Boundaries**, **Topics & Progress** 6-state mastery tracker (`Mastered` → `Unseen`), **My Notes** (subject folders + page thumbnails), and **Study Planner** (`Focus | Week | Month` + calendar).

### D. Coursework Studio & AI Essay Editor
- **IA / EE / TOK Guides & Exemplars:** Structured `1 → 2 → 3 → 4` workflow with subject rubrics and annotated exemplars.
- **AI Essay Editor:** Split document + margin rail supporting:
  - Criterion-by-criterion IB rubric scoring (`Crit A/B/C/D`).
  - Passage highlighting mapped directly to specific inline margin comments.
  - Proposed inline edits rendered as clean diffs with **Accept Edit / Dismiss** controls.
  - **AI & Originality Checker:** Transparent advisory writing/originality signal breakdown (explicitly labeled as an advisory check rather than definitive proof).
  - Context-aware **Ask Sprout** sidebar prompts.

---

## 4. Saved Visual Assets & Design Artifacts

1. **Canonical Design System:** [DESIGN.md](file:///Users/harrismiao/Coding%20Projects/Simple%20Revision/DESIGN.md)
2. **Approved Unified Interactive Prototype (HTML/CSS/JS):** [docs/design-references/unified-consistent-system.html](file:///Users/harrismiao/Coding%20Projects/Simple%20Revision/docs/design-references/unified-consistent-system.html)
3. **19 RevisionDojo Reference Screenshots:** [docs/design-references/revision-dojo/](file:///Users/harrismiao/Coding%20Projects/Simple%20Revision/docs/design-references/revision-dojo/)
4. **Stitch Canvas Project (`4332812100757253680`):** `https://stitch.google.com/projects/4332812100757253680`
   - Initial Studio Renders: [docs/design-references/stitch-previews/](file:///Users/harrismiao/Coding%20Projects/Simple%20Revision/docs/design-references/stitch-previews/) (`03-essay-editor.png` and `04-question-runner.png` show the Essay Studio & Question Runner layout patterns)
   - Screenshot-Referenced Homepage & All 6 Subject Hubs: [docs/design-references/stitch-v2/](file:///Users/harrismiao/Coding%20Projects/Simple%20Revision/docs/design-references/stitch-v2/)
   - *Important corrections documented in `DESIGN.md`:* Fix Homepage Card 5 from `Theory of Knowledge` to **Math AA SL** (warm amber curve) + remove ninja headband on Sprout; correct `02-chemistry-hl.png` to **Chemistry SL** and keep its 2-column tool list borderless; keep global sidebar neutral `#E4E4E7` active highlights; enforce `Plus Jakarta Sans` + `Inter` + `JetBrains Mono` everywhere.

---

## 5. Recommended Next Steps for the Implementation Session (Argon)

1. **Read Context First:** Inspect `DESIGN.md`, this `docs/HANDOFF.md`, and `docs/design-references/unified-consistent-system.html`.
2. **Choose Technical Architecture (2–3 Concrete Approaches):** Present stack options covering:
   - App framework + styling (e.g., Next.js App Router + TypeScript + Tailwind v4 vs. Vite + React)
   - Mandatory Auth + Persistence (e.g., Supabase Auth + Postgres for user state, notes, flashcards, essay drafts, planner, question attempts; localStorage/encrypted client storage for user Gemini API key)
   - Rich Essay Editor engine for stable passage highlights, margin comment anchors, and inline accept/reject diffs (e.g., TipTap / ProseMirror marks vs. structured paragraph/span anchoring)
   - Repo-side Question Bank ingestion pipeline (strict Zod schema + syllabus taxonomy JSON/SQLite/Postgres seed scripts).
3. **Lock Technical Design & Plan:** Write the technical architecture doc, run builder review, get user approval, and invoke `writing-plans`.
4. **Build in Verified Vertical Slices (Why Past Builds Failed):**
   - *Slice 1:* Design System Shell + Mandatory Auth + Gemini Key Setup + Neutral Homepage + 6 Subject Hubs.
   - *Slice 2:* Repo-Side Question Ingestion Pipeline + Initial Question Batch + Question Runner + Markschemes + Mistakes Log.
   - *Slice 3:* Exam Builder + Predicted Papers + Study Guides/Cheatsheets/Subject Tools (Data Booklet, Formula Booklet, etc.) + Topics & Progress.
   - *Slice 4:* Spaced-Repetition Flashcards + My Notes + Study Planner.
   - *Slice 5:* Gemini BYOK Engine (Sprout AI Tutor, Free-Response Marking, Blurting, Teach Sprout).
   - *Slice 6:* Coursework Studio (AI Essay Editor with highlights/comments/inline diffs + Rubric Scoring + Advisory AI/Originality Check + Guides/Exemplars).
   - Enforce finite state machines (`type ScreenState = ...`), Zod parsing on all external Gemini JSON payloads & question files, and browser verification at `375px`, `768px`, and `1280px` after every slice.
