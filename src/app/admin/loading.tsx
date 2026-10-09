import {
  StatCardsSkeleton,
  TableSkeleton,
} from "@/components/shared/loading-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-8 w-64" />
      <StatCardsSkeleton count={4} />
      <TableSkeleton rows={6} />
    </div>
  );
}
