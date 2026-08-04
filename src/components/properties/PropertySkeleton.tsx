import React from 'react';

export function PropertySkeleton() {
  return (
    <div className="block animate-pulse">
      <div className="w-full aspect-[3/4] rounded-sm bg-gray-100 mb-5"></div>
      <div className="flex flex-col gap-2">
        <div className="h-6 bg-gray-100 rounded w-2/3"></div>
        <div className="h-4 bg-gray-100 rounded w-full max-w-[250px] mt-1"></div>
        <div className="h-4 bg-gray-100 rounded w-16 mt-3"></div>
      </div>
    </div>
  );
}
