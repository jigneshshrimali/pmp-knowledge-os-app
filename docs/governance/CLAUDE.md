# CLAUDE.md — PMP Knowledge OS Engineering Guide

> This document is the permanent source of truth for anyone — human or AI —
> working on this codebase. It exists because a project that starts as a
> personal study tool and is meant to become a public product will pass
> through many hands and many sessions. Code explains *what* the system
> does. This document explains *why* it's built the way it is, so that
> "why" survives even when the person (or model) who made the original
> decision isn't in the room anymore.
>
> If you are an AI engineer (or a human) about to make a change: read the
> relevant sections below *before* writing code, not after.

---

## 1. Product Vision

**PMP Knowledge OS is a visual PMP mastery platform** — a system that turns
a static library of PMP study material (concepts, flashcards, scenarios,
exam questions, Cornell Notes, memory hooks) into an interactive learning
experience.

It starts as a **personal learning system**: one person's tool for passing
the PMP exam, built to be fast, distraction-free, and genuinely useful for
daily study. It is architected, from day one, so that it can grow into a
**public digital product** — with accounts, progress tracking, spaced
repetition, mock exams, an AI tutor, and subscriptions — without a rewrite.

Why this matters: every architectural decision in this codebase is a bet
on "will this still make sense with 1 user, or with 10,000 users?" A
decision that only works for the personal-tool phase (e.g., content baked
into the bundle, no notion of a "user") is acceptable *only* if it doesn't
block the public-product phase later. Section 15 (Future Scalability
Principles) exists to keep that bet honest.

## 2. Mission Statement

**Turn PMP content into understanding, not just exposure.**

The mission is not "display the content." It's "help a specific person
retain and apply PMP knowledge well enough to pass the exam and do the
job." That distinction should shape every feature decision: a feature that
increases exposure to content (more pages, more views) is not automatically
a win. A feature that increases retention and correct application (spaced
repetition, active recall, scenario reasoning) is the actual goal.

When a proposed feature is ambiguous, prefer the version that makes the
learner *do* something (recall, decide, apply) over the version that makes
them *read* something.

## 3. Educational Philosophy

The content model — concepts, flashcards, scenarios, exams — is not
arbitrary. It mirrors a deliberate learning progression:

1. **Concepts** — build a correct mental model first. Nothing else works
   if the underlying model is wrong.
2. **Flashcards** — force active recall of that model. Recognition
   (re-reading) is not the same skill as recall, and the exam tests recall.
3. **Scenarios** — apply the model under realistic ambiguity. The PMP exam
   is situational, not definitional; scenarios are where "I understand the
   concept" turns into "I can use the concept."
4. **Exams** — simulate the real test conditions: time pressure, mixed
   topics, no do-overs.

Why this matters for engineering: these four content types are not
interchangeable "content blobs." Do not build one generic "content viewer"
that flattens concepts, flashcards, scenarios, and exam questions into the
same UI pattern. Each type exists because it trains a different cognitive
skill, and the UI/interaction design for each should reflect that
(recognition UI ≠ recall UI ≠ applied-reasoning UI ≠ timed-test UI).

## 4. Project Goals

Ordered by priority — when goals conflict, higher items win:

1. **Correctness of content delivery.** The right concept, flashcard,
   scenario, or question, rendered accurately. A beautiful UI showing the
   wrong content is worse than a plain UI showing the right content.
2. **Speed and low friction.** A study tool that's slow to load or
   clunky to navigate will simply not get used daily. Perceived speed is a
   feature, not a nice-to-have.
3. **Content/UI independence.** Content authors (including future
   non-engineers) should be able to add/edit study material without
   touching application code, and engineers should be able to reshape the
   UI without touching content. See Section 5.
4. **Incremental extensibility.** Every future feature in the vision
   (accounts, progress, revision, mock exams, AI tutor, subscriptions)
   should be addable as a new module, not a refactor of existing modules.
5. **Simplicity over premature completeness.** Don't build the
   infrastructure for a feature before the feature is being built. See
   Section 16.

