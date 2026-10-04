import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="bg-muted mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full">
          <Compass className="text-muted-foreground h-6 w-6" />
        </div>
        <p className="text-6xl font-bold tracking-tighter">404</p>
        <h1 className="mt-2 text-xl font-semibold">Page not found</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button asChild>
            <Link href={ROUTES.home}>Back to home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={ROUTES.events}>Browse events</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
