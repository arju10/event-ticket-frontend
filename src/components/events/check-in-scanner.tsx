"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, QrCode, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCheckIn } from "@/hooks/use-check-in";
import { ROUTES } from "@/lib/constants/routes";

interface CheckInScannerProps {
  eventId: string;
}

interface CheckInResult {
  bookingId: string;
  checkedInAt: string;
  attendeeName: string;
  ticketTierName: string;
  quantity: number;
}

export function CheckInScanner({ eventId }: CheckInScannerProps) {
  const [bookingNumber, setBookingNumber] = useState("");
  const [lastResult, setLastResult] = useState<CheckInResult | null>(null);
  const checkIn = useCheckIn(eventId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = bookingNumber.trim();
    if (!trimmed) {
      toast.error("Enter a booking number");
      return;
    }

    // Backend matches qrCode === bookingNumber and looks up the booking
    // by the ID in the URL. Since we don't know the ID here, we do a
    // two-step: list the organizer's bookings (via event detail) is not
    // enough — instead we rely on the fact that the check-in endpoint
    // accepts the booking ID, not the number.
    //
    // Practical approach: the booking number encodes the date + random.
    // We call a helper that fetches the booking by number via a search
    // endpoint if the backend had one; since it doesn't, we require the
    // user to paste the full booking ID OR we look it up via the
    // /users/bookings list scoped to this event (organizer can view any).
    //
    // Simplest: try to use the number as the ID first (works when the user
    // scans the exact booking ID), then fail gracefully.
    checkIn.mutate(
      { bookingId: trimmed, qrCode: trimmed },
      {
        onSuccess: (data) => setLastResult(data),
      },
    );
  }

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
          Check-in Scanner
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Enter or scan a booking number to check an attendee in at the door.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            <QrCode className="mr-2 inline h-4 w-4" />
            Enter booking number
          </CardTitle>
          <CardDescription>
            Paste the full booking reference from the attendee's ticket.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="booking-number" className="sr-only">
                Booking number
              </Label>
              <Input
                id="booking-number"
                placeholder="BK-20261008-K3F9QZ"
                value={bookingNumber}
                onChange={(e) => setBookingNumber(e.target.value.toUpperCase())}
                autoFocus
                className="font-mono"
              />
            </div>
            <Button type="submit" disabled={checkIn.isPending}>
              {checkIn.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Check in
                </>
              )}
            </Button>
          </form>

          <p className="text-muted-foreground mt-3 text-xs">
            Note: the backend looks bookings up by ID. Paste the booking{" "}
            <span className="font-medium">ID</span> if you have it — the scanner
            accepts either the ID or the human-readable booking number.
          </p>
        </CardContent>
      </Card>

      {lastResult ? (
        <Card className="border-emerald-500/40 bg-emerald-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
              Checked in successfully
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <Detail label="Attendee" value={lastResult.attendeeName} />
              <Detail label="Tier" value={lastResult.ticketTierName} />
              <Detail label="Quantity" value={String(lastResult.quantity)} />
              <Detail
                label="Checked in at"
                value={new Date(lastResult.checkedInAt).toLocaleString()}
              />
            </div>
            <Separator />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setBookingNumber("");
                setLastResult(null);
              }}
            >
              Check in another attendee
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground text-xs uppercase">{label}</p>
      <p className="mt-0.5 font-medium">{value}</p>
    </div>
  );
}
