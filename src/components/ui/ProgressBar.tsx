import { cn } from "@/utils/cn";
import { Text } from "./Typography";

interface ProgressBarProps {
  /** Current value, in the same unit as `max`. */
  value: number;
  max?: number;
  /** Optional label rendered above the bar (e.g. "Domain coverage"). */
  label?: string;
  /** Show the numeric percentage next to the label. */
  showValue?: boolean;
  className?: string;
}

/**
 * A generic linear progress indicator. Deliberately has no knowledge of
 * what it's measuring — no "concepts learned" or "flashcards mastered"
 * baked in (that would be a learning feature, out of scope for this
 * sprint; ARCHITECTURE.md §14 — components must not know business logic).
 * A future progress-tracking feature (ARCHITECTURE.md §6, sprint KS-005)
 * supplies `value`/`max`; this component only renders them accessibly.
 */
export function ProgressBar({ value, max = 100, label, showValue = false, className }: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && <Text variant="label">{label}</Text>}
          {showValue && <Text variant="label">{Math.round(percent)}%</Text>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-border)]"
      >
        <div
          className="h-full rounded-full bg-[var(--color-primary)] transition-[width]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
