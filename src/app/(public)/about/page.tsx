import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = {
  title: "About",
  description:
    "EventHub is a modern event ticketing platform built around one guarantee: a sold-out tier can never be oversold.",
};

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Correctness first",
    description:
      "Every ticket purchase runs inside a single atomic database transaction. The last ticket in a tier can only be sold once — even under hundreds of concurrent requests.",
  },
  {
    icon: Users,
    title: "Fair to every attendee",
    description:
      "When a tier sells out, join the waitlist. The moment a spot frees up, the next person in line gets a held reservation and a notification — automatically.",
  },
  {
    icon: Sparkles,
    title: "Transparent by default",
    description:
      "Fixed refund windows (100% / 50% / 0%) applied automatically. Every state change is written to an audit log.",
  },
  {
    icon: CalendarDays,
    title: "Built for organizers",
    description:
      "Multi-tier events, coupons, real-time sales analytics, and a door check-in scanner — all part of the platform.",
  },
];

export default function AboutPage() {
  return (
    <div className="container-page py-16 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          About EventHub
        </h1>
        <p className="text-muted-foreground mt-4 text-lg">
          A production-shaped backend, a modern frontend, and one non-negotiable
          guarantee: no ticket tier can ever be oversold.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {VALUES.map((value) => {
          const Icon = value.icon;
          return (
            <div
              key={value.title}
              className="bg-card rounded-xl border p-6 transition-shadow hover:shadow-md"
            >
              <div className="bg-primary/10 text-primary mb-4 flex h-10 w-10 items-center justify-center rounded-lg">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold">{value.title}</h2>
              <p className="text-muted-foreground mt-2 text-sm">
                {value.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-muted/30 mt-14 rounded-2xl border p-8 text-center sm:p-12">
        <h2 className="text-2xl font-semibold tracking-tight">
          Want to host an event on EventHub?
        </h2>
        <p className="text-muted-foreground mt-2">
          Sign up as an organizer and publish your first event in minutes.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href={ROUTES.register}>Create an account</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={ROUTES.contact}>Talk to us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
