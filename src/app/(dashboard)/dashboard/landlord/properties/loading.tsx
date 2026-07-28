"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function LandlordPropertiesLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      <Skeleton className="h-10 w-[300px]" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-xl border overflow-hidden">
            <Skeleton className="h-48 w-full rounded-none" />
            <div className="p-5 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-6 w-1/4" />
              </div>
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-4">
                <Skeleton className="h-12 w-16" />
                <Skeleton className="h-12 w-16" />
              </div>
            </div>
            <div className="p-5 pt-0 flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-12" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
