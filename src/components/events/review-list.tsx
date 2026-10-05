"use client";

import { format } from "date-fns";
import { Star, MessageSquareQuote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { RatingDistribution } from "./rating-distribution";
import { useEventReviews } from "@/hooks/use-event-reviews";

interface ReviewListProps {
  eventId: string;
}

export function ReviewList({ eventId }: ReviewListProps) {
  const { data, isLoading } = useEventReviews(eventId, { page: 1, limit: 10 });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  const stats = data?.statistics;
  const reviews = data?.items ?? [];

  if (!stats || stats.totalReviews === 0) {
    return (
      <EmptyState
        icon={MessageSquareQuote}
        title="No reviews yet"
        description="Reviews appear here once attendees have checked in and left feedback."
      />
    );
  }

  return (
    <div className="space-y-8">
      <RatingDistribution stats={stats} />

      <div className="space-y-4">
        {reviews.map((review) => {
          const initials =
            review.user?.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase() ?? "??";

          return (
            <div
              key={review.id}
              className="bg-card rounded-lg border p-4 sm:p-5"
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={review.user?.profileImage ?? undefined}
                    alt={review.user?.name ?? "Attendee"}
                  />
                  <AvatarFallback className="text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">
                      {review.user?.name ?? "Attendee"}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      · {format(new Date(review.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={
                          i < review.rating
                            ? "h-3.5 w-3.5 fill-amber-400 text-amber-400"
                            : "text-muted-foreground/30 h-3.5 w-3.5"
                        }
                      />
                    ))}
                  </div>

                  {review.comment ? (
                    <p className="mt-3 text-sm leading-relaxed">
                      {review.comment}
                    </p>
                  ) : null}

                  {review.organizerResponse ? (
                    <div className="border-primary bg-muted/40 mt-3 rounded-md border-l-2 p-3">
                      <p className="text-primary text-xs font-medium">
                        Organizer response
                      </p>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {review.organizerResponse}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {data?.pagination ? <Pagination meta={data.pagination} /> : null}
    </div>
  );
}
