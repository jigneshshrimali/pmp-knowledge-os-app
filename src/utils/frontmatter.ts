/**
 * A deliberately small, dependency-free YAML-frontmatter parser.
 *
 * Supports the subset of YAML that PMP content is expected to use:
 * flat `key: value` pairs, quoted strings, numbers, booleans, and
 * simple inline arrays (`tags: [a, b, c]`). It intentionally does NOT
 * support nested objects/multi-line YAML — if the content ever needs
 * that, swap this for a real YAML library (e.g. `gray-matter`) without
 * changing the public `parseFrontmatter` signature.
 */

export interface ParsedFrontmatter<T = Record<string, unknown>> {
  data: T;
  body: string;
}

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

function parseValue(raw: string): unknown {
  const value = raw.trim();

  if (value === "") return "";
  if (value === "true") return true;
  if (value === "false") return false;
  if (!Number.isNaN(Number(value)) && value !== "") return Number(value);

  // Inline array: [a, b, c]
  if (value.startsWith("[") && value.endsWith("]")) {
    return value
      .slice(1, -1)
      .split(",")
      .map((item) => item.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }

  // Quoted string
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

/** Parses a raw markdown string with an optional `---` frontmatter block. */
export function parseFrontmatter<T = Record<string, unknown>>(
  raw: string,
): ParsedFrontmatter<T> {
  const match = raw.match(FRONTMATTER_PATTERN);

  if (!match) {
    return { data: {} as T, body: raw.trim() };
  }

  const [, frontmatterBlock, body] = match;
  const data: Record<string, unknown> = {};

  for (const line of frontmatterBlock.split(/\r?\n/)) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1);
    if (!key) continue;

    data[key] = parseValue(rawValue);
  }

  return { data: data as T, body: body.trim() };
}
