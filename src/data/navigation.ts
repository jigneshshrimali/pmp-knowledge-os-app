import type { NavItem } from "@/types/navigation";

/**
 * Static navigation config for the app shell.
 *
 * NOTE: this file lives in `src/data/` because it's application
 * configuration, not PMP study content — actual content lives in the
 * repository-level `data/` folder and is loaded through `services/content`.
 */
export const primaryNavItems: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "Concepts", path: "/concepts", description: "Core PMP concept explainers" },
  { label: "Flashcards", path: "/flashcards", description: "Quick recall practice" },
  { label: "Scenarios", path: "/scenarios", description: "Situational judgement practice" },
  { label: "Exams", path: "/exams", description: "Practice exam question bank" },
];
