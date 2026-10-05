import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventDetailClient } from "@/components/events/event-detail-client";
import { ReviewList } from "@/components/events/review-list";
import { Separator } from "@/components/ui/separator";
import { eventsApi } from "@/lib/api/events";
import type { EventDetail } from "@/types/models";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getEvent(id: string): Promise<EventDetail | null> {
  try {
    return await eventsApi.detail(id);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    return { title: "Event not found" };
  }

  return {
    title: event.title,
    description: event.description.slice(0, 160),
    openGraph: {
      title: event.title,
      description: event.description.slice(0, 160),
      type: "article",
      images: event.bannerImage ? [{ url: event.bannerImage }] : undefined,
    },
  };
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    notFound();
  }

  return (
    <div className="container-page py-10 sm:py-14">
      <EventDetailClient event={event} />

      <Separator className="my-12" />

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          What attendees are saying
        </h2>
        <ReviewList eventId={event.id} />
      </section>
    </div>
  );
}
