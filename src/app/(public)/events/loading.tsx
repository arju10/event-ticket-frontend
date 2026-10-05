import { CardGridSkeleton } from "@/components/shared/loading-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventsLoading() {
  return (
    <div className="container-page py-10 sm:py-14">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="mt-3 h-4 w-96" />
      <div className="mt-8">
        <Skeleton className="mb-6 h-24 w-full rounded-lg" />
        <CardGridSkeleton count={9} />
      </div>
    </div>
  );
}
