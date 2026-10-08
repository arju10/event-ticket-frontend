"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ticketTiersApi, type CreateTierPayload } from "@/lib/api/ticket-tiers";
import { extractErrorMessage } from "@/lib/api/client";

export function useCreateTicketTier(eventId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTierPayload) =>
      ticketTiersApi.create(eventId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ticket-tiers", "list", eventId] });
      qc.invalidateQueries({ queryKey: ["events", "detail", eventId] });
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}

export function useUpdateTicketTier(eventId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      tierId,
      payload,
    }: {
      tierId: string;
      payload: Partial<CreateTierPayload> & { status?: string };
    }) => ticketTiersApi.update(tierId, payload),
    onSuccess: () => {
      toast.success("Tier updated");
      qc.invalidateQueries({ queryKey: ["ticket-tiers", "list", eventId] });
      qc.invalidateQueries({ queryKey: ["events", "detail", eventId] });
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}
