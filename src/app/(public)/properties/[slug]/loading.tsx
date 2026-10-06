import React from 'react';
import { Skeleton } from '@/components/ui/skeletons/Skeleton';

export default function PropertyDetailLoading() {
  return (
    <main className="min-h-screen bg-[#FEF6EE] animate-in fade-in duration-500">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[188px] pt-10 md:pt-10">
        
        {/* Back Link Skeleton */}
        <Skeleton className="h-5 w-24 mb-6 rounded-md bg-[#EAE8E1]" />

        {/* Hero Gallery Skeleton - Exact match to GalleryGrid */}
        <div className="mb-8 md:mb-10 w-full">
          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-[2fr_1fr] gap-3 h-[420px] lg:h-[480px]">
            <Skeleton className="w-full h-full rounded-none bg-[#EAE8E1]" />
            <div className="grid grid-rows-2 gap-3 h-full">
              <Skeleton className="w-full h-full rounded-none bg-[#EAE8E1]" />
              <Skeleton className="w-full h-full rounded-none bg-[#EAE8E1]" />
            </div>
          </div>
          {/* Mobile Single Image */}
          <div className="block md:hidden h-[50vh] w-full">
             <Skeleton className="w-full h-full rounded-none bg-[#EAE8E1]" />
          </div>
        </div>

        {/* Content Row: Left Column (Content) + Right Column (Booking Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_345px] gap-8 lg:gap-14 items-start relative pb-16 md:pb-20">
          
          {/* Left Column Content Skeleton */}
          <div className="min-w-0 flex flex-col gap-10 md:gap-12">
            <div>
              {/* Title & Quick Info */}
              <Skeleton className="h-10 md:h-14 w-3/4 mb-6 bg-[#EAE8E1]" />
              <div className="flex gap-4">
                <Skeleton className="h-5 w-20 bg-[#EAE8E1]" />
                <Skeleton className="h-5 w-20 bg-[#EAE8E1]" />
                <Skeleton className="h-5 w-20 bg-[#EAE8E1]" />
              </div>

              {/* Amenities Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-2 items-start">
                    <Skeleton className="h-6 w-6 rounded-full bg-[#EAE8E1]" />
                    <Skeleton className="h-4 w-24 bg-[#EAE8E1]" />
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Booking Card Skeleton */}
            <div className="lg:hidden">
              <Skeleton className="h-[337px] w-full rounded-xl bg-[#EAE8E1]" />
            </div>

            {/* Editorial Description */}
            <div className="space-y-4 mt-4">
              <Skeleton className="h-6 w-full bg-[#EAE8E1]" />
              <Skeleton className="h-6 w-full bg-[#EAE8E1]" />
              <Skeleton className="h-6 w-3/4 bg-[#EAE8E1]" />
            </div>
            
            {/* Experience / Standards Block */}
            <div className="space-y-4 mt-8">
              <Skeleton className="h-8 w-48 mb-6 bg-[#EAE8E1]" />
              <Skeleton className="h-32 w-full bg-[#EAE8E1]" />
            </div>
          </div>

          {/* Right Column Sticky Booking Card Skeleton (Desktop) */}
          <div className="hidden lg:block lg:sticky lg:top-[144px] self-start w-[345px] shrink-0">
             <Skeleton className="h-[337px] w-full rounded-xl bg-[#EAE8E1]" />
          </div>

        </div>
      </div>
    </main>
  );
}
