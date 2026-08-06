'use client';

import Link from 'next/link';
import { HeroSection } from '@/types/homepage';
import { SearchWidget } from '@/components/shared/SearchWidget';
import { HOME_DEFAULTS } from '@/lib/defaults/home';
import { CrossfadeCarousel } from '@/components/shared/CrossfadeCarousel';

export function Hero({ hero }: { hero: HeroSection }) {
  let resolvedImages: any[] = (hero?.images || []).map((img: any) => ({
    assetId: img.assetId || img.asset?._ref || img._ref || '',
    alt: img.alt || hero.title,
  }));

  // Provide the original default fallback to prevent black background
  if (resolvedImages.length === 0) {
    resolvedImages = [HOME_DEFAULTS.hero.backgroundImage];
  }

  if (!hero) return null;

  const eyebrow = hero.eyebrow || HOME_DEFAULTS.hero.eyebrow;
  const title = hero.title || HOME_DEFAULTS.hero.title;
  const subtitle = hero.subtitle || HOME_DEFAULTS.hero.subtitle;
  const primaryCtaLabel = hero.primaryCta?.label || HOME_DEFAULTS.hero.cta.text;

  return (
    <section 
      className="relative w-full h-[100svh] flex flex-col justify-end pb-24 md:pb-32 overflow-hidden bg-[#1B1A17]"
      role="banner"
      aria-label={hero.backgroundAlt || title}
    >
      {/* Background Images Carousel */}
      <div className="absolute inset-0 z-0">
        <CrossfadeCarousel 
          images={resolvedImages} 
          alt={hero.backgroundAlt || title} 
        />
      </div>

      {/* Gradient Overlay for Text Readability */}
      <div 
        className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10"
        style={{ opacity: hero.overlayOpacity ?? 1 }}
      />

      {/* Content */}
      <div className="relative z-10 w-full px-6 md:px-10 lg:px-16 mx-auto max-w-7xl flex flex-col items-start animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300 fill-mode-both">
        
        {eyebrow && (
          <span className="text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-white/80 mb-6 block">
            {eyebrow}
          </span>
        )}
        
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium tracking-wide text-white leading-[1.1] mb-6 max-w-4xl">
          {title}
        </h1>
        
        <p className="text-lg md:text-xl font-light text-white/90 max-w-2xl leading-relaxed mb-12">
          {subtitle}
        </p>
        
        {/* Search Component */}
        <div className="w-full max-w-4xl mt-12 bg-white/10 backdrop-blur-md rounded-sm p-2 flex flex-col md:flex-row gap-2">
          <SearchWidget primaryCtaLabel={primaryCtaLabel} />
        </div>
      </div>
    </section>
  );
}
