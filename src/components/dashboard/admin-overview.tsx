"use client";

import {
  Users,
  CalendarDays,
  Ticket,
  DollarSign,
  TrendingUp,
  Percent,
  Activity,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatCard } from "./stat-card";
import { RevenueChart } from "./revenue-chart";
import { CategoryPieChart } from "./category-pie-chart";
import { ErrorState } from "@/components/shared/error-state";
import { StatCardsSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminStats } from "@/hooks/use-admin-stats";
import { format } from "date-fns";

export function AdminOverview() {
  const { data, isLoading, isError, refetch } = useAdminStats();

  if (isLoading)
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-52" />
        <StatCardsSkeleton count={4} />
        <StatCardsSkeleton count={3} />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[340px] w-full rounded-xl" />
          <Skeleton className="h-[340px] w-full rounded-xl" />
        </div>
      </div>
    );

  if (isError || !data)
    return (
      <ErrorState
        title="Couldn't load dashboard stats"
        description="There was a problem fetching platform statistics."
        action={
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        }
      />
    );

  const { overview, recentActivity, platformHealth, popularCategories } = data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Platform Overview
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Everything happening on EventHub, at a glance.
        </p>
      </div>

      {/* Primary stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total users"
          value={overview.totalUsers.toLocaleString()}
          icon={Users}
          hint={`${overview.totalOrganizers} organizers`}
        />
        <StatCard
          label="Total events"
          value={overview.totalEvents.toLocaleString()}
          icon={CalendarDays}
        />
        <StatCard
          label="Total bookings"
          value={overview.totalBookings.toLocaleString()}
          icon={Ticket}
        />
        <StatCard
          label="Total revenue"
          value={`৳${overview.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          accent="success"
          hint={`৳${overview.totalRefunds.toLocaleString()} refunded`}
        />
      </div>

      {/* Platform health */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Conversion rate"
          value={`${platformHealth.conversionRate}%`}
          icon={TrendingUp}
          hint="Bookings in last 30 days"
          accent="default"
        />
        <StatCard
          label="Refund rate"
          value={`${platformHealth.refundRate}%`}
          icon={Percent}
          accent={platformHealth.refundRate > 10 ? "warning" : "success"}
          hint="Refunds ÷ gross revenue"
        />
        <StatCard
          label="Active users"
          value={platformHealth.activeUsers.toLocaleString()}
          icon={Activity}
          hint="Non-deleted accounts"
        />
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Today's activity</CardTitle>
          <CardDescription>
            Updates since {format(new Date(), "MMMM d, yyyy")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <ActivityTile
              label="New users"
              value={recentActivity.newUsersToday}
            />
            <ActivityTile
              label="New events"
              value={recentActivity.newEventsToday}
            />
            <ActivityTile
              label="New bookings"
              value={recentActivity.newBookingsToday}
            />
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart
          data={popularCategories.map((c, i) => ({
            date: new Date(
              Date.now() - (popularCategories.length - i) * 86400000,
            )
              .toISOString()
              .slice(0, 10),
            revenue: c.count * 1000,
            bookings: c.count,
          }))}
        />
        <CategoryPieChart data={popularCategories} />
      </div>
    </div>
  );
}

function ActivityTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-muted/30 rounded-lg border p-4">
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold">+{value}</p>
    </div>
  );
}