## 5. Architecture Principles

### Content-first architecture
Real content lives in `data/` and `assets/` at the repository root —
markdown, JSON, images — completely independent of the application code
in `src/`. The app *reads* content; it does not *own* content.

**Why:** content is the actual asset of this product. Study material will
be added, corrected, and expanded far more often than the application's
core architecture changes. If content were embedded in components or
required code changes to update, every content edit would risk a code
change, a PR, a deploy. Keeping content as data files means content and
code can move at different speeds and be owned by different people
(engineer vs. subject-matter author) without stepping on each other.

### Separation of concerns (types → services → UI)
```
types/     defines what content looks like once loaded (contracts)
services/  defines how content is found, parsed, and cached (data access)
components/pages/layouts/  define how content is presented (UI only)
```
**Why:** this is the single most important rule in the codebase. A
component that imports `import.meta.glob` or parses frontmatter directly
has broken the layering — now the UI is coupled to *how content happens to
be stored on disk today*. If content storage ever changes (e.g., moves to
a CMS, a database, or a remote API), every component that bypassed the
services layer becomes a bug. Components should only ever know "call this
service function, get this typed object back."

### Lazy, cached data loading
Content is loaded on demand (per page/route) and cached after first load,
not all up front.

**Why:** the content library is expected to grow substantially (more
concepts, more flashcards, more exam questions over time). Eagerly loading
everything into the initial bundle would make load time proportional to
content volume — the opposite of Goal #2 (speed). Lazy loading keeps
startup fast regardless of how much content exists.

### Explicit content contracts (types)
Every content type (`Concept`, `Flashcard`, `Scenario`, `ExamQuestion`)
has an explicit TypeScript interface, independent of the raw file format.

**Why:** the UI should never need to know whether a piece of content came
from markdown frontmatter or a JSON file. The type is the contract; the
service is responsible for honoring it regardless of the underlying file
format. This is what lets `flashcards` and `exams` be JSON-backed while
`concepts` and `scenarios` are markdown-backed, with zero difference from
a component's point of view.

## 6. Folder Structure Guidelines

```
src/
├── components/
│   ├── ui/          reusable, content-agnostic primitives (Button, Card, Badge)
│   ├── layout/       structural pieces used by layouts (Header, Footer, Nav)
│   └── providers/      React context providers (ThemeProvider, and future
│                        providers — AuthProvider, ProgressProvider, etc.)
├── pages/              one file per route; composes components + services
├── layouts/             route-level shell compositions (AppLayout)
├── services/             data access; the only place that talks to
│                          data/ and assets/, or (later) an API/backend
├── data/                 app-level static config (nav items, site
│                          metadata) — NOT PMP content
├── types/                 shared TypeScript contracts
├── utils/                  small, pure, dependency-free helpers
└── styles/                  global CSS / theme tokens
```

**Why this shape specifically:**
- **`components/ui` vs `components/layout` vs `components/providers`** are
  split by *reusability scope*, not by feature. A `ui` component should be
  usable in any future feature (mock exams, AI tutor) without modification.
  A `layout` component is specific to the app shell. A `provider` supplies
  cross-cutting state. Mixing these makes it hard to know what's safe to
  reuse versus what's coupled to the current shell.
- **`pages` vs `layouts`** are split because a page is "what renders for
  this route" and a layout is "what wraps multiple routes." Conflating
  them makes it unclear where shared chrome (nav, footer) should live as
  more routes are added.
- **`services` is the only folder allowed to know about `data/`/`assets/`
  or, later, network requests.** This boundary is what makes Section 5's
  separation of concerns enforceable rather than aspirational.
- **`src/data` is deliberately named to be confusable with root `data/`**
  and that's worth flagging explicitly: `src/data` is small, versioned
  *application* configuration (nav items, site strings). It must never
  contain actual PMP study content — that always belongs in root `data/`.

New top-level folders under `src/` should be rare. Prefer adding a file to
an existing folder over inventing a new one; a growing number of
single-purpose top-level folders is a sign the structure needs
reconsidering, not extending.

