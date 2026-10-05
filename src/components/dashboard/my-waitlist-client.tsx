"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Users, Clock, CheckCircle2, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { useMyWaitlist } from "@/hooks/use-my-waitlist";
import { useLeaveWaitlist } from "@/hooks/use-leave-waitlist";
import { WAITLIST_STATUS_COLORS } from "@/lib/constants/status-colors";
import { ROUTES } from "@/lib/constants/routes";

export function MyWaitlistClient() {
  const { data, isLoading, isError, refetch } = useMyWaitlist();
  const leave = useLeaveWaitlist();

  if (isLoading) return <TableSkeleton rows={5} />;
  if (isError)
    return (
      <ErrorState
        title="Couldn't load your waitlist"
        action={
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        }
      />
    );

  const entries = data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          My Waitlist
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          We'll notify you the moment a ticket frees up.
        </p>
      </div>

      {entries.length === 0 ? (
        <EmptyState
          icon={Users}
          title="You're not on any waitlist"
          description="When a tier is sold out, join its waitlist and we'll hold a spot for you when one opens up."
          action={
            <Button asChild>
              <Link href={ROUTES.events}>Browse events</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold">
                      Waitlist entry #{entry.id.slice(0, 8)}
                    </h3>
                    <StatusBadge
                      status={entry.status}
                      variant={
                        WAITLIST_STATUS_COLORS[entry.status] as
                          | "success"
                          | "warning"
                          | "default"
                          | "destructive"
                          | "secondary"
                          | "outline"
                      }
                    />
                  </div>
                  <div className="text-muted-foreground mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {entry.quantity} ticket
                      {entry.quantity === 1 ? "" : "s"}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Joined {format(new Date(entry.createdAt), "MMM d, yyyy")}
                    </span>
                    {entry.position ? (
                      <span className="text-foreground inline-flex items-center gap-1 font-medium">
                        Position #{entry.position}
                      </span>
                    ) : null}
                    {entry.status === "NOTIFIED" && entry.offerExpiresAt ? (
                      <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-500">
                        <CheckCircle2 className="h-3 w-3" />
                        Offer expires{" "}
                        {format(
                          new Date(entry.offerExpiresAt),
                          "MMM d · h:mm a",
                        )}
                      </span>
                    ) : null}
                  </div>
                </div>
                {entry.status === "WAITING" || entry.status === "NOTIFIED" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => leave.mutate(entry.id)}
                    disabled={leave.isPending}
                  >
                    {leave.isPending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="mr-1 h-3.5 w-3.5" />
                        Leave
                      </>
                    )}
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
