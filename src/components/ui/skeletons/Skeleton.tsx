import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className = '', ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-shimmer rounded-md ${className}`}
      {...props}
    />
  );
}

export function SkeletonText({ className = '', lines = 1 }: { className?: string, lines?: number }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={`h-4 ${i === lines - 1 && lines > 1 ? 'w-2/3' : 'w-full'}`} 
        />
      ))}
    </div>
  );
}

export function SkeletonImage({ className = '' }: SkeletonProps) {
  return <Skeleton className={`w-full h-full object-cover rounded-xl ${className}`} />;
}

export function SkeletonCircle({ className = '' }: SkeletonProps) {
  return <Skeleton className={`rounded-full ${className}`} />;
}

export function SkeletonButton({ className = '' }: SkeletonProps) {
  return <Skeleton className={`h-12 w-32 rounded-full ${className}`} />;
}