## 7. Component Design Rules

- **`components/ui` primitives must be content-agnostic.** They accept
  props; they never import a content service or know about "concepts" or
  "flashcards." A `Card` component that hardcodes "concept card" behavior
  has smuggled a feature into a primitive, and every future feature that
  wants a card now has to work around that assumption.
- **Presentational components should not fetch data.** Data loading
  belongs in pages (via services/hooks), which pass data down as props.
  This keeps components testable in isolation and reusable across
  different data sources.
- **Prefer composition over configuration.** A component with ten boolean
  props trying to cover every use case is harder to reason about than two
  or three smaller components composed together. If a component needs a
  large prop surface to handle variants, that's a signal to split it.
- **No business logic in components.** "Is this answer correct," "has
  this card been mastered," "is this user's trial expired" are domain
  questions that belong in `services/` or (later) dedicated domain
  modules — not inlined into a component's render logic. Business logic
  in components can't be reused or unit-tested independently of React.

## 8. State Management Philosophy

- **Start with the least powerful tool that solves the problem.** Local
  component state (`useState`) first, lifted state second, React Context
  third. No global state library has been introduced, and none should be
  added speculatively.
- **Context is for cross-cutting concerns, not app-wide data.**
  `ThemeProvider` is a Context because theme genuinely needs to be
  readable from anywhere. A future `AuthProvider` fits the same
  justification. Content (concepts, flashcards, etc.) should *not* live
  in Context — it's fetched per-page via services, not held as global
  state, because most content doesn't need to be globally accessible and
  putting it in Context would cause needless re-renders app-wide.
- **Server/content state and UI state are different categories.**
  Loading/error/data for a content collection (`useContentCollection`) is
  conceptually different from UI state like "is this dropdown open."
  Don't reach for the same tool for both by default.
