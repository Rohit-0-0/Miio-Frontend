import React from 'react';
import { AppImage } from '@/components/media/AppImage';

interface LocationHeroProps {
  title: string;
  image?: any;
}

export function LocationHero({ title, image }: LocationHeroProps) {
  return (
    <section className="w-full bg-[#FEF6EE]">
      <div className="relative w-full h-[320px] md:h-[433px] overflow-hidden">
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
        
        {/* Inner wrapper to keep the text aligned with the 1440px layout constraints while image bleeds full width */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <div className="relative mx-auto max-w-[1440px] w-full h-full">
            <div className="absolute bottom-10 md:bottom-14 left-4 md:left-[188px] right-4 pointer-events-auto">
              <h1 className="font-serif text-[56px] md:text-[72px] lg:text-[80px] text-white tracking-tight leading-none">
                {title}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}