"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { notificationsApi } from "@/lib/api/notifications";

export function useNotifications(params: {
  page?: number;
  limit?: number;
  isRead?: boolean;
}) {
  return useQuery({
    queryKey: ["notifications", "list", params],
    queryFn: () => notificationsApi.list(params),
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  });
}
