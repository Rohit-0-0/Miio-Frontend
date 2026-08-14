import React from 'react';
import { PropertyCard } from '@/components/shared/PropertyCard';
import { PropertyData } from '@/types/property';

interface RelatedPropertiesProps {
  properties: PropertyData[];
  mode: 'AUTO' | 'MANUAL' | 'OFF';
}

export function RelatedProperties({ properties, mode }: RelatedPropertiesProps) {
  if (mode === 'OFF' || !properties || properties.length === 0) return null;

  return (
    <section className="mb-20 pt-12 border-t border-gray-100">
      <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">
        You May Also Like
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property) => {
          return (
            <PropertyCard 
              key={property.id}
              id={property.id}
              slug={property.slug}
              title={property.title}
              nickname={property.nickname}
              unitType={property.unitType}
              location={property.location ? `${property.location.city}, ${property.location.country}` : undefined}
              guests={property.maxGuests}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              propertyType={property.propertyType}
              reviews={property.reviews}
              image={property.coverImageId ? { assetId: property.coverImageId } : (property.gallery?.[0] as any)}
            />
          );
        })}
      </div>
    </section>
  );
}
