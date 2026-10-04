import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  setAuthCookie,
} from "@/lib/api/client";
import type { UserRole } from "@/types/enums";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  hasHydrated: boolean;

  setSession: (payload: {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  }) => void;
  setUser: (user: AuthUser) => void;
  clearSession: () => void;
  setHasHydrated: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      hasHydrated: false,

      setSession: ({ user, accessToken, refreshToken }) => {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
          window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }
        setAuthCookie(accessToken);
        set({ user, accessToken, refreshToken });
      },

      setUser: (user) => set({ user }),

      clearSession: () => {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(ACCESS_TOKEN_KEY);
          window.localStorage.removeItem(REFRESH_TOKEN_KEY);
        }
        setAuthCookie(null);
        set({ user: null, accessToken: null, refreshToken: null });
      },

      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: "etp_auth_state",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        // Reconcile cookie with restored access token
        if (state?.accessToken) setAuthCookie(state.accessToken);
        state?.setHasHydrated(true);
      },
    },
  ),
);
