import { apiClient } from "./client";
import type { ApiSuccess } from "@/types/api";
import type { WaitlistEntry } from "@/types/models";

export const waitlistApi = {
  async join(eventId: string, ticketTierId: string, quantity: number) {
    const { data } = await apiClient.post<
      ApiSuccess<{
        id: string;
        position: number;
        status: string;
        createdAt: string;
      }>
    >(`/events/${eventId}/waitlist`, { ticketTierId, quantity });
    return data.data;
  },

  async forEvent(
    eventId: string,
  ): Promise<{ items: WaitlistEntry[]; total: number }> {
    const { data } = await apiClient.get<
      ApiSuccess<{ items: WaitlistEntry[]; total: number }>
    >(`/events/${eventId}/waitlist`);
    return data.data;
  },

  async mine(): Promise<WaitlistEntry[]> {
    const { data } =
      await apiClient.get<
        ApiSuccess<WaitlistEntry[] | { items: WaitlistEntry[] }>
      >("/users/waitlist");
    const raw = data.data as unknown;
    if (Array.isArray(raw)) return raw;
    return (raw as { items: WaitlistEntry[] }).items ?? [];
  },

  async leave(waitlistId: string): Promise<void> {
    await apiClient.delete(`/waitlist/${waitlistId}`);
  },
};
