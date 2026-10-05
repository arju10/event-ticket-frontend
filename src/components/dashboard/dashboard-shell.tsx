"use client";

import type { ReactNode } from "react";
import type { SidebarNavItem } from "@/components/layout/dashboard-sidebar";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { RoleGuard } from "@/components/layout/role-guard";
import type { UserRole } from "@/types/enums";

interface DashboardShellProps {
  allow: UserRole[];
  sidebarItems: SidebarNavItem[];
  sidebarTitle: string;
  profileHref: string;
  notificationsHref: string;
  children: ReactNode;
}

export function DashboardShell({
  allow,
  sidebarItems,
  sidebarTitle,
  profileHref,
  notificationsHref,
  children,
}: DashboardShellProps) {
  return (
    <RoleGuard allow={allow}>
      <div className="bg-muted/20 flex min-h-screen">
        <div className="hidden md:block">
          <DashboardSidebar items={sidebarItems} title={sidebarTitle} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardTopbar
            sidebarItems={sidebarItems}
            sidebarTitle={sidebarTitle}
            profileHref={profileHref}
            notificationsHref={notificationsHref}
          />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </RoleGuard>
  );
}
