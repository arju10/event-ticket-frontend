import { DetailSkeleton } from "@/components/shared/loading-skeleton";

export default function EventDetailLoading() {
  return (
    <div className="container-page py-10 sm:py-14">
      <DetailSkeleton />
    </div>
  );
}
