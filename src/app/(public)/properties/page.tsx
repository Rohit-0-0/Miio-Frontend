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
import { PropertiesListSuspense } from '@/components/properties/PropertiesListSuspense';
import { PropertyCardSkeleton } from '@/components/ui/skeletons/CompositeSkeletons';
import { Suspense } from 'react';
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

  let staysPage;
  try {
    staysPage = await staysPageService.get();
  } catch (error) {
    console.error('Failed to fetch stays page data:', error);
  }

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

        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        }>
          <PropertiesListSuspense 
            query={query} 
            resolvedParams={resolvedParams} 
            emptyStateConfig={emptyStateConfig} 
          />
        </Suspense>
      </SectionContainer>
    </div>
  );
}
