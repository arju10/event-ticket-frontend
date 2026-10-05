"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { eventsApi, type EventListParams } from "@/lib/api/events";

export function useEvents(params: EventListParams) {
  return useQuery({
    queryKey: ["events", "list", params],
    queryFn: () => eventsApi.list(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
