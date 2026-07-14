import { siteConfig } from "@/data/siteConfig";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-[var(--color-foreground)]/60">
        © {new Date().getFullYear()} {siteConfig.name}. Built for focused PMP study.
      </div>
    </footer>
  );
}
