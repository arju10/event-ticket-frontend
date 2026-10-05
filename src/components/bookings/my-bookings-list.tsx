"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Ticket, ArrowRight, CalendarX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Pagination } from "@/components/shared/pagination";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { useMyBookings } from "@/hooks/use-my-bookings";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { BOOKING_STATUS_COLORS } from "@/lib/constants/status-colors";
import { ROUTES } from "@/lib/constants/routes";
import type { BookingStatus } from "@/types/enums";

const FILTER_DEFAULTS = { status: "ALL", page: 1 };

const TABS: Array<{ label: string; value: "ALL" | BookingStatus }> = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Checked in", value: "CHECKED_IN" },
  { label: "Cancelled", value: "CANCELLED" },
];

export function MyBookingsList() {
  const { values, setFilter } = useUrlFilters(FILTER_DEFAULTS);

  const { data, isLoading, isError, refetch } = useMyBookings({
    status:
      values.status && values.status !== "ALL"
        ? (values.status as BookingStatus)
        : undefined,
    page: Number(values.page) || 1,
    limit: 10,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          My Bookings
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Every ticket you've booked, across all events.
        </p>
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

      {isLoading && !data ? (
        <TableSkeleton rows={6} />
      ) : isError ? (
        <ErrorState
          title="Couldn't load your bookings"
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : !data || data.items.length === 0 ? (
        <EmptyState
          icon={CalendarX}
          title="No bookings match this filter"
          description="When you book tickets, they'll appear here."
          action={
            <Button asChild>
              <Link href={ROUTES.events}>Browse events</Link>
            </Button>
          }
        />
      ) : (
        <>
          <div className="space-y-3">
            {data.items.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-base font-semibold">
                        {booking.event?.title ?? "Event"}
                      </h3>
                      <StatusBadge
                        status={booking.status}
                        variant={
                          BOOKING_STATUS_COLORS[booking.status] as
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
                      <span className="font-mono">{booking.bookingNumber}</span>
                      {booking.event ? (
                        <span>
                          {format(
                            new Date(booking.event.startDate),
                            "MMM d, yyyy · h:mm a",
                          )}
                        </span>
                      ) : null}
                      <span>
                        {booking.quantity} ×{" "}
                        {booking.ticketTier?.name ?? "ticket"}
                      </span>
                      <span className="text-foreground font-medium">
                        ৳{booking.finalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={ROUTES.dashboardBookingDetail(booking.id)}>
                      View <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Pagination meta={data.pagination} />
        </>
      )}
    </div>
  );
}
