import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

/**
 * Implements the typographic hierarchy defined in DESIGN_SYSTEM.md §4:
 * Page title → Section/card title → Body/description → Label/meta.
 *
 * Every page and component should compose text through these primitives
 * rather than hand-picking a Tailwind text-size class, so the hierarchy
 * stays consistent across the app — a learner scanning under time
 * pressure relies on that consistency to separate "title" from "detail"
 * without reading every word.
 */

type HeadingLevel = "page" | "section";

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  /** Renders a different HTML element than the visual level implies —
   * use to keep exactly one <h1> per page while still getting "page"
   * styling elsewhere, or vice versa. Defaults to h1 for "page", h2 for
   * "section". */
  as?: "h1" | "h2" | "h3";
}

const headingClasses: Record<HeadingLevel, string> = {
  page: "text-2xl font-bold tracking-tight sm:text-3xl",
  section: "text-base font-semibold sm:text-lg",
};

const defaultElement: Record<HeadingLevel, "h1" | "h2"> = {
  page: "h1",
  section: "h2",
};

export function Heading({ level = "page", as, className, ...props }: HeadingProps) {
  const Element = as ?? defaultElement[level];
  return <Element className={cn(headingClasses[level], className)} {...props} />;
}

type TextVariant = "body" | "muted" | "label";

interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: TextVariant;
  as?: "p" | "span" | "div";
}

const textClasses: Record<TextVariant, string> = {
  body: "text-sm text-[var(--color-foreground)]",
  muted: "text-sm text-[var(--color-foreground)]/70",
  label: "text-xs font-medium text-[var(--color-foreground)]/70",
};

export function Text({ variant = "body", as = "p", className, ...props }: TextProps) {
  const Element = as;
  return <Element className={cn(textClasses[variant], className)} {...props} />;
}
