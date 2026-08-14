import Link from 'next/link';
import { ImageAsset } from '@/types/common';
import { AppImage } from '@/components/media/AppImage';
import { Star } from 'lucide-react';

interface PropertyCardProps {
  id?: string;
  slug: string;
  title: string;
  nickname?: string;
  unitType?: string;
  location?: string;
  guests?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  reviews?: { avg: number; total: number };
  placeholderPrice?: string;
  image?: ImageAsset | string;
  className?: string;
}

const formatUnitType = (type?: string) => {
  if (!type) return null;
  if (type === 'MTL') return 'Multi Unit';
  if (type === 'MTL_CHILD') return 'Sub Unit';
  if (type === 'SINGLE') return 'Single Unit';
  return type.replace(/_/g, ' ').replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase());
};

export function PropertyCard({
  id,
  slug,
  title,
  nickname,
  unitType,
  location,
  guests,
  bedrooms,
  bathrooms,
  propertyType,
  reviews,
  placeholderPrice,
  image,
  className = '',
}: PropertyCardProps) {
  const formattedUnitType = formatUnitType(unitType);

  return (
    <Link 
      href={`/properties/${slug}${id ? `?id=${id}` : ''}`}
      prefetch={true}
      className={`group flex flex-col space-y-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-4 rounded-sm ${className}`}
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 rounded-lg">
        {image ? (
          typeof image === 'string' ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <AppImage
              image={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#F8F5EF] text-[#1B1A17]/20">
            <span className="font-serif text-2xl tracking-widest uppercase">MiiO</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-col space-y-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex flex-col space-y-1">
            <h3 className="text-xl md:text-2xl font-serif text-[#1B1A17] line-clamp-2">{title}</h3>
            {location && (
              <div className="flex items-center text-sm font-light text-[#1B1A17]/60">
                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                {location}
              </div>
            )}
          </div>
          
          {reviews && reviews.total > 0 && (
            <div className="flex flex-col items-end shrink-0 mt-1">
              <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-2 py-0.5 rounded text-sm font-medium">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{reviews.avg}</span>
              </div>
              <span className="text-xs text-[#1B1A17]/50 mt-1 whitespace-nowrap">({reviews.total} reviews)</span>
            </div>
          )}
        </div>
        
        {(nickname || formattedUnitType) && (
          <div className="text-sm font-medium text-[#1B1A17]/80">
            {formattedUnitType && <span className="text-[#1B1A17]/60 mr-1">{formattedUnitType} • </span>}
            Unit: {nickname || title}
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 pt-1">
          {propertyType && (
            <span className="px-2.5 py-1 bg-[#1B1A17]/5 text-[#1B1A17]/70 text-xs font-medium rounded-sm">
              {propertyType}
            </span>
          )}
          {guests && (
            <span className="px-2.5 py-1 bg-[#1B1A17]/5 text-[#1B1A17]/70 text-xs font-medium rounded-sm">
              {guests} Guests
            </span>
          )}
          {bedrooms && (
            <span className="px-2.5 py-1 bg-[#1B1A17]/5 text-[#1B1A17]/70 text-xs font-medium rounded-sm">
              {bedrooms} Bedrooms
            </span>
          )}
          {bathrooms && (
            <span className="px-2.5 py-1 bg-[#1B1A17]/5 text-[#1B1A17]/70 text-xs font-medium rounded-sm">
              {bathrooms} Bathrooms
            </span>
          )}
        </div>

        {placeholderPrice && (
          <div className="flex justify-end pt-2">
            <span className="text-base font-medium text-[#1B1A17]">
              Total {placeholderPrice}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
