/**
 * Minimal conditional className joiner (a dependency-free stand-in for
 * `clsx`). Accepts strings, falsy values, and objects of `{ class: bool }`.
 */
type ClassValue = string | number | null | false | undefined | Record<string, boolean>;

export function cn(...values: ClassValue[]): string {
  const classes: string[] = [];

  for (const value of values) {
    if (!value) continue;

    if (typeof value === "string" || typeof value === "number") {
      classes.push(String(value));
      continue;
    }

    for (const [key, enabled] of Object.entries(value)) {
      if (enabled) classes.push(key);
    }
  }

  return classes.join(" ");
}
