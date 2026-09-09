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
    <p className="text-[15px] text-[#1B1A17]/70 mb-8">
      {parts.join('  ')}
    </p>
  );
}
