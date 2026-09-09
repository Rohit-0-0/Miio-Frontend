import React from 'react';
import Link from 'next/link';
import { AppImage } from '@/components/media/AppImage';

interface LocationStayCardProps {
  id: string;
  slug: string;
  name: string;
  location: string;
  bedrooms: number;
  guests: number;
  price?: string;
  priceLabel?: string;
  coverImage?: string | any;
}

export function LocationStayCard({
  id,
  slug,
  name,
  location,
  bedrooms,
  guests,
  price,
  priceLabel = '/ night',
  coverImage,
}: LocationStayCardProps) {
  const displayLocation = location.split(',')[0]?.trim() || location;
  const href = `/properties/${slug}?id=${id}`;
  const meta = [
    displayLocation,
    bedrooms ? `${bedrooms} bed` : null,
    guests ? `${guests} guests` : null,
  ]
    .filter(Boolean)
    .join(' \u00b7 ');

  return (
    <Link href={href} className="group block no-underline cursor-pointer w-full">
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#EAE8E1] mb-3">
        {coverImage ? (
          typeof coverImage === 'string' ? (
            <img
              src={coverImage}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-[520ms] ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <AppImage
              image={coverImage}
              alt={name}
              fill
              className="object-cover transition-transform duration-[520ms] ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          )
        ) : (
          <div className="w-full h-full bg-[#EAE8E1]" />
        )}
      </div>

      <h3 className="text-[15px] font-semibold text-[#241D19] leading-tight mb-1.5 capitalize line-clamp-1">
        {name}
      </h3>
      <div className="flex justify-between items-baseline gap-3 text-[13px] text-[#7D7975]">
        <span className="min-w-0 truncate">{meta}</span>
        {price ? (
          <span className="shrink-0 whitespace-nowrap">
            From {price} {priceLabel}
          </span>
        ) : null}
      </div>
    </Link>
  );
}