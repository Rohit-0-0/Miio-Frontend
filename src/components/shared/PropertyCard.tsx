import Link from 'next/link';
import { ImageAsset } from '@/types/common';
import { AppImage } from '@/components/media/AppImage';

interface PropertyCardProps {
  id?: string;
  slug: string;
  title: string;
  nickname?: string;
  unitType?: string;
  location?: string;
  guests?: number;
  bedrooms?: number;
  placeholderPrice?: string;
  image?: ImageAsset;
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
  placeholderPrice,
  image,
  className = '',
}: PropertyCardProps) {
  const details = [
    guests ? `${guests} Guests` : null,
    bedrooms ? `${bedrooms} Beds` : null, // Assuming bedrooms maps to "Beds" based on user example: "4 Guests • 2 Beds"
  ].filter(Boolean).join(' · ');

  const formattedUnitType = formatUnitType(unitType);

  return (
    <Link 
      href={`/properties/${slug}${id ? `?id=${id}` : ''}`}
      prefetch={true}
      className={`group flex flex-col space-y-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-4 rounded-sm ${className}`}
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
        {image ? (
          <AppImage
            image={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#F8F5EF] text-[#1B1A17]/20">
            <span className="font-serif text-2xl tracking-widest uppercase">MiiO</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-xl md:text-2xl font-serif text-[#1B1A17]">{title}</h3>
          {placeholderPrice && (
            <span className="text-sm font-medium tracking-widest uppercase text-[#1B1A17] whitespace-nowrap mt-1">
              {placeholderPrice}
            </span>
          )}
        </div>
        
        {(nickname || formattedUnitType) && (
          <div className="text-sm font-medium text-[#1B1A17]/80">
            {formattedUnitType && <span className="text-[#1B1A17]/60 mr-1">{formattedUnitType} • </span>}
            Unit: {nickname || title}
          </div>
        )}
        
        {(location || details) && (
          <div className="flex justify-between items-center text-sm font-light text-[#1B1A17]/60">
            <span>{location}</span>
            <span>{details}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
