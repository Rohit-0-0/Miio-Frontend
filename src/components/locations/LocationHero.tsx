import React from 'react';
import { AppImage } from '@/components/media/AppImage';

interface LocationHeroProps {
  title: string;
  image?: any;
}

export function LocationHero({ title, image }: LocationHeroProps) {
  return (
    <section className="relative w-full h-[52vh] min-h-[380px] max-h-[620px] overflow-hidden bg-[#EAE8E1]">
      {image ? (
        <AppImage
          image={image}
          alt={title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
      <div className="absolute bottom-10 md:bottom-14 left-4 md:left-[188px] right-4">
        <h1 className="font-serif text-[56px] md:text-[72px] lg:text-[80px] text-white tracking-tight leading-none">
          {title}
        </h1>
      </div>
    </section>
  );
}