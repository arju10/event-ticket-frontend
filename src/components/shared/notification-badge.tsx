"use client";

import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "@/lib/api/notifications";
import { cn } from "@/lib/utils";

export function NotificationBadge({ className }: { className?: string }) {
  const { data } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => notificationsApi.list({ page: 1, limit: 1, isRead: false }),
    staleTime: 30_000,
  });

  const count = data?.unreadCount ?? 0;
  if (count === 0) return null;

  return (
    <span
      className={cn(
        "bg-destructive text-destructive-foreground absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold",
        className,
      )}
      aria-label={`${count} unread notifications`}
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}
