"use client";

import Link from "next/link";
import { AlertCircle, CalendarX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardGridSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { EventCard } from "@/components/events/event-card";
import { useFeaturedEvents } from "@/hooks/use-featured-events";
import { ROUTES } from "@/lib/constants/routes";

export function FeaturedEventsSection() {
  const { data, isLoading, isError, refetch } = useFeaturedEvents(6);

  if (isLoading) {
    return <CardGridSkeleton count={6} />;
  }

  if (isError) {
    return (
      <div className="border-destructive/30 bg-destructive/5 rounded-lg border p-6 text-center">
        <AlertCircle className="text-destructive mx-auto mb-3 h-6 w-6" />
        <p className="text-muted-foreground text-sm">
          Couldn't load events right now.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => refetch()}
        >
          Try again
        </Button>
      </div>
    );
  }

  const events = data?.items ?? [];

  if (events.length === 0) {
    return (
      <EmptyState
        icon={CalendarX}
        title="No upcoming events yet"
        description="Check back soon — organizers are setting up new events regularly."
        action={
          <Button asChild>
            <Link href={ROUTES.events}>Browse all events</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
