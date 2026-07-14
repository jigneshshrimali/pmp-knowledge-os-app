/**
 * Domain types for PMP content.
 *
 * These describe the *shape* the application expects content to be in
 * once loaded — they are intentionally decoupled from how content is
 * stored on disk (markdown + frontmatter, or JSON). The services layer
 * is responsible for mapping raw files onto these types.
 */

/** Common fields every piece of content is expected to carry. */
export interface ContentMetadata {
  /** Stable identifier, derived from the file path if not set explicitly. */
  id: string;
  /** Display title. */
  title: string;
  /** Optional short summary used in list views. */
  summary?: string;
  /** Free-form tags for filtering/search (e.g. domain, difficulty). */
  tags?: string[];
  /** Path the content was loaded from — useful for debugging. */
  sourcePath: string;
}

/** A markdown-based concept explainer (data/concepts). */
export interface Concept extends ContentMetadata {
  /** PMP knowledge area / domain, e.g. "People", "Process", "Business Environment". */
  domain?: string;
  /** Rendered markdown body. */
  body: string;
}

/** A single flashcard (data/flashcards). */
export interface Flashcard extends ContentMetadata {
  question: string;
  answer: string;
  domain?: string;
}

/** A scenario-based practice item (data/scenarios). */
export interface Scenario extends ContentMetadata {
  prompt: string;
  body: string;
  domain?: string;
}

/** A single exam question (data/exams). */
export interface ExamQuestion extends ContentMetadata {
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
  domain?: string;
}

/** Union of every content kind the app knows about. Extend as new content is added. */
export type ContentKind = "concept" | "flashcard" | "scenario" | "examQuestion";
