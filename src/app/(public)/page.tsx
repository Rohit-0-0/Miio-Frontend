import { Metadata } from 'next';
import { getHomepage } from '@/lib/server/homepage';
import { getPropertyListing, getPropertiesByIds } from '@/lib/server/property';
import { getJournalListing } from '@/lib/server/journal';
import { Hero } from '@/components/home/Hero';
import { FeaturedProperties } from '@/components/home/FeaturedProperties';
import { EditorialStatement } from '@/components/home/EditorialStatement';
import { Locations } from '@/components/home/Locations';
import { Trust } from '@/components/home/Trust';
import { JournalPreview } from '@/components/home/JournalPreview';
import { FinalCTA } from '@/components/home/FinalCTA';
import { PropertyDocument } from '@/types/property';
import { FeaturedPropertiesSection } from '@/types/homepage';

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepage();
  
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

  // Resolve Featured Properties
  let properties: PropertyDocument[] = [];
  try {
    const featuredProps = homepage.featuredProperties || ({} as Partial<FeaturedPropertiesSection>);
    const mode = featuredProps.displayMode || 'LATEST';
    const maxItems = featuredProps.maxProperties || 3;
    const propertyIds = featuredProps.manualSelection || [];
    
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
      // LATEST
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

  // Resolve Journal Articles
  let articles: any[] = [];
  try {
    // 1. Try fetching featured journals
    const featuredRes = await getJournalListing({ limit: '3', featured: 'true' });
    articles = featuredRes.data || [];
    
    // 2. Fallback to latest published if no featured journals exist
    if (articles.length === 0) {
      const fallbackRes = await getJournalListing({ limit: '3' });
      articles = fallbackRes.data || [];
    }
  } catch (err) {
    console.error('Failed to resolve journal articles:', err);
  }

  return (
    <main className="w-full flex flex-col">
      {homepage.hero && <Hero hero={homepage.hero} />}
      
      <section className="bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-24 md:py-32 flex flex-col lg:flex-row gap-16 xl:gap-24 items-stretch">
          <div className="w-full lg:w-2/3">
            {properties.length > 0 && (
              <FeaturedProperties 
                config={homepage.featuredProperties || {} as any} 
                properties={properties} 
              />
            )}
          </div>
          <div className="w-full lg:w-1/3 flex">
            {homepage.editorialStatement && <EditorialStatement statement={homepage.editorialStatement} />}
          </div>
        </div>
      </section>

      {homepage.locations && <Locations locations={homepage.locations} />}
      {homepage.trust && <Trust trust={homepage.trust} />}
      {homepage.journal && <JournalPreview journal={homepage.journal} articles={articles} />}
      {homepage.finalCta && <FinalCTA finalCta={homepage.finalCta} />}
    </main>
  );
}
