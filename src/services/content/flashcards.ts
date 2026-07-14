import { createJsonCollection } from "./createJsonCollection";
import { idFromPath } from "@/utils/idFromPath";
import type { Flashcard } from "@/types/content";

/** Loose shape we tolerate from raw flashcard JSON files. */
interface RawFlashcard {
  id?: string;
  question?: string;
  front?: string;
  answer?: string;
  back?: string;
  tags?: string[];
  domain?: string;
}

const modules = import.meta.glob("../../../data/flashcards/**/*.json", {
  import: "default",
}) as Record<string, () => Promise<RawFlashcard | RawFlashcard[]>>;

export const flashcardsService = createJsonCollection<RawFlashcard, Flashcard>(
  modules,
  (raw, sourcePath, index) => ({
    id: raw.id ?? `${idFromPath(sourcePath)}-${index}`,
    title: raw.question ?? raw.front ?? "Untitled flashcard",
    question: raw.question ?? raw.front ?? "",
    answer: raw.answer ?? raw.back ?? "",
    tags: raw.tags ?? [],
    domain: raw.domain,
    sourcePath,
  }),
);
