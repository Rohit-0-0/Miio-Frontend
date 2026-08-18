import React from 'react';
import Link from 'next/link';
import { AppImage } from '../media/AppImage';
import { ImageAsset } from '@/types/common';
import { Star } from 'lucide-react';

interface PropertyBrowseCardProps {
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
  bathrooms,
  propertyType,
  reviews,
  price,
  priceLabel = '/ night',
  coverImage,
  searchQueryString,
  imageAspectRatio = 'aspect-[3/4]',
}: PropertyBrowseCardProps) {
  const formattedUnitType = formatUnitType(unitType);
  const href = `/properties/${slug}?id=${id}${searchQueryString ? `&${searchQueryString}` : ''}`;

  return (
    <Link href={href} className="group block no-underline cursor-pointer">
      <div className={`relative w-full ${imageAspectRatio} overflow-hidden rounded-lg bg-gray-100 mb-5`}>
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
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-serif text-xl text-gray-900 tracking-tight capitalize line-clamp-2">
            {name.toLowerCase()}
          </h3>
          {reviews && reviews.total > 0 && (
            <div className="flex flex-col items-end shrink-0 mt-0.5">
              <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-2 py-0.5 rounded text-sm font-medium">
                <Star className="w-3 h-3 fill-current" />
                <span>{reviews.avg}</span>
              </div>
              <span className="text-[10px] text-gray-500 mt-1 whitespace-nowrap">({reviews.total} reviews)</span>
            </div>
          )}
        </div>
        
        {(nickname || formattedUnitType) && (
          <div className="text-sm font-medium text-gray-700 mt-0.5">
            {formattedUnitType && <span className="text-gray-500 mr-1">{formattedUnitType} • </span>}
            Unit: {nickname || name}
          </div>
        )}
        
        <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          <span>{location}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs font-medium text-gray-600">
          {propertyType && (
            <span className="px-2 py-1 bg-gray-50 border border-gray-100 rounded-sm">
              {propertyType}
            </span>
          )}
          {guests && (
            <span className="px-2 py-1 bg-gray-50 border border-gray-100 rounded-sm">
              {guests} Guests
            </span>
          )}
          {bedrooms && (
            <span className="px-2 py-1 bg-gray-50 border border-gray-100 rounded-sm">
              {bedrooms} Beds
            </span>
          )}
          {bathrooms && (
            <span className="px-2 py-1 bg-gray-50 border border-gray-100 rounded-sm">
              {bathrooms} Baths
            </span>
          )}
        </div>
          
        {price && (
          <div className="flex items-center gap-2 mt-3 font-medium">
            <span className="text-gray-900">{price}</span>
            {price !== 'Enquire' && priceLabel && (
              <span className="text-gray-400 font-normal">{priceLabel}</span>
            )}
          </div>
        )}

        <div className="mt-4 text-sm font-medium text-gray-900 flex items-center gap-2 group-hover:text-gray-600 transition-colors">
          View Stay
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </div>
      </div>
    </Link>
  );
}
