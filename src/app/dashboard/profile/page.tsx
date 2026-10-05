import type { Metadata } from "next";
import { ProfileClient } from "@/components/dashboard/profile-client";

export const metadata: Metadata = {
  title: "Profile",
  robots: { index: false, follow: false },
};

export default function DashboardProfilePage() {
  return <ProfileClient />;
}
