import React from 'react';
import { getPropertyListing, getPropertiesByIds } from '@/lib/server/property';
import { FeaturedProperties } from '@/components/home/FeaturedProperties';
import { PropertyDocument } from '@/types/property';
import { FeaturedPropertiesSection } from '@/types/homepage';

export async function FeaturedPropertiesSuspense({ config }: { config: FeaturedPropertiesSection }) {
  let properties: PropertyDocument[] = [];
  try {
    const mode = config.displayMode || 'LATEST';
    const maxItems = config.maxProperties || 3;
    const propertyIds = config.manualSelection || [];
    
    if (mode === 'MANUAL' && propertyIds.length > 0) {
      const res = await getPropertiesByIds(propertyIds);
      properties = res.data || [];
    } else if (mode === 'FEATURED') {
      const res = await getPropertyListing({
        featured: 'true',
        status: 'PUBLISHED',
        visibleOnWebsite: 'true',
        sort: 'sortOrder',
        order: 'asc',
        limit: maxItems.toString()
      });
      properties = res.data || [];
    } else {
      const res = await getPropertyListing({
        status: 'PUBLISHED',
        visibleOnWebsite: 'true',
        sort: 'createdAt',
        order: 'desc',
        limit: maxItems.toString()
      });
      properties = res.data || [];
    }
  } catch (err) {
    console.error('Failed to resolve featured properties:', err);
  }

  if (properties.length === 0) return null;

  return <FeaturedProperties config={config} properties={properties} />;
}
