import React from 'react';

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}
