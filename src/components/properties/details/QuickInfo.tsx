import React from 'react';

interface QuickInfoProps {
  guests?: number;
  bedrooms?: number;
  bathrooms?: number;
  beds?: number;
}

export function QuickInfo({ guests, bedrooms, bathrooms, beds }: QuickInfoProps) {
  const parts = [];
  if (guests) parts.push(`${guests} guests`);
  if (bedrooms) parts.push(`${bedrooms} bedrooms`);
  if (beds) parts.push(`${beds} beds`);
  if (bathrooms) parts.push(`${bathrooms} baths`);

  return (
    <div className="flex items-center space-x-2 text-gray-600 text-sm md:text-base border-b border-gray-100 pb-6 mb-6">
      {parts.map((part, i) => (
        <React.Fragment key={part}>
          <span>{part}</span>
          {i < parts.length - 1 && <span>·</span>}
        </React.Fragment>
      ))}
    </div>
  );
}
