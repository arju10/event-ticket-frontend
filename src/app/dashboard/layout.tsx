import type { ReactNode } from "react";
import { LayoutDashboard, Ticket, Users, Bell, User } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import type { SidebarNavItem } from "@/components/layout/dashboard-sidebar";
import { ROUTES } from "@/lib/constants/routes";

const SIDEBAR_ITEMS: SidebarNavItem[] = [
  {
    href: ROUTES.dashboard,
    label: "Overview",
    icon: LayoutDashboard,
    exact: true,
  },
  { href: ROUTES.dashboardBookings, label: "My Bookings", icon: Ticket },
  { href: ROUTES.dashboardWaitlist, label: "Waitlist", icon: Users },
  { href: ROUTES.dashboardNotifications, label: "Notifications", icon: Bell },
  { href: ROUTES.dashboardProfile, label: "Profile", icon: User },
];

export default function AttendeeDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DashboardShell
      allow={["ATTENDEE"]}
      sidebarItems={SIDEBAR_ITEMS}
      sidebarTitle="My Account"
      profileHref={ROUTES.dashboardProfile}
      notificationsHref={ROUTES.dashboardNotifications}
    >
      {children}
    </DashboardShell>
  );
}
