import { staysPageService } from '@/services/stays-page.service';
import { normalizePropertyQuery } from '@/lib/utils/search-params';
import { BrowseHeader } from '@/components/properties/BrowseHeader';
import { PropertiesListSuspense } from '@/components/properties/PropertiesListSuspense';
import { PropertyCardSkeleton } from '@/components/ui/skeletons/CompositeSkeletons';
import { FinalCTA } from '@/components/home/FinalCTA';
import { Suspense } from 'react';
import type { Metadata } from 'next';

const STAYS_FINAL_CTA_DEFAULTS = {
  heading: 'A more direct way to stay',
  description: 'Book directly for the best available rates and a more seamless experience.',
  buttonText: 'Browse by location',
  buttonLink: '/locations',
};

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
    description:
      'Explore our curated collection of luxury properties available for your next unforgettable stay.',
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
    description: 'No stays available for these dates and guests.',
    ctaText: 'Return Home',
    ctaLink: '/',
  };

  const finalCta = staysPage?.finalCta || STAYS_FINAL_CTA_DEFAULTS;

  return (
    <div className="min-h-screen bg-[#FEF6EE]">
      <section className="pt-[48px] pb-16 md:pb-24 px-4 md:px-10 xl:px-[188px] mx-auto max-w-[1440px]">
        <BrowseHeader
          heading={generalSettings.heading}
          introText={generalSettings.introText}
        />

        <Suspense
          fallback={
            <div>
              <div className="flex flex-row items-center justify-between gap-4 mb-8">
                <div className="flex gap-2">
                  {['Location', 'Guests', 'Price'].map((label) => (
                    <div
                      key={label}
                      className="h-9 w-24 rounded-full border border-[#1B1A17]/10 bg-white animate-pulse"
                    />
                  ))}
                </div>
                <div className="h-4 w-36 bg-[#1B1A17]/5 animate-pulse rounded" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 md:gap-x-6 gap-y-10">
                {Array.from({ length: 6 }).map((_, i) => (
                  <PropertyCardSkeleton key={i} />
                ))}
              </div>
            </div>
          }
        >
          <PropertiesListSuspense
            query={query}
            resolvedParams={resolvedParams}
            emptyStateConfig={emptyStateConfig}
          />
        </Suspense>
      </section>

      <FinalCTA finalCta={finalCta} defaults={STAYS_FINAL_CTA_DEFAULTS} />
    </div>
  );
}
