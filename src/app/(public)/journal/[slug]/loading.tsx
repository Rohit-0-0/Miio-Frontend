import React from 'react';
import { HeroSkeleton, EditorialSkeleton } from '@/components/ui/skeletons/CompositeSkeletons';
import { Skeleton } from '@/components/ui/skeletons/Skeleton';

export default function JournalDetailLoading() {
  return (
    <main className="w-full flex flex-col bg-[#F8F5EF] animate-in fade-in duration-500 min-h-screen">
      <HeroSkeleton />
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24 w-full">
        <div className="max-w-4xl mx-auto w-full">
          {/* Article Info Skeleton */}
          <div className="flex flex-wrap gap-8 py-8 border-y border-[#1B1A17]/10 mb-16">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <EditorialSkeleton />
        </div>
      </div>
    </main>
  );
}
