# Simple Revision — Design System & Visual Specification (`DESIGN.md`)

> **Design Philosophy:** Calm, distraction-free IB Diploma revision workspace built around an airy neutral global shell (`#FFFFFF` / `#FAFAFA`), unified typography (`Plus Jakarta Sans` + `Inter` + `JetBrains Mono`), thin `1px` hairlines, generous centered whitespace, a minimalist leaf-sprout mascot (**Sprout**), and subject-specific nature atmospheres that activate only when you enter one of the 6 subjects.

---

## 1. Visual Theme & Atmosphere

- **Global App Shell (Strictly Neutral):** Pure white `#FFFFFF` primary canvas paired with a quiet `#FAFAFA` slim left sidebar (`224px` wide) and `#F4F4F5` subtle hover/pill surfaces. Global navigation, active sidebar rows, search inputs, Planner, My Notes, Question Runner, and AI Essay Studio stay neutral slate/charcoal—never drenched in a single subject's color.
- **Per-Subject Nature Immersion:** Each of the 6 IB subjects introduces its own soft, blurred nature aurora wash at the top of the Subject Hub (dissolving seamlessly into pure `#FFFFFF` below the underline tabs), its own subject accent line, a distinct **Subject Spotlight** strip, and custom right-bleeding vector art on its Homepage card.
- **Minimalistic Micro-Copy & Breathing Room:** Content sits centered inside an `820px` max-width reading column (`920px` for split-pane Essay Studio) with generous horizontal whitespace. Tool rows sit **borderless directly on pure white** in balanced 2-column grids (`42×42px` soft pastel icon tiles + bold title + 1-line subtitle).
- **Zero Monetization / Video Noise:** No `Upgrade`, `Energy ⚡`, `XP`, `PRO` badges, `MYP/University` toggles, or video elements anywhere.
- **Elevation & Borders:** Zero heavy drop shadows. Depth relies solely on flat tonal contrast and `1px solid #E4E4E7` hairline boundaries.

---

## 2. Color Palette & Roles

### A. Global Neutral Foundation (Consistent Across Every Screen)
| Role | Token | Hex | Usage |
| :--- | :--- | :--- | :--- |
| Primary Canvas | `--bg-canvas` | `#FFFFFF` | Main study workspace, Subject Hub body, Question Runner, Essay sheet |
| Sidebar Surface | `--bg-sidebar` | `#FAFAFA` | Fixed `224px` left navigation rail |
| Subtle Hover / Pill | `--bg-hover` / `--bg-pill` | `#F4F4F5` | Search pill, subtle hover pills on borderless tool rows, `DP / My 6` track |
| Primary Hairline | `--border` | `#E4E4E7` | Card outlines, tab bottom rules, IA stepper border, input frames |
| Soft Hairline | `--border-soft` | `#F4F4F5` | Sidebar divider, topbar bottom divider, agenda dividers |
| Primary Ink | `--ink` | `#18181B` | Headings, active nav labels, primary dark CTA buttons, essay body |
| Muted Ink | `--muted` | `#71717A` | Subheadings (`Harris`, `HL`/`SL`), breadcrumbs, 1-line tool subtitles |
| Neutral Active Nav | `--nav-active` | `#E4E4E7` | Selected item fill in global left sidebar (neutral across all pages) |

### B. Sprout Mascot & Semantic Status Signals
| Role | Hex | Usage |
| :--- | :--- | :--- |
| Sprout Primary Leaf | `#065F46` / `#059669` | Sprout seed body, leaf accents, `Gemini Key Ready` dot |
| Sprout Highlight Leaf | `#34D399` / `#A7F3D0` | Secondary leaf highlight & soft avatar ring |
| Warm Amber Pop | `#D97706` (Soft `#FEF3C7`, Ink `#92400E`) | Streak flame accent, inline essay highlight (`Criterion B`), daily focus badge |
| Positive / Edit Accept | `#059669` (Soft `#ECFDF5`, Ink `#065F46`) | Accepted markscheme ticks, inline AI suggested edit additions |
| Alert / Mistakes | `#DC2626` (Soft `#FEF2F2`) | Mistakes Log icon, notification dot, strikethrough deletion text |

### C. Subject-Specific Identities (All 6 Exact IB Subjects)
Each subject pairs **2 harmonious nature tones** (for its Homepage card & blurred top aurora wash) with a crisp accent underline inside its Subject Hub:

