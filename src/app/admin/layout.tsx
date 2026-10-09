"use client";

import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  Tag,
  ScrollText,
  Bell,
  User as UserIcon,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import type { SidebarNavItem } from "@/components/layout/dashboard-sidebar";
import { ROUTES } from "@/lib/constants/routes";

const SIDEBAR_ITEMS: SidebarNavItem[] = [
  {
    href: ROUTES.admin,
    label: "Overview",
    icon: LayoutDashboard,
    exact: true,
  },
  { href: ROUTES.adminUsers, label: "Users", icon: Users },
  { href: ROUTES.adminCoupons, label: "Coupons", icon: Tag },
  { href: ROUTES.adminAuditLogs, label: "Audit Logs", icon: ScrollText },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/profile", label: "Profile", icon: UserIcon },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell
      allow={["ADMIN"]}
      sidebarItems={SIDEBAR_ITEMS}
      sidebarTitle="Admin"
      profileHref="/admin/profile"
      notificationsHref="/admin/notifications"
    >
      {children}
    </DashboardShell>
  );
}
