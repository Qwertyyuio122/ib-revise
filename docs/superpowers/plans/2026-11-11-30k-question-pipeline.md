# 30,000-Question Hybrid Pipeline & Interactive Diagrams — Implementation Plan

> **For agentic execution:** Execute tasks sequentially, verify every task with tests/typechecks before moving to the next, and do not mark complete until all 30,000 questions are verified, seeded to Turso, committed, pushed, and deployed to Vercel.

**Goal:** Build and run an Option B hybrid verified pipeline generating 30,000 IB-style questions (8,000 Math AA SL with interactive diagrams, 7,000 Chem SL, 6,500 Bio HL, 6,500 French B SL, 1,000 History HL, 1,000 English Lit HL), upgrade the DB/API/UI to scale cleanly to 30k questions with interactive math diagrams, seed production Turso, and push/deploy to Vercel.

**Spec:** [docs/superpowers/specs/2026-11-11-30k-question-pipeline-design.md](../specs/2026-11-11-30k-question-pipeline-design.md)

---

## Global Constraints
- Follow `GEMINI.md`, `project_guidelines.md`, and `DESIGN.md` strictly (zero paywalls/videos, 6 locked subjects, Chemistry SL `22.7 dm³ mol⁻¹` / zero HL leaks, Math AA SL zero AHL/AI leaks, no `eval()`, strict `ScreenState<T>` & `AbortController`, Zod `.safeParse()`).
- Keep all 18 SQLite tables (`ALL_18_TABLES`) intact; add columns via idempotent `ALTER TABLE` migration for live Turso safety.
- Preserve Vitest execution speed (<5s) by gating `content/questions/generated/` ingestion behind `INCLUDE_GENERATED_PACKS=1` in test mode while testing generated shards explicitly.

---

## Implementation Checklist

### Task 1: Question & Diagram Zod Schemas + DB Migration & Sharded Seeding
- [ ] Extend `src/content/schemas.ts` with `MathDiagramSpecSchema` (7 discriminated-union diagram types) plus optional `subtopicCode` and `diagramSpec` on `QuestionItemSchema`, with geometry/probability refinements.
- [ ] Update `src/db/schema.ts` and `src/db/index.ts` (`BOOTSTRAP_SQL` + idempotent `PRAGMA table_info(questions)` `ALTER TABLE` migration + composite question indexes `idx_questions_subject_paper_diff` and `idx_questions_daily`).
- [ ] Update `src/db/__tests__/db-turso.test.ts` index expectations and verify existing-DB migration test passes.
- [ ] Update `src/db/seed.ts`, `scripts/seed-content.ts`, and `next.config.ts` to stream `.json` / `.jsonl` / `.jsonl.gz` recursively in batches of 250, support fast manifest skip unless `--force`, and prevent serverless bundle bloat when `TURSO_DATABASE_URL` is configured.
- [ ] Run `npx vitest run src/db/__tests__/db-turso.test.ts src/content/__tests__/curriculum-seed.test.ts`.

### Task 2: Safe Math Evaluator & Interactive Math Diagram Renderer
- [ ] Create `src/lib/math-eval.ts` — safe recursive-descent expression parser/evaluator + numerical derivative (`+ - * / ^ sin cos tan abs sqrt ln log exp pi e`) with unit tests.
- [ ] Create `src/components/questions/InteractiveMathDiagram.tsx` implementing all 7 interactive SVG diagram types (`function_graph`, `geometry_figure`, `unit_circle`, `probability_tree`, `venn_diagram`, `normal_curve`, `stats_plot`) styled strictly with `DESIGN.md` tokens, keyboard/touch controls, and live readouts.
- [ ] Wire `diagramSpec` and `subtopicCode` into `QuestionRunnerItem`, `src/content/index.ts`, `src/app/api/mistakes/route.ts`, and `QuestionRunnerClient.tsx`.
- [ ] Add unit/component tests for `math-eval.ts` and all 7 `InteractiveMathDiagram` variants.

### Task 3: Scalable 30k Query API & Paginated Question Runner
- [ ] Upgrade `src/app/api/questions/route.ts` to use SQLite/Turso `WHERE`, `LIMIT`, `OFFSET`, `COUNT(*)`, `hasDiagram` filter, `q` search, date-deterministic `mode=daily`, calibrated `mode=exam` sampling, and `questionId` lookup.
- [ ] Upgrade `src/app/(app)/questions/page.tsx` to load only the initial page (`limit=25`), `totalCount`, and `topics` instead of loading all 30,000 rows in RSC props.
- [ ] Upgrade `src/components/questions/QuestionRunnerClient.tsx` with `serverPaginated` mode (`ScreenState`, `AbortController`, topic filter, "Diagrams Only" toggle, search input, cross-page Prev/Next, Exam sampling, Mistakes Redo lookup) while maintaining full backward compatibility with direct `initialQuestions` unit tests.
- [ ] Run `npx vitest run src/lib/__tests__/api-routes.test.ts src/components/__tests__/essay-studio.test.tsx`.

