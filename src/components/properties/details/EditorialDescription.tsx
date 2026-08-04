import React from 'react';
import { RichTextRenderer } from '@/components/ui/editor';

interface EditorialDescriptionProps {
  description?: string;
  fallbackDescription?: string;
}

export function EditorialDescription({ description, fallbackDescription }: EditorialDescriptionProps) {
  return (
    <section className="mb-12">
      <div className="prose prose-lg text-gray-600 prose-p:leading-relaxed">
        {description ? (
          <RichTextRenderer html={description} />
        ) : fallbackDescription ? (
          <RichTextRenderer html={fallbackDescription} />
        ) : (
          <p>No description available.</p>
        )}
      </div>
    </section>
  );
}
