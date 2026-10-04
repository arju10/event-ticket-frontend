import { apiClient } from "./client";
import type { ApiSuccess } from "@/types/api";
import type { Payment } from "@/types/models";
import type { PaymentMethod, PaymentStatus } from "@/types/enums";

export interface InitiatePaymentResponse {
  paymentId: string;
  amount: number;
  method: string;
  status: PaymentStatus;
  paymentUrl: string;
  expiresAt: string | null;
}

export const paymentsApi = {
  async initiate(
    bookingId: string,
    method: PaymentMethod = "STRIPE",
  ): Promise<InitiatePaymentResponse> {
    const { data } = await apiClient.post<ApiSuccess<InitiatePaymentResponse>>(
      "/payments/initiate",
      { bookingId, method },
    );
    return data.data;
  },

  async status(paymentId: string): Promise<Payment> {
    const { data } = await apiClient.get<ApiSuccess<Payment>>(
      `/payments/${paymentId}/status`,
    );
    return data.data;
  },
};
