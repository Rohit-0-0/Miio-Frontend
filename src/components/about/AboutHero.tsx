import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AboutData } from '@/types/about';

export function AboutHero({ hero }: { hero: AboutData['hero'] }) {
  const imageUrl = hero?.backgroundImage?.assetId 
    ? `https://cdn.sanity.io/images/placeholder/production/${hero.backgroundImage.assetId}`
    : null;

  return (
    <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center bg-gray-900">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={hero.backgroundImage?.alt || hero.title}
          fill
          priority
          className="object-cover object-center opacity-60"
        />
      )}
      {!imageUrl && <div className="absolute inset-0 bg-gray-800" />}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto space-y-6">
        <h1 className="text-5xl md:text-7xl font-serif tracking-tight">{hero?.title}</h1>
        <p className="text-lg md:text-2xl font-light text-white/90">{hero?.subtitle}</p>
        {hero?.cta?.label && hero?.cta?.href && (
          <div className="pt-8">
            <Link
              href={hero.cta.href}
              className="inline-block px-8 py-3 border border-white text-white hover:bg-white hover:text-gray-900 transition-colors duration-300 text-sm tracking-widest uppercase"
            >
              {hero.cta.label}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
