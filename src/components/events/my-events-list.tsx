"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Plus, CalendarDays, Pencil, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Pagination } from "@/components/shared/pagination";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { useMyEvents } from "@/hooks/use-my-events";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { EVENT_STATUS_COLORS } from "@/lib/constants/status-colors";
import { ROUTES } from "@/lib/constants/routes";
import type { EventStatus } from "@/types/enums";

const FILTER_DEFAULTS = { status: "ALL", page: 1 };

const TABS: Array<{ label: string; value: "ALL" | EventStatus }> = [
  { label: "All", value: "ALL" },
  { label: "Drafts", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Completed", value: "COMPLETED" },
];

export function MyEventsList() {
  const { values, setFilter } = useUrlFilters(FILTER_DEFAULTS);

  const { data, isLoading, isError, refetch } = useMyEvents({
    status:
      values.status && values.status !== "ALL"
        ? (values.status as EventStatus)
        : "DRAFT",
    page: Number(values.page) || 1,
    limit: 10,
  });

  const query = useMyEvents({
    page: Number(values.page) || 1,
    limit: 100,
  });

  const allItems = query.data?.items ?? [];
  const filtered =
    values.status === "ALL"
      ? allItems
      : allItems.filter((e) => e.status === values.status);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            My Events
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage everything you've created.
          </p>
        </div>
        <Button asChild>
          <Link href={ROUTES.organizerNewEvent}>
            <Plus className="mr-2 h-4 w-4" />
            New event
          </Link>
        </Button>
      </div>

      <Tabs
        value={values.status || "ALL"}
        onValueChange={(v) => setFilter({ status: v })}
      >
        <TabsList className="flex w-full flex-wrap justify-start sm:w-auto">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {query.isLoading ? (
        <TableSkeleton rows={6} />
      ) : query.isError ? (
        <ErrorState
          title="Couldn't load your events"
          action={
            <Button variant="outline" onClick={() => query.refetch()}>
              Try again
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No events match this filter"
          description="Create a new event or switch tabs to see others."
          action={
            <Button asChild>
              <Link href={ROUTES.organizerNewEvent}>
                <Plus className="mr-2 h-4 w-4" />
                Create event
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((event) => (
            <Card key={event.id}>
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-base font-semibold">
                      {event.title}
                    </h3>
                    <StatusBadge
                      status={event.status}
                      variant={
                        EVENT_STATUS_COLORS[event.status] as
                          | "success"
                          | "warning"
                          | "default"
                          | "destructive"
                          | "secondary"
                          | "outline"
                      }
                    />
                  </div>
                  <div className="text-muted-foreground mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    <span>
                      {format(new Date(event.startDate), "MMM d, yyyy")}
                    </span>
                    <span>
                      {event.venue} · {event.city}
                    </span>
                    {event.lowestPrice !== null ? (
                      <span>From ৳{event.lowestPrice.toLocaleString()}</span>
                    ) : null}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={ROUTES.eventDetail(event.id)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={ROUTES.organizerEventDetail(event.id)}>
                      <Pencil className="mr-1 h-3.5 w-3.5" />
                      Manage
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
