"use client";

import { useAuthStore } from "@/stores/auth-store";

export function useCurrentUser() {
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  return { user, hasHydrated };
}
