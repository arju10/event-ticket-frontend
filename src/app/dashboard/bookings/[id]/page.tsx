import type { Metadata } from "next";
import { BookingDetailClient } from "@/components/bookings/booking-detail-client";

export const metadata: Metadata = {
  title: "Booking Details",
  robots: { index: false, follow: false },
};

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BookingDetailClient bookingId={id} />;
}
