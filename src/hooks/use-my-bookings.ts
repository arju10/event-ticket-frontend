"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { bookingsApi } from "@/lib/api/bookings";
import type { BookingStatus } from "@/types/enums";

export function useMyBookings(params: {
  status?: BookingStatus;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["bookings", "mine", params],
    queryFn: () => bookingsApi.listMine(params),
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  });
}
