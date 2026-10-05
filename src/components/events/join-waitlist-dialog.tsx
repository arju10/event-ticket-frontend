"use client";

import { useState } from "react";
import { Loader2, Users } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useJoinWaitlist } from "@/hooks/use-join-waitlist";

interface JoinWaitlistDialogProps {
  eventId: string;
  ticketTierId: string;
  tierName: string;
  maxQuantity: number;
}

export function JoinWaitlistDialog({
  eventId,
  ticketTierId,
  tierName,
  maxQuantity,
}: JoinWaitlistDialogProps) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const join = useJoinWaitlist(eventId);

  function handleJoin() {
    join.mutate(
      { ticketTierId, quantity },
      {
        onSuccess: () => {
          setOpen(false);
          setQuantity(1);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Users className="mr-2 h-4 w-4" />
          Join {tierName} waitlist
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join the {tierName} waitlist</DialogTitle>
          <DialogDescription>
            When a ticket frees up, we'll hold it for you and send a
            notification. You'll have 2 hours to complete your booking.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="waitlist-qty">How many tickets do you need?</Label>
          <Input
            id="waitlist-qty"
            type="number"
            min={1}
            max={maxQuantity}
            value={quantity}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (!Number.isNaN(v) && v >= 1 && v <= maxQuantity)
                setQuantity(v);
            }}
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={join.isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleJoin} disabled={join.isPending}>
            {join.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Joining...
              </>
            ) : (
              "Join waitlist"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
