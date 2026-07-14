import { createMarkdownCollection } from "./createMarkdownCollection";
import { idFromPath } from "@/utils/idFromPath";
import type { Concept } from "@/types/content";

// Lazily import every markdown file under the repository-level
// `data/concepts/` folder. `query: "?raw"` tells Vite to return the raw
// file contents as a string instead of trying to execute it as a module.
const modules = import.meta.glob("../../../data/concepts/**/*.md", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;

export const conceptsService = createMarkdownCollection<Concept>(
  modules,
  (data, body, sourcePath) => ({
    id: (data.id as string) ?? idFromPath(sourcePath),
    title: (data.title as string) ?? idFromPath(sourcePath),
    summary: data.summary as string | undefined,
    tags: (data.tags as string[] | undefined) ?? [],
    domain: data.domain as string | undefined,
    body,
    sourcePath,
  }),
);
