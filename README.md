# PMP Knowledge OS

## Project Purpose

**PMP Knowledge OS** is a visual PMP mastery platform. It starts as a
personal learning system — a fast, content-driven way to move through
PMP concepts, flashcards, scenarios, and practice questions — and is
architected to grow into a public digital product (accounts, progress
tracking, spaced-repetition revision, mock exams, an AI tutor,
subscriptions) without a foundational rewrite.

This phase delivers the **application foundation only**: app shell,
routing, theming, a reusable component layer, and a content/asset
loading strategy. No accounts, payments, AI features, mock-exam engine,
or dashboards are implemented yet — by design.

## Technology Stack

| Layer | Choice |
|---|---|
| Framework | React 19 |
| Language | TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |

No state-management, data-fetching, or UI-kit libraries were added —
the foundation is intentionally minimal so future iterations can choose
those deliberately.

## Architecture at a Glance

### Content-first, zero duplication
Real PMP content stays exactly where it already lives — the
repository-level `data/` and `assets/` folders are **not** touched or
duplicated into `src/`. A `services/content` layer reads those folders
directly at build time using Vite's `import.meta.glob`, so adding or
editing a markdown/JSON file in `data/` requires no code changes.

### Separation of concerns
```
types/     → what content looks like once loaded (contracts)
services/  → how content is found, parsed, and cached (data access)
components/pages/layouts/ → how content is presented (UI only)
```
Pages never parse files or construct paths directly — they call a
service function and render what comes back.

### Data loading strategy
Two generic factories do all the heavy lifting:
- `createMarkdownCollection()` — for `.md` files with YAML frontmatter
  (used by `concepts` and `scenarios`).
- `createJsonCollection()` — for `.json` files (used by `flashcards`
  and `exams`).

Each real content type (`src/services/content/concepts.ts`,
`flashcards.ts`, `scenarios.ts`, `exams.ts`) is a ~20-line file that
points one of these factories at a glob pattern and maps raw
frontmatter/JSON onto a typed domain object (`src/types/content.ts`).
Loading is **lazy and cached** — a file is only read/parsed the first
time a page asks for it.

Frontmatter parsing uses a small, dependency-free parser
(`src/utils/frontmatter.ts`) rather than pulling in a YAML library —
it covers flat keys, strings, numbers, booleans, and inline arrays,
which is what simple content frontmatter needs. It can be swapped for
a full YAML library later without changing any service's public API.

### Asset loading strategy
`src/services/content/assets.ts` globs every image under
`assets/cornell/` and `assets/memory-hooks/` at build time and exposes
`filename → bundled URL` lookup maps (`getCornellNoteAsset()`,
`getMemoryHookAsset()`). Components reference images by filename only —
never by hand-built path — so Vite can bundle/hash/optimize them freely.

### App shell, routing, and theming
- `layouts/AppLayout.tsx` — header, footer, mobile nav, and a routed
  `<Outlet/>`; every page renders inside it.
- `src/routes.tsx` — a single, centralized route table.
- `components/providers/ThemeProvider.tsx` — light/dark theme via a
  `.dark` class + CSS variables (`src/styles/globals.css`), persisted to
  `localStorage`, defaulting to OS preference.

### Built for extension
The folder layout leaves obvious slots for what's explicitly deferred:
- `types/user.ts`, `services/auth.ts` → accounts
- `services/progress.ts` → progress tracking / revision system
- `pages/ExamRunnerPage.tsx` → real mock-exam experience (today's
  `ExamsPage` only lists the question bank)
- `services/ai.ts` → AI tutor
- `services/billing.ts` → subscriptions

None of these exist yet, intentionally.

## Repository Structure

```
.
├── src/
│   ├── components/
│   │   ├── ui/            # Button, Card, Badge — reusable primitives
│   │   ├── layout/         # Header, Footer, MobileNav
│   │   └── providers/        # ThemeProvider
│   ├── pages/                # HomePage, ConceptsPage, FlashcardsPage,
│   │                          # ScenariosPage, ExamsPage, NotFoundPage
│   ├── layouts/               # AppLayout (the app shell)
│   ├── services/
│   │   └── content/            # markdown/JSON collection loaders +
│   │                            # per-domain services + asset loader
│   ├── data/                    # app-level config (nav items, site config)
│   │                             # — NOT PMP content, see note below
│   ├── types/                    # content/navigation/theme contracts
│   ├── utils/                     # cn(), frontmatter parser, id helper,
│   │                                # useContentCollection hook
│   ├── styles/globals.css          # Tailwind entrypoint + theme variables
│   ├── routes.tsx                   # route table
│   ├── App.tsx                       # providers + router composition
│   └── main.tsx                       # Vite entry point
│
├── data/            # EXISTING — concepts, flashcards, scenarios, exams
├── assets/           # EXISTING — cornell/, memory-hooks/
├── docs/              # EXISTING
│
├── index.html
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
└── package.json
```

> **Note on `src/data/` vs. root `data/`:** these are deliberately
> different things. Root-level `data/` is your PMP content library.
> `src/data/` is small application configuration (navigation items,
> site metadata) that ships as part of the app bundle. Nothing in
> `src/data/` is PMP content.

## Development Commands

```bash
npm install       # install dependencies
npm run dev        # start the dev server (http://localhost:5173)
npm run build        # type-check and build for production
npm run preview        # preview the production build locally
npm run type-check       # run TypeScript without emitting output
```

## Project Status

- [x] Vite + React + TypeScript + Tailwind CSS foundation
- [x] App shell, centralized routing, light/dark theming
- [x] Reusable UI component layer (`Button`, `Card`, `Badge`)
- [x] Content loading strategy (markdown + JSON, lazy + cached)
- [x] Asset loading strategy (image glob → URL maps)
- [ ] User accounts, progress tracking, revision system (future)
- [ ] Mock exam runner (future — question bank listing only today)
- [ ] AI tutor (future)
- [ ] Subscriptions (future)
