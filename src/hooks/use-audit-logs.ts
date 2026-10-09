"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";
import type { AuditAction } from "@/types/enums";

export function useAuditLogs(params: {
  entityType?: string;
  action?: AuditAction;
  userId?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["admin", "audit-logs", params],
    queryFn: () => adminApi.auditLogs(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
