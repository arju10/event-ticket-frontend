"use client";

import { useState } from "react";
import { Loader2, XCircle } from "lucide-react";
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
import { useCancelBooking } from "@/hooks/use-cancel-booking";

export function CancelBookingDialog({ bookingId }: { bookingId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const cancel = useCancelBooking();

  const canSubmit = reason.trim().length >= 2;

  function handleCancel() {
    if (!canSubmit) return;
    cancel.mutate(
      { bookingId, reason: reason.trim() },
      {
        onSuccess: () => {
          setOpen(false);
          setReason("");
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <XCircle className="mr-2 h-4 w-4" />
          Cancel booking
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel this booking?</DialogTitle>
          <DialogDescription>
            Refund amount depends on how close we are to the event:
            <br />
            <span className="text-foreground mt-2 block">
              100% refund 7+ days before · 50% between 24h–7d · 0% within 24h
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="cancel-reason">
            Reason for cancelling{" "}
            <span className="text-muted-foreground text-xs font-normal">
              (min 2 characters)
            </span>
          </Label>
          <Textarea
            id="cancel-reason"
            rows={3}
            placeholder="Let the organizer know why..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={cancel.isPending}
          >
            Keep booking
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={!canSubmit || cancel.isPending}
          >
            {cancel.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              "Confirm cancellation"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
