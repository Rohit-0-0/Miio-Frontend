import { getPropertyListing, getPropertiesByIds } from '@/lib/server/property';
import { staysPageService } from '@/services/stays-page.service';
import { normalizePropertyQuery } from '@/lib/utils/search-params';
import { SectionContainer } from '@/components/properties/SectionContainer';
import { BrowseHeader } from '@/components/properties/BrowseHeader';
import { SearchWidget } from '@/components/shared/SearchWidget';
import { PropertyGrid } from '@/components/properties/PropertyGrid';
import { PropertyBrowseCard } from '@/components/properties/PropertyBrowseCard';
import { EmptyState } from '@/components/properties/EmptyState';
import { Pagination } from '@/components/shared/Pagination';
import type { Metadata } from 'next';
import { PropertySummary } from '@/types/property';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const staysPage = await staysPageService.get({ next: { revalidate: 300 } });
    if (staysPage.seo) {
      return {
        title: staysPage.seo.metaTitle,
        description: staysPage.seo.metaDescription,
        keywords: staysPage.seo.keywords,
      };
    }
  } catch (error) {
    console.error('Failed to fetch SEO for stays page:', error);
  }
  return {
    title: 'Luxury Properties | Miio',
    description: 'Explore our curated collection of luxury properties available for your next unforgettable stay.',
  };
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const query = normalizePropertyQuery(resolvedParams);

  let properties: any[] = [];
  let staysPage;
  let hasApiError = false;
  let missingDates = false;

  try {
    staysPage = await staysPageService.get();
  } catch (error) {
    console.error('Failed to fetch stays page data:', error);
  }

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
    const searchRes = await fetch(`${apiUrl}${endpoint}`, {
      cache: 'no-store'
    });
    
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
      if (Array.isArray(val)) val.forEach(v => searchParamsObj.append(key, v));
      else searchParamsObj.append(key, val);
    }
  });
  const searchQueryString = searchParamsObj.toString();

  const generalSettings = staysPage?.general || {
    heading: 'All Stays',
    introText: 'Browse our carefully curated collection of homes designed for slower living.',
  };

  const emptyStateConfig = staysPage?.emptyState || {
    heading: 'No stays available',
    description: "No stays available for these dates and guests.",
    ctaText: 'Return Home',
    ctaLink: '/',
  };

  return (
    <div className="min-h-screen bg-white">
      <SectionContainer className="pt-32 pb-8">
        <BrowseHeader 
          heading={generalSettings.heading} 
          introText={generalSettings.introText} 
        />
        
        <div className="mb-10 pb-8 border-b border-gray-100">
          <SearchWidget primaryCtaLabel="Search" />
        </div>

        {hasApiError ? (
          <div className="text-center py-20 text-gray-500">
            <h3 className="text-xl font-serif text-gray-900 mb-2">Unavailable</h3>
            <p>Unable to check availability right now.</p>
          </div>
        ) : missingDates ? (
          <div className="text-center py-20 text-gray-500">
            <h3 className="text-xl font-serif text-gray-900 mb-2">Select Dates</h3>
            <p>Please select check-in and check-out dates to browse available properties.</p>
          </div>
        ) : properties.length === 0 ? (
          <EmptyState config={{
            ...emptyStateConfig,
            heading: 'No stays available',
            description: 'No stays available for these dates and guests.',
          }} />
        ) : (
          <>
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
          </>
        )}
      </SectionContainer>
    </div>
  );
}
