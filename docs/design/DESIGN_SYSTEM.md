# DESIGN_SYSTEM.md — PMP Knowledge OS Design System

> Companion to `PRODUCT_EXPERIENCE.md`. That document establishes *why*
> the product must feel calm, considered, and premium rather than busy
> (§1, §5). This document turns that intention into a concrete visual and
> component language — grounded in what's actually implemented today
> (`src/styles/globals.css`, `src/components/ui/*`), not an aspirational
> redesign. Where this document names something not yet built, it says so
> explicitly.
>
> Written primarily from a **UX Designer** perspective, with a **Learning
> Experience Designer** check on every decision: does this choice help
> someone study, or just look good? No code changes result from this
> document; no new dependencies are proposed.

---

## 1. Visual Identity

The product's visual identity should read as: **a calm, well-organized
study space — closer to a well-designed reference book or a considered
productivity tool than to a gamified quiz app.**

This is a deliberate choice, not a default. PMP exam candidates are
already managing real stress (a certification tied to career outcomes,
studying around a full-time job — `PRODUCT_EXPERIENCE.md` §2). A visual
identity that leans playful/gamified (badges, confetti, bright primary
colors everywhere) would work against the trust and seriousness the
content needs to convey, even though those patterns are common in
consumer learning apps. The identity intentionally borrows more from
"professional reference tool" than "language-learning app."

Concretely, this means:
- **Restraint over decoration.** Visual flourishes must justify
  themselves by aiding comprehension (`PRODUCT_EXPERIENCE.md` §4);
  decoration for its own sake is a cost, not a feature.
