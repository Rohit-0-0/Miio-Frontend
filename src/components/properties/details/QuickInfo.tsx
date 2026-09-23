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
    <div className="flex items-center flex-wrap gap-x-5 gap-y-1 text-[16px] md:text-[18px] text-[#1B1A17] font-sans font-normal mb-8">
      {parts.map((p, i) => (
        <span key={i} className="text-[#1B1A17]">
          {p}
        </span>
      ))}
    </div>
  );
}

