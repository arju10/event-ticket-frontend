import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentSuccessClient } from "@/components/payment/payment-success-client";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Payment Successful",
  description: "Your booking is being confirmed.",
  robots: { index: false, follow: false },
};

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ bookingId?: string }>;
}) {
  const { bookingId } = await searchParams;

  return (
    <Suspense fallback={<SuccessSkeleton />}>
      <PaymentSuccessClient bookingId={bookingId ?? null} />
    </Suspense>
  );
}

function SuccessSkeleton() {
  return (
    <div className="space-y-4 text-center">
      <Skeleton className="mx-auto h-16 w-16 rounded-full" />
      <Skeleton className="mx-auto h-8 w-64" />
      <Skeleton className="mx-auto h-4 w-80" />
      <Skeleton className="mx-auto h-32 w-full rounded-lg" />
    </div>
  );
}
