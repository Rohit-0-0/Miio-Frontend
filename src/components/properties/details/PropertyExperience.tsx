import React from 'react';
import { RichTextRenderer } from '@/components/ui/editor';

interface PropertyExperienceProps {
  experience?: string;
}

export function PropertyExperience({ experience }: PropertyExperienceProps) {
  if (!experience) return null;

  return (
    <section className="mb-12 pt-12 border-t border-gray-100">
      <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">
        The Experience
      </h2>
      <div className="prose prose-lg text-gray-600">
        <RichTextRenderer html={experience} />
      </div>
    </section>
  );
}
