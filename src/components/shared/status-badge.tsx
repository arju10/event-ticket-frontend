import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { BadgeVariant } from "@/lib/constants/status-colors";

interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant;
  className?: string;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: "border-transparent bg-primary text-primary-foreground",
  secondary: "border-transparent bg-secondary text-secondary-foreground",
  destructive: "border-transparent bg-destructive text-destructive-foreground",
  outline: "text-foreground",
  success: "border-transparent bg-emerald-500 text-white",
  warning: "border-transparent bg-amber-500 text-white",
};

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const resolvedVariant: BadgeVariant = variant ?? "secondary";
  return (
    <Badge
      variant={
        resolvedVariant === "success" || resolvedVariant === "warning"
          ? "outline"
          : resolvedVariant
      }
      className={cn(VARIANT_CLASSES[resolvedVariant], "font-medium", className)}
    >
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
