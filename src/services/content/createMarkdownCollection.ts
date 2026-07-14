import { parseFrontmatter } from "@/utils/frontmatter";
import type { ContentMetadata } from "@/types/content";

/**
 * A Vite `import.meta.glob` result: a map of file path -> lazy import function.
 * Using the lazy (non-eager) form means individual files are only fetched
 * and parsed when a page actually asks for them.
 */
type GlobModules = Record<string, () => Promise<string>>;

/**
 * Builds a typed content service backed by markdown files with YAML
 * frontmatter. `mapper` converts the parsed frontmatter + body into the
 * domain type `T` (e.g. `Concept`, `Scenario`).
 *
 * This is the single place markdown parsing happens — pages and
 * components never touch `import.meta.glob` or frontmatter directly.
 */
export function createMarkdownCollection<T extends ContentMetadata>(
  modules: GlobModules,
  mapper: (data: Record<string, unknown>, body: string, sourcePath: string) => T,
) {
  let cache: T[] | null = null;

  async function getAll(): Promise<T[]> {
    if (cache) return cache;

    const entries = await Promise.all(
      Object.entries(modules).map(async ([path, loadRaw]) => {
        const raw = await loadRaw();
        const { data, body } = parseFrontmatter(raw);
        return mapper(data, body, path);
      }),
    );

    cache = entries;
    return entries;
  }

  async function getById(id: string): Promise<T | undefined> {
    const all = await getAll();
    return all.find((item) => item.id === id);
  }

  return { getAll, getById };
}
