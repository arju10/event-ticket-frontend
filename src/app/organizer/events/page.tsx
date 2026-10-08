import type { Metadata } from "next";
import { MyEventsList } from "@/components/events/my-events-list";

export const metadata: Metadata = {
  title: "My Events",
  robots: { index: false, follow: false },
};

export default function OrganizerEventsPage() {
  return <MyEventsList />;
}
