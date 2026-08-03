import Link from 'next/link';
import { FinalCtaSection } from '@/types/homepage';

export function FinalCTA({ finalCta }: { finalCta: FinalCtaSection }) {
  if (!finalCta) return null;

  return (
    <section className="bg-[#1B1A17] py-32 md:py-48">
      <div className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center space-y-10">
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-tight">
          {finalCta.heading}
        </h2>
        
        {finalCta.description && (
          <p className="text-lg md:text-xl font-light text-white/70 max-w-2xl leading-relaxed">
            {finalCta.description}
          </p>
        )}
        
        <div className="pt-8">
          <Link
            href={finalCta.buttonLink || '/properties'}
            className="inline-flex items-center justify-center bg-white text-[#1B1A17] px-8 py-4 text-sm font-medium tracking-widest uppercase transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1B1A17] rounded-sm"
          >
            {finalCta.buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}
