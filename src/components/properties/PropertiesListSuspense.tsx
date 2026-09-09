import React from 'react';
import { PropertiesView } from '@/components/properties/PropertiesView';
import { EmptyState } from '@/components/properties/EmptyState';
import { StaysFilterBar } from '@/components/properties/StaysFilterBar';
import { env } from '@/config/env';

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
    const city = query.city as string | undefined;
    
    const beSearchParams = new URLSearchParams();
    if (city) beSearchParams.append('city', city);
    if (checkIn) beSearchParams.append('checkIn', checkIn);
    if (checkOut) beSearchParams.append('checkOut', checkOut);
    if (adults) beSearchParams.append('adults', adults);
    if (children) beSearchParams.append('children', children);
    if (infants) beSearchParams.append('infants', infants);
    if (pets) beSearchParams.append('pets', pets);
    
    // Append advanced filters
    if (query.propertyType) beSearchParams.append('propertyType', query.propertyType as string);
    if (query.amenities) beSearchParams.append('amenities', query.amenities as string);
    if (query.minBedrooms) beSearchParams.append('minBedrooms', query.minBedrooms as string);
    if (query.minBathrooms) beSearchParams.append('minBathrooms', query.minBathrooms as string);
    if (query.minPrice) beSearchParams.append('minPrice', query.minPrice as string);
    if (query.maxPrice) beSearchParams.append('maxPrice', query.maxPrice as string);

    const apiUrl = env.NEXT_PUBLIC_API_URL;
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
      <div>
        <StaysFilterBar resultLabel="—" />
        <div className="text-center py-20 text-[#7D7975]">
          <h3 className="text-xl font-serif text-[#1B1A17] mb-2">Unavailable</h3>
          <p>Unable to check availability right now.</p>
        </div>
      </div>
    );
  }

  if (missingDates) {
    return (
      <div>
        <StaysFilterBar />
        <div className="text-center py-20 text-[#7D7975]">
          <h3 className="text-xl font-serif text-[#1B1A17] mb-2">Select Dates</h3>
          <p>Please select check-in and check-out dates to browse available properties.</p>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div>
        <StaysFilterBar resultLabel="0 properties" />
        <EmptyState config={{
          ...emptyStateConfig,
          heading: 'No stays available',
          description: 'No stays available for these dates and guests.',
        }} />
      </div>
    );
  }

  return (
    <PropertiesView properties={properties} searchQueryString={searchQueryString} />
  );
}
