# Design Specification: ib revise (Serene Revision)

A calm, distraction-free digital revision environment engineered specifically for International Baccalaureate (IB) Diploma candidates. The design replaces high-anxiety gamification, robotic terminal styling, and generic AI dashboard clutter with visual decompression, warm tactile minimalism, and gentle focus.

---

## 1. Visual Theme and Atmosphere

* **Atmosphere**: Warm Minimalist Calm with Tactile Soft Surfaces.
* **Emotional Intent**: Alleviate cognitive fatigue during intense exam preparation cycles. Every screen invites calm, prolonged focus.
* **Canvas Density**: Spacious, generous breathing room. Rejects dense box-in-box grids and right-angle clutter in favor of soft contours and continuous vertical rhythm.
* **Surface Temperature**: Warm deep charcoal (`#0e0e11`) paired with soft ambient rose luminosity, avoiding cold clinical blues and muddy dark slates.

---

## 2. Color Palette & Semantic Roles

| Token Name | Hex Code | Role & Usage |
| :--- | :--- | :--- |
| **`surface-canvas`** | `#0e0e11` | Root page background. Deep, warm charcoal base that eases eye strain. |
| **`surface-card`** | `#141419` | Primary component background (subject rows, modals, docked elements). |
| **`surface-raised`** | `#1b1b22` | Hover surfaces, elevated pills, and active list selections. |
| **`border-subtle`** | `#23232a` | Razor-quiet 1px architectural divider and container boundary stroke. |
| **`text-primary`** | `#f4f4f6` | Primary headers, subject titles, and high-emphasis labels. |
| **`text-secondary`** | `#9ca3af` | Syllabus subtopics, metadata, keyboard shortcuts, and descriptive notes. |
| **`accent-blush`** | `#f4a7b9` | **Single Vibrant Pop**. Reserved for active dots, pill badges, and mastery focus rings. |
| **`accent-blush-glow`**| `rgba(244, 167, 185, 0.12)` | Ambient focus ring / subtle halo on selected cards and active inputs. |
| **`accent-rose-hover`**| `#ffd2dc` | Soft hover glow on primary buttons and key interactions. |

---

## 3. Typography Rules

* **Primary Typeface**: **Plus Jakarta Sans** (Humanist Sans-Serif).
* **Guiding Principles**: Smooth curves, open counters, and human warmth. Monospaced and harsh robotic fonts are strictly prohibited from headers and primary navigation.

| Role | Font Family | Size | Weight | Line Height | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / Hero** | Plus Jakarta Sans | 44px / 2.75rem | 600 (SemiBold) | 52px | -0.025em |
| **Section Title** | Plus Jakarta Sans | 24px / 1.5rem | 600 (SemiBold) | 32px | -0.015em |
| **Card Header** | Plus Jakarta Sans | 18px / 1.125rem | 500 (Medium) | 26px | -0.01em |
| **Body (Default)** | Plus Jakarta Sans | 15px / 0.9375rem | 400 (Regular) | 24px | 0em |
| **Caption / Meta** | Plus Jakarta Sans | 13px / 0.8125rem | 400 (Regular) | 18px | +0.005em |
| **Pill / Button Label** | Plus Jakarta Sans | 13px / 0.8125rem | 500 (Medium) | 18px | +0.01em |

---

## 4. Component Stylings

### Buttons & Pills
* **Primary Action**: Pill-shaped (`rounded-full`), background `#f4a7b9`, text `#0e0e11`, font weight 500. On hover: shifts to `#ffd2dc` with a soft rose ambient bloom (`0 8px 24px -4px rgba(244, 167, 185, 0.25)`).
* **Secondary / Ghost Pill**: Pill-shaped (`rounded-full`), 1px solid border (`#23232a`), background `#141419`, text `#f4f4f6`. On hover: background `#1b1b22`, border soft blush tint (`rgba(244, 167, 185, 0.35)`).

