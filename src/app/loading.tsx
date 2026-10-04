import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <div className="container-page py-12">
      <Skeleton className="h-10 w-1/2" />
      <Skeleton className="mt-4 h-4 w-1/3" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-56 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
