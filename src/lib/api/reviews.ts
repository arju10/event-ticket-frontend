import { apiClient } from "./client";
import type { ApiPaginated, ApiSuccess, PaginatedResult } from "@/types/api";
import type { Review, ReviewStatistics } from "@/types/models";

export interface CreateReviewPayload {
  bookingId: string;
  rating: number;
  comment?: string;
}

export const reviewsApi = {
  async create(eventId: string, payload: CreateReviewPayload): Promise<Review> {
    const { data } = await apiClient.post<ApiSuccess<Review>>(
      `/events/${eventId}/review`,
      payload,
    );
    return data.data;
  },

  async listForEvent(
    eventId: string,
    params: { page?: number; limit?: number; rating?: number } = {},
  ): Promise<PaginatedResult<Review> & { statistics: ReviewStatistics }> {
    const { data } = await apiClient.get<
      ApiPaginated<Review> & {
        data: { statistics: ReviewStatistics };
      }
    >(`/events/${eventId}/reviews`, { params });

    return {
      items: data.data.items,
      pagination: data.data.pagination,
      statistics: data.data.statistics,
    };
  },

  async respond(
    reviewId: string,
    response: string,
  ): Promise<{
    id: string;
    organizerResponse: string;
    responseDate: string;
  }> {
    const { data } = await apiClient.post<
      ApiSuccess<{
        id: string;
        organizerResponse: string;
        responseDate: string;
      }>
    >(`/reviews/${reviewId}/respond`, { response });
    return data.data;
  },
};
