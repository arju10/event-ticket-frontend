import type { Metadata } from "next";
import { EventWaitlistView } from "@/components/events/event-waitlist-view";

export const metadata: Metadata = {
  title: "Event Waitlist",
  robots: { index: false, follow: false },
};

export default async function EventWaitlistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EventWaitlistView eventId={id} />;
}
