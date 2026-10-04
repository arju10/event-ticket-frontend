import { apiClient } from "./client";
import type { ApiPaginated, PaginatedResult } from "@/types/api";
import type { Notification } from "@/types/models";

export interface ListNotificationsResult extends PaginatedResult<Notification> {
  unreadCount: number;
}

export const notificationsApi = {
  async list(
    params: {
      page?: number;
      limit?: number;
      isRead?: boolean;
    } = {},
  ): Promise<ListNotificationsResult> {
    const { data } = await apiClient.get<
      ApiPaginated<Notification> & {
        data: { unreadCount: number };
      }
    >("/users/notifications", { params });

    return {
      items: data.data.items,
      pagination: data.data.pagination,
      unreadCount: data.data.unreadCount,
    };
  },

  async markAsRead(id: string): Promise<void> {
    await apiClient.patch(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.patch("/notifications/read-all");
  },
};
