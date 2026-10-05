"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { bookingsApi, type CreateBookingPayload } from "@/lib/api/bookings";
import { extractErrorMessage, extractFieldErrors } from "@/lib/api/client";

export function useBookingMutation(eventId: string) {
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) =>
      bookingsApi.create(eventId, payload),
    onSuccess: (data) => {
      toast.success("Booking created — redirecting to payment...");
      qc.invalidateQueries({ queryKey: ["events", "detail", eventId] });
      qc.invalidateQueries({ queryKey: ["ticket-tiers", "list", eventId] });

      // The backend returns a Stripe Checkout URL (or a dev mock-confirm URL).
      // Redirect the user there to complete payment.
      if (data.payment?.paymentUrl) {
        window.location.href = data.payment.paymentUrl;
      } else {
        router.push(`/payment/success?bookingId=${data.booking.id}`);
      }
    },
    onError: (err) => {
      const fieldErrors = extractFieldErrors(err);
      if (fieldErrors && Object.keys(fieldErrors).length > 0) {
        const first = Object.values(fieldErrors)[0];
        toast.error(first ?? "Could not complete booking");
      } else {
        toast.error(extractErrorMessage(err));
      }
    },
  });
}
