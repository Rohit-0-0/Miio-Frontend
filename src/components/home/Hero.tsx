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
      className="relative w-full z-40"
      role="banner"
      aria-label={hero.backgroundAlt || title}
    >
      <div className="relative w-full min-h-[440px] md:min-h-[673px] md:h-[calc(100vh-128px)] flex flex-col items-center justify-start pt-8 md:justify-center md:pt-0 pb-6 md:pb-0">
        {/* Background Images Carousel */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <CrossfadeCarousel 
            images={resolvedImages} 
            alt={hero.backgroundAlt || title} 
            priority={true}
          />
        </div>

        {/* Overlay (Figma: #00000033) */}
        <div 
          className="absolute inset-0 z-0 bg-[#00000033] overflow-hidden"
          style={{ opacity: hero.overlayOpacity ?? 1 }}
        />

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto flex flex-col items-center text-center px-4 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300 fill-mode-both">
          
          <h1 className="font-serif text-[32px] md:text-[56px] font-medium tracking-wide text-white leading-[1.08] mb-3 md:mb-6 max-w-[310px] md:max-w-[636px]">
            {title}
          </h1>
          
          <p className="font-sans text-[15px] md:text-lg font-normal md:font-light text-white max-w-[350px] md:max-w-[500px] leading-none md:leading-relaxed mb-8 md:mb-12">
            {subtitle}
          </p>

          {/* Search Component (flowing below subtitle) */}
          <div className="w-full max-w-[800px] flex justify-center z-20">
            <SearchWidget 
              primaryCtaLabel="Search"
              labels={hero.searchWidgetLabels}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
