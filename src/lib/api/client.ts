import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";
import type { ApiError } from "@/types/api";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://event-ticket-booking-management-pla.vercel.app/api/v1";

export const ACCESS_TOKEN_KEY = "etp_access_token";
export const REFRESH_TOKEN_KEY = "etp_refresh_token";
export const AUTH_COOKIE_KEY = "etp_auth";

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

function getStoredRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setAuthCookie(value: string | null) {
  if (typeof document === "undefined") return;
  if (value) {
    // 7 days, path=/, SameSite=Lax — middleware only reads it, never trusts it.
    document.cookie = `${AUTH_COOKIE_KEY}=${value}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
  } else {
    document.cookie = `${AUTH_COOKIE_KEY}=; path=/; max-age=0; SameSite=Lax`;
  }
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

// -------- Request interceptor: attach Bearer token --------
apiClient.interceptors.request.use((config) => {
  const token = getStoredAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// -------- Refresh handling (serialized so only ONE refresh runs) --------
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = getStoredRefreshToken();
    if (!refreshToken) return null;

    try {
      const { data } = await axios.post(
        `${API_URL}/auth/refresh-token`,
        { refreshToken },
        { headers: { "Content-Type": "application/json" } },
      );
      const newAccess = data?.data?.accessToken as string | undefined;
      const newRefresh = data?.data?.refreshToken as string | undefined;
      if (!newAccess || !newRefresh) return null;

      window.localStorage.setItem(ACCESS_TOKEN_KEY, newAccess);
      window.localStorage.setItem(REFRESH_TOKEN_KEY, newRefresh);
      setAuthCookie(newAccess);
      return newAccess;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// -------- Response interceptor: 401 → refresh → retry --------
apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<ApiError>) => {
    const original = error.config as RetryableRequest | undefined;

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !original.url?.includes("/auth/refresh-token") &&
      !original.url?.includes("/auth/login")
    ) {
      original._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(original);
      }

      // Refresh failed → clean up & bounce to login
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(ACCESS_TOKEN_KEY);
        window.localStorage.removeItem(REFRESH_TOKEN_KEY);
        setAuthCookie(null);
        const path = window.location.pathname;
        const isProtected =
          path.startsWith("/dashboard") ||
          path.startsWith("/organizer") ||
          path.startsWith("/admin");
        if (isProtected && !path.startsWith("/login")) {
          const redirect = encodeURIComponent(path);
          window.location.href = `/login?redirect=${redirect}`;
        }
      }
    }

    // Surface the backend's message on non-401 errors so callers can also catch it
    const message =
      error.response?.data?.message ??
      error.message ??
      "Something went wrong. Please try again.";

    // Global toast unless the caller explicitly opts out via config.meta.silent
    const silent = (original as { meta?: { silent?: boolean } })?.meta?.silent;
    if (!silent && error.response?.status !== 401) {
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

export function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiError | undefined;
    if (data?.errors?.length) return data.errors[0]!.message;
    if (data?.message) return data.message;
    return err.message;
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}

export function extractFieldErrors(
  err: unknown,
): Record<string, string> | undefined {
  if (!axios.isAxiosError(err)) return undefined;
  const data = err.response?.data as ApiError | undefined;
  if (!data?.errors?.length) return undefined;
  return data.errors.reduce<Record<string, string>>((acc, e) => {
    acc[e.field] = e.message;
    return acc;
  }, {});
}
