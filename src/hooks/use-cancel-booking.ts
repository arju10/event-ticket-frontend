"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { bookingsApi } from "@/lib/api/bookings";
import { extractErrorMessage } from "@/lib/api/client";

export function useCancelBooking() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      reason,
    }: {
      bookingId: string;
      reason: string;
    }) => bookingsApi.cancel(bookingId, reason),
    onSuccess: (data, variables) => {
      const policy = data.refundPolicy;
      const amount = data.refundAmount;
      const message =
        policy === "FULL_REFUND"
          ? `Cancelled — full refund of ৳${amount.toLocaleString()}`
          : policy === "PARTIAL_REFUND"
            ? `Cancelled — partial refund of ৳${amount.toLocaleString()}`
            : "Cancelled — no refund per policy";
      toast.success(message);
      qc.invalidateQueries({ queryKey: ["bookings"] });
      qc.invalidateQueries({
        queryKey: ["bookings", "detail", variables.bookingId],
      });
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}
