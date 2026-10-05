import type { Metadata } from "next";
import { Suspense } from "react";
import { EventsBrowser } from "@/components/events/events-browser";
import { CardGridSkeleton } from "@/components/shared/loading-skeleton";

export const metadata: Metadata = {
  title: "Browse Events",
  description:
    "Search and filter upcoming events by category, city, date, and price.",
};

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  return (
    <div className="container-page py-10 sm:py-14">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Browse Events
        </h1>
        <p className="text-muted-foreground mt-2">
          Discover events near you — filter by category, city, or date.
        </p>
      </header>

      <Suspense fallback={<CardGridSkeleton count={9} />}>
        <EventsBrowser initialSearchParams={serializeParams(params)} />
      </Suspense>
    </div>
  );
}

function serializeParams(
  params: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    if (typeof v === "string") out[k] = v;
    else if (Array.isArray(v) && v.length > 0) out[k] = v[0]!;
  }
  return out;
}
