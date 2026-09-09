import React from 'react';

interface PropertyGridProps {
  children: React.ReactNode;
}

export function PropertyGrid({ children }: PropertyGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 md:gap-x-6 gap-y-10">
      {children}
    </div>
  );
}
