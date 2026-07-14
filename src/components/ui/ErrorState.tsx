import type { ReactNode } from "react";
import { Heading, Text } from "./Typography";
import { cn } from "@/utils/cn";

interface ErrorStateProps {
  title?: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/**
 * A content-agnostic "something went wrong" state, paired with
 * `EmptyState` and `Skeleton` as the three canonical async states a list
 * page can be in. `role="alert"` so assistive tech announces the failure
 * without the page needing to manage focus manually.
 */
export function ErrorState({
  title = "Something went wrong",
  description,
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-12 text-center",
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
