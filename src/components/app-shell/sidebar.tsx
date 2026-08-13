"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_SECTIONS, activeNavItem } from "./nav";
import { cn } from "@/lib/utils";

export type SidebarCounts = Partial<Record<"newLeads" | "pendingDrafts", number>>;

/**
 * Left navigation panel.
 *
 * Fixed rail on desktop, off-canvas drawer below `lg`. The drawer closes on
 * navigation — without that, tapping a link on a phone leaves the panel
 * covering the content the user just asked for.
 */
export function Sidebar({ counts = {} }: { counts?: SidebarCounts }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = activeNavItem(pathname);

  // Escape closes the drawer — expected of anything that behaves like a modal.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        aria-expanded={open}
        className="fixed left-4 top-4 z-30 rounded-lg border border-border bg-surface p-2 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div
          role="presentation"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}

      <nav
        aria-label="Main"
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-surface",
          "transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link href="/app" className="text-lg font-semibold tracking-tight">
            Cătină
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            className="rounded-md p-1 text-muted transition hover:text-foreground lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4">
          {NAV_SECTIONS.map((section, i) => (
            <div key={section.title ?? `section-${i}`} className="mb-5">
              {section.title && (
                <p className="px-2 pb-1.5 text-xs font-medium uppercase tracking-wide text-muted">
                  {section.title}
                </p>
              )}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = active?.href === item.href;
                  const badge = item.badgeKey ? counts[item.badgeKey] : undefined;
                  const Icon = item.icon;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        // Closed on click rather than on a pathname effect:
                        // otherwise tapping a link on a phone leaves the panel
                        // covering the content the user just asked for.
                        onClick={() => setOpen(false)}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition",
                          isActive
                            ? "bg-accent-soft font-medium text-foreground"
                            : "text-muted hover:bg-accent-soft hover:text-foreground",
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" aria-hidden />
                        <span className="flex-1">{item.label}</span>
                        {badge !== undefined && badge > 0 && (
                          <span className="rounded-full bg-accent px-1.5 py-0.5 text-xs font-medium text-accent-foreground">
                            {badge > 99 ? "99+" : badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border px-5 py-4 text-xs text-muted">
          EU-hosted · Frankfurt
        </div>
      </nav>
    </>
  );
}
