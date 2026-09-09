import React from 'react';
import { RichTextRenderer } from '@/components/ui/editor';
import { EditorialContentRenderer } from '@/components/ui/EditorialContentRenderer';

interface EditorialDescriptionProps {
  description?: string;
  fallbackDescription?: string;
}

export function EditorialDescription({ description, fallbackDescription }: EditorialDescriptionProps) {
  if (!description && !fallbackDescription) return null;

  return (
    <section className="mb-2">
      <h2 className="font-serif text-[18px] text-[#1B1A17] mb-3">Description</h2>
      {description ? (
        <div className="prose prose-p:text-[15px] prose-p:leading-relaxed prose-p:text-[#1B1A17]/75 max-w-none">
          <RichTextRenderer html={description} />
        </div>
      ) : fallbackDescription ? (
        <div className="text-[15px] leading-relaxed text-[#1B1A17]/75">
          <EditorialContentRenderer content={fallbackDescription} />
        </div>
      ) : null}
    </section>
  );
}