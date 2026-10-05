"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Loader2,
  ShieldCheck,
  Ticket,
  CalendarCog,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/auth-store";
import { HOME_BY_ROLE } from "@/lib/constants/routes";
import { extractErrorMessage } from "@/lib/api/client";
import type { DemoAccount } from "@/lib/constants/demo-accounts";
import type { UserRole } from "@/types/enums";
import { cn } from "@/lib/utils";

const ROLE_ICONS: Record<UserRole, LucideIcon> = {
  ADMIN: ShieldCheck,
  ATTENDEE: Ticket,
  ORGANIZER: CalendarCog,
};

export function DemoLoginButton({
  account,
  disabled,
  className,
}: {
  account: DemoAccount;
  disabled?: boolean;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const setSession = useAuthStore((s) => s.setSession);
  const router = useRouter();
  const searchParams = useSearchParams();
  const Icon = ROLE_ICONS[account.role];

  async function handleClick() {
    setLoading(true);
    try {
      const data = await authApi.login(account.email, account.password);
      setSession({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      toast.success(`Logged in as ${account.label}`);
      const redirect = searchParams.get("redirect");
      const target =
        redirect && redirect.startsWith("/")
          ? redirect
          : HOME_BY_ROLE[data.user.role];
      router.push(target);
      router.refresh();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClick}
      disabled={disabled || loading}
      className={cn(
        "h-auto flex-col items-start gap-1 px-4 py-3 text-left",
        className,
      )}
    >
      <div className="flex w-full items-center gap-2">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Icon className="h-4 w-4" />
        )}
        <span className="text-sm font-semibold">{account.label}</span>
      </div>
      <span className="text-muted-foreground text-xs font-normal">
        {account.description}
      </span>
    </Button>
  );
}
