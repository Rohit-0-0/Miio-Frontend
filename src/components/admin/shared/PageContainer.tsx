import React from 'react';

export function PageContainer({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`p-6 md:p-10 max-w-7xl mx-auto w-full ${className}`}>
      {children}
    </div>
  );
}
