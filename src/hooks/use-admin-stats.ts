"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "dashboard-stats"],
    queryFn: () => adminApi.dashboardStats(),
    staleTime: 60_000,
  });
}
