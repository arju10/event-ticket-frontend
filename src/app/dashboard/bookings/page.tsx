import type { Metadata } from "next";
import { MyBookingsList } from "@/components/bookings/my-bookings-list";

export const metadata: Metadata = {
  title: "My Bookings",
  robots: { index: false, follow: false },
};

export default function DashboardBookingsPage() {
  return <MyBookingsList />;
}
