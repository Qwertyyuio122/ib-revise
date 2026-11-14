# GEMINI.md — Simple Revision Agent & Sub-Agent Engineering Mandate

> **Scope:** Applies automatically to the root workspace and every subdirectory of **Simple Revision**. Every agent and sub-agent MUST follow these standards alongside [project_guidelines.md](./project_guidelines.md) (complete product, architecture, schema, and route inventory) and [DESIGN.md](./DESIGN.md) (canonical visual specification).

---

## 1. Mandatory Pre-Work Protocol

Before writing code, creating UI, or generating curriculum content:
1. **Read the relevant sections** of [project_guidelines.md](./project_guidelines.md) and [DESIGN.md](./DESIGN.md). When implementing or polishing any UI surface, inspect [docs/design-references/unified-consistent-system.html](./docs/design-references/unified-consistent-system.html) as the visual source of truth.
2. **Respect active workspace state:** Do not overwrite unrelated work-in-progress files, do not revert user choices, and check existing components/helpers (`src/lib/`, `src/components/`, `src/content/schemas.ts`, `src/types/fsm.ts`) before introducing new abstractions.
3. **Never invent product scope:** Only the locked **6 IB Diploma subjects**, zero paywalls, zero videos, mandatory auth, and repo-seeded question packs are permitted.

---

## 2. Anti-"Vibe Coded" UI Design Standards

Simple Revision must look and feel like a calm, editorial, precision-crafted IB study desk—never like a generic AI-generated SaaS template.

### A. Strictly Banned Visual Patterns
- **NO generic SaaS gradients:** Never use saturated purple, violet, or indigo hero gradients or neon glow badges.
- **NO heavy card drop-shadows:** Depth comes exclusively from flat tonal contrast (`#FFFFFF` vs `#FAFAFA` vs `#F4F4F5`) and crisp `1px solid #E4E4E7` hairlines—never blurred floating cards.
- **NO pure black on pure white fatigue:** Use `#18181B` (`--ink`) on `#FFFFFF` (`--bg-canvas`), paired with `#71717A` (`--muted`) and `#3F3F46` secondary text.
- **NO unstyled native controls:** Every `<button>`, `<input>`, `<select>`, and link control must have explicit padding, border/surface tokens, hover/active states, and accessible focus rings.
- **NO generic spinner-only loading states:** Use tailored skeleton placeholders matching the target layout (`AuthCardSkeleton`, `src/app/(app)/loading.tsx`, hairline card skeletons).
- **NO emojis in navigation, sidebars, tabs, or toolbars:** Use crisp `1.8px`-stroke monochrome outline SVGs (custom inline SVGs or `lucide-react`) and `<SproutMascot />` poses.
- **NO font mixing across screens:** Never switch to serif fonts on essays, notes, or subject hubs.

### B. Unified Shell vs. Per-Subject Nature Immersion
- **Global Shell Stays Strictly Neutral:**
  - Top Utility Bar (`54px`, `#FFFFFF`, bottom border `#F4F4F5`): Sprout emblem + `Simple Revision`, `⌘K` search pill (`#F4F4F5`), `StudyTimerPopover`, notifications bell, streak pill, Sprout avatar menu.
  - Left Sidebar (`224px`, `#FAFAFA`, right border `#F4F4F5`): `DP | My 6` pill toggle, monochrome nav items, `#E4E4E7` neutral active fill (`--nav-active`).
  - Global routes (`/`, `/tutor`, `/planner`, `/notes`, `/questions`, `/study-guides`, `/cheatsheets`, `/flashcards`, `/essay-studio`, `/coursework`, `/saved`, `/settings`, `/login`, `/signup`) MUST remain neutral slate/charcoal—never drenched in a single subject's accent color.
- **Subject Immersion Is Scoped:**
  - Per-subject blurred aurora washes (`--wash-1..3`), subject accent underlines (`--subj-accent`), and soft tints (`--subj-soft`) activate ONLY inside `/subjects/[slug]` and `/tools/[toolSlug]`, dissolving smoothly into `#FFFFFF` below the header/tabs.

### C. Typography, Layout & Component Geometry
- **Single Font Stack (defined in `src/app/layout.tsx` & `src/app/globals.css`):**
  - Display (`--font-display`): `Plus Jakarta Sans` (`27px` `font-semibold` `-0.025em` paired with `24px` `font-medium` `--muted` for two-tone headers like `Good evening, / Harris` or `Biology / HL`).
  - Body (`--font-body`): `Inter` (`13px–14px`, `1.5` line-height; `1.75` inside `.ProseMirror` essay drafts; `12px` `--muted` metadata).
  - Mono (`--font-mono`): `JetBrains Mono` (timers, `⌘K`, `SPROUT DAILY #2`, syllabus codes).
- **Reading Width & Spacing (`4px`/`8px` rhythm):**
  - Standard centered content column: `.col-center` (`max-w-[820px]`).
  - Split-pane AI Essay Studio (`60% / 40%`): `.col-center-wide` (`max-w-[920px]`).
