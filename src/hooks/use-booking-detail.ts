"use client";

import { useQuery } from "@tanstack/react-query";
import { bookingsApi } from "@/lib/api/bookings";

export function useBookingDetail(id: string) {
  return useQuery({
    queryKey: ["bookings", "detail", id],
    queryFn: () => bookingsApi.detail(id),
    enabled: Boolean(id),
    staleTime: 15_000,
  });
}
