import type { ReactNode } from "react";
import Link from "next/link";
import { CalendarDays, ShieldCheck, Sparkles, Users } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";

const PERKS = [
  { icon: ShieldCheck, text: "No-overselling checkout guarantee" },
  { icon: Users, text: "Automatic waitlist conversion" },
  { icon: Sparkles, text: "Multi-tier events with coupons" },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="from-primary via-primary text-primary-foreground relative hidden overflow-hidden bg-gradient-to-br to-indigo-600 p-12 lg:flex lg:flex-col">
        <div
          aria-hidden
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative z-10 flex h-full flex-col">
          <Link href={ROUTES.home} className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
              <CalendarDays className="h-5 w-5" />
            </span>
            <span className="text-xl font-semibold tracking-tight">
              EventHub
            </span>
          </Link>

          <div className="mt-auto space-y-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ticketing that
                <br />
                just works.
              </h2>
              <p className="text-primary-foreground/80 mt-4 max-w-md">
                Discover events, book with confidence, and manage the full
                lifecycle — from a single dashboard.
              </p>
            </div>

            <ul className="space-y-3">
              {PERKS.map((perk) => {
                const Icon = perk.icon;
                return (
                  <li key={perk.text} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm">{perk.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-col">
        {/* Mobile header */}
        <div className="flex items-center justify-between border-b px-6 py-4 lg:hidden">
          <Link href={ROUTES.home} className="flex items-center gap-2">
            <span className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
              <CalendarDays className="h-4 w-4" />
            </span>
            <span className="text-lg font-semibold">EventHub</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
