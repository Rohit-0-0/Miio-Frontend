import React from 'react';

interface BrowseHeaderProps {
  heading: string;
  introText: string;
}

export function BrowseHeader({ heading, introText }: BrowseHeaderProps) {
  return (
    <div className="max-w-[540px] mb-8 md:mb-10">
      <h1 className="font-serif text-4xl md:text-[48px] lg:text-[56px] font-normal text-[#1B1A17] mb-4 tracking-tight leading-[1.1]">
        {heading}
      </h1>
      <p className="text-[15px] md:text-[16px] font-light text-[#1B1A17]/65 leading-relaxed">
        {introText}
      </p>
    </div>
  );
}
