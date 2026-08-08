import { Skeleton } from "@/components/ui/skeleton";

export function PropertyCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/50 bg-card p-4">
      <Skeleton className="aspect-[4/3] w-full rounded-xl" />
      <div className="space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex gap-4 mt-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
      </div>
      <div className="border-t border-border/50 pt-4 mt-2">
        <Skeleton className="h-6 w-1/3" />
      </div>
    </div>
  );
}
