import React from 'react';

interface PropertyHeaderProps {
  title: string;
  location: string;
}

export function PropertyHeader({ title, location }: PropertyHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-2">
        {title}
      </h1>
      <p className="text-lg text-gray-600">
        {location}
      </p>
    </div>
  );
}
