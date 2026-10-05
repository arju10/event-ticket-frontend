import type { ReactNode } from "react";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";

export default function PaymentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-border/60 border-b">
        <div className="container-page flex h-16 items-center justify-between">
          <Link href={ROUTES.home} className="flex items-center gap-2">
            <span className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
              <CalendarDays className="h-4 w-4" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              EventHub
            </span>
          </Link>
          <span className="text-muted-foreground text-xs">Secure checkout</span>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">{children}</div>
      </main>
    </div>
  );
}
