import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

/**
 * A generic pulsing placeholder block. Composed by callers into whatever
 * shape a loading list needs (e.g. a grid of card-shaped skeletons) —
 * this component has no opinion about content shape, only about the
 * "something is loading, calmly" visual language (DESIGN_SYSTEM.md §1:
 * calm over busy — a pulsing shape reads as considered, a bare "Loading…"
 * string reads as unfinished).
 */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[var(--color-border)]",
        className,
      )}
      aria-hidden="true"
      {...props}
    />
  );
}

/** A ready-made skeleton shaped like a `Card` (title line + description
 * lines), for the common case of a loading grid of content cards —
 * saves every list page from re-deriving the same three-line shape. */
export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-4/5" />
    </div>
  );
}
