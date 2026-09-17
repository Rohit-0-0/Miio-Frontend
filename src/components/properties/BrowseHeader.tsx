import React from 'react';

interface BrowseHeaderProps {
  heading: string;
  introText: string;
}

export function BrowseHeader({ heading, introText }: BrowseHeaderProps) {
  return (
    <div className="flex flex-col gap-[12px] mb-8 md:mb-[52px]">
      <h1 className="font-serif text-[32px] md:text-[40px] font-normal text-[#1B1A17] leading-[1.1] md:leading-[108%]">
        {heading}
      </h1>
      <p className="font-sans text-[16px] md:text-[20px] font-normal text-[#1B1A17] leading-[140%] md:leading-[100%] w-full">
        {introText}
      </p>
    </div>
  );
}
