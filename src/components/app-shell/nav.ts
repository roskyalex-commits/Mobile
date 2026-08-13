import {
  Building2,
  LayoutDashboard,
  Mail,
  Radar,
  Settings,
  Target,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Sidebar navigation, defined once so the sidebar, the mobile drawer and the
 * page-title lookup can't drift apart.
 *
 * Grouped by the order the user actually moves through the product: define who
 * you're after, see who was found, reach out, then configure.
 */
export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Shown in the sidebar when there's something waiting. */
  badgeKey?: "newLeads" | "pendingDrafts";
};

export type NavSection = {
  title?: string;
  items: NavItem[];
};

export const NAV_SECTIONS: NavSection[] = [
  {
    items: [{ href: "/app", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Sourcing",
    items: [
      { href: "/app/icp", label: "Ideal customer", icon: Target },
      { href: "/app/companies", label: "Companies", icon: Building2 },
      { href: "/app/leads", label: "Leads", icon: Users, badgeKey: "newLeads" },
      { href: "/app/signals", label: "Signals", icon: Radar },
    ],
  },
  {
    title: "Outreach",
    items: [
      {
        href: "/app/campaigns",
        label: "Campaigns",
        icon: Mail,
        badgeKey: "pendingDrafts",
      },
    ],
  },
  {
    items: [{ href: "/app/settings", label: "Settings", icon: Settings }],
  },
];

export const ALL_NAV_ITEMS: NavItem[] = NAV_SECTIONS.flatMap((s) => s.items);

/**
 * Longest-prefix match, so /app/leads/123 resolves to the Leads item while
 * /app itself doesn't swallow every child route.
 */
export function activeNavItem(pathname: string): NavItem | undefined {
  return ALL_NAV_ITEMS.filter(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  ).sort((a, b) => b.href.length - a.href.length)[0];
}
