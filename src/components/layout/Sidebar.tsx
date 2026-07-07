"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/ui";
import { Logo } from "./Logo";

// The two primary destinations. Kept as data so the nav renders in a loop and
// adding a screen later is a one-line change.
const NAV_ITEMS = [
  { href: "/generator", label: "Generator", icon: "edit_note" },
  { href: "/editor", label: "Editor", icon: "history_edu" },
] as const;

interface SidebarProps {
  /** Drawer open state (mobile only; the sidebar is always visible at lg+). */
  isOpen: boolean;
  /** Called when a nav item is chosen, so the parent can close the drawer. */
  onNavigate: () => void;
}

/**
 * Persistent left navigation. On `lg+` it's a static 280px column; below `lg`
 * it becomes an off-canvas drawer toggled from the mobile top bar.
 */
export function Sidebar({ isOpen, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex h-screen w-[280px] flex-col gap-2 border-r border-border bg-muted p-4 transition-transform duration-200",
        "lg:static lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      {/* Brand */}
      <div className="mb-6 px-2 py-4">
        <Logo subtitle="Cover letter, on speed dial" markSize={40} />
      </div>

      {/* Primary nav */}
      <nav className="flex flex-col gap-1" data-tour="nav">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-primary font-semibold text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:translate-x-0.5 hover:bg-muted-hover hover:text-foreground",
              )}
            >
              <Icon
                name={item.icon}
                filled={active}
                size={20}
                className="transition-transform duration-200 group-hover:scale-110"
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* New draft — primary action */}
      <Link
        href="/generator"
        onClick={onNavigate}
        className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
      >
        <Icon name="add" size={20} />
        New Draft
      </Link>
    </aside>
  );
}
