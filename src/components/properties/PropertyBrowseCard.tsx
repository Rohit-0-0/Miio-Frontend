import React from 'react';
import Link from 'next/link';
import { AppImage } from '../media/AppImage';
import { ImageAsset } from '@/types/common';

interface PropertyBrowseCardProps {
  id: string;
  slug: string;
  name: string;
  nickname?: string;
  unitType?: string;
  location: string;
  guests: number;
  bedrooms: number;
  price: string;
  priceLabel?: string;
  coverImage?: ImageAsset | string;
  searchQueryString?: string;
}

const formatUnitType = (type?: string) => {
  if (!type) return null;
  if (type === 'MTL') return 'Multi Unit';
  if (type === 'MTL_CHILD') return 'Sub Unit';
  if (type === 'SINGLE') return 'Single Unit';
  return type.replace(/_/g, ' ').replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase());
};

export function PropertyBrowseCard({
  id,
  slug,
  name,
  nickname,
  unitType,
  location,
  guests,
  bedrooms,
  price,
  priceLabel = '/ night',
  coverImage,
  searchQueryString,
}: PropertyBrowseCardProps) {
  const formattedUnitType = formatUnitType(unitType);
  const href = `/properties/${slug}?id=${id}${searchQueryString ? `&${searchQueryString}` : ''}`;

  return (
    <Link href={href} className="group block no-underline cursor-pointer">
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-sm bg-gray-100 mb-5">
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
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-1">
        <h3 className="font-serif text-xl text-gray-900 tracking-tight capitalize">
          {name.toLowerCase()}
        </h3>
        
        {(nickname || formattedUnitType) && (
          <div className="text-sm font-medium text-gray-700 mt-0.5">
            {formattedUnitType && <span className="text-gray-500 mr-1">{formattedUnitType} • </span>}
            Unit: {nickname || name}
          </div>
        )}
        
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
          <div className="flex items-center gap-3">
            <span>{location}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>{guests} Guests</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>{bedrooms} Beds</span>
          </div>
          
          <div className="flex items-center gap-2 mt-2 md:mt-0 ml-auto md:ml-0 font-medium">
            <span className="text-gray-900">{price}</span>
            {price !== 'Enquire' && priceLabel && (
              <span className="text-gray-400 font-normal">{priceLabel}</span>
            )}
          </div>
        </div>

        <div className="mt-4 text-sm font-medium text-gray-900 flex items-center gap-2 group-hover:text-gray-600 transition-colors">
          View Stay
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </div>
      </div>
    </Link>
  );
}
