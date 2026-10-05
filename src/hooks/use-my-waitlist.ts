"use client";

import { useQuery } from "@tanstack/react-query";
import { waitlistApi } from "@/lib/api/waitlist";

export function useMyWaitlist() {
  return useQuery({
    queryKey: ["waitlist", "mine"],
    queryFn: () => waitlistApi.mine(),
    staleTime: 30_000,
  });
}
