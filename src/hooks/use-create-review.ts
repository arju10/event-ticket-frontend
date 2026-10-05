"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { reviewsApi, type CreateReviewPayload } from "@/lib/api/reviews";
import { extractErrorMessage } from "@/lib/api/client";

export function useCreateReview(eventId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) =>
      reviewsApi.create(eventId, payload),
    onSuccess: () => {
      toast.success("Thanks for your review!");
      qc.invalidateQueries({ queryKey: ["reviews", eventId] });
      qc.invalidateQueries({ queryKey: ["events", "detail", eventId] });
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}
