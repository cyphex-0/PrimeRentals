import { Skeleton } from "@/components/ui/skeleton";
import { PropertyCardSkeleton } from "@/components/ui/property-card-skeleton";

export default function PropertiesLoading() {
  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0 space-y-4">
          <Skeleton className="h-8 w-1/2 mb-4" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </aside>
        
        <main className="flex-1">
          <Skeleton className="h-10 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
