import type { ContentMetadata } from "@/types/content";

type GlobModules<Raw> = Record<string, () => Promise<Raw | Raw[]>>;

/**
 * Builds a typed content service backed by JSON files. Each file may
 * contain either a single item or an array of items — `mapper` is called
 * once per raw item found.
 *
 * Mirrors `createMarkdownCollection`'s API so pages don't need to care
 * whether a content type happens to be stored as markdown or JSON.
 */
export function createJsonCollection<Raw, T extends ContentMetadata>(
  modules: GlobModules<Raw>,
  mapper: (raw: Raw, sourcePath: string, indexInFile: number) => T,
) {
  let cache: T[] | null = null;

  async function getAll(): Promise<T[]> {
    if (cache) return cache;

    const entries = await Promise.all(
      Object.entries(modules).map(async ([path, loadJson]) => {
        const parsed = await loadJson();
        const items = Array.isArray(parsed) ? parsed : [parsed];
        return items.map((item, index) => mapper(item, path, index));
      }),
    );

    cache = entries.flat();
    return cache;
  }

  async function getById(id: string): Promise<T | undefined> {
    const all = await getAll();
    return all.find((item) => item.id === id);
  }

  return { getAll, getById };
}
