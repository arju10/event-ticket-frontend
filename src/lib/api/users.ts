import { apiClient } from "./client";
import type { ApiSuccess } from "@/types/api";
import type { PublicUserProfile, User } from "@/types/models";

export const usersApi = {
  async me(): Promise<User> {
    const { data } = await apiClient.get<ApiSuccess<User>>("/users/me");
    return data.data;
  },

  async updateMe(payload: {
    name?: string;
    phone?: string;
    bio?: string;
    dateOfBirth?: string;
    notificationPreferences?: { email?: boolean; sms?: boolean };
  }): Promise<User> {
    const { data } = await apiClient.patch<ApiSuccess<User>>(
      "/users/me",
      payload,
    );
    return data.data;
  },

  async uploadProfileImage(file: File): Promise<{ profileImage: string }> {
    const form = new FormData();
    form.append("image", file);
    const { data } = await apiClient.post<ApiSuccess<{ profileImage: string }>>(
      "/users/me/profile-image",
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return data.data;
  },

  async changePassword(payload: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }): Promise<void> {
    await apiClient.patch("/users/change-password", payload);
  },

  async publicProfile(id: string): Promise<PublicUserProfile> {
    const { data } = await apiClient.get<ApiSuccess<PublicUserProfile>>(
      `/users/${id}/profile`,
    );
    return data.data;
  },
};
