import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";

export function PublicFooter() {
  return (
    <footer className="border-border/60 bg-muted/30 mt-20 border-t">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
              <CalendarDays className="h-4 w-4" />
            </span>
            <span className="text-lg font-semibold">EventHub</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Discover, book, and manage events — with guaranteed no-overselling
            checkout.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Product</h4>
          <ul className="text-muted-foreground space-y-2 text-sm">
            <li>
              <Link href={ROUTES.events} className="hover:text-foreground">
                Browse Events
              </Link>
            </li>
            <li>
              <Link href={ROUTES.pricing} className="hover:text-foreground">
                Pricing
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Company</h4>
          <ul className="text-muted-foreground space-y-2 text-sm">
            <li>
              <Link href={ROUTES.about} className="hover:text-foreground">
                About
              </Link>
            </li>
            <li>
              <Link href={ROUTES.contact} className="hover:text-foreground">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Get Started</h4>
          <ul className="text-muted-foreground space-y-2 text-sm">
            <li>
              <Link href={ROUTES.login} className="hover:text-foreground">
                Login
              </Link>
            </li>
            <li>
              <Link href={ROUTES.register} className="hover:text-foreground">
                Create Account
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-border/60 text-muted-foreground border-t py-4 text-center text-xs">
        © {new Date().getFullYear()} EventHub. All rights reserved.
      </div>
    </footer>
  );
}
