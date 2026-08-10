import React from 'react';
import { 
  HeroSkeleton, 
  EditorialSkeleton,
  PropertyCardSkeleton
} from '@/components/ui/skeletons/CompositeSkeletons';
import { Skeleton, SkeletonText } from '@/components/ui/skeletons/Skeleton';

export default function PropertyDetailLoading() {
  return (
    <main className="w-full flex flex-col bg-[#F8F5EF] animate-in fade-in duration-500 min-h-screen">
      {/* Hero Gallery Skeleton */}
      <div className="relative w-full h-[70vh] md:h-[85vh]">
        <Skeleton className="w-full h-full rounded-none" />
        <div className="absolute bottom-12 left-6 md:left-10 lg:left-16 z-10 flex flex-col space-y-4">
           <Skeleton className="h-6 w-32 bg-white/30" />
           <Skeleton className="h-12 md:h-16 w-3/4 max-w-2xl bg-white/30" />
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24 w-full">
        {/* Specs Bar Skeleton */}
        <div className="flex flex-wrap gap-8 py-8 border-y border-[#1B1A17]/10 mb-16">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-24" />
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
          <div className="w-full lg:w-2/3">
            <EditorialSkeleton />
          </div>
          
          <div className="w-full lg:w-1/3">
            {/* Booking Widget Skeleton */}
            <div className="sticky top-32 p-8 bg-white shadow-sm flex flex-col space-y-6">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-14 w-full mt-4" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Properties Skeleton */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <Skeleton className="h-10 w-64 mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
