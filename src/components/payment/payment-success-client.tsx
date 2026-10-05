"use client";

import Link from "next/link";
import { format } from "date-fns";
import {
  CheckCircle2,
  Loader2,
  AlertCircle,
  ArrowRight,
  Clock,
  Ticket,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useBookingPoll } from "@/hooks/use-booking-poll";
import { ROUTES } from "@/lib/constants/routes";
import { StatusBadge } from "@/components/shared/status-badge";
import { BOOKING_STATUS_COLORS } from "@/lib/constants/status-colors";

interface PaymentSuccessClientProps {
  bookingId: string | null;
}

export function PaymentSuccessClient({ bookingId }: PaymentSuccessClientProps) {
  const { booking, isLoading, isTimedOut, error, refetch } = useBookingPoll({
    bookingId,
  });

  // No bookingId in URL — something went wrong with the redirect
  if (!bookingId) {
    return (
      <ErrorPanel
        title="Missing booking reference"
        message="We couldn't identify which booking this payment was for. If you completed a payment, check your bookings page."
      />
    );
  }

  // Initial loading (before first response)
  if (isLoading && !booking) {
    return (
      <div className="text-center">
        <div className="bg-primary/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Confirming your payment
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          This usually takes a few seconds. Please don't close this page.
        </p>
      </div>
    );
  }

  // Error fetching status
  if (error && !booking) {
    return (
      <ErrorPanel
        title="Couldn't load your booking"
        message={error}
        onRetry={refetch}
      />
    );
  }

  if (!booking) return null;

  // Payment pending but polling timed out
  if (booking.status === "PENDING" && isTimedOut) {
    return <PendingPanel booking={booking} onRefresh={refetch} />;
  }

  // Still polling
  if (booking.status === "PENDING") {
    return (
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Waiting for payment confirmation
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Your payment is being processed by Stripe. This can take up to a
          minute.
        </p>
        <div className="bg-card mt-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
          <span className="relative flex h-2 w-2">
            <span className="bg-primary/70 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
            <span className="bg-primary relative inline-flex h-2 w-2 rounded-full" />
          </span>
          Checking booking status...
        </div>
      </div>
    );
  }

  // Confirmed
  if (booking.status === "CONFIRMED" || booking.status === "CHECKED_IN") {
    return <ConfirmedPanel booking={booking} />;
  }

  // Cancelled / expired / refunded
  return (
    <div className="text-center">
      <div className="bg-destructive/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
        <AlertCircle className="text-destructive h-8 w-8" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">
        Booking not confirmed
      </h1>
      <p className="text-muted-foreground mt-2 text-sm">
        This booking is currently{" "}
        <span className="font-medium">
          {booking.status.replace(/_/g, " ").toLowerCase()}
        </span>
        . If you believe this is a mistake, contact support.
      </p>
      <div className="mt-6 flex justify-center gap-2">
        <Button asChild>
          <Link href={ROUTES.dashboardBookings}>My bookings</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={ROUTES.events}>Browse events</Link>
        </Button>
      </div>
    </div>
  );
}

// ─────────────── Sub-panels ───────────────

function ConfirmedPanel({
  booking,
}: {
  booking: import("@/types/models").Booking;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Payment successful
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Your tickets are confirmed and we've sent a confirmation to your
          account.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-base">
                {booking.event?.title ?? "Your booking"}
              </CardTitle>
              <CardDescription>
                {booking.ticketTier?.name ?? "Ticket"}
              </CardDescription>
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
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/30 rounded-lg border border-dashed p-4">
            <p className="text-muted-foreground text-xs uppercase">
              Booking reference
            </p>
            <p className="mt-1 font-mono text-lg font-semibold">
              {booking.bookingNumber}
            </p>
            <p className="text-muted-foreground mt-2 text-xs">
              Show this at the door for check-in.
            </p>
          </div>

          <dl className="space-y-2 text-sm">
            <Row
              label="Quantity"
              value={`${booking.quantity} ticket${booking.quantity === 1 ? "" : "s"}`}
            />
            {booking.event ? (
              <Row
                label="Venue"
                value={`${booking.event.venue} · ${format(new Date(booking.event.startDate), "MMM d, yyyy · h:mm a")}`}
              />
            ) : null}
            <Row
              label="Total paid"
              value={`৳${booking.finalAmount.toLocaleString()}`}
            />
          </dl>

          <Separator />

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild className="flex-1">
              <Link href={ROUTES.dashboardBookingDetail(booking.id)}>
                <Ticket className="mr-2 h-4 w-4" />
                View ticket
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href={ROUTES.dashboardBookings}>
                My bookings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <p className="text-muted-foreground flex items-center justify-center gap-2 pt-2 text-xs">
            <Mail className="h-3 w-3" />A confirmation is available in your
            notifications.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function PendingPanel({
  booking,
  onRefresh,
}: {
  booking: import("@/types/models").Booking;
  onRefresh: () => Promise<void>;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
        <Clock className="h-8 w-8 text-amber-500" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">
        Payment still processing
      </h1>
      <p className="text-muted-foreground mt-2 text-sm">
        We haven't received Stripe's confirmation yet. If you completed the
        payment, it should appear here shortly.
      </p>
      <div className="mt-6 flex justify-center gap-2">
        <Button onClick={() => void onRefresh()}>Check again</Button>
        <Button variant="outline" asChild>
          <Link href={ROUTES.dashboardBookings}>My bookings</Link>
        </Button>
      </div>
      <p className="text-muted-foreground mt-6 text-xs">
        Booking reference:{" "}
        <span className="font-mono">{booking.bookingNumber}</span>
      </p>
    </div>
  );
}

function ErrorPanel({
  title,
  message,
  onRetry,
}: {
  title: string;
  message: string;
  onRetry?: () => Promise<void>;
}) {
  return (
    <div className="text-center">
      <div className="bg-destructive/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
        <AlertCircle className="text-destructive h-8 w-8" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="text-muted-foreground mt-2 text-sm">{message}</p>
      <div className="mt-6 flex justify-center gap-2">
        {onRetry ? (
          <Button onClick={() => void onRetry()}>Try again</Button>
        ) : null}
        <Button variant={onRetry ? "outline" : "default"} asChild>
          <Link href={ROUTES.dashboardBookings}>Go to my bookings</Link>
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
