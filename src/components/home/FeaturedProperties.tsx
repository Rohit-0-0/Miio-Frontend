import { MinimalPropertyCard } from '@/components/home/MinimalPropertyCard';
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
    <div className="flex flex-col gap-[16px] md:gap-[32px]">
      <div className="flex flex-row justify-between items-center px-4 md:px-0">
        <h2 className="text-[24px] font-serif font-bold text-[#1B1A17] m-0 leading-tight">
          {title}
        </h2>
          
        {ctaText && (
          <Link
            href={ctaLink}
            className="font-sans text-[13px] font-normal text-[#5F4E44] hover:opacity-70 transition-all flex items-center gap-1"
          >
            {ctaText}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
          </Link>
        )}
      </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[32px]">
          {properties.map((property: any) => {
            const image = property.guestyImageUrl || property.coverImageId || property.picture?.large || property.gallery?.[0]?.assetId || property.gallery?.[0];

            const currency = property.prices?.currency === 'AUD' ? '$' : (property.prices?.currency || '');
            let price = config.placeholderPrice || '';
            let priceLabel = '';
            
            if (property.prices?.totalPrice) {
              price = `${currency}${property.prices.totalPrice}`;
              priceLabel = 'total';
            } else if (property.prices?.basePrice) {
              price = `${currency}${property.prices.basePrice}`;
              priceLabel = '/ night';
            }

            return (
              <MinimalPropertyCard
                key={property.id}
                id={property.id}
                slug={property.slug || property.id}
                name={property.title}
                nickname={property.nickname}
                unitType={property.unitType}
                location={[property.location?.city, property.location?.country].filter(Boolean).join(', ') || 'Various Locations'}
                guests={property.maxGuests || 2}
                bedrooms={property.bedrooms || 1}
                bathrooms={property.bathrooms}
                propertyType={property.propertyType}
                reviews={property.reviews}
                price={price}
                priceLabel={priceLabel}
                coverImage={image as any}
                imageAspectRatio="aspect-[35/46]"
              />
            );
          })}
        </div>

      </div>
  );
}
