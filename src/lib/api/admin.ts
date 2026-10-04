import { apiClient } from "./client";
import type { ApiPaginated, ApiSuccess, PaginatedResult } from "@/types/api";
import type { AdminUser, AuditLog, DashboardStats } from "@/types/models";
import type { AuditAction, UserRole } from "@/types/enums";

export const adminApi = {
  async listUsers(
    params: {
      role?: UserRole;
      isActive?: boolean;
      page?: number;
      limit?: number;
      search?: string;
    } = {},
  ): Promise<PaginatedResult<AdminUser>> {
    const { data } = await apiClient.get<ApiPaginated<AdminUser>>(
      "/admin/users",
      { params },
    );
    return { items: data.data.items, pagination: data.data.pagination };
  },

  async updateUserRole(
    userId: string,
    role: UserRole,
  ): Promise<{ id: string; role: UserRole; updatedAt: string }> {
    const { data } = await apiClient.patch<
      ApiSuccess<{ id: string; role: UserRole; updatedAt: string }>
    >(`/admin/users/${userId}/role`, { role });
    return data.data;
  },

  async suspendUser(
    userId: string,
    suspend: boolean,
    reason: string,
  ): Promise<{
    id: string;
    isActive: boolean;
    suspensionReason: string | null;
  }> {
    const { data } = await apiClient.patch<
      ApiSuccess<{
        id: string;
        isActive: boolean;
        suspensionReason: string | null;
      }>
    >(`/admin/users/${userId}/suspend`, { suspend, reason });
    return data.data;
  },

  async dashboardStats(): Promise<DashboardStats> {
    const { data } = await apiClient.get<ApiSuccess<DashboardStats>>(
      "/admin/dashboard-stats",
    );
    return data.data;
  },

  async auditLogs(
    params: {
      entityType?: string;
      action?: AuditAction;
      userId?: string;
      from?: string;
      to?: string;
      page?: number;
      limit?: number;
    } = {},
  ): Promise<PaginatedResult<AuditLog>> {
    const { data } = await apiClient.get<ApiPaginated<AuditLog>>(
      "/admin/audit-logs",
      { params },
    );
    return { items: data.data.items, pagination: data.data.pagination };
  },
};
