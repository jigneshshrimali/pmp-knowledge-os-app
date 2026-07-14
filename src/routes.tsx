import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import {
  HomePage,
  ConceptsPage,
  FlashcardsPage,
  ScenariosPage,
  ExamsPage,
  NotFoundPage,
} from "@/pages";

/**
 * Central route table. Every route mounts inside `AppLayout`.
 * Adding a new top-level page later means: add the page component to
 * `pages/`, register it here, and optionally add it to
 * `data/navigation.ts` — nothing else needs to change.
 */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "concepts", element: <ConceptsPage /> },
      { path: "flashcards", element: <FlashcardsPage /> },
      { path: "scenarios", element: <ScenariosPage /> },
      { path: "exams", element: <ExamsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
