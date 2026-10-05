"use client";

import { useQuery } from "@tanstack/react-query";
import { eventsApi } from "@/lib/api/events";
import { ticketTiersApi } from "@/lib/api/ticket-tiers";

export function useEventDetail(id: string) {
  return useQuery({
    queryKey: ["events", "detail", id],
    queryFn: () => eventsApi.detail(id),
    enabled: Boolean(id),
    staleTime: 60_000,
  });
}

export function useTicketTiers(eventId: string) {
  return useQuery({
    queryKey: ["ticket-tiers", "list", eventId],
    queryFn: () => ticketTiersApi.listForEvent(eventId),
    enabled: Boolean(eventId),
    staleTime: 60_000,
  });
}
