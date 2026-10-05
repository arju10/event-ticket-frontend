import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentCancelClient } from "@/components/payment/payment-cancel-client";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Payment Cancelled",
  description: "Your payment was cancelled.",
  robots: { index: false, follow: false },
};

export default async function PaymentCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ bookingId?: string }>;
}) {
  const { bookingId } = await searchParams;

  return (
    <Suspense
      fallback={
        <div className="space-y-4 text-center">
          <Skeleton className="mx-auto h-16 w-16 rounded-full" />
          <Skeleton className="mx-auto h-8 w-64" />
        </div>
      }
    >
      <PaymentCancelClient bookingId={bookingId ?? null} />
    </Suspense>
  );
}
