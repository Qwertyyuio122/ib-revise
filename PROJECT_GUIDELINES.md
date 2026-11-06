# Project Guidelines: ib revise

These guidelines define the engineering discipline, coding standards, and operational protocol for building and maintaining **ib revise**.

---

## 1. Golden Rule: Phased Development Only

Do not write or modify code across multiple layers simultaneously. Follow the sequential order established in `IMPLEMENTATION_PLAN.md`:
1. **Phase 1**: Static Shell & Design Tokens
2. **Phase 2**: Supabase Auth & Session Management
3. **Phase 3**: Database Migrations & 30k Question Ingestion
4. **Phase 4**: Revision Mechanics (Flashcards & Question Bank)
5. **Phase 5**: Verification & Deployment

*Never begin coding a new phase until the user explicitly tests and greenlights the current phase.*

---

## 2. Code Quality & Conventions

* **Language**: TypeScript in strict mode (`"strict": true` in `tsconfig.json`). No `any` types permitted.
* **Component Paradigm**: Next.js App Router (React Server Components by default; add `'use client'` only where user interactivity or hooks are required).

---

## 3. Styling & Token Hygiene

* **Tailwind CSS Utility-First**: All styling must leverage the semantic tokens configured from `DESIGN.md`.
* **Zero Hardcoded Colors**: Use `bg-surface-canvas`, `bg-surface-card`, `text-text-primary`, `text-text-secondary`, and `text-accent-blush` rather than arbitrary hex values scattered across components.
