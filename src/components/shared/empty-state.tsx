import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "border-border bg-muted/30 flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-16 text-center",
        className,
      )}
    >
      <div className="bg-muted mb-4 flex h-14 w-14 items-center justify-center rounded-full">
        <Icon className="text-muted-foreground h-6 w-6" aria-hidden />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      {description ? (
        <p className="text-muted-foreground mt-1 max-w-sm text-sm">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
