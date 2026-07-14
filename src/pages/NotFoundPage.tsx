import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui";

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="text-[var(--color-foreground)]/70">This page doesn't exist yet.</p>
      <NavLink to="/">
        <Button variant="secondary">Back to home</Button>
      </NavLink>
    </div>
  );
}
