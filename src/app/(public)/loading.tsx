import React from 'react';
import { 
  HeroSkeleton, 
  PropertyCardSkeleton, 
  LocationCardSkeleton,
  JournalCardSkeleton
} from '@/components/ui/skeletons/CompositeSkeletons';
import { Skeleton, SkeletonText } from '@/components/ui/skeletons/Skeleton';

export default function HomeLoading() {
  return (
    <main className="w-full flex flex-col animate-in fade-in duration-500">
      <HeroSkeleton />
      
      <section className="bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-24 md:py-32 flex flex-col lg:flex-row gap-16 xl:gap-24 items-stretch">
          <div className="w-full lg:w-2/3">
            <div className="flex flex-col space-y-12">
              <div className="flex justify-between items-end">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-4 w-24 hidden md:block" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-12">
                {Array.from({ length: 4 }).map((_, i) => (
                  <PropertyCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/3 flex">
            <div className="flex flex-col space-y-8 bg-[#F8F5EF] p-12 w-full h-full justify-center">
              <Skeleton className="h-6 w-32" />
              <SkeletonText lines={4} className="text-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Locations Skeleton */}
      <section className="bg-white pb-24 md:pb-32">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="flex flex-col space-y-12">
            <div className="flex justify-between items-end">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-4 w-24 hidden md:block" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <LocationCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
