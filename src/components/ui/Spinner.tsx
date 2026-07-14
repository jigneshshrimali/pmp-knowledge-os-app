import { cn } from "@/utils/cn";

interface SpinnerProps {
  className?: string;
  /** Visually-hidden text for screen readers — customize per context
   * (e.g. "Loading concepts…") when the generic default isn't specific
   * enough to be useful when announced out of visual context. */
  label?: string;
}

/**
 * A minimal, dependency-free spinner (no icon library — see CLAUDE.md §10
 * on avoiding unnecessary dependencies for something a few lines of CSS
 * can do). `role="status"` + visually-hidden text means screen readers
 * announce the loading state even though it's a purely visual spin
 * otherwise.
 */
export function Spinner({ className, label = "Loading" }: SpinnerProps) {
  return (
    <span role="status" className={cn("inline-flex items-center", className)}>
      <svg
        className="h-4 w-4 animate-spin text-current"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}
