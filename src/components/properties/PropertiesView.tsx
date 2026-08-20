'use client';

import React from 'react';
import { PropertyGrid } from '@/components/properties/PropertyGrid';
import { PropertyBrowseCard } from '@/components/properties/PropertyBrowseCard';
import { StaysMap } from '@/components/properties/StaysMap';

interface PropertiesViewProps {
  properties: any[];
  searchQueryString: string;
}

export function PropertiesView({ properties, searchQueryString }: PropertiesViewProps) {
  return (
    <div className="relative">
      {/* Grid View & Split View Layout */}
      <div className="flex flex-col-reverse lg:flex-row gap-8">
        
        {/* Properties List - Half width on desktop, full width on mobile below map */}
        <div className="w-full lg:w-1/2 overflow-y-auto pr-0 lg:pr-4 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10">
            {properties.map((property: any) => {
              const id = property._id || property.id;
              const name = property.nickname || property.title || 'Unknown Property';
              const location = [property.address?.city, property.address?.country].filter(Boolean).join(', ') || 'Various Locations';
              const guests = property.accommodates || 2;
              const bedrooms = property.bedrooms || 1;
              const coverImage = property.picture?.large || property.picture?.regular || property.pictures?.[0]?.original || null;
              
              const currency = property.prices?.currency === 'AUD' ? '$' : (property.prices?.currency || '');
              let price = 'Enquire';
              let priceLabel = '/ night';
              
              if (property.prices?.totalPrice) {
                price = `${currency}${property.prices.totalPrice}`;
                priceLabel = 'total';
              } else if (property.prices?.basePrice) {
                price = `${currency}${property.prices.basePrice}`;
                priceLabel = '/ night';
              }
              
              return (
                <PropertyBrowseCard
                  key={id}
                  id={id}
                  slug={id}
                  name={name}
                  nickname={property.nickname}
                  unitType={property.propertyType || ''}
                  location={location}
                  guests={guests}
                  bedrooms={bedrooms}
                  bathrooms={property.bathrooms}
                  propertyType={property.propertyType}
                  reviews={property.reviews}
                  price={price}
                  priceLabel={priceLabel}
                  coverImage={coverImage}
                  searchQueryString={searchQueryString}
                />
              );
            })}
          </div>
        </div>

        {/* Map View - Always visible, half screen on desktop, fixed height on mobile above list */}
        <div className="w-full h-[60vh] lg:h-[calc(100vh-12rem)] lg:w-1/2 lg:sticky lg:top-24">
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg border border-gray-200">
            <StaysMap properties={properties} searchQueryString={searchQueryString} />
          </div>
        </div>

      </div>
    </div>
  );
}
