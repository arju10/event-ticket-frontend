"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { notificationsApi } from "@/lib/api/notifications";
import { extractErrorMessage } from "@/lib/api/client";

export function useMarkNotificationAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}

export function useMarkAllNotificationsAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      toast.success("All notifications marked as read");
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}