- **When a real state-management need arises** (e.g., progress tracking
  that many components need to read and update), evaluate the specific
  need before picking a library. A library adopted "because we'll need it
  eventually" is exactly the premature-completeness this project avoids
  (Section 4, Goal #5).

## 9. Asset Management Strategy

- Images live in `assets/cornell/` and `assets/memory-hooks/` at the
  repository root, alongside — not inside — the application source.
- The build tool discovers them at build time and produces a
  filename → resolved-URL lookup; components request an asset by
  filename and never construct a file path by hand.

**Why:** hardcoded paths (`"/assets/cornell/foo.png"`) break silently the
moment a file moves or the build output structure changes, and they
bypass whatever bundling/optimization the build tool would otherwise apply
(hashing for cache-busting, compression). A lookup-by-filename indirection
means the `assets/` folder's internal organization can change freely
without hunting down every hardcoded reference in the UI.

New asset categories (e.g., a future icon set, illustrations for an AI
tutor persona) should follow the same pattern: a folder under `assets/`,
a corresponding loader in `services/`, never a hand-typed path in a
component.

## 10. Coding Standards

- **TypeScript strict mode is non-negotiable.** `strict: true` plus
  `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch`
  are enabled project-wide. A study tool whose correctness matters (wrong
  answer marked "correct" is a real harm to a learner) should not tolerate
  the categories of bugs strict typing catches for free.
- **No `any`.** If a type is genuinely unknown (e.g., loosely-shaped raw
  JSON from a content file), model it as an explicit "raw" interface with
  optional fields and map it into a strict domain type at the service
  boundary (see how `flashcards.ts`/`exams.ts` define `RawFlashcard`/
  `RawExamQuestion`). This keeps looseness contained to the one place
  that legitimately has to deal with it.
- **Pure functions in `utils/`.** Utilities should not depend on React,
  browser globals (beyond documented exceptions), or module-level mutable
  state. This makes them trivially testable and safe to reuse in a future
  non-browser context (e.g., a build script, a server-side tutor engine).
- **No unnecessary dependencies.** Every dependency is a maintenance
  liability, a bundle-size cost, and a future breaking-change risk.
  Before adding a library, check whether the problem can be solved in a
  small, owned utility (see `utils/frontmatter.ts` and `utils/cn.ts` —
  both intentionally hand-rolled instead of pulling in a package). If a
  library is genuinely the right call (e.g., routing), add it deliberately
  and document why in the relevant README/CLAUDE section.
- **Barrel exports (`index.ts`) per folder** exist to give each module a
  clean public surface and to make refactors inside a folder invisible to
  its consumers. Only export what's meant to be used from outside the
  folder.

## 11. Naming Conventions

- **Components:** `PascalCase` file and export name, matching
  (`Button.tsx` exports `Button`). One primary component per file.
- **Pages:** `PascalCase` with a `Page` suffix (`ConceptsPage.tsx`) —
  distinguishes "this is a route target" from a generic component at a
  glance.
- **Services:** `camelCase`, named after the domain they serve
  (`concepts.ts` exports `conceptsService`), not after the mechanism
  (avoid names like `markdownLoader.ts` for a domain-specific service —
  that name belongs to the generic factory, not the instantiation).
- **Types/interfaces:** `PascalCase`, singular nouns (`Concept`, not
  `Concepts` or `ConceptType`). Suffixes like `Props`, `State`, `Value`
  are reserved for their specific meaning (`ThemeContextValue`), not
  used decoratively.
- **Hooks:** `camelCase` prefixed with `use` (`useContentCollection`,
  `useTheme`), per React convention — this isn't stylistic, React's rules
  of hooks tooling relies on the `use` prefix to identify hooks.
- **Booleans:** prefix with `is`/`has`/`should` (`isLoading`, `hasError`)
  so their type is legible from the name alone.

**Why naming gets its own section:** in a codebase meant to outlive its
original author, consistent naming is what lets a new engineer (or an AI
session with no memory of past sessions) predict where something lives
and what it's called, without searching. Inconsistent naming quietly taxes
every future session's context budget.

## 12. UI / UX Principles

- **Clarity over decoration.** This is a study tool used under time
  pressure (real exam prep). Visual noise that doesn't aid comprehension
  is a cost, not a feature.
- **Respect the content hierarchy from Section 3.** Concepts should read
  like reference material (calm, scannable). Flashcards should hide the
  answer until recalled — showing both at once defeats the purpose of a
  flashcard. Scenarios should present the situation before any answer
  options. Exams should visually signal "this is a test," not "this is a
  casual read."
- **Dark mode is a first-class citizen, not an afterthought.** Study
  sessions happen at all hours; the theme system (Section 8) exists so
  every new component should use theme CSS variables, not hardcoded
  colors, from the start.
- **Mobile is not an edge case.** A learner reviewing flashcards on a
  phone between meetings is a primary use case, not a stretch goal. Every
  new page/component should be checked at mobile width before being
  considered done (see Section 18).
- **Predictable navigation.** The nav (Section 6, `data/navigation.ts`)
  is the map of the product. New top-level content types should appear
  there; don't create orphaned routes reachable only by direct URL.

## 13. Performance Guidelines

- **Lazy-load content, not code speculatively.** Section 5 covers content
  loading; the same principle applies to code — don't route-split or
  lazy-import a page before it's actually large enough to matter. Premature
  optimization here adds complexity (loading states, suspense boundaries)
  without a measured benefit.
- **Cache content service results in memory** (already the pattern in
  every `services/content/*` module) so navigating back to an already
  visited page doesn't re-fetch/re-parse. Cache invalidation only needs to
  be considered once content becomes mutable at runtime (e.g., a future
  CMS integration) — don't build invalidation logic before that's true.
- **Keep the dependency graph small.** Bundle size is a direct,
  measurable tax on load time (Goal #2). Every new dependency should be
  justified against this cost, not just its convenience (see Section 10).
- **Images must go through the asset loading strategy** (Section 9), which
  allows the build tool to apply hashing/caching — never bypass it with a
  raw `<img src="/some/hardcoded/path">`.
- **Measure before optimizing.** If a performance concern is raised,
  the first step is profiling/measuring the actual behavior, not guessing.
  Optimizations without a measured baseline tend to add complexity while
  fixing the wrong problem.

## 14. Accessibility Guidelines

- **Semantic HTML first.** Use `<button>`, `<nav>`, `<main>`, heading
  levels in order, etc., before reaching for ARIA attributes. Semantic
  elements give correct behavior (keyboard focus, screen reader
  announcement) for free; ARIA should supplement, not replace, semantics.
- **Every interactive element must be keyboard-operable and have a
  visible focus state.** A study tool has to work for a learner who
  doesn't use a mouse — this is not optional polish.
- **Color is never the only signal.** Correct/incorrect answers, active
  nav state, etc. must be distinguishable without relying on color alone
  (icon, text, or pattern in addition to color), for colorblind users.
- **Interactive elements need accessible labels.** Icon-only buttons
  (e.g., the theme toggle) must have `aria-label`s — this is already the
  pattern in `Header.tsx` and should be followed for every future
  icon-only control.
- **Contrast must hold in both themes.** Because dark mode is first-class
  (Section 12), every new color addition should be checked for adequate
  contrast in both `:root` and `.dark`, not just the theme the author
  happened to be looking at.

**Why this is a dedicated section, not folded into UI/UX:** accessibility
requirements are easy to silently drop when they're treated as a subset of
general UX taste rather than a distinct, checkable requirement. Giving it
its own section makes it a first-class checklist item, not an afterthought
someone remembers "if there's time."

## 15. Future Scalability Principles

The Product Vision (Section 1) names six future capabilities. This
codebase is shaped so each one is *additive*:

| Future capability | Where it plugs in | Why the seam already exists |
|---|---|---|
| **User accounts** | new `types/user.ts`, `services/auth.ts`, `AuthProvider` alongside `ThemeProvider` | Provider pattern (Section 8) already supports adding cross-cutting context without touching existing providers |
| **Progress tracking** | new `services/progress.ts`, consumed by existing content pages | Content pages already receive typed content via a service call; adding "mark as reviewed" is a new service call, not a rewrite of how content flows in |
| **Revision system (spaced repetition)** | new scheduling logic in `services/`, likely reading flashcard/scenario data that already exists | Content is already typed and service-accessed, independent of the scheduling algorithm that will consume it |
| **Mock exams** | a new `pages/ExamRunnerPage.tsx` (today's `ExamsPage` is a read-only list, deliberately) reusing the existing `examsService` | The question bank is already loaded and typed; building a timed-runner experience is UI/state work on top of existing data access, not a new data layer |
| **AI tutor** | new `services/ai.ts`, likely a new `providers/` entry for tutor session state | Services are already the sanctioned place for anything that talks to an external system; adding an API-backed service doesn't disturb file-based content services |
| **Subscriptions** | new `services/billing.ts`, gating logic at the page/route level | Routing (Section 6) is centralized in one route table, making it a single place to add access-gating later |

**The governing rule:** if implementing something from this list would
require restructuring `types/`, `services/`, or the `components` split
described in Section 6, that's a signal the current change is being built
wrong — not that the plan above was wrong. Flag it and reconsider the
approach rather than forcing a fit.

## 16. Rules for Adding New Features

1. **Identify which layer the feature touches** (Section 5) before
   writing any code: does it need a new content type (service + type), a
   new page, a new reusable component, or new cross-cutting state? Most
   features touch more than one layer — enumerate them explicitly first.
2. **Do not build speculative infrastructure.** Build the feature that's
   being asked for, shaped so the *next* feature in Section 15's table
   isn't blocked — not the next feature itself. E.g., when building
   progress tracking, don't also scaffold billing "while we're in there."
3. **New content types get their own service, not a special case in an
   existing one.** Follow the pattern in `services/content/`: a factory
   (`createMarkdownCollection`/`createJsonCollection`) instantiated with a
   glob pattern and a mapper function.
4. **New UI primitives go in `components/ui` only if they're genuinely
   reusable** across more than one feature. A one-off piece of UI for a
   single page belongs in that page's file or a co-located component, not
   in the shared primitive layer — polluting `ui/` with single-use
   components makes the "reusable" signal meaningless.
5. **Update the relevant CLAUDE.md section in the same change** if the
   feature changes an architectural principle, folder convention, or
   pattern described here. A feature that contradicts this document
   without updating it creates exactly the drift this document exists to
   prevent.
6. **New routes must be added to the central route table
   (`routes.tsx`) and, if user-facing, to `data/navigation.ts`.** Don't
   create a page component that isn't reachable through normal navigation
   unless it's explicitly meant to be a hidden/internal route.

## 17. Rules for Modifying Existing Code

1. **Never modify `data/`, `assets/`, or `docs/` content as a side
   effect of an application-code change.** These are content-owner
   territory (Section 5). If a code change genuinely requires a content
   change (e.g., a new required frontmatter field), that must be called
   out explicitly and treated as a separate, visible decision — not
   silently bundled in.
2. **Don't widen a component's or service's responsibility to solve an
   unrelated problem.** If `ConceptsPage` needs a small tweak and you
   notice `FlashcardsPage` has a similar issue, fix them as two clear
   changes (even in the same commit) rather than merging their logic into
   a shared abstraction on the spot — premature abstraction driven by
   "I noticed a similarity" tends to produce the wrong abstraction. Extract
   a shared pattern only once it shows up a third time and the shape is
   clear.
3. **Preserve existing type contracts unless the change is explicitly
   about the contract.** Downstream consumers (pages, other services)
   trust the shape defined in `types/`. Changing a type is a
   cross-cutting change and should be treated with the weight of Section
   16's cross-layer analysis, not as a local edit.
4. **Don't introduce a new dependency to fix a small bug** that a few
   lines of owned code can fix (Section 10). Reach for a dependency only
   when the alternative is reimplementing something genuinely complex and
   security/correctness-sensitive (e.g., don't hand-roll JWT parsing when
   accounts are eventually added).
5. **Leave code better documented than you found it, not just better
   functioning.** If you had to read a comment or this document to
   understand why something was built a certain way, and the code itself
   didn't make that clear, add the missing context as a comment rather
   than relying on the next reader to also find this document.

## 18. Definition of Done

A change is not done until:

- [ ] It respects the layering in Section 5 (no service logic in
      components, no UI logic in services).
- [ ] `npm run type-check` passes with no errors and no new `any`.
- [ ] It works and looks correct in **both light and dark theme**
      (Section 12).
- [ ] It works and looks correct at **mobile width**, not just desktop
      (Section 12).
- [ ] New interactive elements are keyboard-accessible and labeled
      (Section 14).
- [ ] New routes are registered in `routes.tsx` and, if user-facing, in
      `data/navigation.ts` (Section 16).
- [ ] No content in `data/`, `assets/`, or `docs/` was modified as an
      unreviewed side effect (Section 17).
- [ ] Naming follows Section 11's conventions.
- [ ] If the change affects an architectural principle or convention in
      this document, **this document is updated in the same change**
      (Section 16, rule 5).

A feature that works but skips this list isn't "done, with follow-up
needed" — it's incomplete. Follow-up items that never get scheduled are
how technical debt accumulates silently.

## 19. Git Commit Guidelines

- **One logical change per commit.** A commit should be independently
  understandable and (ideally) revertable without unintentionally
  reverting an unrelated change bundled into it.
- **Commit messages should explain intent, not restate the diff.**
  `Fix flashcards page` says nothing a diff doesn't already show. `Fix
  flashcards not rendering when a content file has no tags array` explains
  the *why*, which is what's actually hard to recover later.
- **Reference the CLAUDE.md section a change relates to, when relevant**
  (e.g., `Add progress service (see CLAUDE.md #15 Future Scalability)`).
  This creates a durable trail connecting individual commits back to the
  architectural reasoning behind them, so a future engineer (or AI
  session) reading `git log` can reconstruct not just *what* changed but
  *why it was allowed to change that way*.
- **Never commit generated/build output** (`dist/`, `.tsbuildinfo`, etc.)
  — these are already excluded via `.gitignore` and should stay that way.
- **Content changes and code changes should generally be separate
  commits**, even if related, to keep the "who owns this change" signal
  clean (Section 5, Section 17).

## 20. Sprint Workflow

1. **Start of sprint: re-read this document's relevant sections** for
   whatever's being built, not just the feature request itself. A prompt
   like "add mock exams" should trigger a re-read of Sections 3, 15
   (the mock-exam row), and 16 before any code is written.
2. **Design in layers, not in files.** Before writing components, decide:
   what's the new type (if any)? What's the new service (if any)? What's
   the new page/route? What's genuinely reusable UI vs. page-specific UI?
   This mirrors Section 5 and prevents layering violations from being
   introduced under time pressure.
3. **Build the data/service layer before the UI**, and verify it with the
   simplest possible rendering (even a plain list) before investing in
   final UI polish. This catches content-shape mismatches early, when
   they're cheap to fix, rather than after a polished UI has been built on
   top of wrong assumptions.
4. **Self-check against the Definition of Done (Section 18)** before
   considering the sprint item finished.
5. **End of sprint: update this document** if anything built during the
   sprint changed an architectural principle, added a new convention, or
   revealed that a principle here was wrong or incomplete. This document
   is expected to evolve — the goal is that it never falls out of sync
   with the actual codebase, because a stale CLAUDE.md is worse than no
   CLAUDE.md (it actively misleads the next session).
   
## 21. Success Metrics

The application succeeds when it helps users:

- Learn concepts faster.
- Recall concepts longer.
- Revise efficiently.
- Practice regularly.
- Pass the PMP examination.

Every new feature should improve at least one of these outcomes.

## 22. Learning Journey

Every topic should eventually support the complete learning cycle.

Learn
↓

Understand
↓

Visualize

↓

Remember

↓

Practice

↓

Assess

↓

Revise

↓

Master


---

## Success Metrics

The application succeeds when it helps users:

- Learn concepts faster.
- Recall concepts longer.
- Revise efficiently.
- Practice regularly.
- Pass the PMP examination.

Every feature must improve at least one of these outcomes.

---

## Learning Journey

Every PMP topic should eventually support the complete learning cycle:

Learn
↓
Understand
↓
Visualize
↓
Remember
↓
Practice
↓
Assess
↓
Revise
↓
Master

The application should optimize for knowledge retention, not information storage.

---

## 23. PMP Content Standards

Every major PMP concept should eventually contain:

- Definition
- Key concepts
- Cornell Notes
- Memory Hook
- Scenario-based questions
- Flashcards
- Interview preparation notes
- Related concepts

Content should be structured, reusable, and machine-readable.

---


## 24. Visual Asset Standards

Visual learning assets are a core part of the product.

Cornell Notes:

- A4 Portrait format
- Print-ready
- Premium educational design
- Suitable for handbook creation

Memory Hooks:

- A4 Portrait format
- Visual memory techniques
- Simple and memorable
- One-page concept mastery

All visual assets should support recall and revision.

---


## 25. Sprint Workflow

Every development sprint follows:

Vision
↓
Planning
↓
Claude Implementation
↓
CTO Review
↓
Testing
↓
Merge
↓
Freeze
↓
Next Sprint

No major feature should skip review.

---


## 26. Backlog Philosophy

Ideas are unlimited.

Engineering complexity is not.

A feature should only be implemented when it supports:

- PMP learning effectiveness
- User experience
- Product scalability
- Future business value

Interesting but non-essential ideas belong in the backlog.

---

## 27. AI Collaboration Roles

ChatGPT:

- CTO
- Product Owner
- Solution Architect
- Learning Mentor

Claude:

- Senior Software Engineer
- Implementation Partner
- Code Generator

Jignesh:

- Founder
- Product Manager
- PMP Candidate
- Product Tester

All decisions should optimize for the long-term success of PMP Knowledge OS.


---

*While the application contains documentation, its primary purpose is to be a personal learning operating system that helps users master PMP concepts through structured learning, revision, and practice.*
