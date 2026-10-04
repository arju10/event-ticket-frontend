import { apiClient } from "./client";
import type { ApiSuccess } from "@/types/api";
import type { UserRole } from "@/types/enums";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await apiClient.post<ApiSuccess<LoginResponse>>(
      "/auth/login",
      { email, password },
    );
    return data.data;
  },

  async register(payload: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    role: "ATTENDEE" | "ORGANIZER";
  }): Promise<RegisterResponse> {
    const { data } = await apiClient.post<ApiSuccess<RegisterResponse>>(
      "/auth/register",
      payload,
    );
    return data.data;
  },

  async logout(refreshToken: string): Promise<void> {
    await apiClient.post("/auth/logout", { refreshToken });
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post("/auth/forgot-password", { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post("/auth/reset-password", { token, newPassword });
  },
};