| Subject & Level | Homepage Card Gradient & Art | Subject Hub Aurora Wash | Accent Line | Spotlight Focus |
| :--- | :--- | :--- | :--- | :--- |
| **Biology HL** | `#1D6E45` → `#49AD78` (Butterfly & meadow leaves) | Meadow green + pale sky (`rgba(167,243,208,0.55)`) | `#059669` | 2025 Themes A–D, Cell & Pathway Visualizations, 20% Lab IA |
| **Chemistry SL** | `#0F766E` → `#2DD4BF` (Molecular hexagon & flask) | Coastal sea-glass teal (`rgba(153,246,228,0.55)`) | `#0D9488` | Interactive IB Data Booklet, Periodic Table, Calculation Step Checker |
| **History HL** | `#5A3626` → `#8D5E47` (Parchment scroll & wax seal) | Warm desert-sand terracotta (`rgba(253,230,138,0.52)`) | `#B45309` | Paper 1 OPCVL Source Trainer, Essay Outline Builder, Historiography Timelines |
| **English Literature HL** | `#1E40AF` → `#3B82F6` (Open book & ink motif) | Twilight cobalt mist (`rgba(191,219,254,0.58)`) | `#1D4ED8` | Literary Device Drill, Global Issue Bank, Quote Flashcards, IO & HL Essay |
| **French B SL** | `#0369A1` → `#38BDF8` (Eiffel Tower & sky clouds) | Mediterranean sky azure (`rgba(186,230,253,0.62)`) | `#0284C7` | 5 IB Themes, Text-Type & Register Drills, Grammar & Conjugation Lab |
| **Math AA SL** | `#B45309` → `#F59E0B` (Golden spiral & curve) | Sunlit golden-ochre (`rgba(254,240,138,0.52)`) | `#D97706` | Paper 1 Non-Calc / Paper 2 GDC Split, Interactive Formula Booklet |

---

## 3. Typography Rules

**Strict Consistency Rule:** Use ONE shared font stack across every screen—Homepage, all 6 Subject Hubs, Question Runner, Planner, My Notes, and AI Essay Studio (do **not** swap between sans and serif across screens).

- **Display / Headings (`--font-display`):** `'Plus Jakarta Sans', 'Inter', sans-serif`
  - Page Greeting / Subject Heading: `27px`, weight `600`, tracking `-0.025em`, line-height `1.2` (Paired with `24px`, weight `500`, `--muted` `#71717A` for two-tone contrast like `Good evening, / Harris` or `Biology / HL`).
  - Card / Section Title: `14px–16px`, weight `600`, tracking `-0.015em`.
- **UI & Long-Form Body (`--font-body`):** `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`
  - Standard UI / Essay prose: `13px–14px`, weight `400–500`, line-height `1.5` (`1.75` for essay drafts).
  - Tool subtitles & metadata: `12px`, weight `400`, `#71717A`.
- **Mono Metrics & Shortcuts (`--font-mono`):** `'JetBrains Mono', monospace`
  - Timers (`14:22`), keyboard badges (`⌘K`), `SPROUT DAILY #2`, syllabus codes (`A1.1`).

---

## 4. Component Stylings

- **Global Top Utility Bar (`54px` height):**
  - Left: Brand logo (Sprout square emblem + `Simple Revision`), rounded search pill (`Search syllabus, questions, notes...` + `⌘K` badge).
  - Right: `Gemini Key Ready` pill, monochrome timer icon, bell with unread dot, streak flame pill, circular Sprout avatar.
- **Slim Left Sidebar (`224px`, `#FAFAFA`):**
  - Top `DP | My 6` pill toggle.
  - Strictly **crisp `1.8px`-stroke monochrome outline SVG icons** (no emojis).
  - Groups: `Home`, `My Subjects`, `Sprout AI Tutor`, `Study Planner`, `My Notes`; `All Resources` (`Question Bank`, `Study Notes`, `Cheatsheets`, `Flashcards`); `IA / EE / TOK` (`AI Essay Studio`, `Coursework Guides`, `Exemplars`); `Tools` (`Plagiarism & AI`, `Teach Sprout`, `Blurting`); `Saved`; bottom `Settings & Gemini Key`.
