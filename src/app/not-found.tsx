import Link from "next/link";
import { Compass, Home, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="bg-primary/10 text-primary mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
          <Compass className="h-8 w-8" />
        </div>
        <p className="text-primary/30 text-7xl font-bold tracking-tighter">
          404
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="text-muted-foreground mt-3 text-sm">
          The page you're looking for doesn't exist, was moved, or you don't
          have access to it.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Button asChild>
            <Link href={ROUTES.home}>
              <Home className="mr-2 h-4 w-4" />
              Back home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={ROUTES.events}>
              <CalendarDays className="mr-2 h-4 w-4" />
              Browse events
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
