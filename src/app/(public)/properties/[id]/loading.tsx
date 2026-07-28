"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="space-y-4 flex-1">
            <Skeleton className="h-10 w-3/4 max-w-2xl" />
            <div className="flex flex-wrap items-center gap-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        {/* Gallery Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3 aspect-[16/9] md:aspect-auto md:h-[500px]">
            <Skeleton className="w-full h-full rounded-2xl" />
          </div>
          <div className="hidden md:grid grid-rows-3 gap-4 h-[500px]">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="w-full h-full rounded-2xl" />
            ))}
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-40" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>

            <div className="space-y-4">
              <Skeleton className="h-8 w-40" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </div>
          </div>

          <div>
            <Skeleton className="h-[400px] w-full rounded-2xl sticky top-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