- **Homepage Subject Cards (`118px` height, `14px` radius):**
  - Minimal text ONLY: top-left white subject title (`15.5px`, weight `600`), bottom-left crisp white `Open >` pill button, custom right-bleeding vector artwork. Zero extra stats/bars inside the cards.
- **Borderless 2-Column Subject Tool Grid:**
  - Zero outer borders on tool items. Each row has a `42×42px` rounded-`11px` soft pastel icon container, `14px` semibold title, `12px` muted 1-line description, and `#F4F4F5` rounded-`14px` fill on hover.
- **Coursework IA Stepper Card (`14px` radius, `1px solid #E4E4E7`):**
  - Left subject IA label + title, center 3 numbered circular steps (`1 → 2 → 3`), right `Setup >` pill button.
- **Subject Spotlight Strip (`12px` radius, `3.5px` left accent border):**
  - Tinted with the subject's soft background; houses subject-unique quick-launch pills (e.g., Data Booklet, Formula Booklet, OPCVL Trainer, Text-Type Studio).
- **AI Essay Studio Split View (`60% / 40%`):**
  - Left: Clean `#FFFFFF` paper card with inline warm-amber passage highlights (`border-bottom: 2px solid #D97706`) and inline diff edits (strikethrough old phrase + emerald `#ECFDF5` replacement).
  - Right: Aligned `1px` hairline comment/edit cards with left colored accent bar (`#D97706` for rubric feedback, `#059669` for `Accept Edit / Dismiss` suggestions), Criterion score pills, AI/Originality signal pill, and docked Sprout helper prompt.
- **Mascot ("Sprout") Pose States:**
  - *Guide Sprout:* Smiling leaf-sprout in header, Daily Focus banner, and Study Plan empty states.
  - *Snoozing Sprout:* Monochrome grey sleeping pose in empty AI chat history.
  - *Baby Seed:* Smaller single-leaf sprout for **Teach Sprout** (Feynman teaching mode).
  - *Notepad Sprout:* Holding an amber notepad for **Blurting** recall mode.

---

## 5. Layout Principles

- **Base Unit:** `4px` / `8px` spacing rhythm.
- **Desktop Viewport (`≥ 1024px`):** Fixed `224px` left sidebar + fluid main viewport (`44px` horizontal padding) centering an `820px` content column (`920px` for split-pane AI Essay Studio).
- **Tablet (`768px – 1023px`):** Collapsible sidebar rail; subject grid shifts from 3 columns to 2 columns.
- **Mobile (`< 768px`):** Drawer sidebar + single-column subject cards & tool lists (`16px` outer gutters); verify cleanly at `375px`, `768px`, and `1280px`.

---

## 6. Reference Assets & Stitch Canvas Index

All visual references and approved prototypes are saved directly in this repository:
- **Approved Unified Interactive Prototype (Source of Truth for Consistency):**
  - [docs/design-references/unified-consistent-system.html](docs/design-references/unified-consistent-system.html)
- **Original RevisionDojo Reference Screenshots (19 PNGs):**
  - [docs/design-references/revision-dojo/](docs/design-references/revision-dojo/)
- **Stitch Canvas Project (`4332812100757253680`):**
  - URL: `https://stitch.google.com/projects/4332812100757253680`
  - **Initial Stitch Explorations** ([docs/design-references/stitch-previews/](docs/design-references/stitch-previews/)):
    - `01-homepage.png`, `02-biology-hub.png`, `03-essay-editor.png`, `04-question-runner.png`
    - *Note:* `03-essay-editor.png` and `04-question-runner.png` define the split-pane Essay Studio and Markscheme Runner layouts—remember to standardize their typography to `Plus Jakarta Sans` + `Inter` (matching `unified-consistent-system.html`) and fix the Essay Studio search-bar overlap.
  - **Screenshot-Referenced Stitch Subject Hubs & Homepage** ([docs/design-references/stitch-v2/](docs/design-references/stitch-v2/)):
    - `00-homepage-neutral.png` *(note: replace Card 5 "Theory of Knowledge" with **Math AA SL** amber-curve card and remove ninja headband on Sprout as implemented in `unified-consistent-system.html`)*
    - `01-biology-hl.png`
    - `02-chemistry-hl.png` *(note: correct level to **Chemistry SL**, and match the borderless white tool rows used in the other 5 subject hubs)*
    - `03-history-hl.png`
    - `04-english-lit-hl.png`
    - `05-french-b-sl.png`
    - `06-math-aa-sl.png`
