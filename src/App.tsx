import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { router } from "@/routes";

export function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
