import React from 'react';
import { 
  PropertyCardSkeleton, 
  SearchWidgetSkeleton
} from '@/components/ui/skeletons/CompositeSkeletons';
import { Skeleton } from '@/components/ui/skeletons/Skeleton';

export default function PropertiesLoading() {
  return (
    <main className="w-full flex flex-col pt-32 pb-24 md:pb-32 animate-in fade-in duration-500 bg-[#F8F5EF] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 w-full">
        {/* Header & Search */}
        <div className="flex flex-col space-y-8 mb-16">
          <Skeleton className="h-12 w-64 md:w-96" />
          <SearchWidgetSkeleton />
        </div>
        
        {/* Filter/Sort Bar */}
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-48" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {Array.from({ length: 9 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
