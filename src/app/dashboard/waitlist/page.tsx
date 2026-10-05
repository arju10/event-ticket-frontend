import type { Metadata } from "next";
import { MyWaitlistClient } from "@/components/dashboard/my-waitlist-client";

export const metadata: Metadata = {
  title: "My Waitlist",
  robots: { index: false, follow: false },
};

export default function DashboardWaitlistPage() {
  return <MyWaitlistClient />;
}
