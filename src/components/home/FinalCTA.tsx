import Link from 'next/link';
import { FinalCtaSection } from '@/types/homepage';
import { HOME_DEFAULTS } from '@/lib/defaults/home';

export function FinalCTA({ finalCta }: { finalCta: FinalCtaSection }) {
  const heading = finalCta?.heading || HOME_DEFAULTS.finalCta.heading;
  const description = finalCta?.description || HOME_DEFAULTS.finalCta.description;
  const buttonText = finalCta?.buttonText || HOME_DEFAULTS.finalCta.buttonText;
  const buttonLink = finalCta?.buttonLink || HOME_DEFAULTS.finalCta.buttonLink;

  return (
    <section className="bg-[#1B1A17] py-32 md:py-48">
      <div className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center space-y-10">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-tight">
          {heading}
        </h2>
        
        {description && (
          <p className="text-lg md:text-xl font-light text-white/70 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
        
        <div className="pt-8">
          <Link
            href={buttonLink}
            className="inline-flex items-center justify-center bg-white text-[#1B1A17] px-8 py-4 text-sm font-medium tracking-widest uppercase transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1B1A17] rounded-sm"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}
