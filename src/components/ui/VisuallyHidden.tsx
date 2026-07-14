import type { ReactNode } from "react";

/**
 * Renders content that's available to assistive tech but not visually
 * shown — the accessible-name pattern used throughout this design system
 * (Spinner's "Loading" text, the skip link's visible-on-focus label).
 * Relies on Tailwind's built-in `sr-only` utility rather than a custom
 * class, so no CSS is duplicated.
 */
export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span className="sr-only">{children}</span>;
}
