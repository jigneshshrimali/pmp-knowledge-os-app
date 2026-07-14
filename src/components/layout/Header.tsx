import { NavLink } from "react-router-dom";
import { primaryNavItems } from "@/data/navigation";
import { siteConfig } from "@/data/siteConfig";
import { useTheme } from "@/components/providers/ThemeProvider";
import { Button } from "@/components/ui";
import { cn } from "@/utils/cn";

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-[var(--color-border)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <NavLink to="/" className="text-lg font-semibold">
          {siteConfig.name}
        </NavLink>

        <nav className="hidden items-center gap-1 sm:flex">
          {primaryNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-surface)]",
                  isActive && "bg-[var(--color-surface)] text-[var(--color-primary)]",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Button
          variant="ghost"
          aria-label="Toggle color theme"
          onClick={toggleTheme}
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </Button>
      </div>
    </header>
  );
}
