"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { XCircle, RotateCcw, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bookingsApi } from "@/lib/api/bookings";
import { ROUTES } from "@/lib/constants/routes";
import type { Booking } from "@/types/models";

interface PaymentCancelClientProps {
  bookingId: string | null;
}

export function PaymentCancelClient({ bookingId }: PaymentCancelClientProps) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);

  // Best-effort: fetch the event ID so we can offer a "try again" button
  // that lands the user back on the event detail page.
  useEffect(() => {
    if (!bookingId) return;
    let cancelled = false;
    setLoading(true);
    bookingsApi
      .detail(bookingId)
      .then((b) => {
        if (!cancelled) setBooking(b);
      })
      .catch(() => {
        // Ignore — booking may have already expired and been cleaned up.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  const eventId = booking?.eventId ?? booking?.event?.id ?? null;

  return (
    <div className="text-center">
      <div className="bg-muted mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
        <XCircle className="text-muted-foreground h-8 w-8" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">
        Payment cancelled
      </h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Your payment wasn't completed, so nothing was charged. Your booking is
        still pending — you can retry before the hold expires (15 minutes).
      </p>

      {loading ? (
        <div className="text-muted-foreground mt-6 flex items-center justify-center gap-2 text-xs">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Checking your booking...
        </div>
      ) : null}

      <div className="mt-8 flex flex-col items-center justify-center gap-2 sm:flex-row">
        {eventId ? (
          <Button asChild className="w-full sm:w-auto">
            <Link href={ROUTES.eventDetail(eventId)}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Try again
            </Link>
          </Button>
        ) : null}
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link href={ROUTES.dashboardBookings}>
            My bookings
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {booking ? (
        <p className="text-muted-foreground mt-8 text-xs">
          Booking reference:{" "}
          <span className="font-mono">{booking.bookingNumber}</span>
        </p>
      ) : null}
    </div>
  );
}
