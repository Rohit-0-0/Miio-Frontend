import React from 'react';

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionContainer({ children, className = '' }: SectionContainerProps) {
  return (
    <section className={`py-24 px-6 md:px-12 xl:px-24 mx-auto max-w-[1920px] ${className}`}>
      {children}
    </section>
  );
}
