import React from 'react';

interface PropertyHeaderProps {
  title: string;
  subtitle?: string;
  shortDescription?: string;
  location?: string;
}

export function PropertyHeader({ title, subtitle, shortDescription }: PropertyHeaderProps) {
  return (
    <div className="mb-4">
      <h1 className="font-serif text-[36px] md:text-[44px] font-normal text-[#1B1A17] leading-tight tracking-tight mb-3">
        {title}
      </h1>
      {subtitle && (
        <h2 className="font-sans font-semibold text-[20px] text-[#241D19] leading-[140%] tracking-normal mb-1">
          {subtitle}
        </h2>
      )}
      {shortDescription && (
        <p className="font-sans font-normal text-[16px] text-[#241D19] leading-[140%] tracking-normal max-w-[680px]">
          {shortDescription}
        </p>
      )}
    </div>
  );
}
