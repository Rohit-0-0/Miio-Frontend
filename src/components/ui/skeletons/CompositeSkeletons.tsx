import React from 'react';
import { Skeleton, SkeletonText, SkeletonImage } from './Skeleton';

export function PropertyCardSkeleton() {
  return (
    <div className="flex flex-col space-y-4">
      <SkeletonImage className="aspect-[4/3] rounded-sm" />
      <div className="flex flex-col space-y-3">
        <div className="flex justify-between items-start gap-4">
          <Skeleton className="h-6 md:h-8 w-2/3" />
          <Skeleton className="h-5 w-1/4 mt-1" />
        </div>
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}

export function LocationCardSkeleton() {
  return (
    <div className="flex flex-col space-y-4">
      <SkeletonImage className="aspect-[3/4] rounded-sm" />
      <Skeleton className="h-8 w-1/2 mx-auto" />
      <Skeleton className="h-4 w-1/4 mx-auto" />
    </div>
  );
}

export function JournalCardSkeleton() {
  return (
    <div className="flex flex-col space-y-4">
      <SkeletonImage className="aspect-[4/5] rounded-sm" />
      <div className="flex flex-col space-y-3 items-center text-center mt-4">
        <Skeleton className="h-3 w-1/4 uppercase tracking-widest" />
        <Skeleton className="h-6 md:h-8 w-3/4" />
        <Skeleton className="h-4 w-1/3 mt-2" />
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative w-full h-[100svh] flex flex-col justify-end pb-24 md:pb-32 overflow-hidden">
      {/* Background Skeleton */}
      <Skeleton className="absolute inset-0 rounded-none bg-gray-200/50 dark:bg-gray-800/50" />
      
      {/* Content Skeleton */}
      <div className="relative z-10 w-full px-6 md:px-10 lg:px-16 mx-auto max-w-7xl flex flex-col items-start space-y-6">
        <Skeleton className="h-4 w-32 bg-gray-300/30" />
        <Skeleton className="h-16 md:h-20 lg:h-24 w-3/4 max-w-2xl bg-gray-300/30" />
        <Skeleton className="h-6 w-1/2 max-w-lg bg-gray-300/30" />
        
        {/* Search Widget Skeleton inside Hero */}
        <div className="w-full max-w-4xl mt-12 bg-gray-100/10 backdrop-blur-md rounded-sm p-2 flex flex-col md:flex-row gap-2 h-[68px]">
           <Skeleton className="h-full w-full bg-gray-300/20" />
        </div>
      </div>
    </div>
  );
}

export function EditorialSkeleton() {
  return (
    <div className="w-full max-w-4xl flex flex-col space-y-12">
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <SkeletonText lines={4} />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <SkeletonText lines={3} />
        <div className="ml-5 space-y-2 mt-4">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
    </div>
  );
}

export function SearchWidgetSkeleton() {
  return (
    <div className="w-full bg-white shadow-sm border border-gray-100 rounded-sm p-2 flex flex-col md:flex-row items-center h-[68px]">
      <Skeleton className="h-full w-full bg-gray-100 rounded-sm" />
    </div>
  );
}
