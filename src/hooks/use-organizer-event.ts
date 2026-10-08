"use client";

import { useQuery } from "@tanstack/react-query";
import { eventsApi } from "@/lib/api/events";

export function useOrganizerEvent(id: string) {
  return useQuery({
    queryKey: ["events", "detail", id],
    queryFn: () => eventsApi.detail(id),
    enabled: Boolean(id),
    staleTime: 30_000,
  });
}
