import React from 'react';
import { Skeleton } from '@/components/ui/skeletons/Skeleton';

export default function PropertyDetailLoading() {
  return (
    <main className="w-full flex flex-col bg-[#FEF6EE] animate-in fade-in duration-500 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[188px] pt-10 w-full pb-20">
        <Skeleton className="h-4 w-28 mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-3 h-[320px] md:h-[420px] mb-10">
          <Skeleton className="w-full h-full rounded-none" />
          <div className="hidden md:grid grid-rows-2 gap-3">
            <Skeleton className="w-full h-full rounded-none" />
            <Skeleton className="w-full h-full rounded-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
          <div className="space-y-6">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-4 w-48" />
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-20 w-full" />
          </div>
          <Skeleton className="h-[360px] w-full rounded-2xl" />
        </div>
      </div>
    </main>
  );
}