- **One accent color, used deliberately.** Today's `--color-primary`
  (indigo, `#4f46e5` light / `#818cf8` dark) is the *only* strong color in
  the system. It should stay reserved for primary actions and active
  state (already the pattern in `Header.tsx`'s active nav link and
  `Button`'s primary variant) — introducing a second competing accent
  color would dilute the one signal the system currently has for "this is
  the important thing."
- **Structure communicates through spacing and hierarchy, not through
  visual noise.** Borders, surface-color changes (`--color-surface` vs
  `--color-background`), and whitespace do the organizing work — not
  drop shadows, gradients, or decorative icons.

## 2. Design Principles

1. **Clarity over cleverness.** Every design decision should be checked
   against: does this make the content easier to find, read, and act on?
   A clever interaction that doesn't serve that goal doesn't belong.
2. **Consistency builds trust.** A learner who has to relearn how to read
   the interface each time they encounter a new content type is spending
   cognitive effort on the product instead of on studying. Shared visual
   language (see §4, §6) across Concepts/Flashcards/Scenarios/Exams
   should feel like one system, differentiated only where the *learning
   task itself* differs (`PRODUCT_EXPERIENCE.md` §5, principle 1).
3. **Every screen serves one moment in the learning journey.** Per
   `USER_JOURNEY.md`, a screen's design should be legible as "this is
   where I understand," "this is where I recall," "this is where I'm
   tested" — not a generic list-of-content layout reused regardless of
   purpose.
4. **Design for the tired learner, not the ideal one.** The realistic
   user is studying at the end of a long day. High contrast, generous
   touch targets, and unambiguous next actions matter more than visual
   sophistication that only reads well under ideal attention.
5. **Nothing ships in only one theme.** Every design decision is made
   against both light and dark simultaneously (see §8) — not designed
   once and adapted after, because study sessions happen at all hours
   (`CLAUDE.md` §12).

## 3. Color Philosophy

The current token set (`src/styles/globals.css`) is intentionally small:

| Token | Light | Dark | Role |
|---|---|---|---|
| `--color-background` | `#ffffff` | `#0b0f1a` | The page canvas — never used for content surfaces directly. |
| `--color-surface` | `#f8fafc` | `#111827` | Cards, panels — anything that needs to visually sit "above" the page. |
| `--color-border` | `#e2e8f0` | `#1f2937` | Structural separation — never used to convey meaning (see below). |
| `--color-foreground` | `#0f172a` | `#e2e8f0` | Primary text — high contrast against both `background` and `surface`. |
| `--color-primary` | `#4f46e5` (indigo) | `#818cf8` (lighter indigo) | The one accent — primary actions, active navigation state. |
| `--color-primary-foreground` | `#ffffff` | `#0b0f1a` | Text/icon color placed on top of `--color-primary`. |

**Why so few tokens, and why not more semantic colors (success green,
error red, warning amber) yet:** per `CLAUDE.md` §10 ("no unnecessary
dependencies/complexity") and `PRODUCT_EXPERIENCE.md` §5 principle 3
("calm before comprehensive"), semantic colors should be introduced when
a real feature needs them (e.g., correct/incorrect feedback in a flashcard
or scenario reveal, or a mock-exam score) — not spec'd speculatively
now. When they are introduced, the same discipline applies: one
deliberate color per meaning (success, error, warning), each with a
light/dark pair, added to this token table at that time.

**Color must never be the only signal.** Per `CLAUDE.md` §14, correct vs.
incorrect, active vs. inactive, must be distinguishable without color
alone (icon, weight, text, or position in addition to color) — this
matters even more once semantic colors exist, since colorblind users are
otherwise locked out of exactly the feedback moments (right/wrong
answers) that matter most in a study tool.

## 4. Typography Hierarchy

No custom font has been introduced — the system currently relies on the
browser/OS default stack, which is the correct choice at this stage
(`CLAUDE.md` §10 — no unnecessary dependencies; a web-font adds a
network request and a loading-flash concern that isn't justified yet).
The hierarchy that matters is **scale and weight, not typeface choice**:

| Level | Example use | Why this level exists |
|---|---|---|
| **Page title** (`text-2xl`–`text-3xl`, bold) | `HomePage` headline, page `<h1>`s | Answers "what page am I on" at a glance — the first thing a scanning, time-pressured learner needs (`PRODUCT_EXPERIENCE.md` §2). |
| **Section / card title** (`text-base`–`text-lg`, semibold) | `CardTitle`, concept/flashcard titles | The actual content being scanned — must be distinguishable from body text without relying on color. |
| **Body / description** (`text-sm`, regular, muted via opacity) | `CardDescription`, page subtext | Supporting detail — intentionally lower visual weight so it doesn't compete with titles when scanning a list. |
| **Label / meta** (`text-xs`, medium) | `Badge` tags, mobile nav labels | The smallest, least urgent tier — present for precision (e.g., a topic tag) without demanding attention. |

**Why hierarchy is treated as a design-system concern, not a per-page
choice:** a learner scanning a list of ten concepts under time pressure
relies on consistent visual weight to separate "title" from "detail"
without reading every word. If every page invented its own hierarchy,
that scanning shortcut would break each time the learner moved between
Concepts, Flashcards, and Scenarios.

## 5. Layout Principles

- **Content is centered and width-constrained** (`max-w-6xl` in
  `AppLayout`), not full-bleed. A study reference reads better with a
  bounded line length than a browser-width-spanning layout — this is a
  readability decision, not an arbitrary one.
- **Grid over improvisation.** List views use a responsive grid
  (`grid-cols-1 sm:grid-cols-2`, extending to more columns only where
  content density genuinely benefits) rather than ad hoc flex
  arrangements per page — consistent gutters and card sizing are part of
  the "one coherent system" goal from §2, principle 2.
- **Mobile-first, not mobile-adapted.** Layouts are designed starting
  from a single column at mobile width, then expanded at the `sm:`
  breakpoint and beyond — not designed for desktop and adapted down.
  Every layout decision must be checked at mobile width before being
  considered complete (`CLAUDE.md` §18 Definition of Done); this is the
  starting constraint, not a responsive adjustment applied afterward.
- **Vertical rhythm over dense packing.** Generous spacing between
  sections (the existing `gap-8` pattern on `HomePage`) is a deliberate
  choice consistent with "calm over busy" (§1) — a study tool that packs
  content edge-to-edge reads as urgent/cluttered, working against the
  calm, confidence-building tone `PRODUCT_EXPERIENCE.md` §1 and §6 call
  for.
- **The app shell is stable; content changes underneath it.** Header,
  footer, and (on mobile) the bottom nav stay visually constant across
  every route, so the learner's spatial mental model of "where things
  are" doesn't reset when navigating — an underrated contributor to the
  "one coherent system, not four separate tools" feeling
  (`PRODUCT_EXPERIENCE.md` §7).

## 6. Component Philosophy

Restated from `ARCHITECTURE.md` §9 with the design rationale made
explicit:

- **Primitives (`Button`, `Card`, `Badge`) are the alphabet, not the
  sentences.** They stay strictly content-agnostic — a `Card` doesn't
  know if it's showing a concept or a flashcard. This is what lets every
  future feature reuse them without a redesign.
- **Content-type-specific interaction components sit one layer above
  primitives**, composed from them. A future `FlashcardView` (flip/reveal)
  or `ScenarioView` (situation → decision → reveal) should visually
  *feel* like part of the same system (same border radius, same surface
  color, same typography scale from §4) while *behaving* differently,
  because the interaction is what teaches (`PRODUCT_EXPERIENCE.md` §6 —
  Flashcards/Scenarios are still list-only today; this is their design
  target, not their current state).
- **One card shape, several card behaviors.** The visual container
  (rounded corners, border, surface background, padding — see the
  existing `Card` component) should stay consistent across content types
  so the system reads as coherent; what changes per content type is what
  happens when the learner interacts with it, not how it's framed.
- **Variants over new components.** `Button`'s `primary`/`secondary`/
  `ghost` variant pattern is the model to follow — extend an existing
  primitive with a new variant before creating a near-duplicate
  component, consistent with `CLAUDE.md` §16 rule 4 (new UI primitives
  only when genuinely, provably reusable).

## 7. Accessibility Principles

Restated from `CLAUDE.md` §14 and `PRODUCT_EXPERIENCE.md` §5 principle 5,
with the design-system-specific implications:

- **Every color pairing in §3 must meet contrast requirements in both
  themes**, checked at the point a token is added — not assumed correct
  because it "looks fine." `--color-foreground` on `--color-background`
  and on `--color-surface` are the two pairings that matter most, since
  they carry all body and title text.
- **Focus states are a design element, not a browser default to
  override away.** Every interactive component (`Button`, future
  `NavLink`-based components) must have a visible, on-brand focus ring —
  currently `focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]`
  on `Button` is the pattern to extend to every new interactive
  component, not reinvent per component.
- **Icon-only controls need accessible labels as a design requirement,
  not an implementation afterthought.** The theme toggle
  (`Header.tsx`) already sets this pattern (`aria-label="Toggle color
  theme"`) — every future icon-only affordance (e.g., a future flashcard
  flip button) must be designed with its label decided at design time,
  not patched in during implementation.
- **Touch targets sized for real use, not minimum compliance.** Given
  the mobile-first, tired-learner context (§2 principle 4), interactive
  elements should default to comfortably large hit areas, especially on
  the mobile bottom nav and any future flashcard/scenario interaction
  controls.

## 8. Dark Mode Principles

- **Dark mode is not an inverted palette — it's a separately considered
  theme.** As the token table in §3 shows, dark-mode values aren't
  computed by inverting light-mode values; each was chosen for its own
  contrast and readability in a dark context (e.g., the primary accent
  shifts to a lighter indigo in dark mode specifically because the
  darker light-mode indigo would lose contrast against a dark
  background).
- **Toggled explicitly, not only inferred.** The `.dark` class on
  `<html>`, controlled by `ThemeProvider` and persisted to
  `localStorage`, means a learner's explicit choice overrides OS
  preference — appropriate for a study tool used in varied lighting
  (bright office, dark bedroom) that may not match the device's system
  setting (`ARCHITECTURE.md` §5).
- **No component-level color overrides.** Every component consumes
  theme via CSS variables (`bg-[var(--color-surface)]`, etc.), never a
  hardcoded hex value — this is what makes "works in both themes"
  mechanically guaranteed rather than something to remember to check per
  component (`CLAUDE.md` §18 Definition of Done).
- **New tokens are added in pairs.** Any future addition to the token
  table in §3 (e.g., semantic success/error colors) must define both a
  light and a dark value at the same time, before the token is used
  anywhere — a token introduced with only a light-mode value is an
  immediate, guaranteed dark-mode regression.

---

*This document should be updated whenever a visual or component design
decision changes — alongside `PRODUCT_EXPERIENCE.md` and `CLAUDE.md` §16
rule 5's discipline for keeping documentation in sync with reality.*
