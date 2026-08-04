import React from 'react';

interface BrowseHeaderProps {
  heading: string;
  introText: string;
}

export function BrowseHeader({ heading, introText }: BrowseHeaderProps) {
  return (
    <div className="max-w-3xl mb-12 md:mb-16">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6 tracking-tight">
        {heading}
      </h1>
      <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
        {introText}
      </p>
    </div>
  );
}
