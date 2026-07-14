/**
 * Asset loading strategy.
 *
 * Images under the repository-level `assets/` folder are discovered
 * eagerly (at build time) and resolved to their final bundled URL via
 * Vite's `?url` query. This gives components a simple `name -> url`
 * lookup instead of ever constructing file paths by hand, so the
 * `assets/` folder can be freely reorganized internally without
 * touching UI code — as long as filenames stay unique.
 */

const cornellModules = import.meta.glob(
  "../../../assets/cornell/**/*.{png,jpg,jpeg,svg,webp}",
  { eager: true, query: "?url", import: "default" },
) as Record<string, string>;

const memoryHookModules = import.meta.glob(
  "../../../assets/memory-hooks/**/*.{png,jpg,jpeg,svg,webp}",
  { eager: true, query: "?url", import: "default" },
) as Record<string, string>;

function toNameKeyedMap(modules: Record<string, string>): Record<string, string> {
  const map: Record<string, string> = {};
  for (const [path, url] of Object.entries(modules)) {
    const fileName = path.split("/").pop() ?? path;
    map[fileName] = url;
  }
  return map;
}

/** Filename -> resolved URL for every Cornell Notes image. */
export const cornellNotesAssets = toNameKeyedMap(cornellModules);

/** Filename -> resolved URL for every Memory Hooks image. */
export const memoryHookAssets = toNameKeyedMap(memoryHookModules);

/** Looks up a Cornell Notes image by filename, e.g. "risk-management.png". */
export function getCornellNoteAsset(fileName: string): string | undefined {
  return cornellNotesAssets[fileName];
}

/** Looks up a Memory Hooks image by filename. */
export function getMemoryHookAsset(fileName: string): string | undefined {
  return memoryHookAssets[fileName];
}
