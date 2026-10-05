"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { waitlistApi } from "@/lib/api/waitlist";
import { extractErrorMessage } from "@/lib/api/client";

export function useLeaveWaitlist() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (waitlistId: string) => waitlistApi.leave(waitlistId),
    onSuccess: () => {
      toast.success("Left waitlist");
      qc.invalidateQueries({ queryKey: ["waitlist"] });
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}
