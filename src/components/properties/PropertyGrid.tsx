import React from 'react';

interface PropertyGridProps {
  children: React.ReactNode;
}

export function PropertyGrid({ children }: PropertyGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
      {children}
    </div>
  );
}
