import Link from 'next/link';
import { AppImage } from '@/components/media/AppImage';
import { PropertyBrowseCardProps } from '@/components/properties/PropertyBrowseCard';

export function MinimalPropertyCard({ 
  id,
  slug,
  name,
  nickname,
  unitType,
  location,
  guests,
  bedrooms,
  bathrooms,
  propertyType,
  price,
  priceLabel,
  coverImage,
  imageAspectRatio = 'aspect-[3/4]'
}: PropertyBrowseCardProps) {
  const displayTitle = nickname || name;
  const displayLocation = location.split(',')[0]; // Just use city (e.g., "Bondi" instead of "Bondi, Australia")

  return (
    <Link href={`/properties/${slug}?id=${id}`} className="group block no-underline cursor-pointer w-full max-w-[345px] mx-auto">
      {/* Image Container */}
      <div className={`relative w-full ${imageAspectRatio} overflow-hidden bg-[#EAE8E1] mb-[12px]`}>
        {coverImage ? (
          typeof coverImage === 'string' ? (
            <img
              src={coverImage}
              alt={displayTitle}
              className="w-full h-full object-cover transition-transform duration-[520ms] ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <AppImage
              image={coverImage as any}
              alt={displayTitle}
              fill
              className="object-cover transition-transform duration-[520ms] ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
            No Image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-[8px]">
        <h3 className="font-serif text-[20px] leading-tight text-[#1B1A17] capitalize line-clamp-1">
          {displayTitle}
        </h3>
        
        <div className="flex justify-between items-center text-[13px] font-light mt-1">
          <div className="text-[#7D7975]">
            {displayLocation} &middot; {bedrooms} bed &middot; {guests} guests
          </div>

          {(price || priceLabel) && (
            <div className="flex items-center gap-1 text-[#7D7975]">
              <span>From {price}</span>
              {priceLabel && <span>{priceLabel}</span>}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
