"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usersApi } from "@/lib/api/users";
import { extractErrorMessage } from "@/lib/api/client";
import { useAuthStore } from "@/stores/auth-store";

export function useProfile() {
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  return useQuery({
    queryKey: ["profile", "me"],
    queryFn: () => usersApi.me(),
    enabled: hasHydrated,
    staleTime: 60_000,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (payload: Parameters<typeof usersApi.updateMe>[0]) =>
      usersApi.updateMe(payload),
    onSuccess: (user) => {
      toast.success("Profile updated");
      setUser({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
      qc.invalidateQueries({ queryKey: ["profile", "me"] });
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: Parameters<typeof usersApi.changePassword>[0]) =>
      usersApi.changePassword(payload),
    onSuccess: () => toast.success("Password changed"),
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}

export function useUploadAvatar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => usersApi.uploadProfileImage(file),
    onSuccess: () => {
      toast.success("Profile image updated");
      qc.invalidateQueries({ queryKey: ["profile", "me"] });
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}
