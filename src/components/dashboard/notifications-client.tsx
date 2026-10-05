"use client";

import { Bell, CheckCheck, Info } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Pagination } from "@/components/shared/pagination";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { useNotifications } from "@/hooks/use-notifications";
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
} from "@/hooks/use-notification-mutations";
import { usePagination } from "@/hooks/use-pagination";
import { cn } from "@/lib/utils";

export function NotificationsClient() {
  const { page, limit } = usePagination();
  const { data, isLoading, isError, refetch } = useNotifications({
    page,
    limit,
  });
  const markOne = useMarkNotificationAsRead();
  const markAll = useMarkAllNotificationsAsRead();

  if (isLoading && !data) return <TableSkeleton rows={6} />;
  if (isError)
    return (
      <ErrorState
        title="Couldn't load notifications"
        action={
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        }
      />
    );

  const items = data?.items ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Notifications
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {unreadCount > 0
              ? `${unreadCount} unread`
              : "You're all caught up."}
          </p>
        </div>
        {unreadCount > 0 ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAll.mutate()}
            disabled={markAll.isPending}
          >
            <CheckCheck className="mr-1 h-4 w-4" />
            Mark all as read
          </Button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications yet"
          description="Booking confirmations, waitlist offers, and event updates will appear here."
        />
      ) : (
        <>
          <div className="space-y-2">
            {items.map((notif) => (
              <Card
                key={notif.id}
                className={cn(
                  "transition-colors",
                  !notif.isRead && "border-primary/40 bg-primary/5",
                )}
              >
                <CardContent className="flex items-start gap-3 p-4 sm:p-5">
                  <div
                    className={cn(
                      "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg",
                      notif.isRead
                        ? "bg-muted text-muted-foreground"
                        : "bg-primary/15 text-primary",
                    )}
                  >
                    <Info className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-medium">{notif.title}</h3>
                      {!notif.isRead ? (
                        <Badge variant="default" className="text-[10px]">
                          New
                        </Badge>
                      ) : null}
                    </div>
                    <p className="text-muted-foreground mt-0.5 text-sm">
                      {notif.message}
                    </p>
                    <div className="text-muted-foreground mt-2 flex items-center gap-3 text-xs">
                      <span>
                        {format(
                          new Date(notif.createdAt),
                          "MMM d, yyyy · h:mm a",
                        )}
                      </span>
                      {!notif.isRead ? (
                        <button
                          type="button"
                          onClick={() => markOne.mutate(notif.id)}
                          disabled={markOne.isPending}
                          className="text-primary font-medium hover:underline"
                        >
                          Mark as read
                        </button>
                      ) : null}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {data?.pagination ? <Pagination meta={data.pagination} /> : null}
        </>
      )}
    </div>
  );
}
