# PRODUCT_EXPERIENCE.md — PMP Knowledge OS Product Experience Foundation

> Three documents, three clear jobs — do not duplicate across them:
> - **`CLAUDE.md`** — product & engineering *principles* (why the project
>   exists, how engineering decisions get made, the rules everyone works
>   under).
> - **`ARCHITECTURE.md`** — technical *implementation* decisions (how the
>   system is actually built: layers, data flow, dependency rules).
> - **`PRODUCT_EXPERIENCE.md` (this document)** — learner/product
>   *experience* decisions: what problem this solves, for whom, and what
>   it must feel like to use. `DESIGN_SYSTEM.md` (visual language) and
>   `USER_JOURNEY.md` (moment-by-moment flows) extend this document; this
>   is the foundation both build on.
>
> Written from three perspectives, not separated into three sections: a
> **Product Owner** view (what outcome, for whom), a **UX Designer** view
> (how it should feel), and a **Learning Experience Designer** view (does
> it actually help someone learn). Each section names which perspective
> is doing the most work — that's usually also the answer to "why."
>
> No code changes result from this document. No decision in
> `ARCHITECTURE.md` is altered.

---

## 1. Product Vision

**PMP Knowledge OS is not a content viewer. It is a mastery platform.**

A content viewer's job is done the moment the right text is on screen. A
mastery platform's job is done when the learner is measurably closer to
passing the exam and doing the job well — a different bar, even though
the underlying data (concepts, flashcards, scenarios, exams) is the same
either way.

That vision means three commitments, in priority order:

1. **It has a point of view.** It doesn't present four content types side
   by side and leave the learner to sequence them — it actively
   recommends, because it *knows* concepts build the model, flashcards
   force recall, scenarios apply it, exams test it under pressure
   (`CLAUDE.md` §3). A viewer is agnostic about order; a mastery platform
   isn't.
2. **It remembers the learner.** Accounts and progress tracking don't
   exist yet, but every decision from here forward assumes a returning
   learner's history will eventually matter, so today's experience
   doesn't need rebuilding when it does.
3. **It feels calm and considered, not busy.** "Premium" does not mean
   visually maximal — it means every screen is deliberately designed for
   a specific moment in the learning journey (`USER_JOURNEY.md`), not a
   generic content-list layout reused four times.

*(Product Owner lens: this section exists so "mastery platform" isn't a
marketing phrase — every section below is a consequence of one of these
three commitments.)*

## 2. Target Users

The product serves one real person today; it's designed for the
population that person represents, since the product is meant to grow
from personal tool to public product without a rewrite.

**Primary user (today): The Focused Candidate.** A working professional
studying around a full-time job, in short high-intent sessions (commute,
lunch break, evening) rather than long uninterrupted blocks. Already has
real project-management experience, so needs less "what is a project" and
more "how does PMI want me to *think* about this scenario." Primary fear:
running out of time, or studying the wrong things. Primary need:
confident direction on what to do next — decision fatigue is the enemy,
not lack of content.

**Future users (public-product phase — not built for yet, but kept in
view so today's decisions don't foreclose them):**

- **The Team Lead / L&D Buyer** — evaluates the platform for a team,
  cares about progress visibility across people, not personal recall
  mechanics. Implies a future need for aggregate views.
- **The Re-taker** — has failed once, arrives with partial knowledge and
  often anxiety about specific domains. Needs to find *gaps* quickly, not
  restart from zero — the strongest argument for progress tracking and
  domain-level analytics.
- **The Recertifying PMP** — already certified, returning periodically
  for refreshers. Needs fast, targeted access, not a guided first-time
  journey — implies navigation must support both guided and direct-access
  modes, not guided-only (see §6).

*(UX Designer lens: named users exist so every experience decision in
this document and `USER_JOURNEY.md` can be checked against a real person,
not an implicit "the user" that quietly defaults to whoever was imagined
last.)*

## 3. Problems Solved

Stated as problems, not features, because a feature list doesn't explain
why the product needs to exist:

| Problem | Why existing alternatives fail |
|---|---|
| **PMP content is scattered and inconsistent in quality.** | No single source connects definition → recall practice → applied practice → assessment for the same topic — a learner has to assemble their own study system across tools. |
| **Passive reading feels like progress but isn't.** | Most PMP prep material is read-only. The exam tests situational judgment, not recognition — re-reading a concept doesn't train the skill the exam actually measures. |
| **Study time is scarce and easily misallocated.** | Without a system that knows what's been learned vs. practiced vs. mastered, a time-constrained learner has no reliable way to know what to study *next* — they default to what's comfortable (re-reading) over what's needed (recall, applied scenarios). |
| **Generic flashcard/quiz apps don't understand PMP's structure.** | The exam is domain-organized and situational in style. A generic spaced-repetition app treats every fact identically; it can't distinguish "recall a definition" from "apply judgment to an ambiguous scenario" — different skills that need different UI (`CLAUDE.md` §3). |

