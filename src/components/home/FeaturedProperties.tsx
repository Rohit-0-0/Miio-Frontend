import { PropertyCard } from '@/components/shared/PropertyCard';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { PropertyDocument } from '@/types/property';
import { FeaturedPropertiesSection } from '@/types/homepage';
import Link from 'next/link';
import { HOME_DEFAULTS } from '@/lib/defaults/home';

interface FeaturedPropertiesProps {
  properties: PropertyDocument[];
  config: FeaturedPropertiesSection;
}

export function FeaturedProperties({ properties, config }: FeaturedPropertiesProps) {
  if (!properties || properties.length === 0) {
    return null;
  }

  const title = config.title || HOME_DEFAULTS.featuredProperties.heading;
  const ctaText = config.ctaText || config.ctaLabel || HOME_DEFAULTS.editorialStatement.cta.text;
  const ctaLink = config.ctaLink || HOME_DEFAULTS.editorialStatement.cta.href;

  return (
    <div className="flex flex-col space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <SectionHeader 
            title={title} 
            subtitle={config.subtitle} 
            align="left" 
          />
          
          {ctaText && (
            <div className="hidden md:block pb-2">
              <Link
                href={ctaLink}
                className="text-sm font-medium tracking-widest uppercase text-[#1B1A17] hover:underline underline-offset-4 decoration-1 transition-all"
              >
                {ctaText} &rarr;
              </Link>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
          {properties.map((property: any) => {
            const coverAssetId = property.coverImageId || property.gallery?.[0]?.assetId;
            const image = property.guestyImageUrl ? property.guestyImageUrl : (coverAssetId ? { assetId: coverAssetId } : undefined);

            return (
              <PropertyCard
                key={property.id}
                id={property.id}
                slug={property.slug}
                title={property.title}
                nickname={property.nickname}
                unitType={property.unitType}
                location={[property.location?.city, property.location?.country].filter(Boolean).join(', ') || 'Various Locations'}
                guests={property.maxGuests}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                propertyType={property.propertyType}
                reviews={property.reviews}
                placeholderPrice={config.placeholderPrice}
                image={image as any}
              />
            );
          })}
        </div>

        {ctaText && (
          <div className="md:hidden pt-8 flex justify-center">
            <Link
              href={ctaLink}
              className="text-sm font-medium tracking-widest uppercase text-[#1B1A17] hover:underline underline-offset-4 decoration-1 transition-all"
            >
              {ctaText} &rarr;
            </Link>
          </div>
        )}
      </div>
  );
}
