import { PropertyCard } from '@/components/shared/PropertyCard';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { PropertyDocument } from '@/types/property';
import { FeaturedPropertiesSection } from '@/types/homepage';
import Link from 'next/link';

interface FeaturedPropertiesProps {
  properties: PropertyDocument[];
  config: FeaturedPropertiesSection;
}

export function FeaturedProperties({ properties, config }: FeaturedPropertiesProps) {
  if (!properties || properties.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <SectionHeader 
            title={config.title || 'Featured Stays'} 
            subtitle={config.subtitle} 
            align="left" 
          />
          
          {(config.ctaLabel || config.ctaText) && (
            <div className="hidden md:block pb-2">
              <Link
                href={config.ctaLink || '/properties'}
                className="text-sm font-medium tracking-widest uppercase text-[#1B1A17] hover:underline underline-offset-4 decoration-1 transition-all"
              >
                {config.ctaText || config.ctaLabel} &rarr;
              </Link>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
          {properties.map((property) => {
            const coverAssetId = property.coverImageId || property.gallery?.[0]?.assetId;
            const image = coverAssetId ? { assetId: coverAssetId } : undefined;

            return (
              <PropertyCard
                key={property.id}
                slug={property.slug}
                title={property.title}
                location={[property.location?.city, property.location?.country].filter(Boolean).join(', ') || 'Various Locations'}
                guests={property.maxGuests}
                bedrooms={property.bedrooms}
                placeholderPrice={config.placeholderPrice}
                image={image as any}
              />
            );
          })}
        </div>

        {(config.ctaLabel || config.ctaText) && (
          <div className="md:hidden pt-8 flex justify-center">
            <Link
              href={config.ctaLink || '/properties'}
              className="text-sm font-medium tracking-widest uppercase text-[#1B1A17] hover:underline underline-offset-4 decoration-1 transition-all"
            >
              {config.ctaText || config.ctaLabel} &rarr;
            </Link>
          </div>
        )}
      </div>
  );
}
