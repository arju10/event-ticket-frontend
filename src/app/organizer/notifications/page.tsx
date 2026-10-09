import type { Metadata } from "next";
import { NotificationsClient } from "@/components/dashboard/notifications-client";

export const metadata: Metadata = {
  title: "Notifications",
  robots: { index: false, follow: false },
};

export default function OrganizerNotificationsPage() {
  return <NotificationsClient />;
}
