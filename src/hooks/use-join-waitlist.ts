"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { waitlistApi } from "@/lib/api/waitlist";
import { extractErrorMessage } from "@/lib/api/client";

export function useJoinWaitlist(eventId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      ticketTierId,
      quantity,
    }: {
      ticketTierId: string;
      quantity: number;
    }) => waitlistApi.join(eventId, ticketTierId, quantity),
    onSuccess: (data) => {
      toast.success(
        `You're on the waitlist — position #${data.position}. We'll notify you when a spot opens up.`,
      );
      qc.invalidateQueries({ queryKey: ["waitlist", "mine"] });
      qc.invalidateQueries({ queryKey: ["events", "detail", eventId] });
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}
