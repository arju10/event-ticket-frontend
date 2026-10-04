import { apiClient } from "./client";
import type { ApiPaginated, ApiSuccess, PaginatedResult } from "@/types/api";
import type { Booking } from "@/types/models";
import type { BookingStatus } from "@/types/enums";

export interface CreateBookingPayload {
  ticketTierId: string;
  quantity: number;
  couponCode?: string;
  specialRequests?: string;
  dietaryNeeds?: string;
}

export interface CreateBookingResponse {
  booking: {
    id: string;
    bookingNumber: string;
    eventId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    discountAmount: number;
    finalAmount: number;
    status: BookingStatus;
    expiresAt: string;
    createdAt: string;
  };
  payment: {
    paymentUrl: string;
  };
}

export const bookingsApi = {
  async create(
    eventId: string,
    payload: CreateBookingPayload,
  ): Promise<CreateBookingResponse> {
    const { data } = await apiClient.post<ApiSuccess<CreateBookingResponse>>(
      `/events/${eventId}/book`,
      payload,
    );
    return data.data;
  },

  async listMine(
    params: {
      status?: BookingStatus;
      page?: number;
      limit?: number;
      eventId?: string;
    } = {},
  ): Promise<PaginatedResult<Booking>> {
    const { data } = await apiClient.get<ApiPaginated<Booking>>(
      "/users/bookings",
      { params },
    );
    return { items: data.data.items, pagination: data.data.pagination };
  },

  async detail(id: string): Promise<Booking> {
    const { data } = await apiClient.get<ApiSuccess<Booking>>(
      `/bookings/${id}`,
    );
    return data.data;
  },

  async cancel(
    id: string,
    cancellationReason: string,
  ): Promise<{
    id: string;
    status: BookingStatus;
    refundAmount: number;
    refundPolicy: "FULL_REFUND" | "PARTIAL_REFUND" | "NO_REFUND";
    cancelledAt: string;
  }> {
    const { data } = await apiClient.patch<
      ApiSuccess<{
        id: string;
        status: BookingStatus;
        refundAmount: number;
        refundPolicy: "FULL_REFUND" | "PARTIAL_REFUND" | "NO_REFUND";
        cancelledAt: string;
      }>
    >(`/bookings/${id}/cancel`, { cancellationReason });
    return data.data;
  },

  async checkIn(id: string, qrCode: string) {
    const { data } = await apiClient.post<
      ApiSuccess<{
        bookingId: string;
        checkedInAt: string;
        attendeeName: string;
        ticketTierName: string;
        quantity: number;
      }>
    >(`/bookings/${id}/check-in`, { qrCode });
    return data.data;
  },
};
