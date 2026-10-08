import type { Metadata } from "next";
import { OrganizerEventDetail } from "@/components/events/organizer-event-detail";

export const metadata: Metadata = {
  title: "Manage Event",
  robots: { index: false, follow: false },
};

export default async function OrganizerEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrganizerEventDetail eventId={id} />;
}