The product solves these by being **one connected system** across content
types, not a better version of any single existing tool. The connection
between content types — not any one type alone — is the value being
built. *(This table is what a proposed feature should be checked
against: which of these four problems does it solve? Answering none is
scope creep, however interesting.)*

## 4. Learning Experience Philosophy

Product-level philosophy beyond what `CLAUDE.md` §2–§3 already establish
about the content model itself:

- **Retention over exposure.** A feature that increases how much content
  a learner sees is not automatically a win. A feature that increases
  correct recall and application is the actual goal. When a feature is
  ambiguous, favor the version that makes the learner *do* something
  over the version that makes them *read* something.
- **Friction belongs in the learning, not in the product.** Recalling a
  flashcard answer should require real effort (hidden until the learner
  commits to a guess). Finding that flashcard should require none.
  Confusing these two kinds of friction — making the *product* hard to
  use rather than the *recall* effortful — is the most common way a study
  tool undermines itself.
- **Confidence is part of the outcome, not a side effect.** The Focused
  Candidate's core fear is uncertainty about readiness (§2). A product
  that delivers excellent content but never signals "you're getting
  stronger here, weaker there" leaves that fear unaddressed.

## 5. Information Architecture & Content Relationships

Two orthogonal structures should organize content, and the product
should expose both rather than force a choice:

**By content type** (how the app is structured today) —
`Concepts → Flashcards → Scenarios → Exams` — the *pedagogical* axis,
answering "what kind of thinking am I doing right now." This should
remain the navigational backbone: it's what a first-time learner
(Focused Candidate) actually needs, and reworking it later is expensive
once habits form.

**By PMP domain** (People / Process / Business Environment, or the finer
ECO task structure — to be confirmed against real content) — the
*subject-matter* axis, answering "what topic am I working on." Not
surfaced in the UI today, but already present as an optional field on
every content type, so a future domain-filtered view is a UI feature, not
a data-model change. This axis matters most for the Re-taker and
Recertifying-PMP personas (§2), who think in domain terms ("show me
everything about Risk Management"), not content-type order.

**Content relationships** are what turn these two axes into
recommendations rather than static lists. A concept should be able to
surface its related flashcards, scenarios, and exam questions — and other
related concepts — so a learner moving from "I read this" to "let me
practice it" doesn't have to renavigate from scratch. The simplest
mechanism consistent with the existing content model is shared
tags/domain values acting as the relationship, rather than requiring
content authors to hand-maintain a link graph (content authoring should
stay simple). This is named here as a **product decision**, not yet an
implementation task — the exact mechanism should be settled against real
content shapes, but the *reason it must exist* is strategic: every
"premium," system-like behavior this document promises (smart
recommendations, a coherent revision queue, a dashboard that means
something) is downstream of content knowing how it relates to other
content. Without it, the product stays a set of independently browsable
lists no matter how good each list looks.

*(Product Owner lens: this is the single biggest structural gap between
"content viewer" and "mastery platform" today — see §7.)*

## 6. Product Principles

1. **Content-type integrity.** Never flatten concepts, flashcards,
   scenarios, and exam questions into one generic content-card pattern —
   each trains a different skill (`CLAUDE.md` §3, §12).
2. **Recommend, don't just present.** Wherever feasible, suggest a next
   action rather than requiring the learner to decide unaided — directly
   addressing decision fatigue (§2), not just content need.
3. **Calm before comprehensive.** One clear next step beats every
   possible metric or option on screen at once. Expanding a minimal first
   version is always easier than walking back an overwhelming one — this
   is the standard a future dashboard must be held to (§8).
4. **Design for the returning learner, even before accounts exist.**
   Every new page should be built as if progress will eventually attach
   to it — not by building progress tracking now, but by not designing an
   interaction that would need reworking once it exists.
5. **Accessibility is part of premium, not opposed to it.** Removing
   friction is the actual definition of "premium" used throughout this
   document — a platform that's hard to use with a screen reader, or
   illegible during an exhausted study session, has failed regardless of
   visual polish (see `DESIGN_SYSTEM.md` §7 for the concrete
   consequences).
6. **No feature without a stated learning purpose.** Every feature should
   trace back to §3's problem table or §4's philosophy — a feature that
   doesn't is scope creep, however easy it would be to build.

## 7. Core Features Purpose

Every current and near-term feature, stated as *purpose*, so engineering
work can be checked against intent rather than inferred from whatever
currently renders:

| Feature | Purpose | Status |
|---|---|---|
| **Concepts** | Build a correct mental model, one topic at a time. | Live — list view; detail rendering pending |
| **Flashcards** | Force active recall of a concept already learned; answer must stay hidden until the learner commits to a guess. | Live as a list only — the hide/reveal interaction the content type requires isn't built yet |
| **Scenarios** | Apply a concept under realistic ambiguity — present the situation before any answer. | Live as a list only — same gap as Flashcards |
| **Exams** | Simulate real test conditions: timed, mixed-topic, no do-overs. | Live as a **read-only question bank list** only — deliberately incomplete, sequenced after content verification |
| *(future)* **Dashboard** | Answer three questions the instant a learner opens the app, without navigating anywhere: *"Where was I?"* (resume point), *"What's next?"* (a recommendation grounded in §4–§5), *"How am I doing?"* (a lightweight, anxiety-reducing progress signal — a scoreboard is the wrong tone here, per §6 principle 3). | Not built — gated on progress tracking existing first |
| *(future)* **Revision queue** | Surface what to review next based on what's actually been forgotten or missed. | Not built — closes the "Assess → Revise → Master" loop the product has no mechanism for today |

*(This table — especially the Dashboard row — is the clearest concrete
target for "content viewer becomes mastery platform": it's the one future
screen where every principle in §4–§6 becomes visible in one place.)*

## 8. Future AI Interaction Principles

None of this is built (`services/ai.ts` remains a named future seam), but
the principles should be fixed now, before any AI surface is designed, so
early work isn't built against an unexamined assumption of what "AI
tutor" means. (See `USER_JOURNEY.md` §7 for how these apply moment by
moment.)

