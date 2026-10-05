import type { Metadata } from "next";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your EventHub overview.",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <DashboardOverview />;
}
