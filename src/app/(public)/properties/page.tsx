import { getPropertyListing } from '@/lib/server/property';
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

  // Enforce public rules
  query.status = 'PUBLISHED';
  query.visibleOnWebsite = 'true';
  query.limit = query.limit || 12;

  let response;
  let staysPage;
  let hasError = false;

  try {
    const [propRes, cmsRes] = await Promise.all([
      getPropertyListing<PropertySummary>(query as Record<string, string | string[] | undefined>),
      staysPageService.get(),
    ]);
    response = propRes;
    staysPage = cmsRes;
  } catch (error) {
    console.error('Failed to fetch properties or stays page data:', error);
    hasError = true;
  }

  const properties = response?.data || [];
  
  // Fallbacks if CMS is completely unreachable
  const generalSettings = staysPage?.general || {
    heading: 'All Stays',
    introText: 'Browse our carefully curated collection of homes designed for slower living.',
  };
  const filterConfig = staysPage?.filters || {
    showLocationFilter: true,
    showGuestsFilter: true,
    showPriceFilter: true,
    enableMapButton: true,
    defaultSort: 'recommended',
  };
  const emptyStateConfig = staysPage?.emptyState || {
    heading: 'No stays available',
    description: "We're currently updating our curated collection.",
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

        {hasError ? (
          <div className="text-center py-20 text-gray-500">
            <p>Something went wrong. Please try refreshing the page.</p>
          </div>
        ) : properties.length === 0 ? (
          <EmptyState config={emptyStateConfig} />
        ) : (
          <>
            <PropertyGrid>
              {properties.map((property) => (
                <PropertyBrowseCard
                  key={property.id}
                  id={property.id}
                  slug={property.slug}
                  name={property.title}
                  nickname={property.nickname}
                  unitType={property.unitType}
                  location={[property.location?.city, property.location?.country].filter(Boolean).join(', ') || 'Various Locations'}
                  guests={property.maxGuests || 2}
                  bedrooms={property.bedrooms || 1}
                  price={'Enquire'}
                  coverImage={property.gallery?.[0]}
                />
              ))}
            </PropertyGrid>
            {response?.pagination && <Pagination pagination={response.pagination} />}
          </>
        )}
      </SectionContainer>
    </div>
  );
}