- **Signature Component Rules:**
  - **Homepage Subject Cards (`118px` height, `14px` radius):** Top-left subject title + bottom-left white `Open >` pill + custom right-bleeding vector art ONLY. Never add mastery percentages, progress bars, or extra badges inside Homepage cards.
  - **Borderless 2-Column Subject Tool Grids:** Render directly on `#FFFFFF` with zero outer borders—each item pairs a `42×42px` (`11px` radius) pastel icon tile, `14px` semibold title, `12px` 1-line subtitle, and `#F4F4F5` hover fill (`14px` radius).
  - **Coursework IA Stepper Card:** `14px` radius, `1px solid #E4E4E7`, left IA label/title, center `1 → 2 → 3` steps, right `Setup >` pill.
  - **Mascot (`src/components/mascot/SproutMascot.tsx`):** Use only approved poses (`emblem`, `avatar`, `guide`, `snoozing`, `baby`, `notepad`). Never add unapproved accessories (e.g., ninja headband).

### D. Micro-States, Accessibility & Responsive Verification
- **Interactive Micro-States:** Include `transition-colors duration-150`, explicit hover/active states, `cursor-pointer` on clickable buttons, and `focus-visible:ring-2` (or `.pill-btn:focus-visible`).
- **Accessible Semantics:** Use `role="tablist"` / `role="tab"` / `aria-selected`, `aria-expanded`, `aria-label`, `aria-busy`, and `role="alert"` where appropriate.
- **Responsive Breakpoints:** Verify layouts cleanly at **`375px`** (mobile drawer + 1-col), **`768px`** (tablet collapsible rail + 2-col), and **`1280px`** (desktop `224px` sidebar + 3-col cards / centered workspace) with zero horizontal clipping or overlapping controls.

---

## 3. Good Coding Practices

### A. Finite State Machines (FSM) — Zero Boolean Flag Soup
- Never track async screens with scattered booleans (`isLoading`, `isError`, `isSuccess`, `isEmpty`).
- Use `ScreenState<T>` from `src/types/fsm.ts`:
  ```ts
  type ScreenState<T> =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: T }
    | { status: 'empty'; message: string }
    | { status: 'error'; message: string };
  ```
- For complex multi-step flows (timed exams, Feynman dialogue, essay studio review), use `useReducer` or explicit discriminated unions.
- Every async screen must render purposeful **loading** skeletons, actionable **empty** states (with CTA), and recoverable **error** states (with retry + `401` redirect to `/login`).

### B. Schema-First Data Contracts (Zod)
- Define or reuse Zod schemas BEFORE building UI or route handlers:
  - Content & syllabus taxonomy: `src/content/schemas.ts`
  - Auth & redirect sanitization: `src/lib/auth-validation.ts`
  - Originality heuristics & AI responses: `src/lib/originality.ts` + per-route AI response schemas
- Parse ALL external JSON payloads (`request.json()`, `content/questions/*.json`, Gemini outputs) with `.safeParse()`. Return structured `400` responses (via `formatZodError` or descriptive JSON error objects) on invalid payloads.

### C. Auth, Session Integrity & Multi-User Isolation
- **Every non-public API route** MUST call `getCurrentUser()` (`src/lib/auth.ts`) and return `401` if null.
- **Strict user ownership:** Every DB read, update, or delete on user-scoped tables (`topicProgress`, `questionAttempts`, `mistakesLog`, `examSessions`, `flashcards` custom rows, `recallSessions`, `notes`, `essayDocuments`, `studyTasks`, `bookmarks`, `notifications`) MUST include `eq(table.userId, user.id)`. Never trust a client-supplied `userId`.
- **Dual-runtime auth consistency:** Keep Edge `src/middleware.ts` (`verifySessionEdge` using Web Crypto HMAC-SHA256) aligned with Node `src/lib/auth.ts` (`jose` + DB session verification) and `src/lib/auth-secret.ts` (which fails closed in deployed production when `SESSION_SECRET` is missing).
- **Safe redirects & throttling:** Always validate post-auth redirects with `sanitizeRedirectPath()` and preserve auth rate limiting (`src/lib/rate-limit.ts`).

### D. BYOK Gemini AI & Deterministic Fallback (`src/lib/gemini.ts`)
- **Single AI helper:** All AI endpoints (`/api/ai/tutor`, `/api/ai/grade-question`, `/api/ai/review-essay`, `/api/ai/blurting`, `/api/ai/teach-sprout`) must call `callGeminiStructured()` with `responseSchema` (via `zodToGeminiJsonSchema`) + Zod verification + deterministic local `fallback()`.
- **Model constants:** Use `normalizeGeminiModel()` and shared model constants (`gemini-3-flash-preview` default, `gemini-3.5-flash`, `gemini-3.8-flash`, `gemini-3.1-pro-preview`, plus legacy `gemini-2.5-*` mapping).
- **Key resolution order:** `x-gemini-key` header → authenticated `user.geminiApiKey` → `process.env.GEMINI_API_KEY`.
- **Single key management UX:** Gemini key entry/testing lives in `/settings` (and optional signup field). Do NOT reintroduce a standalone `GeminiKeyModal` or store raw API keys in browser `localStorage`.

