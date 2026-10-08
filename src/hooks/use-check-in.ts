"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { bookingsApi } from "@/lib/api/bookings";
import { extractErrorMessage } from "@/lib/api/client";

interface CheckInVariables {
  bookingId: string;
  qrCode: string;
}

export function useCheckIn(eventId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, qrCode }: CheckInVariables) =>
      bookingsApi.checkIn(bookingId, qrCode),
    onSuccess: (data) => {
      toast.success(
        `Checked in ${data.attendeeName} · ${data.ticketTierName} × ${data.quantity}`,
      );
      qc.invalidateQueries({ queryKey: ["events", "detail", eventId] });
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}
