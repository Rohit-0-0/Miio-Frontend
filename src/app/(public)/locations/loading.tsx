import React from 'react';
import { LocationCardSkeleton } from '@/components/ui/skeletons/CompositeSkeletons';
import { Skeleton } from '@/components/ui/skeletons/Skeleton';

export default function LocationsLoading() {
  return (
    <main className="w-full flex flex-col pt-32 pb-24 md:pb-32 animate-in fade-in duration-500 bg-[#F8F5EF] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 w-full">
        {/* Header */}
        <div className="flex flex-col space-y-6 mb-16 text-center items-center">
          <Skeleton className="h-12 md:h-16 w-64 md:w-96" />
          <Skeleton className="h-6 w-full max-w-2xl" />
          <Skeleton className="h-6 w-3/4 max-w-xl" />
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <LocationCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
