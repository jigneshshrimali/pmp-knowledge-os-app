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

**Clarification from Sprint KS-004:** `components/ui` is not limited to
single-element primitives. Composite components like `EmptyState`,
`ErrorState`, and `PageHeader` — each combining multiple elements and a
small amount of layout — still belong in `ui/`, because the qualifying
test is content-agnosticism (do they know what a "concept" or
"flashcard" is), not visual simplicity. `EmptyState` takes a
title/description/action and renders them; it has no idea what's empty.
That's what makes it a `ui` primitive rather than a page-specific or
`layout/` component, regardless of how many elements it renders.

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

## 7. High-Level Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                            BROWSER (SPA)                          │
│                                                                    │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │  App Shell                                                  │  │
│  │  ThemeProvider ─┬─ RouterProvider ─ routes.tsx              │  │
│  │                 │                                           │  │
│  │                 └─ AppLayout (Header / Footer / MobileNav)  │  │
│  │                        │                                    │  │
│  │                        └─ <Outlet/> → active Page            │ │
│  └───────────────────────────────────────────────────────────┘   │
│                             │                                     │
│                             ▼                                     │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │  Pages  (HomePage, ConceptsPage, FlashcardsPage, …)         │  │
│  │  — composes hooks + presentational components, no data       │ │
│  │    fetching logic of its own                                  │
│  └───────────────────────────────────────────────────────────┘   │
│                             │  calls                              │
│                             ▼                                     │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │  Hooks           (useContentCollection, useTheme)            │ │
│  │  — turns a service's async result into loading/error/data     │
│  └───────────────────────────────────────────────────────────┘   │
│                             │  calls                              │
│                             ▼                                     │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │  Services        (services/content/*)                       │  │
│  │  — the ONLY layer that knows how content is stored on disk    │
│  │  — discovers, parses, caches, maps raw files → typed content   │
│  └───────────────────────────────────────────────────────────┘   │
│                             │  reads (build-time, via Vite glob)  │
│                             ▼                                     │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │  Presentational Components  (components/ui, components/layout) │
│  │  — receive data as props, render only                          │
│  └───────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────────┐
        │  Repository-root content (outside src/)    │
        │  data/{concepts,flashcards,scenarios,exams}│
        │  assets/{cornell,memory-hooks}              │
        │  — owned by content authors, not engineers  │
        └──────────────────────────────────────────┘
```

**Major layers, top to bottom:**

- **App Shell** — composition root. Wires up the theme provider and the
  router. Exists as a single place where cross-cutting providers are
  nested, so adding a future `AuthProvider` is one line here, not a change
  scattered across pages.
- **Pages** — route targets. Their only job is orchestration: call the
  right hook(s), pass the result to presentational components. A page
  should be readable as "what does this route show," not "how is this
  data fetched."
- **Hooks** — the thin adapter between async service calls and React's
  render cycle (loading/error/data state). This layer exists so pages
  don't each reimplement `useEffect`/`useState` boilerplate for fetching,
  and so that boilerplate is unit-testable independent of any specific
  page.
- **Services** — the data-access boundary. This is the *only* layer aware
  of `import.meta.glob`, frontmatter parsing, or JSON shape. Everything
  above this line works only with typed domain objects from `types/`.
- **Presentational components** — the leaves of the tree. No data
  fetching, no business logic, just props in, markup out.
- **Repository-root content** — outside `src/` entirely, by design (see
  §1 of this document's Data Loading Strategy). The application is a
  *reader* of this content, never its owner.

Why draw it this way: the diagram is intentionally a strict top-to-bottom
dependency flow with no arrows pointing back up. That's the architecture's
central invariant — see §15 Dependency Rules below, which makes this
explicit and enforceable rather than just implied by the diagram.

## 8. Folder Responsibility Matrix

| Folder | Responsible for | Must NOT contain |
|---|---|---|
| `src/components` | Presentational UI, split by reusability scope (`ui/` = content-agnostic primitives, `layout/` = app-shell structural pieces, `providers/` = React Context). | Data fetching, content-service imports, business logic (e.g., "is this answer correct"). |
| `src/pages` | One file per route. Orchestrates hooks + components for that route. | Direct `import.meta.glob`/frontmatter parsing, or markup complex enough that it can't be scanned in one read — that complexity belongs in a component. |
| `src/layouts` | Route-level shell compositions that wrap multiple pages (currently `AppLayout`). | Page-specific content or logic — a layout should work identically no matter which page renders inside it. |
| `src/services` | All data access: discovering, parsing, caching, and typing content from `data/`/`assets/`, and (later) any network/API calls. The sole layer permitted to know *how* content is stored. | JSX, React hooks, or any rendering concern. A service returns plain data/promises, never UI. |
| `src/types` | Shared TypeScript contracts (`Concept`, `Flashcard`, `NavItem`, `Theme`, etc.) that both services and UI code agree on. | Implementation logic — types describe shape, not behavior. |
| `src/utils` | Small, pure, framework-independent helpers (`cn`, `frontmatter` parser, `idFromPath`) and the one shared data-fetching hook (`useContentCollection`). | Anything that depends on a specific page or component's context, or that reaches into `data/`/`assets/` directly (that's a service's job). |
| `src/styles` | Global CSS: the Tailwind entrypoint and theme CSS-variable definitions (`globals.css`). | Component-specific styling that could instead be a Tailwind utility class on the component itself. |
| `src/data` | Small, versioned **application** configuration — navigation items, site metadata (`siteConfig.ts`, `navigation.ts`). | Actual PMP study content. This is the folder most likely to be confused with root-level `data/`; the distinction is deliberate and documented precisely so that confusion gets caught here, in writing, rather than in a future content-vs-config mix-up. |

## 9. Design Philosophy

- **Component reusability.** A component earns a place in `components/ui`
  only by being genuinely usable across more than one feature without
  modification (CLAUDE.md §16 rule 4). Reusability is a property that's
  proven by actual reuse, not assumed in advance — a component built for
  one page stays co-located with that page until a second real use case
  justifies promoting it.
- **Separation of concerns.** The types → services → hooks → pages →
  components flow (§7 above) exists so that any single layer can change
  for its own reasons without forcing changes in the others. Content
  storage could move to a CMS tomorrow and, if the service layer's public
  functions kept the same signatures, not one page or component would
  need to change. That property — a storage change being invisible above
  the service layer — is the actual test of whether separation of
  concerns is being honored, not just declared.
- **Simplicity over premature complexity.** No global state library, no
  server layer, no auth, no test framework has been added — not because
  they're unimportant, but because none is justified by a problem that
  exists *today* (CLAUDE.md §4 Goal #5). Each is a deliberate deferral,
  not an oversight; §17–§18 below name exactly when each should be
  introduced.
- **Maintainability.** Every convention in this document (naming, folder
  responsibility, dependency direction) optimizes for the same thing: a
  new engineer, or an AI session with zero memory of previous sessions,
  should be able to predict where a piece of code lives and what it's
  allowed to do, without reading the implementation first. Maintainability
  here means *predictability*, not merely "clean code."

## 10. Routing Philosophy

**Why a central route table exists.** `routes.tsx` is the single file
listing every route in the application. This is deliberate: it means
"what pages does this app have" is answerable by reading one file, not by
searching for scattered route registrations across the codebase. It also
means route-level concerns that don't belong to any individual page —
guards, redirects, layout selection — have one obvious place to live.

**Future authentication approach.** When accounts are introduced
(CLAUDE.md §15), the expected shape is an `AuthProvider`
(`components/providers/AuthProvider.tsx`) supplying auth state app-wide,
consumed by `routes.tsx` to decide which routes require a session. The
central route table is what makes this a contained, single-file change
rather than a sweep through every page component to add guard logic
individually.

**Future protected routes.** The anticipated pattern is a wrapper element
(e.g., a `RequireAuth` component) composed around protected route
definitions in `routes.tsx` — mirroring how `AppLayout` already wraps all
routes today. A protected area with a different shell (e.g., a logged-in
dashboard layout) would be a second layout under `src/layouts/`, selected
per route-group in the same central table, not a fork of the routing
mechanism itself.

## 11. State Management Strategy

**Current state approach.** Local component state (`useState`) is the
default for anything scoped to one component or page. There is no global
application state today — content is fetched per-page via
`useContentCollection` and not cached in any app-wide store beyond each
service module's own in-memory cache (§3 above).

**When Context is used.** React Context is reserved for genuinely
cross-cutting concerns that many unrelated components need to read —
today, only theme (`ThemeProvider`). The test for "does this belong in
Context" is: would prop-drilling this through many unrelated component
trees be worse than the implicit coupling Context introduces? Theme
passes that test; most application data does not.

**When external state management may be introduced.** Not speculatively.
A dedicated state library (e.g., for complex cross-page state like an
in-progress mock exam session, or synced progress-tracking data) should
only be introduced once a concrete feature genuinely needs state shared
across many components in a way `useState` + a couple of Context providers
can't reasonably handle — and that evaluation should happen against the
specific feature's real requirements at the time (CLAUDE.md §8), not be
pre-installed now on the assumption it'll eventually be useful.

## 12. Naming Convention Standards

(Restated here for architectural completeness; the authoritative source
is CLAUDE.md §11 — if the two ever diverge, CLAUDE.md governs.)

| Category | Rule | Example |
|---|---|---|
| **Components** | `PascalCase` file and export name, one primary component per file | `Button.tsx` exports `Button` |
| **Pages** | `PascalCase` with a `Page` suffix — signals "route target" at a glance | `ConceptsPage.tsx` |
| **Services** | `camelCase`, named after the domain served, not the loading mechanism | `concepts.ts` exports `conceptsService` |
| **Hooks** | `camelCase`, `use`-prefixed — required by React's rules-of-hooks tooling, not just convention | `useContentCollection`, `useTheme` |
| **Types** | `PascalCase`, singular nouns; suffixes (`Props`, `Value`) reserved for their specific meaning | `Concept`, `ThemeContextValue` |
| **Utilities** | `camelCase`, named after what they compute, kept pure and framework-independent | `cn`, `parseFrontmatter`, `idFromPath` |

## 13. Data Flow Architecture

```
Content Files              data/*.md, data/*.json, assets/*
     ↓
Content Services           services/content/* — glob discovery,
                            parsing, caching (the only layer that
                            knows the on-disk shape)
     ↓
Type Mapping                raw frontmatter/JSON → Concept, Flashcard,
                             Scenario, ExamQuestion (types/content.ts)
     ↓
Hooks                        useContentCollection — async result →
                              { items, isLoading, error }
     ↓
Pages                          calls the hook, receives typed data
     ↓
UI Components                    receives data as props, renders only
```

This is the same flow as §7's diagram, restated at the data level rather
than the structural level. The reason it's documented twice, from two
angles, is that §7 answers "what are the layers" and this section answers
"what actually moves through them" — a new engineer tracing a bug (say, a
flashcard rendering with a missing answer) should be able to use this
list to know exactly which of five places to check, in order, rather than
searching the whole codebase.

## 14. Dependency Rules

The allowed dependency direction is strictly top-to-bottom, matching §7
and §13. Stated as explicit rules:

- **Components must not import services.** A `components/ui` or
  `components/layout` file importing anything from `services/` is a
  layering violation — components receive data as props, full stop.
- **Pages may import services (directly, or via a hook) and components.**
  Pages are the one layer explicitly allowed to bridge data and
  presentation — that's their defined job.
- **Services must not import components, pages, or anything from React.**
  A service that imports JSX or a hook has stopped being a pure data-access
  module. Services return plain data/promises; they don't know a UI exists.
- **Services must not import other services' internals** — only their
  public functions (e.g., `conceptsService.getAll()`), never reaching into
  another service's private glob patterns or caches. Cross-service
  composition happens at the page/hook level.
- **`utils/` must not import from `services/`, `pages/`, or
  `components/`.** Utilities sit below everything and must stay
  framework- and domain-independent so they remain trivially reusable and
  testable in isolation.
- **`types/` must not import from anywhere except other `types/` files.**
  Types are the shared vocabulary every other layer depends on; if types
  depended on implementation, that dependency would flow the wrong way.

**Why this is worth stating as rules, not just a diagram:** a diagram
describes the intended shape once; explicit rules are what a future
change can be checked against line by line (see CLAUDE.md §18 Definition
of Done — "respects the layering in Section 5" is exactly this list,
made concrete enough to review a PR against).

## 15. Testing Strategy

No automated tests exist yet (see this document's Technical Debt in the
KS-002 review). The following is the intended future approach, to be
introduced incrementally as the reasons for each layer become concrete
rather than installed speculatively (CLAUDE.md §4 Goal #5):

- **Unit testing** — reserved first for `services/` and `utils/`, since
  both are pure/isolated by design (§14) and cheapest to test reliably:
  frontmatter parsing, content mapping functions, and (later) any scoring
  or scheduling logic are the highest-value early targets, because a bug
  there silently produces wrong study content or wrong exam results.
- **Component testing** — reserved for `components/ui` primitives and any
  component with real interaction logic (e.g., a future flashcard flip or
  exam-answer selection), verifying behavior from a user's perspective
  rather than implementation detail.
- **End-to-end testing** — introduced once there are real user flows
  worth protecting against regression (e.g., "start a mock exam, answer
  all questions, see a score") — not before, since E2E tests are the most
  expensive to write and maintain, and are only worth that cost once a
  flow's correctness genuinely matters to the product.

The governing principle across all three: tests should be added when a
class of bug becomes possible and costly, not on a fixed schedule
disconnected from what the codebase actually does yet.

## 16. Deployment Architecture

**Current:**
```
GitHub  →  Vercel  →  Production
(source)   (build +     (static SPA,
            CDN hosting)  served globally)
```
Vercel builds the Vite app (`npm run build`) and serves the static output
from its CDN. There is no server runtime in production today — this
matches the SPA architecture described in §1: no API routes, no
server-side secrets, nothing that needs a persistent server process.

**Future, as accounts/progress/AI-tutor/billing are added:**
```
GitHub  →  Vercel  →  Production (static SPA + CDN)
                          │
                          ▼
                    Backend / API layer  (new — not yet designed)
                          │
                    ┌─────┴─────┐
                    ▼           ▼
                Database   Authentication provider
```
This introduces the project's first server-side component. It is
deliberately not designed yet, because doing so before a concrete feature
(accounts, or the AI tutor) requires it would mean guessing at
requirements (which database, which auth provider, self-hosted vs.
managed) that should instead be decided against that feature's real needs
— consistent with CLAUDE.md §4 Goal #5.

## 17. Performance Strategy

- **Lazy loading (content).** Content services load and parse files on
  first request, not upfront — see §3's table for the full rationale.
  This keeps startup time independent of content library size.
- **Code splitting.** Not yet introduced at the route level — the current
  page set is small enough that splitting would add complexity (Suspense
  boundaries, loading states) without a measurable benefit. This should be
  revisited once the page count or an individual page's bundle weight
  (e.g., a future rich exam-runner or AI tutor chat UI) grows enough to
  matter — measured via actual bundle analysis, not assumed in advance
  (CLAUDE.md §13 — "measure before optimizing").
- **Asset optimization.** All images route through the asset-loading
  strategy (§3 of this document; CLAUDE.md §9), which lets Vite apply
  hashing and standard build-time optimization. No manual image
  compression pipeline exists yet — if Cornell Notes/Memory Hooks assets
  grow large (they're described as print-ready, high-quality images in
  CLAUDE.md §24), a dedicated optimization step may become necessary and
  should be evaluated against real file sizes, not pre-built now.
- **Content loading strategy.** Covered fully in §3; repeated here only
  to note that content loading *is* the primary performance lever in this
  app today, since the app is otherwise a small, static SPA — most future
  performance work will concentrate on how content and (later) API
  responses are fetched and cached, not on framework-level optimization.

## 18. Security Considerations

None of the following exist yet — the current app has no user data, no
secrets, and no network calls, so there is nothing to secure today beyond
standard static-site hosting. Documented here so each is a deliberate
future design task, not a gap discovered under pressure:

- **Authentication.** Verifying who a user is. Will require a real
  provider decision (see §16) — not implemented until accounts (CLAUDE.md
  §15) are actually being built.
- **Authorization.** Verifying what an authenticated user is allowed to
  do (e.g., free vs. subscribed content access, once billing exists). This
  is a distinct concern from authentication and should be modeled
  separately — route-level and, where needed, content-level gating.
- **API key protection.** Once an AI tutor or any third-party API is
  integrated, its keys must live server-side (the future backend layer in
  §16), never in client-bundled code — a static SPA has no mechanism to
  keep a key secret from anyone who opens dev tools.
- **User data protection.** Once accounts/progress exist, personal study
  data (what a user got wrong, how they're progressing) is sensitive by
  the nature of being tied to an individual's exam performance and should
  be handled with the same care as any personal data — access controls,
  and a clear data-retention/deletion story, designed alongside whatever
  backend and database are chosen.

## 19. AI Integration Roadmap

Documented as future possibilities per CLAUDE.md §15's `services/ai.ts`
seam — none of the following are designed or scheduled, only named so
future architectural decisions have a place to be recorded against:

- **AI Tutor.** Conversational help answering PMP questions in context,
  most likely a chat-style UI backed by a new `services/ai.ts` and a
  `providers/` entry for session state (CLAUDE.md §15's table).
- **Smart Revision Assistant.** Likely builds on the future spaced-
  repetition/progress-tracking system (KS-005 in the sprint review),
  using AI to prioritize *what* to revise next rather than just *when*.
- **Exam Coach.** Feedback on mock-exam performance beyond a raw score —
  identifying weak domains, suggesting targeted scenarios/flashcards.
  Depends on the mock-exam runner (KS-004+ in the sprint roadmap) existing
  first, since there's no performance data to coach on otherwise.
- **Scenario Generator.** AI-assisted authoring of new scenario content —
  notably, this would be a *content-authoring* tool, not a runtime
  learner-facing feature, and should respect the content-first
  architecture (§5, CLAUDE.md §5): generated scenarios still land as data
  files in `data/scenarios/`, not as a new in-app content storage
  mechanism.
- **Voice Learning.** Audio-based interaction (e.g., listening to
  concepts, answering flashcards verbally) — the furthest-out item here,
  with the least-defined shape; would need real UX research before any
  architectural commitment.

None of these should be started without a corresponding ADR (§20) once
real design work begins — each represents a genuinely new architectural
capability (network AI calls, possibly audio APIs, new data shapes for
generated content), not an extension of an existing pattern.

## 20. Architecture Decision Record Index

This project uses lightweight ADRs to record *why* a major, hard-to-reverse
technical decision was made — separate from CLAUDE.md (product/engineering
philosophy) and the rest of this document (the architecture as it
currently stands). An ADR captures the decision, the alternatives
considered, and the reasoning at the time, so a future engineer doesn't
have to guess whether a constraint was deliberate or accidental.

| ADR | Title | Status |
|---|---|---|
| ADR-001 | React + Vite | Recorded — see §1 of this document |
| ADR-002 | Content-driven architecture | Recorded — see §3 and §13 of this document |
| ADR-003 | Local-first foundation | Recorded — see §6 and §16 (no server layer until a concrete feature needs one) |

These three are documented in full above rather than as separate files,
since the project is still small enough that this document *is* the
record. As the project grows, each future major decision — introducing a
backend, choosing an auth provider, adopting a state-management library,
committing to an AI provider — should get its own `ADR-NNN-title.md` under
a dedicated `docs/adr/` folder, following the same shape: context,
decision, alternatives considered, consequences. A decision is
"ADR-worthy" if reversing it later would be expensive — routine
implementation choices don't need one; the choices named throughout §§16–19
of this document do, once they're actually made rather than merely
anticipated.

---

*This document should be updated whenever an architectural decision
described here changes — see CLAUDE.md §16 rule 5 and §20 step 5.*
