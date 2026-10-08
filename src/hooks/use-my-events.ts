"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { eventsApi, type EventListParams } from "@/lib/api/events";
import type { EventStatus } from "@/types/enums";

export function useMyEvents(params: EventListParams = {}) {
  return useQuery({
    queryKey: ["events", "mine", params],
    queryFn: () => eventsApi.list(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
