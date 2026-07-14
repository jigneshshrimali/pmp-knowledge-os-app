# ARCHITECTURE.md — PMP Knowledge OS

> Companion to `CLAUDE.md`. `CLAUDE.md` is the product/engineering
> constitution (the *why*, the philosophy, the rules). This document is
> the technical architecture record (the *how it's actually built today*).
> If the two ever appear to disagree, `CLAUDE.md` governs intent and this
> document should be corrected to match it.

---

## 1. Why React + Vite

**React** was chosen because the product is fundamentally a client-rendered,
highly interactive study tool (flashcards, scenario interactions, future
timed exams) rather than a content-marketing site needing SSR/SEO. There's
no current requirement for server rendering, so the complexity of a
meta-framework (routing conventions, server/client component boundaries,
edge runtime considerations) buys nothing yet — see CLAUDE.md §4, Goal #5
("simplicity over premature completeness").

**Vite** was chosen over a bundler-heavier setup for three concrete reasons
that map directly to CLAUDE.md §4 Goal #2 (speed) and §13 (performance):

1. **Native ES modules in dev** mean the dev server starts and hot-reloads
   in milliseconds regardless of project size — important as the content
   library (and eventually feature set) grows.
2. **`import.meta.glob`** is the mechanism the entire content-loading
   strategy (CLAUDE.md §5) is built on. It lets the app discover markdown/
   JSON/image files under the repository-root `data/`/`assets/` folders at
   build time, with zero custom filesystem-crawling code. This is a
   Vite-specific primitive; choosing Vite was in large part choosing this
   capability.
3. **Minimal, transparent config.** One `vite.config.ts`, no hidden
   framework magic — easy for a new engineer (or AI session) to read
   top-to-bottom and understand the whole build, in keeping with CLAUDE.md's
   emphasis on a codebase that outlives its original author.

**Trade-off, stated explicitly:** this is a pure SPA. There is no
server-side rendering, no built-in API routes, and no file-system routing.
If a future requirement emerges for SEO-indexable public content pages
(e.g., marketing pages for the public-product phase) or server-side
secrets handling (billing, AI tutor API keys), that will need a deliberate
architectural decision — most likely a thin server layer or a migration
of specific routes to a meta-framework — not a default assumption that
Vite-SPA covers every future need. This is flagged now so it isn't
rediscovered painfully later.

## 2. Component Organization Principles

Three-way split inside `components/`, by **reusability scope**, not by
feature:

- **`components/ui/`** — content-agnostic primitives (`Button`, `Card`,
  `Badge`). Rule: a `ui` component must never import a content service or
  know what a "concept" or "flashcard" is. It receives props and renders.
  This is what lets every future feature (mock exams, AI tutor UI) reuse
  these without modification.
- **`components/layout/`** — structural pieces (`Header`, `Footer`,
  `MobileNav`) specific to the app shell. These *are* allowed to know
  about navigation/site config, but not about study content.
- **`components/providers/`** — React Context providers (`ThemeProvider`
  today; `AuthProvider`, `ProgressProvider` etc. will land here later).

`pages/` vs `layouts/` is a separate axis: a **page** is "what renders for
one route," a **layout** is "what wraps multiple routes." `AppLayout`
currently wraps every route via a single root layout in `routes.tsx`; if
a future area of the app needs a different shell (e.g., a distraction-free
exam-runner layout without the main nav), that becomes a second layout,
not a conditional inside `AppLayout`.

## 3. Data Loading Strategy

Two generic factory functions do all content parsing:

- `createMarkdownCollection()` — markdown + YAML frontmatter (used by
  `concepts`, `scenarios`)
- `createJsonCollection()` — JSON arrays/objects (used by `flashcards`,
  `exams`)

Each real content domain (`services/content/concepts.ts`, etc.) is a thin
instantiation: a glob pattern pointing at the repository-root `data/`
folder, plus a mapper function from raw file shape to the domain type in
`types/content.ts`.

**Key properties, and why each one exists:**

| Property | Why |
|---|---|
| **Lazy** (`import.meta.glob` without `eager: true` for content) | A file is only fetched/parsed the first time a page requests it — startup cost doesn't grow with content library size (CLAUDE.md §13). |
| **Cached in module-level memory** | Repeat visits to a page don't re-parse; cache invalidation is deliberately *not* implemented yet because content is build-time static, not runtime-mutable (CLAUDE.md §13 — "don't build invalidation logic before that's true"). |
| **Typed at the service boundary** | Raw/loose shapes (`RawFlashcard`, `RawExamQuestion`) are mapped into strict domain types before ever reaching a component, so `strict: true` TypeScript can guarantee correctness everywhere above the service layer. |
| **Dependency-free frontmatter parsing** (`utils/frontmatter.ts`) | A full YAML parser was judged unnecessary for the flat-key/inline-array frontmatter this content actually uses (CLAUDE.md §10 — no unnecessary dependencies). This is a deliberate, documented trade-off: it will need to be swapped for a real YAML library if content frontmatter ever needs nested structures. |

Assets (images) use a **separate, eager** glob (`services/content/assets.ts`)
because there are far fewer images than could-be markdown/JSON entries,
and components generally need to know "does this image exist" synchronously
when rendering a list — eager loading trades a small upfront cost for
simpler consuming code. This is a different trade-off than content loading
and is intentional, not an inconsistency.

## 4. Configuration Management

- **App-level config** (`src/data/navigation.ts`, `src/data/siteConfig.ts`)
  is TypeScript, not JSON/env — it's small, changes with code (adding a
  nav item is a code change, a new route), and benefits from type-checking
  against `types/navigation.ts`.
