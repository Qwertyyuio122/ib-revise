# 30,000-Question Hybrid IB Generation Pipeline & Interactive Math Diagrams — Design Spec

> **Status:** Approved Option B Architecture (`2026-11-11`)  
> **Target Repository:** Simple Revision (`Next.js 15` + `Drizzle ORM` + `@libsql/client` / Turso + Vercel)

---

## 1. Intent & Product Alignment

Build an offline, reproducible, Zod- and KaTeX-verified question generation and seeding pipeline that expands Simple Revision's question bank to **30,000 high-quality IB Diploma questions** without violating any project non-negotiables:

- **Zero runtime LLM question generation:** All 30,000 questions are synthesized, verified, deduplicated, and stored offline in sharded repository packs (`content/questions/generated/*.jsonl.gz`) and ingested via `npm run content:seed` into SQLite / Turso libSQL.
- **Exact 6 IB Subjects & Syllabus Quarantine:**
  - `math` — **Math AA SL** (First Assessment 2021, Topics `SL 1.1`–`SL 5.11`; zero `AHL` / `AI` contamination)
  - `chem` — **Chemistry SL** (First Assessment 2025, Structures 1–3 & Reactivities 1–3; `22.7 dm³ mol⁻¹` at `273.15 K`, `100 kPa`; zero HL leakage)
  - `bio` — **Biology HL** (First Assessment 2025, Themes A–D × Levels 1–4, 40 subtopics)
  - `fr` — **French B SL** (First Assessment 2020, 5 IB Themes, Paper 1 Text Types, Paper 2 Reading & Grammar)
  - `hist` — **History HL** (2017 Guide + 2020 Amendments, Paper 1 OPCVL, Paper 2 WH10/WH12, Paper 3 HL Europe)
  - `eng` — **English Literature HL** (First Assessment 2021, AOE 1–3, Paper 1 Unseen, Paper 2 Comparative, HL Essay / IO)
- **Target 30,000-Question Allocation** *(weighted heavily toward STEM & French, lighter on English & History)*:

| Subject | Slug | Target Questions | Interactive Diagrams | Generation Strategy (Option B Hybrid) |
| :--- | :--- | ---: | ---: | :--- |
| **Math AA SL** | `math` | **8,000** | **~4,400+ (55%)** | 60+ deterministic exact-math & 3-s.f. solver engines across all 51 SL subtopics + varied IB scenarios + interactive `MathDiagramSpec` builders + optional Gemini enrichment |
| **Chemistry SL** | `chem` | **7,000** | — | 45+ deterministic stoichiometry/energetics/kinetics/equilibrium/acid-base/redox/VSEPR/organic engines (`22.7 dm³ mol⁻¹`) + Gemini/curated Paper 1B & Paper 2 scenarios |
| **Biology HL** | `bio` | **6,500** | — | Quantitative/experimental Paper 1B solvers (water potential, $\chi^2$, Hardy-Weinberg, Simpson's $D$, Lincoln index, genetics, enzyme kinetics, mitotic index) + 40-subtopic HL/SL mechanism & experimental matrices + Gemini-authored lab contexts |
| **French B SL** | `fr` | **6,500** | — | Authentic Francophone Paper 2 reading comprehension passages + Paper 1 text-type/Criterion C drills + verified French morphological/syntactic grammar engines (*subjonctif, si-clauses, passé composé/imparfait, pronoms, connecteurs, faux amis*) |
| **History HL** | `hist` | **1,000** | — | Paper 1 OPCVL source excerpts, Paper 2 comparative historiography essays, and Paper 3 HL Europe analytical drills |
| **English Literature HL** | `eng` | **1,000** | — | Bespoke unseen prose/poetry passages, close-reading craft drills, Paper 2 comparative prompts, and HL Essay / IO global-issue prompts |
| **Total** | — | **30,000** | **~4,400+** | **+ 38 existing core pack questions = 30,038+ total DB questions** |

---

## 2. Option B Hybrid Generation & Verification Architecture

Why Option B (instead of pure LLM prompting):
1. Pure LLM calls across 30,000 questions hit API Free-Tier daily caps (`20 RPD/model` observed during preflight) and frequently miscalculate integrals, surds, GDC 3-s.f. rounding, `22.7 dm³ mol⁻¹` stoichiometry, and diagram coordinates.
2. Option B combines:
   - **Deterministic Domain Solvers & Morphological/Scenario Synthesizers:** Exact mathematical/chemical/biological computation and French syntactic verification guarantees 100% numeric & markscheme accuracy, misconception-derived MCQ distractors, and exact diagram geometry.
   - **Resumable Multi-Model Gemini Enrichment Pool (`scripts/pipeline/gemini-client.ts`):** Uses `GEMINI_API_KEY` (`gemini-3.5-flash`, `gemini-3.5-flash-lite`, `gemini-3.1-flash-lite`) with `responseSchema`, LaTeX-JSON backslash repair, rate-limit backoff, and disk checkpoints (`.checkpoints/`) to author unseen Francophone passages, Biology experimental datasets, English literary extracts, History OPCVL sources, and scenario diversity, while supporting `--mode=hybrid` (completes full 30,000 deterministically + LLM corpus) and `--mode=gemini-only` for future paid-key batch expansion.
   - **5-Stage Automated Quality Gate (`scripts/verify-questions.ts`):**
     1. `QuestionItemSchema.safeParse()` (validates `markschemePoints` sum === `marks`, 4 MCQ options + valid `correctOptionId`, $\ge 2$ `walkthroughSteps`, $\ge 1$ `commonPitfalls`).
     2. `MathDiagramSpecSchema.safeParse()` + geometry bounds verification (finite coordinates, valid probabilities summing cleanly, valid quartiles $Q_1 \le Q_2 \le Q_3$, valid expression evaluation).
     3. Strict KaTeX & mhchem compilation check (`katex.renderToString(..., { throwOnError: true })`) and zero control characters (`[\t\b\f\r\v]`).
     4. Syllabus Quarantine Gate (rejects `22.4`, `Entropy`, `Gibbs`, `1H NMR`, `AHL`, `Voronoi`, `Markov`, `Bayes`, etc. in SL packs; enforces accented French and non-empty prompts).
     5. Normalized Stem + Fingerprint Deduplication (0 exact or structural clones across all 30,000 items).

---

## 3. Interactive Math Diagram Specification & UI

### Schema (`MathDiagramSpecSchema` in `src/content/schemas.ts`)
7 interactive discriminated-union variants stored in `questions.diagram_spec_json`:
1. `function_graph`: `xRange`, `yRange`, `functions` (`expr`, `label`, `color?`, `dashed?`, `samplePoints?`), optional `asymptotes` (`vertical`/`horizontal`), `shadedRegion` (`exprTop`, `exprBottom?`, `fromX`, `toX`, `label?`), `tangentAtX`, `keyPoints` (`x`, `y`, `label`), `interactiveTrace` (`true` by default).
2. `geometry_figure`: `viewBox`, `vertices` (`id`, `x`, `y`, `label`), `segments` (`from`, `to`, `label?`, `dashed?`), `rightAngles` (`vertex`, `armA`, `armB`), `angleArcs` (`vertex`, `armA`, `armB`, `label`), `circles` (`cx`, `cy`, `r`, `sectorStartDeg?`, `sectorEndDeg?`).
3. `unit_circle`: `targetAnglesRad` (`number[]`), `labels` (`string[]`), `highlightQuadrants` (`number[]`), `showExactValues` (`boolean`).
4. `probability_tree`: `rootLabel`, `stages` / nested `branches` (`label`, `probDisplay`, `probValue`, `children?`).
5. `venn_diagram`: `universeLabel`, `sets` (`A`, `B`, optional `C`), `regions` (`id`, `label`, `valueDisplay`, `shaded?`).
6. `normal_curve`: `mean`, `sd`, `variableName`, `shadedIntervals` (`from`, `to`, `label?`), `markers` (`x`, `label`).
7. `stats_plot`: supports `subtype`: `'scatter_regression' | 'box_plot' | 'cumulative_ogive' | 'histogram'` with typed axes, data series, regression line/box quartiles/ogive points/histogram bins.

### UI & Design Compliance (`src/components/questions/InteractiveMathDiagram.tsx`)
- Safe recursive-descent math expression evaluator (`src/lib/math-eval.ts`) — strictly zero `eval()` or `new Function()`.
- Calm editorial styling aligned with `DESIGN.md`: `#FFFFFF` card / `#FAFAFA` plot surface, `1px solid #E4E4E7` frame, `#18181B` charcoal axes/curves, `#D97706` Math AA amber highlights, `JetBrains Mono` coordinate readouts, explicit `focus-visible:ring-2` and `transition-colors duration-150`, responsive across `375px`, `768px`, and `1280px`.
- Interactive features per diagram type: live $x$-trace slider & hover coordinates (with optional tangent line toggle), clickable geometry vertices/edges/arcs, interactive unit circle angle scrubber, clickable tree path probability tracer, clickable Venn region inspector, normal $z$-score scrubber, and hoverable stats plot coordinates/quartiles.
- Rendered inside [`QuestionRunnerClient`](file:///Users/harrismiao/Coding Projects/Simple Revision/src/components/questions/QuestionRunnerClient.tsx) directly above the question stem whenever `currentQuestion.diagramSpec` is present.

---

## 4. Database, Seeding & 30k Runtime Scaling

1. **Schema & Idempotent Migration (`src/db/schema.ts`, `src/db/index.ts`):**
   - Keep existing 18 tables (`ALL_18_TABLES` invariant preserved).
   - Add `subtopicCode` (`text('subtopic_code')`) and `diagramSpecJson` (`text('diagram_spec_json')`) to `questions` and `BOOTSTRAP_SQL`.
   - In `ensureDbReady()`, run idempotent `PRAGMA table_info(questions)` checks and `ALTER TABLE questions ADD COLUMN ...` if missing so existing production Turso databases migrate cleanly with zero data loss.
   - Add composite filter indexes (`idx_questions_subject_paper_diff`, `idx_questions_daily`) and update `src/db/__tests__/db-turso.test.ts` index expectations.
2. **Streamed Sharded Seeding (`src/db/seed.ts`, `scripts/seed-content.ts`):**
   - Support `.json`, `.jsonl`, and `.jsonl.gz` under `content/questions/` (recursively including `content/questions/generated/`).
   - Stream upserts to libSQL/Turso in bounded batches of 250 without holding 30,000 Drizzle objects in RAM.
   - In `ensureSeeded(false)` (or `npm run build` unless `--force`), check manifest/count parity so already-seeded Turso databases skip re-uploading 30,000 rows in <1s.
   - Skip `content/questions/generated/` during `VITEST` runs unless `INCLUDE_GENERATED_PACKS=1` so the test suite remains sub-3 seconds.
   - Update `next.config.ts` so `./content/questions/generated/**/*` and oversized local `./data/*.db` are not needlessly bundled into runtime serverless functions when `TURSO_DATABASE_URL` is set.
3. **Server-Backed Paginated Runner (`src/app/api/questions/route.ts`, `src/app/(app)/questions/page.tsx`, `QuestionRunnerClient.tsx`, `src/app/api/mistakes/route.ts`):**
   - Push `subject`, `topicId`, `paper`, `questionType`, `difficulty`, `calculatorPolicy`, `hasDiagram`, text search `q`, `mode=daily` (date-deterministic 5-pack across subjects or within filtered subject), `mode=exam` (calibrated random mock sample), `questionId`, `page`, and `limit` into SQLite/Turso SQL `WHERE` + `LIMIT` + `OFFSET` + `COUNT(*)`.
   - Update `QuestionsPage` to fetch only page 1 (`limit=25`), `totalCount`, and topic metadata instead of serializing 30,000 questions in SSR props.
   - Update `QuestionRunnerClient` with `ScreenState` server-backed pagination, topic dropdown, "Diagrams Only" filter pill, search bar, Prev/Next cross-page stepping, while remaining 100% backward-compatible with unit tests passing `initialQuestions={[...]}` directly.