### Subject Revision Cards (Main Dashboard)
* **Geometry**: `rounded-2xl` containers with 1px border `#23232a` and generous internal padding (`p-6`).
* **Layout**: Horizontal or 3x2 grid. Displays Subject Title (e.g. *Biology HL*), core syllabus topic (*Cell Biology & Genetics*), and two discrete pill actions:
  * `[ Question Bank ]`
  * `[ Flashcards ]`
* **Interaction**: Hover raises surface by 2px with smooth 250ms spring transition and gentle blush border softening.

### Left Sidebar Navigation
* **Width**: Fixed 260px on desktop; collapsible drawer on mobile.
* **Branding**: Lowercase quiet wordmark `ib revise` paired with a glowing `#f4a7b9` pulse dot.
* **Category 1 (SUBJECTS)**:
  1. Biology HL
  2. History HL
  3. English Literature HL
  4. Mathematics AA SL
  5. French B SL
  6. Chemistry SL
* **Category 2 (IB CORE)**:
  Separated by a hairline divider `#23232a`:
  1. Theory of Knowledge (TOK)
  2. Extended Essay (EE)
  3. Internal Assessment (IA Support)

### Prohibited "Vibe-Coding" & AI-Slop Anti-Patterns
To prevent the interface from looking like a generic, redundant AI-generated SaaS template ("AI design slop"), all AI agents and contributors MUST strictly avoid:
* **NO Top Bar Breadcrumb Bloat**: Never render `WORKSPACE / Overview / All Subjects` breadcrumbs or cluttered top utility bars.
* **NO Fake KPI Gauges & Vanity Stat Rows**: Never add 4-column stat callout boxes (`Total Cards`, `Streak`, `Accuracy %`, `45m / 90m completed`) or stock-market trend arrows (`↑ 12%`).
* **NO "Everything-is-a-Card" Nesting**: Never wrap individual paragraphs, metadata tags, or sub-items inside bordered mini-cards inside parent cards. Use spacing, typography, and subtle `1px` hairline dividers (`#23232a`) for hierarchy.
* **NO Purple/Indigo/Cyan "AI Slop" Gradients**: Never use `from-purple-600 to-blue-600`, neon cyan borders, muddy `slate-900` backgrounds, or floating ambient violet orbs. Stick strictly to warm charcoal (`#0e0e11`, `#141419`) and the single Blush Pink (`#f4a7b9`) accent.
* **NO Emoji or Sparkle Pill Badges**: Never place generic AI badges (`✨ AI-Powered`, `🚀 Fast`, `🔥 Streak`) above headings. Use quiet, purposeful status dots (`w-1.5 h-1.5 rounded-full bg-accent-blush`).
* **NO Generic 3-Column Icon-Box Grids**: When showcasing features on the landing page, embed interactive-looking miniature UI previews (e.g., an actual flashcard prompt preview, a real past-paper question snippet `M23-TZ2-HL-P1-Q6`, and an IB Core milestone list) rather than generic icon + lorem ipsum boxes.
* **NO Uncalibrated Hover Jitter**: Never use `hover:scale-105` on large cards or jarring layout shifts. Limit card hover states to a subtle `-2px` vertical lift and border tint shift (`rgba(244, 167, 185, 0.35)`).
* **NO Hard Right-Angle Blocks or Arbitrary Magic Values**: Containers must use `rounded-xl` or `rounded-2xl` geometry and standard spatial tokens rather than arbitrary Tailwind values (`w-[413px]`, `p-[13px]`).

---

## 5. Layout & Responsive Principles

* **Max Container Width**: 1280px centered content area.
* **Base Grid**: 8px spatial grid with relaxed padding increments (`12px`, `20px`, `32px`).
* **Breakpoints**:
  * Desktop (`≥ 1024px`): Fixed 260px left sidebar + fluid main workspace.
  * Tablet (`768px - 1023px`): Collapsed icon sidebar + 2-column card stream.
  * Mobile (`< 768px`): Full-width single column with bottom floating nav dock.
