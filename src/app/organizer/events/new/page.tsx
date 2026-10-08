import type { Metadata } from "next";
import { EventWizard } from "@/components/events/event-wizard";

export const metadata: Metadata = {
  title: "Create Event",
  robots: { index: false, follow: false },
};

export default function NewEventPage() {
  return <EventWizard />;
}
