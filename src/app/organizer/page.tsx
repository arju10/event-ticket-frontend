import type { Metadata } from "next";
import { OrganizerOverview } from "@/components/dashboard/organizer-overview";

export const metadata: Metadata = {
  title: "Organizer Dashboard",
  robots: { index: false, follow: false },
};

export default function OrganizerPage() {
  return <OrganizerOverview />;
}
