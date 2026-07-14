import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { Heading, Text } from "./Typography";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <Heading level="section" as="h3" className={className} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <Text variant="muted" className={cn("mt-1", className)} {...props} />;
}
