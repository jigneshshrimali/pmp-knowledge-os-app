import { createMarkdownCollection } from "./createMarkdownCollection";
import { idFromPath } from "@/utils/idFromPath";
import type { Scenario } from "@/types/content";

const modules = import.meta.glob("../../../data/scenarios/**/*.md", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;

export const scenariosService = createMarkdownCollection<Scenario>(
  modules,
  (data, body, sourcePath) => ({
    id: (data.id as string) ?? idFromPath(sourcePath),
    title: (data.title as string) ?? idFromPath(sourcePath),
    summary: data.summary as string | undefined,
    tags: (data.tags as string[] | undefined) ?? [],
    domain: data.domain as string | undefined,
    prompt: (data.prompt as string) ?? "",
    body,
    sourcePath,
  }),
);
