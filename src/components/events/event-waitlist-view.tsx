"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { DataTable, type Column } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { useEventWaitlist } from "@/hooks/use-event-waitlist";
import { WAITLIST_STATUS_COLORS } from "@/lib/constants/status-colors";
import { ROUTES } from "@/lib/constants/routes";
import type { WaitlistEntry } from "@/types/models";

export function EventWaitlistView({ eventId }: { eventId: string }) {
  const { data, isLoading, isError, refetch } = useEventWaitlist(eventId);

  if (isLoading) return <TableSkeleton rows={6} />;
  if (isError)
    return (
      <ErrorState
        title="Couldn't load waitlist"
        action={
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        }
      />
    );

  const items = data?.items ?? [];

  const columns: Column<WaitlistEntry>[] = [
    {
      key: "position",
      header: "#",
      className: "w-12",
      render: (row) => (
        <span className="text-muted-foreground text-xs">
          {row.position ?? "—"}
        </span>
      ),
    },
    {
      key: "user",
      header: "Attendee",
      render: (row) => (
        <div>
          <p className="text-sm font-medium">{row.user?.name ?? "—"}</p>
          <p className="text-muted-foreground text-xs">
            {row.user?.email ?? ""}
          </p>
        </div>
      ),
    },
    {
      key: "quantity",
      header: "Qty",
      render: (row) => <span className="text-sm">{row.quantity}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <StatusBadge
          status={row.status}
          variant={
            WAITLIST_STATUS_COLORS[row.status] as
              | "success"
              | "warning"
              | "default"
              | "destructive"
              | "secondary"
              | "outline"
          }
        />
      ),
    },
    {
      key: "joined",
      header: "Joined",
      render: (row) => (
        <span className="text-muted-foreground text-xs">
          {format(new Date(row.createdAt), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      key: "offer",
      header: "Offer expires",
      render: (row) =>
        row.offerExpiresAt ? (
          <span className="text-xs">
            {format(new Date(row.offerExpiresAt), "MMM d · h:mm a")}
          </span>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href={ROUTES.organizerEventDetail(eventId)}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to event
        </Link>
      </Button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Waitlist
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Attendees queued for sold-out tiers. Offers cascade automatically.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {items.length} entr{items.length === 1 ? "y" : "ies"}
          </CardTitle>
          <CardDescription>
            Ordered by join time — the oldest is offered the next freed slot.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            rows={items}
            rowKey={(row) => row.id}
            emptyState={
              <EmptyState
                icon={ListOrdered}
                title="No one is on the waitlist"
                description="When a tier sells out, attendees can join its waitlist from the public event page."
              />
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
