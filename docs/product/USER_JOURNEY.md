# USER_JOURNEY.md — PMP Knowledge OS User Journey

> Companion to `PRODUCT_EXPERIENCE.md` (the foundation this document
> walks through moment by moment) and `DESIGN_SYSTEM.md` (the visual
> language each moment should use). Where `PRODUCT_EXPERIENCE.md` §7
> distinguishes a content repository from a learning system in the
> abstract, this document makes that distinction concrete by describing
> what the learner actually experiences at each point — today, honestly,
> and the near-term target where different.
>
> Written primarily from a **Learning Experience Designer** perspective,
> with **UX Designer** and **Product Owner** checks throughout. No code
> changes result from this document.

---

## 1. User Onboarding

**Today:** there is no onboarding. There are no accounts
(`ARCHITECTURE.md` §18), so a visit to the app goes straight to `Home`,
which is a set of links to the four content sections. This is an honest,
correct state for a personal-tool-phase product with one known user
(`PRODUCT_EXPERIENCE.md` §2) — building onboarding for a user who doesn't
yet need to be identified would be premature infrastructure
(`CLAUDE.md` §4 Goal #5).

**Target, once the product has more than one real user:** onboarding
should answer exactly one question for a first-time visitor — *"where am
I in my PMP prep, so this app can meet me there?"* — and nothing more.
Concretely:

- A short, skippable orientation (not a signup wall) establishing rough
  starting point: brand new to PMP concepts, refreshing before the exam,
  or re-taking after a prior attempt. This maps directly to the future
  user types in `PRODUCT_EXPERIENCE.md` §2 (Focused Candidate vs.
  Re-taker vs. Recertifying PMP) and should change what the app
  recommends first, not gate access to anything.
- **No mandatory account creation before value is delivered.** The first
  thing a new visitor should be able to do is *use* the product (read a
  concept, try a flashcard) — asking for an account before that happens
  trades a first impression of "calm, considered tool" for "another
  signup form," directly contradicting `PRODUCT_EXPERIENCE.md` §1.
  Accounts, when they exist, should be introduced at the point value has
  already been demonstrated (e.g., "create an account to save your
  progress" after a first study session), not before.
- Onboarding should be skippable in one action for a returning-minded
  user who just wants to get to content — per `PRODUCT_EXPERIENCE.md` §5
  principle 2, even orientation shouldn't create decision fatigue.

## 2. First-Time Experience

**Today:** `HomePage` presents the product name, a one-line description,
and four cards (Concepts, Flashcards, Scenarios, Exams) with no
indication of order or recommendation. This is functionally a directory,
not a first-time guide.

**Target:** the first-time experience should do what `PRODUCT_EXPERIENCE.md`
§1 names as the first commitment — *have a point of view* — by making the
learning progression (Concepts → Flashcards → Scenarios → Exams,
`CLAUDE.md` §3) visible and suggested, not just four equally-weighted
options. Concretely:

- The four content sections should still all be directly reachable (per
  `PRODUCT_EXPERIENCE.md` §5 principle, direct access matters for future
  users like the Recertifying PMP), but the *first-time* framing should
  visually and textually suggest "start here" — most naturally, a
  highlighted entry point into Concepts, with the other three sections
  present but visually secondary on a first visit.
- The first-time experience should set expectations honestly about what
  exists today (e.g., if the exam runner isn't built yet, the Exams
  entry point should say "question bank" rather than implying a full
  timed-test experience that doesn't exist) — consistent with
  `PRODUCT_EXPERIENCE.md` §6's principle that product features should be
  named for what they actually do.
- This "first visit is different from every subsequent visit" framing is
  itself the seed of the future dashboard (`PRODUCT_EXPERIENCE.md` §6) —
  once return-visit detection exists, first-time framing recedes and the
  "where was I / what's next" dashboard framing takes over.

## 3. Daily Learning Flow

**Today:** a learner arrives at `Home`, picks a content section from the
nav, browses a flat list within it, and leaves. There is no session
structure — each visit is architecturally identical to every other visit.

**Target daily flow**, designed around the Focused Candidate's actual
constraints (`PRODUCT_EXPERIENCE.md` §2 — short, high-intent sessions,
decision fatigue is the enemy):

1. **Arrive** → land on a screen that immediately proposes one clear next
   action (today: the Home content-type grid; future: the dashboard's
   "what's next" recommendation, `PRODUCT_EXPERIENCE.md` §6).
2. **Engage** → move into a focused single-content-type session (e.g., a
   run of flashcards, a handful of scenarios) without needing to
   re-navigate between items — session continuity within a content type
   matters more day-to-day than cross-content-type navigation.
3. **Close the loop** → on finishing a session, get a lightweight
   acknowledgment (not a heavy summary screen — per `PRODUCT_EXPERIENCE.md`
   §5 principle 3, calm before comprehensive) and a next suggestion,
   rather than being dropped back to a generic list with no sense of
   completion.
4. **Leave without loss.** A short session should never feel wasted —
   even five flashcards reviewed should register as real progress once
   progress tracking exists, reinforcing daily return rather than
   requiring long sessions to feel worthwhile.

**Why this matters more than it might seem:** a study tool's value is
almost entirely a function of daily-return behavior, not any single
session's depth. A flow optimized for rare, long sessions would actually
work against the primary persona's real usage pattern.

## 4. Concept Learning Journey

Maps directly to the "Learn → Understand → Visualize" stages of
`CLAUDE.md` §22's cycle, and to `PRODUCT_EXPERIENCE.md` §6's stated
purpose for the Concepts feature.

**Today:** a list of concept cards (title, summary, tags) — no detail
view exists yet; the full concept body and any Cornell Notes / Memory
Hook assets aren't rendered in the UI (`ARCHITECTURE.md` Technical Debt,
KS-004 roadmap item).

**Target journey for a single concept:**

1. **Discover** — find the concept via the list (browsing) or, later, via
   a domain filter or a recommendation (`PRODUCT_EXPERIENCE.md` §4's
   two-axis information architecture).
2. **Learn** — read the core explanation: calm, reference-quality,
   scannable (`DESIGN_SYSTEM.md` §2, principle 3 — this screen's design
   should be legible as "this is where I understand").
3. **Visualize** — see the concept's Memory Hook asset alongside the
   explanation, reinforcing the mental model with a visual anchor
   (`CLAUDE.md` §22's "Visualize" stage) — not a separate destination to
   navigate to, but part of the same screen.
4. **Connect** — see related flashcards, scenarios, and other concepts
   for the same topic (`PRODUCT_EXPERIENCE.md` §8's content relationship
   model), turning "I read this" into "here's how to practice it" without
   forcing a return to a top-level list.
5. **Move forward** — a clear, low-friction path from "I understand this"
   into recall practice (§5 below) for the same topic — the single
   highest-leverage connection this document names, since it's what
   actually turns reading into retention.

## 5. Revision Journey

**Today:** does not exist as a distinct journey. Flashcards and Scenarios
are browsable lists; nothing tracks what's been seen, gotten right, or
gotten wrong, so there's no mechanism to prioritize *what* to revise.

**Target journey**, once progress tracking exists
(`ARCHITECTURE.md` §6, sprint KS-005):

1. **Prompted, not browsed.** Revision should primarily arrive as a
   suggestion ("these 8 flashcards are due for review," "you've missed
   two Risk Management scenarios recently") rather than requiring the
   learner to remember what needs revisiting — directly serving the
   Re-taker persona's core need (`PRODUCT_EXPERIENCE.md` §2) and the
   "Revise" stage `CLAUDE.md` §22 names as currently missing from the
   product entirely.
2. **Recall first, reveal second.** Every revision item — flashcard or
   scenario — must force the learner to commit to an answer before
   revealing it (`PRODUCT_EXPERIENCE.md` §4 — friction belongs in the
   learning, not in the product). A revision flow that shows answers
   alongside questions isn't revision, it's re-reading.
3. **Honest feedback, low drama.** Getting something wrong during
   revision should register clearly (so the system can act on it) without
   feeling punitive — consistent with `PRODUCT_EXPERIENCE.md` §6's
   dashboard tone guidance: progress signals should reduce anxiety, not
   add a second source of exam-day pressure.
4. **Visible improvement over time.** The point of a revision journey is
   for the learner to *feel* themselves getting stronger in a specific
   weak area — this is the most direct expression of "confidence is part
   of the outcome" (`PRODUCT_EXPERIENCE.md` §4).

## 6. Exam Preparation Journey

**Today:** the Exams page is a read-only list of the question bank — a
learner can see what questions exist, but cannot take a timed exam,
receive a score, or get feedback. This is a deliberate, named gap
(`ARCHITECTURE.md` §6), not an oversight.

**Target journey**, once a mock-exam runner exists (KS-004+):

1. **Set expectations before starting.** Time limit, number of questions,
   and scoring approach should be stated clearly up front — an exam
   simulation that surprises the learner mid-session undermines the
   entire point of practicing realistic conditions (`CLAUDE.md` §3 — Exams
   exist to simulate real test conditions, including the psychological
   experience of them).
2. **No safety net during the exam itself.** Consistent with "no
   do-overs" (`CLAUDE.md` §3) — no pausing indefinitely, no reviewing
   answers mid-exam in a way the real exam wouldn't allow. This is one of
   the few places in the product where friction should intentionally
   *not* be reduced, because the friction is the realism.
3. **Rich feedback after, not during.** Once submitted, a full breakdown
   — score, per-domain performance, which questions were missed — turns
   the exam from a pass/fail moment into a diagnostic one, directly
   feeding the Revision Journey (§5): a missed question should be able to
   route the learner back to its source concept and related scenarios
   (`PRODUCT_EXPERIENCE.md` §8's relationship model doing real work here).
4. **Accessible without compromise.** Per `DESIGN_SYSTEM.md` §7, a timed,
   scored experience carries a *higher* accessibility bar than passive
   content, not a lower one — an inaccessible exam runner would exclude a
   learner from the platform's core value proposition, not just degrade
   their experience of it.

## 7. Future AI-Assisted Learning Journey

Restated and made journey-concrete from `PRODUCT_EXPERIENCE.md` §11's
principles (none of this is built; `services/ai.ts` remains a named
future seam per `ARCHITECTURE.md` §19):

1. **Arrives in context, not as a destination.** An AI presence inside a
   scenario (as a hint when stuck) or attached to a missed flashcard (as
   a "why is this the answer" explainer) — not a separate "chat with AI"
   page the learner has to remember to visit.
2. **Socratic before declarative.** When a learner is working through a
   scenario, the AI's first response should prompt reasoning ("what PMI
   process group does this situation belong to?") rather than state the
   answer outright — protecting the "apply before assessment" progression
   (§4 above) from being short-circuited by a shortcut to the answer.
3. **Escalates to a direct answer only when genuinely stuck.** After a
   real attempt, or on explicit request, the AI should give a clear,
   direct explanation — the goal is unblocking a stalled learner, not
   withholding help as a matter of principle.
4. **Feeds the same relationship model everything else uses.** An AI
   explanation of a missed scenario should reference the same related
   concepts (`PRODUCT_EXPERIENCE.md` §8) a human-curated "related
   concepts" link would — the AI is a new *interface* into the existing
   content graph, not a parallel, disconnected knowledge source.
5. **Never the only path.** A learner who wants to study without any AI
   interaction at all should be able to do so end-to-end — every journey
   in §1–§6 above must remain fully functional with the AI surface
   entirely absent, both because not every learner wants it and because
   it keeps the AI feature additive rather than load-bearing
   (`ARCHITECTURE.md` §14's dependency-direction discipline applied at
   the product level: the core journeys shouldn't depend on the AI layer
   existing).

---

*This document should be updated whenever a journey described here
changes — alongside `PRODUCT_EXPERIENCE.md` and `DESIGN_SYSTEM.md`, and
with the same discipline `CLAUDE.md` §16 rule 5 establishes for keeping
documentation in sync with the real product.*
