import type { Metadata } from "next";
import { CheckInScanner } from "@/components/events/check-in-scanner";

export const metadata: Metadata = {
  title: "Check-in Scanner",
  robots: { index: false, follow: false },
};

export default async function CheckInPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CheckInScanner eventId={id} />;
}
