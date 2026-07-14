import { Outlet } from "react-router-dom";
import { Header, Footer, MobileNav } from "@/components/layout";

/**
 * The application shell. Every route renders inside this layout via
 * <Outlet/>. Keeping the shell in `layouts/` (rather than `components/`)
 * signals that it's a route-level composition, not a reusable widget.
 */
export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[var(--color-primary)] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[var(--color-primary-foreground)]"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <MobileNav />
      <Footer />
    </div>
  );
}