### Task 4: Build Option B Hybrid 30,000-Question Pipeline (`scripts/pipeline/`)
- [ ] Build `scripts/pipeline/types.ts`, `blueprints.ts` (all syllabus topics/subtopics and target allocations totaling 30,000), `validators.ts` (Zod, KaTeX `throwOnError`, control chars, HL/SL quarantine, diagram geometry validation, deduplication).
- [ ] Build `scripts/pipeline/gemini-client.ts` (resumable multi-model pool `gemini-3.5-flash` / `gemini-3.5-flash-lite` / `gemini-3.1-flash-lite` with `responseSchema`, JSON/LaTeX escape repair, backoff, and disk checkpointing) + run controlled Gemini stimulus/passage enrichment batches.
- [ ] Build `scripts/pipeline/generators/math-aa-sl.ts` (60+ verified parametric Math AA SL engines across `SL 1.1`–`SL 5.11` producing 8,000 unique questions with ~4,400+ interactive diagrams baked in).
- [ ] Build `scripts/pipeline/generators/chemistry-sl.ts` (45+ verified Chemistry SL engines across Structures 1–3 & Reactivities 1–3 producing 7,000 unique questions strictly at 2025 SL with `22.7 dm³ mol⁻¹`).
- [ ] Build `scripts/pipeline/generators/biology-hl.ts` (6,500 unique Bio HL 2025 questions across all 40 subtopics, Paper 1A/1B/2A/2B, quantitative solvers + mechanisms + Gemini-seeded lab contexts).
- [ ] Build `scripts/pipeline/generators/french-b-sl.ts` (6,500 unique French B SL questions across 5 IB themes, Paper 2 reading passages, Paper 1 text types, and verified French grammar/syntax engines).
- [ ] Build `scripts/pipeline/generators/history-hl.ts` (1,000 History HL Paper 1 OPCVL, Paper 2, Paper 3 questions) & `scripts/pipeline/generators/english-lit-hl.ts` (1,000 English Lit HL AOE 1–3, unseen poetry/prose, comparative/IO/HLE questions).
- [ ] Build `scripts/pipeline/shard-writer.ts`, `scripts/generate-questions.ts`, and `scripts/verify-questions.ts` (CLI flags `--dry-run`, `--mode`, `--subject`, output sharded `content/questions/generated/*.jsonl.gz` + `manifest.json`).
- [ ] Add pipeline unit tests covering generators, validators, diagram accuracy, and deduplication.

### Task 5: Generate & Verify Full 30,000-Question Bank
- [ ] Execute `npx tsx scripts/generate-questions.ts` to produce all **30,000** unique validated questions (`8,000 math`, `7,000 chem`, `6,500 bio`, `6,500 fr`, `1,000 hist`, `1,000 eng`).
- [ ] Execute `npx tsx scripts/verify-questions.ts` and confirm 30,000/30,000 pass Zod, KaTeX, syllabus quarantine, diagram bounds, and 0 duplicates.
- [ ] Verify local SQLite seeding of all 30,038+ questions in a test/local DB without bloating git beyond limits.

### Task 6: Full Verification Suite, Build Check & Responsive UI Verification
- [ ] Run `npx tsc --noEmit --pretty false`, `npm test -- --silent --bail=1`, and `npm run lint`.
- [ ] Run `npm run build` and verify clean Next.js production build.
- [ ] Verify `/questions` pagination, filters, and interactive math diagrams render cleanly across desktop (`1280px`), tablet (`768px`), and mobile (`375px`) viewports (via Playwright/browser verification on local dev server).

### Task 7: Push 30k Questions to Production Turso DB, Git Push & Deploy to Vercel
- [ ] Run idempotent migration + streamed seed against production `TURSO_DATABASE_URL` (`scripts/seed-content.ts --force`), verifying exact Turso row counts (`>= 30,038` questions, `>= 4,000` Math diagrams).
- [ ] Inspect full `git status` and `git diff` for hygiene, commit cleanly, and push to `origin main`.
- [ ] Deploy production to Vercel (`vercel --prod`) and verify the live deployment responds cleanly and serves the new 30,000+ question bank and interactive diagrams!
