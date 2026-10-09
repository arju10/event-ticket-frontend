"use client";

import { useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useUpdateUserRole } from "@/hooks/use-admin-users";
import type { AdminUser } from "@/types/models";
import type { UserRole } from "@/types/enums";

export function UserRoleDialog({ user }: { user: AdminUser }) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<UserRole>(user.role);
  const mutation = useUpdateUserRole();

  function submit() {
    if (role === user.role) {
      setOpen(false);
      return;
    }
    mutation.mutate(
      { userId: user.id, role },
      {
        onSuccess: () => setOpen(false),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ShieldCheck className="mr-1 h-3.5 w-3.5" />
          Role
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change role</DialogTitle>
          <DialogDescription>
            Currently <span className="font-medium">{user.role}</span>. Changing
            role affects what this user can access immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="role-select">New role</Label>
          <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
            <SelectTrigger id="role-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ATTENDEE">Attendee</SelectItem>
              <SelectItem value="ORGANIZER">Organizer</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button onClick={submit} disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save role"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
