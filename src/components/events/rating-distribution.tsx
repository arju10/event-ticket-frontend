import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";
import type { ReviewStatistics } from "@/types/models";

interface RatingDistributionProps {
  stats: ReviewStatistics;
}

export function RatingDistribution({ stats }: RatingDistributionProps) {
  const total = stats.totalReviews || 1;

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-4">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold">
              {stats.averageRating?.toFixed(1) ?? "—"}
            </span>
            <span className="text-muted-foreground text-sm">/ 5</span>
          </div>
          <div className="mt-1 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={
                  i < Math.round(stats.averageRating ?? 0)
                    ? "h-4 w-4 fill-amber-400 text-amber-400"
                    : "text-muted-foreground/40 h-4 w-4"
                }
              />
            ))}
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            {stats.totalReviews} review{stats.totalReviews === 1 ? "" : "s"}
          </p>
        </div>

        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = stats.ratingDistribution[String(rating)] ?? 0;
            const pct = (count / total) * 100;
            return (
              <div key={rating} className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground w-3">{rating}</span>
                <Progress value={pct} className="h-1.5 flex-1" />
                <span className="text-muted-foreground w-8 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