- **Build config** (`vite.config.ts`, `tsconfig*.json`) is kept minimal and
  centralized — one file per concern, no config split across multiple
  plugins unless a plugin requires it.
- **No environment variables exist yet.** The foundation has no secrets,
  no API keys, no per-environment behavior. When the AI tutor or billing
  services are added (CLAUDE.md §15), those will introduce the project's
  first `.env`-based configuration, and that's the point at which secret
  handling, `.env.example`, and environment-specific config need real
  design — not before.

## 5. Theme Approach

- CSS custom properties (`--color-background`, `--color-foreground`, etc.)
  defined once in `src/styles/globals.css` for `:root` (light) and `.dark`
  (dark), consumed via Tailwind v4's `@theme inline` bridge.
- A `.dark` class on `<html>`, toggled by `ThemeProvider`
  (`components/providers/ThemeProvider.tsx`), drives which variable set is
  active — not the OS-level `prefers-color-scheme` media query alone. This
  is what allows a user-controlled toggle (persisted to `localStorage`) to
  override system preference, per CLAUDE.md §12 ("dark mode is a first-class
  citizen").
- Components reference theme values via CSS variables
  (`bg-[var(--color-surface)]`), never hardcoded hex colors — this is what
  makes "every new component works in both themes" (CLAUDE.md §18 DoD
  item) mechanically enforceable rather than something to remember by hand.

## 6. Future Scalability Considerations

This section is the technical counterpart to CLAUDE.md §15's table.
Concretely, today's architecture makes the following assumptions that
future sprints should be aware of:

- **No authentication boundary exists yet.** Every route in `routes.tsx`
  is public. Adding accounts means introducing route-level guards, not
  retrofitting existing pages — the central route table (one file) is
  exactly what makes that a contained change.
- **No server/API layer exists yet.** All data access today is local
  filesystem content via Vite glob imports. An AI tutor or a real backend
  for progress-tracking will introduce the project's first genuine network
  service (`services/ai.ts`, `services/progress.ts` talking to a real
  API) — this is architecturally a new *kind* of service alongside the
  existing content services, not a replacement for them.
- **No persistence layer exists yet** beyond `localStorage` (used only for
  theme preference). Progress tracking and revision scheduling will need
  real persistence (likely a backend + database, or at minimum a synced
  local store) — this is a genuinely new architectural component, not an
  extension of existing patterns, and should be scoped as its own design
  decision when that sprint arrives.
- **The question bank (`ExamsPage`) is read-only today.** A real mock-exam
  runner needs its own state machine (question index, timer, answer
  tracking, scoring) — this is UI/state complexity layered on top of the
  existing `examsService`, not a change to how exam data is loaded.

---

*This document should be updated whenever an architectural decision
described here changes — see CLAUDE.md §16 rule 5 and §20 step 5.*
