import React from 'react';
import { HeroSkeleton, EditorialSkeleton } from '@/components/ui/skeletons/CompositeSkeletons';

export default function AboutLoading() {
  return (
    <main className="w-full flex flex-col bg-white animate-in fade-in duration-500 min-h-screen">
      <HeroSkeleton />
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-24 md:py-32 w-full">
        <div className="max-w-4xl mx-auto w-full">
          <EditorialSkeleton />
        </div>
      </div>
    </main>
  );
}
