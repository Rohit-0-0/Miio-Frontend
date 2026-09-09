import React from 'react';
import { RichTextRenderer } from '@/components/ui/editor';

interface PropertyExperienceProps {
  experience?: string;
}

export function PropertyExperience({ experience }: PropertyExperienceProps) {
  if (!experience) return null;

  return (
    <section className="py-2 font-[family-name:var(--font-instrument-sans)]">
      {/* Figma Heading/H3: Instrument Sans 500 / 16px / 130% / #241D19 */}
      <h2 className="text-[16px] font-medium leading-[130%] text-[#241D19] mb-3 tracking-normal">
        The experience
      </h2>
      {/* Figma Body/Small: Instrument Sans 400 / 14px / 140% / #5F4E44 / max ~705px */}
      <div className="max-w-[705px] text-[14px] font-normal leading-[140%] text-[#5F4E44] [&_p]:text-[14px] [&_p]:leading-[140%] [&_p]:text-[#5F4E44] [&_p]:font-normal [&_p]:m-0">
        <RichTextRenderer html={experience} />
      </div>
    </section>
  );
}