"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/lib/api/admin";
import { extractErrorMessage } from "@/lib/api/client";
import type { UserRole } from "@/types/enums";

export function useAdminUsers(params: {
  role?: UserRole;
  isActive?: boolean;
  page?: number;
  limit?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => adminApi.listUsers(params),
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  });
}

export function useUpdateUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      adminApi.updateUserRole(userId, role),
    onSuccess: (data) => {
      toast.success(`Role updated to ${data.role}`);
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}

export function useSuspendUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      suspend,
      reason,
    }: {
      userId: string;
      suspend: boolean;
      reason: string;
    }) => adminApi.suspendUser(userId, suspend, reason),
    onSuccess: (data) => {
      toast.success(data.isActive ? "User reinstated" : "User suspended");
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}
