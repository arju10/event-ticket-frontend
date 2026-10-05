"use client";

import { CalendarX } from "lucide-react";
import { EventFilters } from "./event-filters";
import { EventCard } from "./event-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Pagination } from "@/components/shared/pagination";
import { CardGridSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/hooks/use-events";
import { useUrlFilters } from "@/hooks/use-url-filters";

const FILTER_DEFAULTS = {
  search: "",
  category: "",
  city: "",
  sortBy: "startDate",
  sortOrder: "asc",
  page: 1,
  limit: 12,
};

interface EventsBrowserProps {
  initialSearchParams: Record<string, string>;
}

export function EventsBrowser({ initialSearchParams }: EventsBrowserProps) {
  const { values, reset } = useUrlFilters(FILTER_DEFAULTS);

  const { data, isLoading, isError, refetch, isFetching } = useEvents({
    page: Number(values.page) || 1,
    limit: FILTER_DEFAULTS.limit,
    search: values.search || undefined,
    category: values.category || undefined,
    city: values.city || undefined,
    sortBy: values.sortBy || "startDate",
    sortOrder: (values.sortOrder as "asc" | "desc") || "asc",
  });

  return (
    <div className="space-y-6">
      <EventFilters
        defaults={{
          search: FILTER_DEFAULTS.search,
          category: FILTER_DEFAULTS.category,
          city: FILTER_DEFAULTS.city,
          sortBy: FILTER_DEFAULTS.sortBy,
          sortOrder: FILTER_DEFAULTS.sortOrder,
        }}
      />

      {isLoading && !data ? (
        <CardGridSkeleton count={9} />
      ) : isError ? (
        <ErrorState
          title="Couldn't load events"
          description="There was a problem reaching the events service. Please try again."
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : data && data.items.length === 0 ? (
        <EmptyState
          icon={CalendarX}
          title="No events match your filters"
          description="Try removing a filter or two, or browse everything."
          action={
            <Button variant="outline" onClick={reset}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <>
          <div
            className={
              isFetching
                ? "opacity-60 transition-opacity duration-200"
                : undefined
            }
          >
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data!.items.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>

          <Pagination meta={data!.pagination} />
        </>
      )}
    </div>
  );
}
