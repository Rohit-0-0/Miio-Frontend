import React from 'react';
import { AppImage } from '@/components/media/AppImage';
import { AboutData } from '@/types/about';
import { RichTextRenderer } from '@/components/ui/editor';

export function AboutStory({ story }: { story: AboutData['story'] }) {
  if (!story) return null;

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <h2 className="text-3xl md:text-5xl font-serif text-gray-900">{story.title}</h2>
          <RichTextRenderer html={story.content} />
        </div>
        <div className="relative w-full aspect-[4/5] bg-gray-100 rounded-sm overflow-hidden">
          <AppImage
            image={story.image}
            alt={story.image?.alt || story.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
