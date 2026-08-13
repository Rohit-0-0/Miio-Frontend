import React from 'react';
import { PropertyGrid } from '@/components/properties/PropertyGrid';
import { PropertyBrowseCard } from '@/components/properties/PropertyBrowseCard';
import { EmptyState } from '@/components/properties/EmptyState';

interface PropertiesListSuspenseProps {
  query: any;
  resolvedParams: any;
  emptyStateConfig: any;
}

export async function PropertiesListSuspense({
  query,
  resolvedParams,
  emptyStateConfig,
}: PropertiesListSuspenseProps) {
  let properties: any[] = [];
  let hasApiError = false;
  const missingDates = false; // Always false in this layout unless we change logic

  const checkIn = query.checkIn as string | undefined;
  const checkOut = query.checkOut as string | undefined;
  
  try {
    const adults = query.adults as string | undefined;
    const children = query.children as string | undefined;
    const infants = query.infants as string | undefined;
    const pets = query.pets as string | undefined;
    
    const beSearchParams = new URLSearchParams();
    if (checkIn) beSearchParams.append('checkIn', checkIn);
    if (checkOut) beSearchParams.append('checkOut', checkOut);
    if (adults) beSearchParams.append('adults', adults);
    if (children) beSearchParams.append('children', children);
    if (infants) beSearchParams.append('infants', infants);
    if (pets) beSearchParams.append('pets', pets);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    const endpoint = beSearchParams.toString() ? `/booking/search?${beSearchParams.toString()}` : `/booking/search`;
    
    console.log(`[Frontend] Fetching properties in ${checkIn && checkOut ? 'availability' : 'browse'} mode`);
    
    // If searching by dates, we need real-time availability so no-store cache.
    // If just browsing, we can safely cache the list of properties to improve performance.
    const fetchOptions: RequestInit = checkIn && checkOut 
      ? { cache: 'no-store' } 
      : { cache: 'no-store' }; // Removed 5 minute cache per user request
      
    const searchRes = await fetch(`${apiUrl}${endpoint}`, fetchOptions);
    
    if (searchRes.ok) {
      const json = await searchRes.json();
      properties = json.data || [];
      console.log(`[Frontend] Received ${properties.length} listings from backend`);
    } else {
      console.warn(`[Frontend] Booking Engine Search failed with status: ${searchRes.status}`);
      hasApiError = true;
    }
  } catch (error) {
    console.error(`[Frontend] Failed to fetch properties from Booking Engine API:`, error);
    hasApiError = true;
  }

  // Create a query string from the search params to pass to property cards
  const searchParamsObj = new URLSearchParams();
  Object.entries(resolvedParams).forEach(([key, val]) => {
    if (val !== undefined) {
      if (Array.isArray(val)) val.forEach(v => searchParamsObj.append(key, v as string));
      else searchParamsObj.append(key, val as string);
    }
  });
  const searchQueryString = searchParamsObj.toString();

  if (hasApiError) {
    return (
      <div className="text-center py-20 text-gray-500">
        <h3 className="text-xl font-serif text-gray-900 mb-2">Unavailable</h3>
        <p>Unable to check availability right now.</p>
      </div>
    );
  }

  if (missingDates) {
    return (
      <div className="text-center py-20 text-gray-500">
        <h3 className="text-xl font-serif text-gray-900 mb-2">Select Dates</h3>
        <p>Please select check-in and check-out dates to browse available properties.</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <EmptyState config={{
        ...emptyStateConfig,
        heading: 'No stays available',
        description: 'No stays available for these dates and guests.',
      }} />
    );
  }

  return (
    <PropertyGrid>
      {properties.map((property: any) => {
        // Map Guesty fields to component props safely
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
            slug={id} // Using ID as slug since we don't have Sanity slugs
            name={name}
            nickname={property.nickname}
            unitType={property.propertyType || ''}
            location={location}
            guests={guests}
            bedrooms={bedrooms}
            price={price}
            priceLabel={priceLabel}
            coverImage={coverImage}
            searchQueryString={searchQueryString}
          />
        );
      })}
    </PropertyGrid>
  );
}
