import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    fs: {
      // The content-loading services intentionally read from the
      // repository-level `data/` and `assets/` folders (siblings of
      // `src/`), so the dev server needs to be allowed to serve files
      // from the project root, not just `src/`.
      allow: [path.resolve(__dirname, ".")],
    },
  },
});
