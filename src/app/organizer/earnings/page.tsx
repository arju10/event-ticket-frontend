import type { Metadata } from "next";
import { OrganizerEarnings } from "@/components/dashboard/organizer-earnings";

export const metadata: Metadata = {
  title: "Earnings",
  robots: { index: false, follow: false },
};

export default function OrganizerEarningsPage() {
  return <OrganizerEarnings />;
}
