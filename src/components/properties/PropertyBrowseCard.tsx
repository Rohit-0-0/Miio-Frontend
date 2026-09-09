import React from 'react';
import Link from 'next/link';
import { AppImage } from '../media/AppImage';
import { ImageAsset } from '@/types/common';

export interface PropertyBrowseCardProps {
  id: string;
  slug: string;
  name: string;
  nickname?: string;
  unitType?: string;
  location: string;
  guests: number;
  bedrooms: number;
  bathrooms?: number;
  propertyType?: string;
  reviews?: { avg: number; total: number };
  price: string;
  priceLabel?: string;
  coverImage?: ImageAsset | string;
  searchQueryString?: string;
  imageAspectRatio?: string;
}

export function PropertyBrowseCard({
  id,
  slug,
  name,
  nickname,
  location,
  guests,
  bedrooms,
  price,
  priceLabel = '/ night',
  coverImage,
  searchQueryString,
  imageAspectRatio = 'aspect-[345/460]',
}: PropertyBrowseCardProps) {
  const displayTitle = nickname || name;
  const displayLocation = location.split(',')[0]?.trim() || location;
  const href = `/properties/${slug}?id=${id}${searchQueryString ? `&${searchQueryString}` : ''}`;

  const metaParts = [
    displayLocation,
    bedrooms ? `${bedrooms} bed` : null,
    guests ? `${guests} guests` : null,
  ].filter(Boolean);

  return (
    <Link href={href} className="group block no-underline cursor-pointer w-full">
      <div
        className={`relative w-full ${imageAspectRatio} overflow-hidden bg-[#EAE8E1] mb-3`}
      >
        {coverImage ? (
          typeof coverImage === 'string' ? (
            <img
              src={coverImage}
              alt={displayTitle}
              className="w-full h-full object-cover transition-transform duration-[520ms] ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <AppImage
              image={coverImage}
              alt={displayTitle}
              fill
              className="object-cover transition-transform duration-[520ms] ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#7D7975]/40">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-baseline gap-3">
          <h3 className="text-[15px] font-medium text-[#1B1A17] capitalize leading-tight line-clamp-1 min-w-0">
            {displayTitle}
          </h3>
          {price && (
            <span className="shrink-0 text-[13px] text-[#7D7975] whitespace-nowrap">
              From {price} {priceLabel}
            </span>
          )}
        </div>

        <p className="text-[13px] text-[#7D7975] leading-snug truncate">
          {metaParts.join(' · ')}
        </p>
      </div>
    </Link>
  );
}
