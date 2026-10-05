"use client";

import { useQuery } from "@tanstack/react-query";
import { eventsApi } from "@/lib/api/events";

export function useFeaturedEvents(limit = 6) {
  return useQuery({
    queryKey: ["events", "featured", limit],
    queryFn: () =>
      eventsApi.list({
        page: 1,
        limit,
        sortBy: "startDate",
        sortOrder: "asc",
        status: "PUBLISHED",
      }),
    staleTime: 60_000,
  });
}
