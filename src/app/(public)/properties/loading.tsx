import React from 'react';
import { PropertyCardSkeleton } from '@/components/ui/skeletons/CompositeSkeletons';
import { Skeleton } from '@/components/ui/skeletons/Skeleton';

export default function PropertiesLoading() {
  return (
    <main className="w-full flex flex-col pt-32 pb-24 md:pb-32 animate-in fade-in duration-500 bg-[#FEF6EE] min-h-screen">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 xl:px-24 w-full">
        <div className="max-w-3xl mb-10 md:mb-14 space-y-5">
          <Skeleton className="h-12 md:h-14 w-72 md:w-96" />
          <Skeleton className="h-4 w-full max-w-md" />
          <Skeleton className="h-4 w-3/4 max-w-sm" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-4 w-36" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
