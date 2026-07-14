import { NavLink } from "react-router-dom";
import { Button, Heading, Text } from "@/components/ui";

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <Heading level="page" as="h1">
        404
      </Heading>
      <Text variant="muted">This page doesn't exist yet.</Text>
      <NavLink to="/">
        <Button variant="secondary">Back to home</Button>
      </NavLink>
    </div>
  );
}
