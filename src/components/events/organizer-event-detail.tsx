"use client";

import Link from "next/link";
import { format } from "date-fns";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Rocket,
  XCircle,
  Plus,
  Pencil,
  Users,
  QrCode,
  ListOrdered,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/status-badge";
import { ErrorState } from "@/components/shared/error-state";
import { DetailSkeleton } from "@/components/shared/loading-skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { TicketTierDialog } from "./ticket-tier-dialog";
import { useOrganizerEvent } from "@/hooks/use-organizer-event";
import {
  useUpdateEventStatus,
  useDeleteEvent,
} from "@/hooks/use-event-mutations";
import { ticketTiersApi } from "@/lib/api/ticket-tiers";
import { EVENT_STATUS_COLORS } from "@/lib/constants/status-colors";
import { ROUTES } from "@/lib/constants/routes";

export function OrganizerEventDetail({ eventId }: { eventId: string }) {
  const {
    data: event,
    isLoading,
    isError,
    refetch,
  } = useOrganizerEvent(eventId);
  const updateStatus = useUpdateEventStatus(eventId);
  const deleteEvent = useDeleteEvent(eventId);

  const { data: tiers } = useQuery({
    queryKey: ["ticket-tiers", "list", eventId],
    queryFn: () => ticketTiersApi.listForEvent(eventId),
    enabled: Boolean(eventId),
  });

  if (isLoading) return <DetailSkeleton />;
  if (isError || !event)
    return (
      <ErrorState
        title="Couldn't load event"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
            <Button asChild>
              <Link href={ROUTES.organizerEvents}>Back to events</Link>
            </Button>
          </div>
        }
      />
    );

  const canPublish = event.status === "DRAFT";
  const canCancel =
    event.status === "PUBLISHED" || event.status === "POSTPONED";
  const canDelete = event.status === "DRAFT";

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href={ROUTES.organizerEvents}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to events
        </Link>
      </Button>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{event.title}</h1>
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
          <div className="text-muted-foreground mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {format(new Date(event.startDate), "EEE, MMM d, yyyy · h:mm a")}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {event.venue}, {event.city}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {canPublish ? (
            <ConfirmDialog
              trigger={
                <Button>
                  <Rocket className="mr-2 h-4 w-4" />
                  Publish event
                </Button>
              }
              title="Publish this event?"
              description="Once published, attendees can book tickets. You can still edit until the event starts."
              confirmLabel="Publish"
              onConfirm={() =>
                updateStatus.mutateAsync("PUBLISHED").then(() => undefined)
              }
            />
          ) : null}
          {canCancel ? (
            <ConfirmDialog
              trigger={
                <Button variant="destructive">
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel event
                </Button>
              }
              title="Cancel this event?"
              description="All confirmed bookings will be automatically refunded in full. This cannot be undone."
              confirmLabel="Cancel event"
              variant="destructive"
              onConfirm={() =>
                updateStatus.mutateAsync("CANCELLED").then(() => undefined)
              }
            />
          ) : null}
          {canDelete ? (
            <ConfirmDialog
              trigger={
                <Button variant="ghost" className="text-destructive">
                  Delete
                </Button>
              }
              title="Delete this draft?"
              description="This permanently removes the draft event."
              confirmLabel="Delete"
              variant="destructive"
              onConfirm={() => deleteEvent.mutateAsync().then(() => undefined)}
            />
          ) : null}
        </div>
      </div>

      {/* Quick action tiles */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <QuickAction
          href={ROUTES.organizerEventWaitlist(eventId)}
          icon={ListOrdered}
          label="Waitlist"
          hint="View queued attendees"
        />
        <QuickAction
          href={ROUTES.organizerEventCheckIn(eventId)}
          icon={QrCode}
          label="Check-in"
          hint="Scan booking numbers"
        />
        <QuickAction
          href={ROUTES.organizerEarnings}
          icon={TrendingUp}
          label="Earnings"
          hint="Revenue analytics"
        />
        <QuickAction
          href={ROUTES.eventDetail(eventId)}
          icon={Users}
          label="Public view"
          hint="See the attendee page"
        />
      </div>

      {/* Ticket tiers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Ticket tiers</CardTitle>
            <CardDescription>
              {tiers?.length ?? 0} tier
              {(tiers?.length ?? 0) === 1 ? "" : "s"} configured
            </CardDescription>
          </div>
          <TicketTierDialog eventId={eventId} />
        </CardHeader>
        <CardContent>
          {!tiers || tiers.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No tiers yet. Add your first tier to start selling tickets.
            </p>
          ) : (
            <ul className="divide-y">
              {tiers.map((tier) => (
                <li
                  key={tier.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{tier.name}</p>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      ৳{tier.price.toLocaleString()} · {tier.sold} sold ·{" "}
                      {tier.reserved} reserved · {tier.available} available
                    </p>
                  </div>
                  <TicketTierDialog
                    eventId={eventId}
                    tier={tier}
                    trigger={
                      <Button variant="outline" size="sm">
                        <Pencil className="mr-1 h-3.5 w-3.5" />
                        Edit
                      </Button>
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Description preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
  hint,
}: {
  href: string;
  icon: typeof Users;
  label: string;
  hint: string;
}) {
  return (
    <Link
      href={href}
      className="group bg-card hover:border-primary flex flex-col gap-2 rounded-lg border p-4 transition-all hover:shadow-sm"
    >
      <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-md">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-muted-foreground text-xs">{hint}</p>
      </div>
    </Link>
  );
}
