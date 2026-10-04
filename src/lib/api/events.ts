import { apiClient } from "./client";
import type { ApiPaginated, ApiSuccess, PaginatedResult } from "@/types/api";
import type { Event, EventCard, EventDetail } from "@/types/models";
import type { EventStatus } from "@/types/enums";

export interface EventListParams {
  page?: number;
  limit?: number;
  category?: string;
  subCategory?: string;
  city?: string;
  status?: EventStatus;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  dateFrom?: string;
  dateTo?: string;
  priceMin?: number;
  priceMax?: number;
  search?: string;
}

export const eventsApi = {
  async list(
    params: EventListParams = {},
  ): Promise<PaginatedResult<EventCard>> {
    const { data } = await apiClient.get<ApiPaginated<EventCard>>("/events", {
      params,
    });
    return {
      items: data.data.items,
      pagination: data.data.pagination,
      extra: data.data,
    };
  },

  async detail(id: string): Promise<EventDetail> {
    const { data } = await apiClient.get<ApiSuccess<EventDetail>>(
      `/events/${id}`,
    );
    return data.data;
  },

  async create(payload: Record<string, unknown>): Promise<Event> {
    const { data } = await apiClient.post<ApiSuccess<Event>>(
      "/events",
      payload,
    );
    return data.data;
  },

  async update(id: string, payload: Record<string, unknown>): Promise<Event> {
    const { data } = await apiClient.patch<ApiSuccess<Event>>(
      `/events/${id}`,
      payload,
    );
    return data.data;
  },

  async updateStatus(id: string, status: EventStatus): Promise<Event> {
    const { data } = await apiClient.patch<ApiSuccess<Event>>(
      `/events/${id}/status`,
      { status },
    );
    return data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/events/${id}`);
  },
};
