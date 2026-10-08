"use client";

import { useQuery } from "@tanstack/react-query";
import { waitlistApi } from "@/lib/api/waitlist";

export function useEventWaitlist(eventId: string) {
  return useQuery({
    queryKey: ["waitlist", "event", eventId],
    queryFn: () => waitlistApi.forEvent(eventId),
    enabled: Boolean(eventId),
    staleTime: 30_000,
  });
}
