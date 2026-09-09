import React from 'react';

interface PropertyHeaderProps {
  title: string;
  location?: string;
}

export function PropertyHeader({ title }: PropertyHeaderProps) {
  return (
    <div className="mb-3">
      <h1 className="font-serif text-[36px] md:text-[44px] font-normal text-[#1B1A17] leading-tight tracking-tight">
        {title}
      </h1>
    </div>
  );
}
