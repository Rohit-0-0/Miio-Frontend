import React from 'react';
import Image from 'next/image';
import { AboutData } from '@/types/about';

export function AboutStory({ story }: { story: AboutData['story'] }) {
  if (!story) return null;

  const imageUrl = story.image?.assetId 
    ? `https://cdn.sanity.io/images/placeholder/production/${story.image.assetId}`
    : null;

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <h2 className="text-3xl md:text-5xl font-serif text-gray-900">{story.title}</h2>
          <div className="prose prose-lg prose-gray font-light text-gray-600 leading-relaxed whitespace-pre-wrap">
            {story.content}
          </div>
        </div>
        <div className="relative w-full aspect-[4/5] bg-gray-100 rounded-sm overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={story.image?.alt || story.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
