"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="max-w-md text-center">
        <div className="bg-destructive/10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full">
          <AlertTriangle className="text-destructive h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold">Admin panel error</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Something went wrong loading this section.
        </p>
        <Button onClick={reset} className="mt-6">
          Try again
        </Button>
      </div>
    </div>
  );
}
