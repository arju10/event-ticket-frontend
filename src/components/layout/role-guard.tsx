"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import type { UserRole } from "@/types/enums";
import { HOME_BY_ROLE } from "@/lib/constants/routes";

export function RoleGuard({
  allow,
  children,
}: {
  allow: UserRole[];
  children: React.ReactNode;
}) {
  const { user, hasHydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!allow.includes(user.role)) {
      toast.error("You don't have access to that page");
      router.replace(HOME_BY_ROLE[user.role] ?? "/");
    }
  }, [allow, hasHydrated, router, user]);

  if (!hasHydrated || !user || !allow.includes(user.role)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
