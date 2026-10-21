import React from 'react';

interface QuickInfoProps {
  guests?: number;
  bedrooms?: number;
  bathrooms?: number;
  beds?: number;
}

export function QuickInfo({ guests, bedrooms, bathrooms }: QuickInfoProps) {
  const parts = [
    guests ? `${guests} guests` : null,
    bedrooms ? `${bedrooms} bedrooms` : null,
    bathrooms ? `${bathrooms} bathrooms` : null,
  ].filter(Boolean);

  if (parts.length === 0) return null;

  return (
    <div className="flex items-center flex-wrap gap-x-6 gap-y-1 font-sans font-medium text-[16px] leading-[130%] text-[#241D19] mb-4">
      {parts.map((p, i) => (
        <span key={i} className="text-[#241D19]">
          {p}
        </span>
      ))}
    </div>
  );
}

