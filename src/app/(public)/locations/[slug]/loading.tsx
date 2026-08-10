import React from 'react';
import { 
  HeroSkeleton, 
  PropertyCardSkeleton
} from '@/components/ui/skeletons/CompositeSkeletons';
import { Skeleton } from '@/components/ui/skeletons/Skeleton';

export default function LocationDetailLoading() {
  return (
    <main className="w-full flex flex-col bg-[#F8F5EF] animate-in fade-in duration-500 min-h-screen">
      {/* Hero Skeleton */}
      <HeroSkeleton />

      {/* Properties in this Location */}
      <section className="py-24 md:py-32 w-full">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="flex flex-col space-y-12">
            <Skeleton className="h-10 md:h-12 w-64 md:w-96" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {Array.from({ length: 6 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
