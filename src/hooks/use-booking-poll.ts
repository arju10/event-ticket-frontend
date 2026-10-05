"use client";

import { useEffect, useRef, useState } from "react";
import { bookingsApi } from "@/lib/api/bookings";
import type { Booking } from "@/types/models";
import type { BookingStatus } from "@/types/enums";

interface UseBookingPollOptions {
  bookingId: string | null;
  /** Max milliseconds to keep polling. Default 2 minutes. */
  timeoutMs?: number;
  /** Poll interval. Default 2s. */
  intervalMs?: number;
}

interface UseBookingPollResult {
  booking: Booking | null;
  isLoading: boolean;
  isPolling: boolean;
  isTimedOut: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const TERMINAL_STATUSES: BookingStatus[] = [
  "CONFIRMED",
  "CANCELLED",
  "EXPIRED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
];

export function useBookingPoll({
  bookingId,
  timeoutMs = 2 * 60 * 1000,
  intervalMs = 2000,
}: UseBookingPollOptions): UseBookingPollResult {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startedAtRef = useRef<number>(Date.now());
  const stoppedRef = useRef(false);

  async function fetchOnce() {
    if (!bookingId) return;
    try {
      const data = await bookingsApi.detail(bookingId);
      setBooking(data);
      setError(null);
      if (TERMINAL_STATUSES.includes(data.status)) {
        stoppedRef.current = true;
        setIsPolling(false);
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Could not check booking status";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!bookingId) return;

    stoppedRef.current = false;
    startedAtRef.current = Date.now();
    setIsTimedOut(false);
    setBooking(null);
    setError(null);
    setIsLoading(true);

    // Initial fetch
    void fetchOnce();

    const timer = setInterval(() => {
      if (stoppedRef.current) {
        clearInterval(timer);
        return;
      }
      if (Date.now() - startedAtRef.current > timeoutMs) {
        stoppedRef.current = true;
        clearInterval(timer);
        setIsPolling(false);
        setIsTimedOut(true);
        return;
      }
      setIsPolling(true);
      void fetchOnce();
    }, intervalMs);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId, intervalMs, timeoutMs]);

  return {
    booking,
    isLoading,
    isPolling,
    isTimedOut,
    error,
    refetch: fetchOnce,
  };
}