- **Teach, don't answer.** Prompt reasoning and give hints by default;
  reserve direct answers for when the learner has genuinely tried and is
  still stuck — an AI that hands over answers undermines the entire
  content progression in §4.
- **Contextual, not a destination.** Appears where the learner already
  is (inside a scenario, reviewing a missed flashcard), not as an
  isolated "chat with AI" page disconnected from what's being studied.
- **Transparently AI, always.** No pattern that blurs whether the learner
  is talking to a person, an authoritative source, or a model — trust
  matters more than novelty when wrong information has real exam-day
  consequences.
- **Opt-in and interruptible, never the default path.** A learner who
  wants to read a concept and move on should never be funneled through an
  AI interaction to do so.
- **Honest about its limits.** An uncertain response should say so rather
  than sound confident — especially given how situational and
  ambiguous-by-design PMP questions can be.

## 9. Content Repository vs. Learning System

The distinction this entire document is organized around, made explicit:

| | **Content repository** | **Learning system** |
|---|---|---|
| Organizing question | "What content exists?" | "What should I do right now?" |
| Content types | Independent, browsable buckets | Connected stages of one progression |
| Learner history | Not modeled | Central to every recommendation |
| Success measured by | Content coverage | Retention and applied correctness |

**Where the product is today, honestly:** four independent, list-only
pages with no cross-linking, no progress, no recommendation —
architecturally a content repository, even though the underlying content
model was designed as a learning system from the start (`CLAUDE.md` §3).
This is the correct state for a content-verification-first sprint
sequence, but the vision in §1 is not yet realized by the current build —
this document exists to keep that gap visible and intentional, not
something the team quietly stops noticing.

**The concrete markers that the product has crossed from repository to
system:** content types are cross-linked (§5), the product recommends
rather than only presents (§6, §7's Dashboard), and returning learners
see something different from first-time learners. None exist yet. All
three are named explicitly so future sprints have a checkable finish
line, not an open-ended aspiration — and so that "commercial product
readiness" has a concrete, testable meaning rather than being a vague
aspiration: a product ready to sell is one where these three markers are
true, not merely one with more content in it.

---

*This document defines the product foundation `DESIGN_SYSTEM.md` and
`USER_JOURNEY.md` build on. Reference it before designing or implementing
any new page or feature, alongside `CLAUDE.md` and `ARCHITECTURE.md`, and
update it whenever a product decision described here changes — per the
same discipline `CLAUDE.md` §16 rule 5 establishes for architectural
decisions.*
