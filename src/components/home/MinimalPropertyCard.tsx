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
  imageAspectRatio = 'aspect-[4/3]'
}: PropertyBrowseCardProps) {
  const displayTitle = nickname || name;
  const displayLocation = location.split(',')[0]; // Just use city (e.g., "Bondi" instead of "Bondi, Australia")

  return (
    <Link href={`/properties/${slug}?id=${id}`} className="group block no-underline cursor-pointer">
      {/* Image Container */}
      <div className={`relative w-full ${imageAspectRatio} overflow-hidden bg-[#EAE8E1] mb-4`}>
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
      <div className="flex flex-col gap-1">
        <h3 className="font-serif text-lg md:text-xl text-[#1B1A17] tracking-tight capitalize line-clamp-1">
          {displayTitle}
        </h3>
        
        <div className="flex justify-between items-center text-xs md:text-sm font-light mt-1">
          <div className="text-[#7D7975]">
            {displayLocation} &middot; {bedrooms} bed &middot; {guests} guests
          </div>

          {(price || priceLabel) && (
            <div className="flex items-center gap-1 text-[#1B1A17]">
              <span>From {price}</span>
              {priceLabel && <span className="text-[#7D7975]">{priceLabel}</span>}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
