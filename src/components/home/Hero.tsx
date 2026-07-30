import Link from 'next/link';
import { HeroSection } from '@/types/homepage';
import { buildImageUrl } from '@/lib/media/buildImageUrl';

export function Hero({ hero }: { hero: HeroSection }) {
  if (!hero) return null;

  const imageUrl = buildImageUrl(hero.backgroundImage?.assetId);

  return (
    <section 
      className="relative w-full flex items-center overflow-hidden bg-gray-900"
      style={{
        minHeight: hero.heroHeight || '80vh',
        backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      role="banner"
      aria-label={hero.backgroundAlt || hero.title}
    >
      {/* Overlay */}
      {hero.overlayOpacity !== undefined && hero.overlayOpacity > 0 && (
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: hero.overlayOpacity }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 w-full px-6 md:px-10 lg:px-16 mx-auto max-w-7xl flex flex-col justify-center"
           style={{ alignItems: hero.textAlignment === 'left' ? 'flex-start' : hero.textAlignment === 'right' ? 'flex-end' : 'center', textAlign: hero.textAlignment || 'center' }}>
        
        {hero.eyebrow && (
          <span className="text-sm md:text-base font-semibold uppercase tracking-widest text-white/80 mb-4 block">
            {hero.eyebrow}
          </span>
        )}
        
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight mb-6 max-w-4xl">
          {hero.title}
        </h1>
        
        <p className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed mb-10">
          {hero.subtitle}
        </p>
        
        <div className={`flex flex-col sm:flex-row gap-4 ${hero.textAlignment === 'left' ? 'justify-start' : hero.textAlignment === 'right' ? 'justify-end' : 'justify-center'} w-full max-w-md`}>
          {hero.primaryCta && (
            <Link
              href={hero.primaryCta.href || '#'}
              className="inline-flex items-center justify-center rounded-sm bg-white px-8 py-3.5 text-base font-medium text-gray-900 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 w-full sm:w-auto"
            >
              {hero.primaryCta.label || 'Learn More'}
            </Link>
          )}
          {hero.secondaryCta?.label && (
            <Link
              href={hero.secondaryCta.href || '#'}
              className="inline-flex items-center justify-center rounded-sm bg-transparent border border-white px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 w-full sm:w-auto"
            >
              {hero.secondaryCta.label}
            </Link>
          )}
        </div>
      </div>

      {hero.showScrollIndicator && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 animate-bounce z-10 flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest mb-2 opacity-75">Scroll</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      )}
    </section>
  );
}
