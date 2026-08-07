import React from 'react';
import { RichTextRenderer } from '@/components/ui/editor';
import { EditorialContentRenderer } from '@/components/ui/EditorialContentRenderer';

interface EditorialDescriptionProps {
  description?: string;
  fallbackDescription?: string;
}

export function EditorialDescription({ description, fallbackDescription }: EditorialDescriptionProps) {
  if (!description && !fallbackDescription) {
    return (
      <section className="mb-12">
        <p className="text-gray-600">No description available.</p>
      </section>
    );
  }

  return (
    <section className="mb-12 max-w-4xl">
      {description ? (
        <div className="prose prose-lg text-gray-600 prose-p:leading-relaxed">
          <RichTextRenderer html={description} />
        </div>
      ) : fallbackDescription ? (
        <EditorialContentRenderer content={fallbackDescription} />
      ) : null}
    </section>
  );
}
