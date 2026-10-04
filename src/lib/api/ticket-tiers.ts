import { apiClient } from "./client";
import type { ApiSuccess } from "@/types/api";
import type { TicketTier } from "@/types/models";

export interface CreateTierPayload {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  minPurchase?: number;
  maxPurchase?: number;
  saleStartDate?: string;
  saleEndDate?: string;
  includes?: string[];
}

export const ticketTiersApi = {
  async listForEvent(eventId: string): Promise<TicketTier[]> {
    const { data } = await apiClient.get<ApiSuccess<{ items: TicketTier[] }>>(
      `/events/${eventId}/ticket-tiers`,
    );
    return data.data.items;
  },

  async create(
    eventId: string,
    payload: CreateTierPayload,
  ): Promise<TicketTier> {
    const { data } = await apiClient.post<ApiSuccess<TicketTier>>(
      `/events/${eventId}/ticket-tiers`,
      payload,
    );
    return data.data;
  },

  async update(
    tierId: string,
    payload: Partial<CreateTierPayload> & { status?: string },
  ): Promise<TicketTier> {
    const { data } = await apiClient.patch<ApiSuccess<TicketTier>>(
      `/ticket-tiers/${tierId}`,
      payload,
    );
    return data.data;
  },
};
