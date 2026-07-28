"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function TenantRentalsLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-10 w-[150px]" />
      </div>

      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-xl">
            <Skeleton className="w-full sm:w-48 h-32 rounded-lg" />
            <div className="flex-1 space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-4 w-1/3" />
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