### E. SQLite, Drizzle & Vercel Serverless Compatibility (`src/db/`)
- **Schema synchronization:** Whenever altering tables or indexes, update BOTH `src/db/schema.ts` AND `BOOTSTRAP_SQL` in `src/db/index.ts`.
- **Serverless cold-start awareness:** Locally DB lives at `./data/simple-revision.db` (WAL mode). On Vercel (`process.env.VERCEL === '1'`), `src/db/index.ts` copies the pre-seeded bundled DB into `/tmp/simple-revision.db` and `next.config.ts` bundles `./data/**/*`. Always verify `npm run content:seed` cleanly updates the DB when modifying `src/content/` or `content/questions/`.

### F. React Hygiene, Performance & Maintainability
- Render all LaTeX / mhchem (`$...$`, `$$...$$`, `\ce{...}`) with memoized `<KaTeXText />` (`src/components/math/KaTeXText.tsx`), never raw inline `katex.renderToString`.
- Clean up `fetch()` calls with `AbortController`, and always remove `window`/`document` listeners and `setTimeout` timers in `useEffect` cleanup.
- Reuse shared wrappers (`AuthCardShell`, `PasswordField`, `AppShell`) instead of duplicating markup across pages.
- Keep `src/app/(app)/error.tsx` and `src/app/(app)/loading.tsx` working cleanly with Next.js App Router boundaries.

---

## 4. "Vibe Coding" Errors Explicitly Forbidden Here

| Anti-Pattern ("Vibe Coding" Trap) | Required Practice in Simple Revision |
| :--- | :--- |
| **1. Dead or cosmetic UI controls** (fake search buttons, placeholder tabs, static bells/timers) | Wire every link, tab, popover, and button to real state or a working API route. |
| **2. Scope, tier, or media bloat** (`PRO`/`Upgrade` badges, `XP`/`Energy`, `<video>` embeds, guest/demo login, extra subjects, TOK card on Home) | Keep single free tier, zero videos, mandatory email/password auth, and strictly the 6 locked IB subjects. |
| **3. Wrong IB syllabus level or outdated constants** (Chemistry HL instead of SL, Biology 2016 topics, `22.4 dm³ mol⁻¹` at STP) | Follow exact specs in `project_guidelines.md` (Chemistry **SL** 2025, Biology **HL** 2025, IB STP `22.7 dm³ mol⁻¹`, History 2017+2020, Math AA SL, English Lit HL, French B SL). |
| **4. Runtime LLM question generation** (calling Gemini to invent practice questions on the fly) | All practice questions must be authored offline, validated by `QuestionItemSchema`, and seeded via `npm run content:seed`. |
| **5. Fragile string replacement in Essay Studio** (`text.replace(...)` breaking annotations as the user edits) | Anchor inline feedback and diffs with TipTap ProseMirror marks (`CriterionHighlightMark`, `SuggestedEditMark`). |
| **6. Unvalidated LLM JSON (`JSON.parse(text)` directly)** | Always run `callGeminiStructured()` (`extractJsonFromResponse` + `schema.safeParse` + `deterministic_fallback`). |
| **7. Duplicate key modals or insecure client key storage** (re-adding `GeminiKeyModal` or saving keys in `localStorage`) | Keep personal Gemini keys persisted server-side in SQLite + HTTP-only `sr_gemini` cookie via `/settings` / `/api/settings`. |
| **8. Boolean flag soup & swallowed errors** (`isLoading && !isError`, silent `.catch(() => {})` hiding failures) | Use `ScreenState<T>`, handle `401` redirects, and display actionable error + retry UI. |
| **9. Unscoped DB queries or unvalidated redirects** (`where(eq(table.id, id))` without `userId`, raw `router.push(next)`) | Always enforce `eq(table.userId, user.id)` and `sanitizeRedirectPath()`. |
| **10. Blind full-file edits & unverified claims** (reading huge files blindly, skipping tests/typecheck) | Grep symbols first, read targeted line ranges, inspect `git diff`, and run verification checks after edits. |

---

## 5. Agent Workflow & Verification Checklist

1. **Locate before editing:** Use `grep -rn` / `rg -n` first; read only targeted line ranges (`StartLine`/`EndLine`).
2. **Respect single sources of truth:** Match route slugs in `src/app/(app)/tools/[toolSlug]/page.tsx` and query params (`mode=` on `/questions`, `tab=` on `/subjects/[slug]`) before adding links.
3. **Run verification after your final edit** (with compact flags):
   - Type check: `npx tsc --noEmit --pretty false`
   - Unit/integration tests: `npm test -- --silent --bail` (or targeted `npx vitest run <path>`)
   - When modifying content packs/DB: `npm run content:seed`
   - When modifying Next routes, middleware, or `next.config.ts`: `npm run build`
   - When modifying UI: verify responsive layout at `375px`, `768px`, and `1280px` and check all micro-states (`loading`, `empty`, `error`, `success`).
4. **Pre-commit audit:** Inspect `git diff` for unused imports, duplicated logic, missing ownership checks, memory leaks, or visual token drift before reporting done.
