'use client';

import React from 'react';
import { PropertyGrid } from '@/components/properties/PropertyGrid';
import { PropertyBrowseCard } from '@/components/properties/PropertyBrowseCard';
import { StaysFilterBar } from '@/components/properties/StaysFilterBar';

interface PropertiesViewProps {
  properties: any[];
  searchQueryString: string;
}

export function PropertiesView({ properties, searchQueryString }: PropertiesViewProps) {
  const total = properties.length;
  const resultLabel =
    total === 0 ? '0 properties' : `1-${total} of ${total} properties`;

  return (
    <div className="relative w-full">
      <StaysFilterBar resultLabel={resultLabel} />

      <PropertyGrid>
        {properties.map((property: any) => {
          const id = property._id || property.id;
          const name = property.nickname || property.title || 'Unknown Property';
          const location =
            [property.address?.city, property.address?.country].filter(Boolean).join(', ') ||
            'Various Locations';
          const guests = property.accommodates || 2;
          const bedrooms = property.bedrooms || 1;
          const coverImage =
            property.picture?.large ||
            property.picture?.regular ||
            property.pictures?.[0]?.original ||
            null;

          const currency = property.prices?.currency === 'AUD' ? '$' : property.prices?.currency || '';
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
      </PropertyGrid>
    </div>
  );
}
