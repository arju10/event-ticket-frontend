"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { eventsApi } from "@/lib/api/events";
import { extractErrorMessage, extractFieldErrors } from "@/lib/api/client";
import type { EventStatus } from "@/types/enums";

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => eventsApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (err) => {
      const fieldErrors = extractFieldErrors(err);
      if (fieldErrors && Object.keys(fieldErrors).length > 0) {
        toast.error(Object.values(fieldErrors)[0] ?? "Could not create event");
      } else {
        toast.error(extractErrorMessage(err));
      }
    },
  });
}

export function useUpdateEvent(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      eventsApi.update(id, payload),
    onSuccess: () => {
      toast.success("Event updated");
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["events", "detail", id] });
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}

export function useUpdateEventStatus(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (status: EventStatus) => eventsApi.updateStatus(id, status),
    onSuccess: (_, status) => {
      toast.success(`Event ${status.toLowerCase()}`);
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["events", "detail", id] });
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}

export function useDeleteEvent(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => eventsApi.remove(id),
    onSuccess: () => {
      toast.success("Event deleted");
      qc.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}
