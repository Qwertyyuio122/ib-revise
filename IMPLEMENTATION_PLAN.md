# Implementation Plan: ib revise

A complete blueprint to build **ib revise**—a calm, distraction-free, multi-user web application equipped for 30,000+ IB exam questions, interactive flashcards, and IB Core management.

---

## 1. Technical Stack Architecture

* **Frontend**: Next.js 15 (App Router, React 19, TypeScript)
* **Styling**: Tailwind CSS configured with the **Serene Revision** token set defined in `DESIGN.md`
* **Animations**: Framer Motion (gentle micro-interactions, spring card flips, soft blush glows)
* **Backend & Auth**: Supabase (PostgreSQL with Row-Level Security, Supabase Auth for multi-user session management)
* **Search Engine**: PostgreSQL Full-Text Search (`tsvector` & GIN indexing) for sub-15ms queries across 30,000+ questions
* **Hosting**: Vercel

---

## 2. Phased Implementation Roadmap

### Phase 1: Static Editorial Shell & Design System (Completed)
* Initialize Next.js project with Tailwind and Framer Motion.
* Inject `DESIGN.md` tokens into `tailwind.config.ts`.
* Build the static **Landing Page** with calm typography, hero, and subject highlights.
* Build the **Dashboard Layout** with the 6 subjects, IB Core milestones, and interactive sample drawer.

### Phase 2: Supabase Authentication & Multi-User Isolation
* Configure Supabase project and client libraries (`@supabase/supabase-js`, `@supabase/ssr`).
* Build minimalist authentication pages (`/login`, `/signup`) matching the calm aesthetic.
* Implement Row-Level Security (RLS) on all user data tables to ensure 100% data privacy between students.
* Protect the `/dashboard` route with Next.js middleware.

### Phase 3: The 30,000 Question Ingestion Pipeline
* Run database migration with indexed tables and Full-Text Search.
* Build a Node.js batch ingestion script (`scripts/seed-questions.ts`) that reads structured question JSONs and seeds Supabase in batches of 1,000 rows.
* Implement cursor-based API route `/api/questions` supporting instant filters.

### Phase 4: Interactive Revision Engines
* **Flashcards Drill**: Full-screen distraction-free flashcard modal with FSRS spaced repetition.
* **Question Bank Interface**: Filter bar with pill toggles, mark scheme peek, and bookmarking.
* **IB Core Tracker**: Milestone cards for TOK Essay, EE word count progress, and IA deadlines.

### Phase 5: Verification, Polish & Deployment
* End-to-end verification and production deployment on Vercel.
