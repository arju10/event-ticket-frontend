"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { couponsApi, type CreateCouponPayload } from "@/lib/api/coupons";
import { extractErrorMessage, extractFieldErrors } from "@/lib/api/client";

export function useCreateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCouponPayload) => couponsApi.create(payload),
    onSuccess: (coupon) => {
      toast.success(`Coupon ${coupon.code} created`);
      qc.invalidateQueries({ queryKey: ["admin", "coupons"] });
    },
    onError: (err) => {
      const fieldErrors = extractFieldErrors(err);
      if (fieldErrors && Object.keys(fieldErrors).length > 0) {
        toast.error(Object.values(fieldErrors)[0] ?? "Invalid coupon");
      } else {
        toast.error(extractErrorMessage(err));
      }
    },
  });
}
