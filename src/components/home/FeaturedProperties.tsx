import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { PropertyCard } from './PropertyCard';
import { PropertyDocument } from '@/types/property';
import { FeaturedPropertiesSection } from '@/types/homepage';
import Link from 'next/link';

interface FeaturedPropertiesProps {
  properties: PropertyDocument[];
  config: FeaturedPropertiesSection;
}

export function FeaturedProperties({ properties, config }: FeaturedPropertiesProps) {
  if (!properties || properties.length === 0) {
    return null; // Gracefully hide if no featured properties
  }

  return (
    <Section className="bg-gray-50">
      <Container>
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
            {config.title || 'Featured Properties'}
          </h2>
          {config.subtitle && (
            <p className="text-gray-600 text-lg">
              {config.subtitle}
            </p>
          )}
          {config.description && (
            <p className="text-gray-500 mt-2">
              {config.description}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              slug={property.slug}
              name={property.title}
              location={[property.location?.city, property.location?.country].filter(Boolean).join(', ') || 'Various Locations'}
              description={property.shortDescription || property.longDescription?.substring(0, 150) || ''}
              coverImage={property.coverImageId || property.gallery?.[0]?.assetId}
            />
          ))}
        </div>

        {config.ctaLabel && (
          <div className="mt-16 flex justify-center">
            <Link
              href={config.ctaLink || '/properties'}
              className="inline-flex items-center justify-center rounded-sm bg-gray-900 px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
            >
              {config.ctaLabel}
            </Link>
          </div>
        )}
      </Container>
    </Section>
  );
}
