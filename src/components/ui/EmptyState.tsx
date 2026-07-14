import type { ReactNode } from "react";
import { Heading, Text } from "./Typography";
import { cn } from "@/utils/cn";

interface EmptyStateProps {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/**
 * A calm, content-agnostic "nothing here yet" state — replaces the
 * ad hoc `<p>No X found yet…</p>` line that was duplicated across every
 * content list page (Concepts/Flashcards/Scenarios/Exams). Content-
 * agnostic by design: it takes a title/description/action, never a
 * "concept" or "flashcard" — same discipline as every other `ui`
 * primitive (ARCHITECTURE.md §9).
 */
export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-lg border border-dashed border-[var(--color-border)] px-6 py-12 text-center",
        className,
      )}
    >
      <Heading level="section" as="h3">
        {title}
      </Heading>
      {description && <Text variant="muted">{description}</Text>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
