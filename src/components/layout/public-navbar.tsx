"use client";

import Link from "next/link";
import { Menu, CalendarDays } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCurrentUser } from "@/hooks/use-current-user";
import { HOME_BY_ROLE, ROUTES } from "@/lib/constants/routes";

const NAV_LINKS = [
  { href: ROUTES.events, label: "Browse Events" },
  { href: ROUTES.pricing, label: "Pricing" },
  { href: ROUTES.about, label: "About" },
  { href: ROUTES.contact, label: "Contact" },
];

export function PublicNavbar() {
  const { user, hasHydrated } = useCurrentUser();
  const [open, setOpen] = useState(false);

  const homeHref = user ? HOME_BY_ROLE[user.role] : ROUTES.home;

  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href={ROUTES.home} className="flex items-center gap-2">
          <span className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
            <CalendarDays className="h-4 w-4" />
          </span>
          <span className="text-lg font-semibold tracking-tight">EventHub</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {!hasHydrated ? (
            <div className="bg-muted h-9 w-24 animate-pulse rounded-md" />
          ) : user ? (
            <Button asChild>
              <Link href={homeHref}>My Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href={ROUTES.login}>Login</Link>
              </Button>
              <Button asChild>
                <Link href={ROUTES.register}>Get Started</Link>
              </Button>
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>
            <div className="mt-6 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="hover:bg-muted rounded-md px-3 py-2 text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2 border-t pt-4">
                {user ? (
                  <Button asChild onClick={() => setOpen(false)}>
                    <Link href={homeHref}>My Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      asChild
                      onClick={() => setOpen(false)}
                    >
                      <Link href={ROUTES.login}>Login</Link>
                    </Button>
                    <Button asChild onClick={() => setOpen(false)}>
                      <Link href={ROUTES.register}>Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
