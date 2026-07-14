import { createJsonCollection } from "./createJsonCollection";
import { idFromPath } from "@/utils/idFromPath";
import type { ExamQuestion } from "@/types/content";

/** Loose shape we tolerate from raw exam-question JSON files. */
interface RawExamQuestion {
  id?: string;
  question?: string;
  options?: string[];
  choices?: string[];
  correctOptionIndex?: number;
  answerIndex?: number;
  explanation?: string;
  tags?: string[];
  domain?: string;
}

const modules = import.meta.glob("../../../data/exams/**/*.json", {
  import: "default",
}) as Record<string, () => Promise<RawExamQuestion | RawExamQuestion[]>>;

export const examsService = createJsonCollection<RawExamQuestion, ExamQuestion>(
  modules,
  (raw, sourcePath, index) => ({
    id: raw.id ?? `${idFromPath(sourcePath)}-${index}`,
    title: raw.question ?? "Untitled question",
    question: raw.question ?? "",
    options: raw.options ?? raw.choices ?? [],
    correctOptionIndex: raw.correctOptionIndex ?? raw.answerIndex ?? -1,
    explanation: raw.explanation,
    tags: raw.tags ?? [],
    domain: raw.domain,
    sourcePath,
  }),
);
