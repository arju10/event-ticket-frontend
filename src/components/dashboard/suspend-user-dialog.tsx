"use client";

import { useState } from "react";
import { Loader2, UserX, UserCheck } from "lucide-react";
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
import { useSuspendUser } from "@/hooks/use-admin-users";
import type { AdminUser } from "@/types/models";

export function SuspendUserDialog({ user }: { user: AdminUser }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const mutation = useSuspendUser();

  const isReinstate = !user.isActive;
  const canSubmit = isReinstate || reason.trim().length >= 2;

  function submit() {
    if (!canSubmit) return;
    mutation.mutate(
      {
        userId: user.id,
        suspend: user.isActive,
        reason: reason.trim() || "Reinstated by admin",
      },
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
        <Button variant={user.isActive ? "outline" : "default"} size="sm">
          {user.isActive ? (
            <>
              <UserX className="mr-1 h-3.5 w-3.5" />
              Suspend
            </>
          ) : (
            <>
              <UserCheck className="mr-1 h-3.5 w-3.5" />
              Reinstate
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isReinstate ? "Reinstate this user?" : "Suspend this user?"}
          </DialogTitle>
          <DialogDescription>
            {isReinstate
              ? `${user.name} will regain access to the platform immediately.`
              : `${user.name} will be blocked from logging in and any active session will be invalidated.`}
          </DialogDescription>
        </DialogHeader>

        {!isReinstate ? (
          <div className="space-y-2">
            <Label htmlFor="suspend-reason">
              Reason{" "}
              <span className="text-muted-foreground text-xs font-normal">
                (min 2 characters)
              </span>
            </Label>
            <Textarea
              id="suspend-reason"
              rows={3}
              placeholder="Policy violation, spam, abuse..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        ) : null}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant={isReinstate ? "default" : "destructive"}
            onClick={submit}
            disabled={!canSubmit || mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Working...
              </>
            ) : isReinstate ? (
              "Reinstate"
            ) : (
              "Suspend user"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
