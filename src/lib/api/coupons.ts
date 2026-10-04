import { apiClient } from "./client";
import type { ApiSuccess } from "@/types/api";
import type { Coupon, CouponValidationResult } from "@/types/models";

export interface ValidateCouponPayload {
  code: string;
  eventId: string;
  ticketTierId: string;
  quantity: number;
}

export interface CreateCouponPayload {
  code: string;
  description?: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  perUserLimit?: number;
  startDate: string;
  endDate: string;
}

export const couponsApi = {
  async validate(
    payload: ValidateCouponPayload,
  ): Promise<CouponValidationResult> {
    const { data } = await apiClient.post<ApiSuccess<CouponValidationResult>>(
      "/coupons/validate",
      payload,
    );
    return data.data;
  },

  async create(payload: CreateCouponPayload): Promise<Coupon> {
    const { data } = await apiClient.post<ApiSuccess<Coupon>>(
      "/admin/coupons",
      payload,
    );
    return data.data;
  },
};
