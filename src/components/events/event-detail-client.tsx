"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2, CreditCard, Calendar, MapPin, Users } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TierCard } from "./tier-card";
import { JoinWaitlistDialog } from "./join-waitlist-dialog";
import { useAuthStore } from "@/stores/auth-store";
import { useBookingMutation } from "@/hooks/use-booking-mutation";
import { ticketTiersApi } from "@/lib/api/ticket-tiers";
import { ROUTES } from "@/lib/constants/routes";
import type { EventDetail, TicketTier } from "@/types/models";

interface EventDetailClientProps {
  event: EventDetail;
}

export function EventDetailClient({ event }: EventDetailClientProps) {
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const router = useRouter();
  const booking = useBookingMutation(event.id);

  const { data: tiersData, isLoading: tiersLoading } = useQuery({
    queryKey: ["ticket-tiers", "list", event.id],
    queryFn: () => ticketTiersApi.listForEvent(event.id),
    initialData: event.ticketTiers,
    staleTime: 60_000,
  });

  const tiers: TicketTier[] = tiersData ?? event.ticketTiers;
  const [selectedTierId, setSelectedTierId] = useState<string | null>(
    tiers.find((t) => t.available > 0)?.id ?? null,
  );
  const [quantity, setQuantity] = useState(1);
  const [couponCode, setCouponCode] = useState("");
  const [dietaryNeeds, setDietaryNeeds] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  const selectedTier = tiers.find((t) => t.id === selectedTierId) ?? null;
  const soldOutTier = tiers.find((t) => t.available <= 0) ?? null;

  function handleBook() {
    if (!user) {
      router.push(
        `${ROUTES.login}?redirect=${encodeURIComponent(ROUTES.eventDetail(event.id))}`,
      );
      return;
    }
    if (!selectedTier) {
      toast.error("Please select a ticket tier");
      return;
    }
    if (user.role === "ADMIN") {
      toast.error("Admins cannot book tickets");
      return;
    }

    booking.mutate({
      ticketTierId: selectedTier.id,
      quantity,
      couponCode: couponCode.trim() || undefined,
      dietaryNeeds: dietaryNeeds.trim() || undefined,
      specialRequests: specialRequests.trim() || undefined,
    });
  }

  const subtotal = selectedTier ? selectedTier.price * quantity : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      {/* Left: main content */}
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {event.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{event.category}</Badge>
            {event.isVirtual ? <Badge variant="outline">Virtual</Badge> : null}
            {event.ageRestriction ? (
              <Badge variant="outline">{event.ageRestriction}+</Badge>
            ) : null}
          </div>

          <div className="text-muted-foreground grid gap-3 text-sm sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {format(new Date(event.startDate), "EEE, MMM d, yyyy · h:mm a")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>
                {event.venue}, {event.city}, {event.country}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        <section className="prose prose-sm dark:prose-invert max-w-none">
          <h2 className="text-lg font-semibold">About this event</h2>
          <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </section>

        <Separator />

        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <h2 className="text-lg font-semibold">Ticket tiers</h2>
            {!tiersLoading && tiers.length > 0 ? (
              <span className="text-muted-foreground text-xs">
                {tiers.length} tier{tiers.length === 1 ? "" : "s"}
              </span>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {tiers.map((tier) => (
              <TierCard
                key={tier.id}
                tier={tier}
                selected={selectedTierId === tier.id}
                disabled={tier.available <= 0}
                onSelect={() => setSelectedTierId(tier.id)}
              />
            ))}
          </div>

          {tiers.every((t) => t.available <= 0) && soldOutTier ? (
            <div className="bg-muted/30 rounded-lg border border-dashed p-5">
              <div className="flex items-start gap-3">
                <Users className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">All tiers are sold out</p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Join the waitlist for {soldOutTier.name} and we'll notify
                    you the moment a spot opens up.
                  </p>
                  <div className="mt-3">
                    <JoinWaitlistDialog
                      eventId={event.id}
                      ticketTierId={soldOutTier.id}
                      tierName={soldOutTier.name}
                      maxQuantity={soldOutTier.maxPurchase}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      </div>

      {/* Right: booking box */}
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Book your spot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {!selectedTier ? (
              <p className="text-muted-foreground text-sm">
                Select a tier to continue.
              </p>
            ) : (
              <>
                <div>
                  <p className="text-muted-foreground text-xs uppercase">
                    Selected tier
                  </p>
                  <p className="text-base font-semibold">{selectedTier.name}</p>
                  <p className="text-muted-foreground text-sm">
                    ৳{selectedTier.price.toLocaleString()} × {quantity} ={" "}
                    <span className="text-foreground font-medium">
                      ৳{subtotal.toLocaleString()}
                    </span>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qty">Quantity</Label>
                  <Input
                    id="qty"
                    type="number"
                    min={selectedTier.minPurchase}
                    max={Math.min(
                      selectedTier.maxPurchase,
                      selectedTier.available,
                    )}
                    value={quantity}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      if (!Number.isNaN(v) && v >= 1) setQuantity(v);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coupon">
                    Coupon code{" "}
                    <span className="text-muted-foreground text-xs font-normal">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="coupon"
                    placeholder="e.g. EARLY50"
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dietary">
                    Dietary needs{" "}
                    <span className="text-muted-foreground text-xs font-normal">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="dietary"
                    placeholder="e.g. Vegetarian"
                    value={dietaryNeeds}
                    onChange={(e) => setDietaryNeeds(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requests">
                    Special requests{" "}
                    <span className="text-muted-foreground text-xs font-normal">
                      (optional)
                    </span>
                  </Label>
                  <Textarea
                    id="requests"
                    rows={2}
                    placeholder="Accessibility needs, seating preference, etc."
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                  />
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleBook}
                  disabled={booking.isPending || !hasHydrated}
                >
                  {booking.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      {user
                        ? `Pay ৳${subtotal.toLocaleString()}`
                        : "Login to book"}
                    </>
                  )}
                </Button>

                <p className="text-muted-foreground text-center text-xs">
                  You'll be redirected to Stripe Checkout. Booking holds your
                  ticket for 15 minutes.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
