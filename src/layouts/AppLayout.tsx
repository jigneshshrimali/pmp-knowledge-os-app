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
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <MobileNav />
      <Footer />
    </div>
  );
}
