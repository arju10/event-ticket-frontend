"use client";

import type { ReactNode } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  Plus,
  BarChart3,
  User,
  Bell,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import type { SidebarNavItem } from "@/components/layout/dashboard-sidebar";
import { ROUTES } from "@/lib/constants/routes";

const SIDEBAR_ITEMS: SidebarNavItem[] = [
  {
    href: ROUTES.organizer,
    label: "Overview",
    icon: LayoutDashboard,
    exact: true,
  },
  { href: ROUTES.organizerEvents, label: "My Events", icon: CalendarDays },
  { href: ROUTES.organizerNewEvent, label: "Create Event", icon: Plus },
  { href: ROUTES.organizerEarnings, label: "Earnings", icon: BarChart3 },
  { href: ROUTES.dashboardNotifications, label: "Notifications", icon: Bell },
  { href: "/organizer/profile", label: "Profile", icon: User },
];

export default function OrganizerLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell
      allow={["ORGANIZER"]}
      sidebarItems={SIDEBAR_ITEMS}
      sidebarTitle="Organizer"
      profileHref="/organizer/profile"
      notificationsHref={ROUTES.dashboardNotifications}
    >
      {children}
    </DashboardShell>
  );
}
