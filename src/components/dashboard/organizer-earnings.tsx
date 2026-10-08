"use client";

import { TrendingUp, DollarSign, Ticket, Users } from "lucide-react";
import { StatCard } from "./stat-card";
import { RevenueChart } from "./revenue-chart";
import { TopEventsChart } from "./top-events-chart";
import { StatusPieChart } from "./status-pie-chart";
import { ErrorState } from "@/components/shared/error-state";
import { StatCardsSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganizerStats } from "@/hooks/use-organizer-stats";

export function OrganizerEarnings() {
  const { data, isLoading, isError, refetch } = useOrganizerStats();

  if (isLoading)
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-52" />
        <StatCardsSkeleton count={4} />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[340px] w-full rounded-xl" />
          <Skeleton className="h-[340px] w-full rounded-xl" />
        </div>
      </div>
    );

  if (isError || !data)
    return (
      <ErrorState
        title="Couldn't load earnings"
        description="There was a problem loading your analytics."
        action={
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        }
      />
    );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Earnings
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Revenue and bookings across all your events.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total revenue"
          value={`৳${data.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          accent="success"
          hint="Estimated from confirmed bookings"
        />
        <StatCard
          label="Total bookings"
          value={data.totalBookings}
          icon={Ticket}
        />
        <StatCard
          label="Confirmed"
          value={data.confirmedBookings}
          icon={Users}
          accent="success"
        />
        <StatCard
          label="Top event"
          value={data.topEvents[0]?.title.slice(0, 20) ?? "—"}
          icon={TrendingUp}
          hint={
            data.topEvents[0]
              ? `৳${data.topEvents[0].revenue.toLocaleString()}`
              : "No events yet"
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart data={data.revenueByDay} />
        <TopEventsChart data={data.topEvents} />
      </div>

      <StatusPieChart data={data.bookingsByStatus} />
    </div>
  );
}
