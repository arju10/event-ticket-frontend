import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  accent?: "default" | "success" | "warning" | "destructive";
  className?: string;
}

const ACCENT_CLASSES: Record<NonNullable<StatCardProps["accent"]>, string> = {
  default: "bg-primary/10 text-primary",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-500",
  destructive: "bg-destructive/10 text-destructive",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  accent = "default",
  className,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            {value}
          </p>
          {hint ? (
            <p className="text-muted-foreground mt-1 text-xs">{hint}</p>
          ) : null}
        </div>
        <div
          className={cn(
            "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg",
            ACCENT_CLASSES[accent],
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
