import { NavLink } from "react-router-dom";
import { primaryNavItems } from "@/data/navigation";
import { cn } from "@/utils/cn";

export function MobileNav() {
  return (
    <nav className="flex items-center justify-around border-t border-[var(--color-border)] bg-[var(--color-background)] py-2 sm:hidden">
      {primaryNavItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === "/"}
          className={({ isActive }) =>
            cn(
              "rounded-md px-2 py-1 text-xs font-medium",
              isActive ? "text-[var(--color-primary)]" : "text-[var(--color-foreground)]/70",
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
