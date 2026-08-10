import { Metadata } from 'next';
import { Suspense } from 'react';
import { getHomepage } from '@/lib/server/homepage';
import { Hero } from '@/components/home/Hero';
import { EditorialStatement } from '@/components/home/EditorialStatement';
import { Locations } from '@/components/home/Locations';
import { Trust } from '@/components/home/Trust';
import { FinalCTA } from '@/components/home/FinalCTA';
import { FeaturedPropertiesSuspense } from '@/components/home/FeaturedPropertiesSuspense';
import { JournalPreviewSuspense } from '@/components/home/JournalPreviewSuspense';
import { PropertyCardSkeleton, JournalCardSkeleton } from '@/components/ui/skeletons/CompositeSkeletons';

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepage({ next: { revalidate: 300 } });
  
  if (!homepage) {
    return { title: 'Miio - A New Standard in Hospitality' };
  }

  const { seo, hero } = homepage;
  
  const title = seo?.title || hero?.title || 'Miio - A New Standard in Hospitality';
  const description = seo?.description || hero?.subtitle || 'Experience the perfect blend of luxury, comfort, and thoughtful design.';
  
  return {
    title,
    description,
    alternates: seo?.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
    robots: seo?.metaRobots ? seo.metaRobots : 'index, follow',
    openGraph: {
      title,
      description,
      images: seo?.ogImage?.assetId ? [{ url: seo.ogImage.assetId }] : [],
    }
  };
}

export default async function HomePage() {
  const homepage = await getHomepage();

  if (!homepage) {
    return (
      <div className="py-24 text-center">Homepage content unavailable.</div>
    );
  }

  return (
    <main className="w-full flex flex-col">
      {homepage.hero && <Hero hero={homepage.hero} />}
      
      <section className="bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-24 md:py-32 flex flex-col lg:flex-row gap-16 xl:gap-24 items-stretch">
          <div className="w-full lg:w-2/3">
            {homepage.featuredProperties && (
              <Suspense 
                fallback={
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-12">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <PropertyCardSkeleton key={i} />
                    ))}
                  </div>
                }
              >
                <FeaturedPropertiesSuspense config={homepage.featuredProperties as any} />
              </Suspense>
            )}
          </div>
          <div className="w-full lg:w-1/3 flex">
            {homepage.editorialStatement && <EditorialStatement statement={homepage.editorialStatement} />}
          </div>
        </div>
      </section>

      {homepage.locations && <Locations locations={homepage.locations} />}
      {homepage.trust && <Trust trust={homepage.trust} />}
      
      {homepage.journal && (
        <Suspense
          fallback={
            <section className="bg-white pb-24 md:pb-32">
              <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <JournalCardSkeleton key={i} />
                  ))}
                </div>
              </div>
            </section>
          }
        >
          <JournalPreviewSuspense journal={homepage.journal} />
        </Suspense>
      )}
      
      {homepage.finalCta && <FinalCTA finalCta={homepage.finalCta} />}
    </main>
  );
}
