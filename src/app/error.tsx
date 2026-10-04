"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root error boundary:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="bg-destructive/10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full">
          <AlertTriangle className="text-destructive h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          An unexpected error occurred. You can try again, or head back home.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button onClick={reset}>Try again</Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
          >
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
