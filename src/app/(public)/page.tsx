import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarDays,
  ShieldCheck,
  TicketCheck,
  Users,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeaturedEventsSection } from "@/components/events/featured-events-section";
import { ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = {
  title: "EventHub — Discover, Book, and Manage Events",
  description:
    "Discover events, book tickets with guaranteed no-overselling checkout, join waitlists, and manage the full event lifecycle — all in one place.",
  openGraph: {
    title: "EventHub — Discover, Book, and Manage Events",
    description:
      "Book tickets with guaranteed no-overselling checkout. Join waitlists. Manage events end-to-end.",
    type: "website",
  },
};

const FEATURES = [
  {
    icon: TicketCheck,
    title: "No-Overselling Checkout",
    description:
      "Every purchase runs inside a single atomic transaction — the last ticket in a tier can only ever be sold once.",
  },
  {
    icon: Users,
    title: "Waitlist That Actually Converts",
    description:
      "When a spot frees up, the next person in line is notified automatically with a held reservation.",
  },
  {
    icon: ShieldCheck,
    title: "Refund Policy You Can Trust",
    description:
      "Automatic 100% / 50% / 0% refunds based on how far ahead of the event you cancel.",
  },
  {
    icon: Sparkles,
    title: "Organizer Tools Built In",
    description:
      "Create multi-tier events, track sales, check in attendees at the door, and view revenue analytics.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse at top, hsl(262 83% 58% / 0.15), transparent 60%)",
          }}
        />
        <div className="container-page flex flex-col items-center py-20 text-center sm:py-28">
          <span className="bg-background/80 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="text-primary h-3.5 w-3.5" />
            Trusted by organizers and attendees
          </span>

          <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Discover events.
            <br />
            <span className="from-primary bg-gradient-to-r to-indigo-500 bg-clip-text text-transparent">
              Book with confidence.
            </span>
          </h1>

          <p className="text-muted-foreground mt-6 max-w-2xl text-lg">
            The only ticket booking platform that guarantees no-overselling
            checkout, automatic waitlist conversion, and transparent refunds —
            for every single event.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link href={ROUTES.events}>
                Browse Events <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={ROUTES.register}>Become an Organizer</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured events */}
      <section className="container-page py-16">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Upcoming Events
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Hand-picked events starting soon.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href={ROUTES.events}>
              View all <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <FeaturedEventsSection />
      </section>

      {/* Features */}
      <section className="bg-muted/30 py-16">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Why EventHub
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Built around the one technical guarantee every ticketing platform
              should have.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-card rounded-lg border p-5 transition-shadow hover:shadow-md"
                >
                  <div className="bg-primary/10 text-primary mb-4 flex h-10 w-10 items-center justify-center rounded-lg">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground mt-1.5 text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container-page py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            How it works
          </h2>
        </div>

        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              step: "01",
              title: "Discover",
              text: "Search and filter events by category, city, date, or price.",
            },
            {
              step: "02",
              title: "Book",
              text: "Pick your tier, apply a coupon, and pay securely via Stripe.",
            },
            {
              step: "03",
              title: "Join Waitlist",
              text: "Tier sold out? Join the waitlist and get offered the next freed slot.",
            },
            {
              step: "04",
              title: "Attend",
              text: "Show your booking QR at the door. Leave a review afterwards.",
            },
          ].map((item) => (
            <li key={item.step} className="bg-card rounded-lg border p-5">
              <span className="text-primary/30 text-3xl font-bold">
                {item.step}
              </span>
              <h3 className="mt-2 text-base font-semibold">{item.title}</h3>
              <p className="text-muted-foreground mt-1.5 text-sm">
                {item.text}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Final CTA */}
      <section className="container-page pb-20">
        <div className="from-primary/10 via-background to-background relative overflow-hidden rounded-2xl border bg-gradient-to-br p-8 sm:p-12">
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <CalendarDays className="text-primary mx-auto mb-4 h-10 w-10" />
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Ready to host your next event?
            </h2>
            <p className="text-muted-foreground mt-3">
              Set up your event with tiers, coupons, and a waitlist in minutes.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" asChild>
                <Link href={ROUTES.register}>Create your first event</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={ROUTES.pricing}>See pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
