"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { reviewsApi } from "@/lib/api/reviews";

export function useEventReviews(
  eventId: string,
  params: { page?: number; limit?: number; rating?: number } = {},
) {
  return useQuery({
    queryKey: ["reviews", eventId, params],
    queryFn: () => reviewsApi.listForEvent(eventId, params),
    placeholderData: keepPreviousData,
    enabled: Boolean(eventId),
    staleTime: 30_000,
  });
}
