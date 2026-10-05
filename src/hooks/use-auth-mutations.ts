"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/auth-store";
import { HOME_BY_ROLE, ROUTES } from "@/lib/constants/routes";
import { extractErrorMessage, extractFieldErrors } from "@/lib/api/client";
import type { LoginValues, RegisterValues } from "@/lib/validations/auth";

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  const router = useRouter();
  const searchParams = useSearchParams();

  return useMutation({
    mutationFn: async (values: LoginValues) => {
      return authApi.login(values.email, values.password);
    },
    onSuccess: (data) => {
      setSession({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      toast.success(`Welcome back, ${data.user.name}`);
      const redirect = searchParams.get("redirect");
      const target =
        redirect && redirect.startsWith("/")
          ? redirect
          : HOME_BY_ROLE[data.user.role];
      router.push(target);
      router.refresh();
    },
    onError: (err) => {
      const fieldErrors = extractFieldErrors(err);
      if (!fieldErrors) toast.error(extractErrorMessage(err));
      // Field errors are surfaced via the caller binding them onto the form.
    },
  });
}

export function useRegister() {
  const setSession = useAuthStore((s) => s.setSession);
  const router = useRouter();

  return useMutation({
    mutationFn: async (values: RegisterValues) => {
      return authApi.register({
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone || undefined,
        role: values.role,
      });
    },
    onSuccess: (data) => {
      setSession({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      toast.success("Account created — welcome to EventHub");
      router.push(HOME_BY_ROLE[data.user.role]);
      router.refresh();
    },
    onError: (err) => {
      const fieldErrors = extractFieldErrors(err);
      if (!fieldErrors) toast.error(extractErrorMessage(err));
    },
  });
}

export function useLogout() {
  const { refreshToken, clearSession } = useAuthStore.getState();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      if (refreshToken) await authApi.logout(refreshToken);
    },
    onSettled: () => {
      clearSession();
      toast.success("Logged out");
      router.push(ROUTES.login);
      router.refresh();
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => authApi.forgotPassword(email),
    onSuccess: () => {
      toast.success(
        "If an account exists for that email, a reset link has been sent.",
      );
    },
    onError: (err) => {
      // Backend always returns 200 for anti-enumeration, so this only fires on real network errors.
      toast.error(extractErrorMessage(err));
    },
  });
}
