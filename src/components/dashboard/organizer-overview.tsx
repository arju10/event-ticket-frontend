"use client";

import Link from "next/link";
import { format } from "date-fns";
import {
  CalendarDays,
  Ticket,
  TrendingUp,
  Users,
  Plus,
  ArrowRight,
  BarChart3,
} from "lucide-react";
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
import { useMyEvents } from "@/hooks/use-my-events";
import { useCurrentUser } from "@/hooks/use-current-user";
import { EVENT_STATUS_COLORS } from "@/lib/constants/status-colors";
import { ROUTES } from "@/lib/constants/routes";

export function OrganizerOverview() {
  const { user } = useCurrentUser();
  const { data, isLoading } = useMyEvents({ page: 1, limit: 5 });

  const totalEvents = data?.pagination.total ?? 0;
  const publishedCount =
    data?.items.filter((e) => e.status === "PUBLISHED").length ?? 0;
  const draftCount =
    data?.items.filter((e) => e.status === "DRAFT").length ?? 0;

  // Rough estimate: lowest price × 50 as placeholder if no bookings data.
  // Real analytics live in /organizer/earnings.
  const totalEstimatedRevenue =
    data?.items.reduce(
      (sum, e) => sum + (e.lowestPrice ? e.lowestPrice * 5 : 0),
      0,
    ) ?? 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome, {user?.name?.split(" ")[0] ?? "Organizer"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Here's how your events are doing.
          </p>
        </div>
        <Button asChild>
          <Link href={ROUTES.organizerNewEvent}>
            <Plus className="mr-2 h-4 w-4" />
            New event
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total events"
          value={totalEvents}
          icon={CalendarDays}
        />
        <StatCard
          label="Published"
          value={publishedCount}
          icon={TrendingUp}
          accent="success"
        />
        <StatCard
          label="Drafts"
          value={draftCount}
          icon={Ticket}
          accent="warning"
        />
        <StatCard
          label="Est. revenue"
          value={`৳${totalEstimatedRevenue.toLocaleString()}`}
          icon={BarChart3}
          hint="Sum across your top events"
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Recent events</CardTitle>
            <CardDescription>Your latest 5 events.</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={ROUTES.organizerEvents}>
              View all <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton rows={3} />
          ) : !data || data.items.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No events yet"
              description="Create your first event to get started."
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
            <ul className="divide-y">
              {data.items.map((event) => (
                <li
                  key={event.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      href={ROUTES.organizerEventDetail(event.id)}
                      className="hover:text-primary block truncate text-sm font-medium"
                    >
                      {event.title}
                    </Link>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {format(new Date(event.startDate), "MMM d, yyyy")} ·{" "}
                      {event.venue}
                    </p>
                  </div>
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
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
