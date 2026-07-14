import type { ReactNode } from "react";
import { Heading, Text } from "./Typography";
import { cn } from "@/utils/cn";

interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  /** Optional trailing content, e.g. a future filter control — kept as a
   * generic slot rather than named props so this stays feature-agnostic. */
  action?: ReactNode;
  className?: string;
}

/**
 * The title + description block every page currently hand-rolled
 * (`<h1 className="text-2xl font-bold …">` + `<p className="…">`,
 * repeated near-identically in HomePage/ConceptsPage/FlashcardsPage/
 * ScenariosPage/ExamsPage). Consolidating it here means the "page title"
 * level of the typographic hierarchy (DESIGN_SYSTEM.md §4) is enforced
 * by one component instead of relying on every page author to copy the
 * right classes.
 */
export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div>
        <Heading level="page">{title}</Heading>
        {description && <Text variant="muted" className="mt-1">{description}</Text>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
