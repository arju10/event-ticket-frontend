"use client";

import { useState } from "react";
import { Loader2, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateReview } from "@/hooks/use-create-review";
import { cn } from "@/lib/utils";

export function LeaveReviewDialog({
  bookingId,
  eventId,
}: {
  bookingId: string;
  eventId: string;
}) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const review = useCreateReview(eventId);

  function submit() {
    review.mutate(
      {
        bookingId,
        rating,
        comment: comment.trim() || undefined,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setComment("");
          setRating(5);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Star className="mr-2 h-4 w-4" />
          Leave a review
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How was the event?</DialogTitle>
          <DialogDescription>
            Your review helps other attendees decide.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  aria-label={`${value} star${value === 1 ? "" : "s"}`}
                  className="rounded p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "h-7 w-7",
                      value <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/40",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comment (optional)</Label>
            <Textarea
              id="comment"
              rows={4}
              placeholder="Tell us what you thought..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={review.isPending}
          >
            Cancel
          </Button>
          <Button onClick={submit} disabled={review.isPending}>
            {review.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit review"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
