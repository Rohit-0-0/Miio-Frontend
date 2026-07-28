import React from 'react';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export function Heading({
  children,
  level = 'h2',
  className = '',
}: {
  children: React.ReactNode;
  level?: HeadingLevel;
  className?: string;
}) {
  const Component = level;

  return (
    <Component className={`font-serif font-bold tracking-tight ${className}`}>
      {children}
    </Component>
  );
}
