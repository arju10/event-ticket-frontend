"use client";

import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Ticket,
  QrCode,
  XCircle,
  Star,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { ErrorState } from "@/components/shared/error-state";
import { CancelBookingDialog } from "./cancel-booking-dialog";
import { LeaveReviewDialog } from "./leave-review-dialog";
import { useBookingDetail } from "@/hooks/use-booking-detail";
import { BOOKING_STATUS_COLORS } from "@/lib/constants/status-colors";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";

export function BookingDetailClient({ bookingId }: { bookingId: string }) {
  const {
    data: booking,
    isLoading,
    isError,
    refetch,
  } = useBookingDetail(bookingId);

  if (isLoading) return <BookingDetailSkeleton />;
  if (isError || !booking)
    return (
      <ErrorState
        title="Couldn't load booking"
        description="This booking may have been removed, or you may not have access to it."
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
            <Button asChild>
              <Link href={ROUTES.dashboardBookings}>Back to bookings</Link>
            </Button>
          </div>
        }
      />
    );

  const canCancel =
    booking.status === "PENDING" || booking.status === "CONFIRMED";
  const canReview = booking.status === "CHECKED_IN";

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href={ROUTES.dashboardBookings}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to bookings
        </Link>
      </Button>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {booking.event?.title ?? "Booking"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Reference <span className="font-mono">{booking.bookingNumber}</span>
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
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Left: ticket + details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your ticket</CardTitle>
              <CardDescription>
                Show this at the door for check-in.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="bg-muted/30 mx-auto flex max-w-[260px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center">
                <QrCode className="text-muted-foreground/60 mb-3 h-16 w-16" />
                <p className="text-muted-foreground text-xs uppercase">
                  Booking number
                </p>
                <p className="mt-1 font-mono text-sm font-semibold break-all">
                  {booking.bookingNumber}
                </p>
              </div>

              <Separator />

              <dl className="space-y-3 text-sm">
                <Row label="Tier" value={booking.ticketTier?.name ?? "—"} />
                <Row
                  label="Quantity"
                  value={`${booking.quantity} ticket${booking.quantity === 1 ? "" : "s"}`}
                />
                <Row
                  label="Unit price"
                  value={`৳${booking.unitPrice.toLocaleString()}`}
                />
                {booking.discountAmount > 0 ? (
                  <Row
                    label="Discount"
                    value={`-৳${booking.discountAmount.toLocaleString()}`}
                    valueClassName="text-emerald-600 dark:text-emerald-500"
                  />
                ) : null}
                <Row
                  label="Total paid"
                  value={`৳${booking.finalAmount.toLocaleString()}`}
                  valueClassName="font-semibold"
                />
              </dl>
            </CardContent>
          </Card>

          {booking.event ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Event details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Calendar className="text-muted-foreground mt-0.5 h-4 w-4" />
                  <div>
                    <p className="font-medium">
                      {format(
                        new Date(booking.event.startDate),
                        "EEEE, MMMM d, yyyy",
                      )}
                    </p>
                    <p className="text-muted-foreground">
                      {format(new Date(booking.event.startDate), "h:mm a")} –{" "}
                      {format(new Date(booking.event.endDate), "h:mm a")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-muted-foreground mt-0.5 h-4 w-4" />
                  <p>{booking.event.venue}</p>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>

        {/* Right: actions + payment */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {canReview ? (
                <LeaveReviewDialog
                  bookingId={booking.id}
                  eventId={booking.eventId}
                />
              ) : null}
              {canCancel ? (
                <CancelBookingDialog bookingId={booking.id} />
              ) : null}
              {booking.status === "PENDING" && booking.expiresAt ? (
                <p className="text-muted-foreground pt-2 text-xs">
                  This booking expires{" "}
                  {format(new Date(booking.expiresAt), "MMM d · h:mm a")} if
                  payment isn't completed.
                </p>
              ) : null}
              {booking.cancellationReason ? (
                <p className="text-muted-foreground pt-2 text-xs">
                  <span className="font-medium">Cancellation reason:</span>{" "}
                  {booking.cancellationReason}
                </p>
              ) : null}
            </CardContent>
          </Card>

          {booking.payment ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Row label="Method" value={booking.payment.method} />
                <Row label="Status" value={booking.payment.status} />
                {booking.payment.transactionId ? (
                  <Row
                    label="Txn ID"
                    value={booking.payment.transactionId}
                    valueClassName="font-mono text-xs"
                  />
                ) : null}
                {booking.refundAmount ? (
                  <Row
                    label="Refunded"
                    value={`৳${booking.refundAmount.toLocaleString()}`}
                  />
                ) : null}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn("text-right", valueClassName)}>{value}</dd>
    </div>
  );
}

function BookingDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-10 w-2/3" />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Skeleton className="h-80 w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
