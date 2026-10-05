"use client";

import { Check, Ticket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TicketTier } from "@/types/models";

interface TierCardProps {
  tier: TicketTier;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export function TierCard({
  tier,
  selected,
  onSelect,
  disabled,
}: TierCardProps) {
  const soldOut = tier.available <= 0;

  return (
    <Card
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={disabled ? undefined : onSelect}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      aria-pressed={selected}
      className={cn(
        "cursor-pointer transition-all",
        selected && "border-primary ring-primary/30 ring-2",
        (disabled || soldOut) && "cursor-not-allowed opacity-60",
        !selected && !disabled && "hover:border-primary/40",
      )}
    >
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold">{tier.name}</h3>
            {tier.description ? (
              <p className="text-muted-foreground mt-0.5 text-sm">
                {tier.description}
              </p>
            ) : null}
          </div>
          {soldOut ? (
            <Badge variant="outline" className="shrink-0">
              Sold out
            </Badge>
          ) : (
            <Badge variant="secondary" className="shrink-0">
              {tier.available} left
            </Badge>
          )}
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">
            ৳{tier.price.toLocaleString()}
          </span>
          <span className="text-muted-foreground text-xs">per ticket</span>
        </div>

        {tier.includes && tier.includes.length > 0 ? (
          <ul className="space-y-1.5">
            {tier.includes.map((item) => (
              <li
                key={item}
                className="text-muted-foreground flex items-center gap-2 text-sm"
              >
                <Check className="text-primary h-3.5 w-3.5" />
                {item}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="text-muted-foreground flex items-center justify-between pt-2 text-xs">
          <span className="inline-flex items-center gap-1">
            <Ticket className="h-3 w-3" />
            Min {tier.minPurchase} · Max {tier.maxPurchase}
          </span>
          {selected ? (
            <span className="text-primary font-medium">Selected</span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
