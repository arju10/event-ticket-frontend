"use client";

import Link from "next/link";
import { ArrowRight, Ticket, CalendarCheck, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatCard } from "./stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { useMyBookings } from "@/hooks/use-my-bookings";
import { useMyWaitlist } from "@/hooks/use-my-waitlist";
import { useCurrentUser } from "@/hooks/use-current-user";
import { BOOKING_STATUS_COLORS } from "@/lib/constants/status-colors";
import { ROUTES } from "@/lib/constants/routes";
import { format } from "date-fns";

export function DashboardOverview() {
  const { user } = useCurrentUser();
  const { data: bookings, isLoading: bookingsLoading } = useMyBookings({
    page: 1,
    limit: 5,
  });
  const { data: waitlist, isLoading: waitlistLoading } = useMyWaitlist();

  const totalBookings = bookings?.pagination.total ?? 0;
  const confirmedCount =
    bookings?.items.filter((b) => b.status === "CONFIRMED").length ?? 0;
  const checkedInCount =
    bookings?.items.filter((b) => b.status === "CHECKED_IN").length ?? 0;
  const waitlistCount = waitlist?.length ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome back, {user?.name?.split(" ")[0] ?? "friend"}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Here's a snapshot of your activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total bookings" value={totalBookings} icon={Ticket} />
        <StatCard
          label="Confirmed"
          value={confirmedCount}
          icon={CalendarCheck}
          accent="success"
        />
        <StatCard
          label="Checked in"
          value={checkedInCount}
          icon={Clock}
          accent="default"
        />
        <StatCard
          label="On waitlist"
          value={waitlistCount}
          icon={Users}
          accent="warning"
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Recent bookings</CardTitle>
            <CardDescription>
              Your latest activity across all events.
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={ROUTES.dashboardBookings}>
              View all <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {bookingsLoading ? (
            <TableSkeleton rows={3} />
          ) : !bookings || bookings.items.length === 0 ? (
            <EmptyState
              icon={Ticket}
              title="No bookings yet"
              description="Browse events and book your first ticket."
              action={
                <Button asChild>
                  <Link href={ROUTES.events}>Browse events</Link>
                </Button>
              }
            />
          ) : (
            <ul className="divide-y">
              {bookings.items.map((booking) => (
                <li
                  key={booking.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      href={ROUTES.dashboardBookingDetail(booking.id)}
                      className="hover:text-primary block truncate text-sm font-medium"
                    >
                      {booking.event?.title ?? "Event"}
                    </Link>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {booking.event
                        ? format(
                            new Date(booking.event.startDate),
                            "MMM d, yyyy",
                          )
                        : "—"}{" "}
                      · {booking.quantity} ×{" "}
                      {booking.ticketTier?.name ?? "ticket"}
                    </p>
                  </div>
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
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {!waitlistLoading && waitlist && waitlist.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Active waitlist entries</CardTitle>
            <CardDescription>
              We'll notify you the moment a ticket frees up.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {waitlist.slice(0, 3).map((entry) => (
                <li key={entry.id} className="py-3 first:pt-0 last:pb-0">
                  <p className="text-sm font-medium">
                    Tier ID {entry.ticketTierId}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {entry.quantity} ticket{entry.quantity === 1 ? "" : "s"} ·
                    joined {format(new Date(entry.createdAt), "MMM d, yyyy")}
                  </p>
                </li>
              ))}
            </ul>
            <Button variant="outline" size="sm" asChild className="mt-4">
              <Link href={ROUTES.dashboardWaitlist}>See all waitlists</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
