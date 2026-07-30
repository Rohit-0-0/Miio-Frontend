import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { WhyMiioSection } from '@/types/homepage';
import { buildImageUrl } from '@/lib/media/buildImageUrl';

export function WhyMiio({ whyMiio }: { whyMiio: WhyMiioSection }) {
  if (!whyMiio) return null;

  const imageUrl = buildImageUrl(whyMiio.image?.assetId);

  return (
    <Section className="bg-white">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Image Column */}
          <div className="w-full aspect-square md:aspect-[4/5] relative overflow-hidden rounded-sm bg-gray-100">
            {imageUrl ? (
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${imageUrl})` }}
                aria-label={whyMiio.image?.alt || 'Why Miio Image'}
                role="img"
              />
            ) : (
              <div className="absolute inset-0 bg-gray-200 w-full h-full flex items-center justify-center text-gray-400">
                <span>Placeholder Image</span>
              </div>
            )}
          </div>
          
          {/* Text Column */}
          <div className="flex flex-col space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              {whyMiio.title}
            </h2>
            
            {whyMiio.subtitle && (
              <h3 className="text-xl text-gray-800 font-medium">
                {whyMiio.subtitle}
              </h3>
            )}
            
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">
              {whyMiio.content}
            </div>
            
            {whyMiio.ctaLabel && (
              <div className="pt-6">
                <Link
                  href={whyMiio.ctaLink || '#'}
                  className="inline-flex items-center text-base font-medium text-gray-900 hover:text-gray-600 transition-colors focus-visible:outline-none focus-visible:underline rounded-sm"
                >
                  {whyMiio.ctaLabel}
                  <span className="ml-2" aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
