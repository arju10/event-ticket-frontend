import type { Metadata } from "next";
import { AdminOverview } from "@/components/dashboard/admin-overview";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminOverview />;
}
