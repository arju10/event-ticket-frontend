import type { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Free for attendees. Simple, transparent pricing for organizers. No hidden fees.",
};

const PLANS = [
  {
    name: "Attendee",
    price: "Free",
    priceNote: "forever",
    description: "Book tickets to any event on EventHub.",
    features: [
      "Unlimited event browsing",
      "Secure Stripe checkout",
      "Waitlist access when tiers sell out",
      "Automatic refunds per policy",
      "Booking history & notifications",
    ],
    cta: { label: "Create free account", href: ROUTES.register },
    highlighted: false,
  },
  {
    name: "Organizer",
    price: "Free",
    priceNote: "during launch",
    description: "Publish unlimited events with multi-tier ticketing.",
    features: [
      "Unlimited events & ticket tiers",
      "Multi-step event creation wizard",
      "Real-time sales & revenue analytics",
      "Door check-in scanner",
      "Event-wide waitlist management",
      "Coupon codes & per-user limits",
      "Organizer responses to reviews",
    ],
    cta: { label: "Start organizing", href: ROUTES.register },
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    priceNote: "contact us",
    description: "For teams running large-scale recurring events.",
    features: [
      "Everything in Organizer",
      "Dedicated account manager",
      "Custom refund policies",
      "SLA & priority support",
      "Custom integrations",
    ],
    cta: { label: "Talk to sales", href: ROUTES.contact },
    highlighted: false,
  },
];

const FAQ = [
  {
    q: "Is there a per-ticket fee?",
    a: "No. EventHub doesn't charge a per-ticket fee. Payment processing fees from Stripe apply normally.",
  },
  {
    q: "Can attendees get refunds?",
    a: "Yes — refunds are automatic: 100% if you cancel 7+ days before the event, 50% between 24h and 7 days, 0% within 24 hours. If the organizer cancels the event, you get a full refund regardless.",
  },
  {
    q: "How does the waitlist work?",
    a: "When a tier is sold out, join the waitlist. If a ticket frees up, we hold it for you for two hours and notify you. If you don't book in time, it cascades to the next person.",
  },
  {
    q: "Can I change my event after publishing?",
    a: "You can edit an event until it starts. Once an event has begun, edits are locked to protect attendees who already have tickets.",
  },
];

export default function PricingPage() {
  return (
    <div className="container-page py-16 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Simple, transparent pricing
        </h1>
        <p className="text-muted-foreground mt-4 text-lg">
          Free for attendees. Free for organizers during launch. No hidden fees,
          ever.
        </p>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              "relative flex flex-col",
              plan.highlighted && "border-primary shadow-lg lg:scale-[1.02]",
            )}
          >
            {plan.highlighted ? (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gap-1">
                <Sparkles className="h-3 w-3" />
                Most popular
              </Badge>
            ) : null}
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-2 text-sm">
                  {plan.priceNote}
                </span>
              </div>

              <ul className="mb-6 flex-1 space-y-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="text-primary mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.highlighted ? "default" : "outline"}
                className="w-full"
                asChild
              >
                <Link href={plan.cta.href}>{plan.cta.label}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mx-auto mt-20 max-w-3xl">
        <h2 className="text-center text-2xl font-semibold tracking-tight">
          Frequently asked questions
        </h2>
        <dl className="mt-8 space-y-6">
          {FAQ.map((item) => (
            <div
              key={item.q}
              className="bg-card hover:border-primary/40 rounded-lg border p-5 transition-colors"
            >
              <dt className="text-base font-semibold">{item.q}</dt>
              <dd className="text-muted-foreground mt-2 text-sm">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
