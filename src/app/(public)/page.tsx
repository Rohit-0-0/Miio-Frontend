import { Metadata } from 'next';
import { getHomepage } from '@/lib/server/homepage';
import { getPropertyListing, getPropertiesByIds } from '@/lib/server/property';
import { Hero } from '@/components/home/Hero';
import { FeaturedProperties } from '@/components/home/FeaturedProperties';
import { WhyMiio } from '@/components/home/WhyMiio';
import { Experiences } from '@/components/home/Experiences';
import { Testimonials } from '@/components/home/Testimonials';
import { FAQ } from '@/components/home/FAQ';
import { Newsletter } from '@/components/home/Newsletter';
import { JournalPreview } from '@/components/home/JournalPreview';
import { PartnerCTA } from '@/components/home/PartnerCTA';
import { PropertyDocument } from '@/types/property';

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepage();
  
  if (!homepage) {
    return { title: 'Miio - A New Standard in Hospitality' };
  }

  const { seo, hero } = homepage;
  
  // Fallback hierarchy: SEO fields -> Hero fields -> Defaults
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

  // If no CMS data, fallback to rendering existing placeholder structure 
  // (though our updated components handle their own null checks)
  if (!homepage) {
    return (
      <>
        <div className="py-24 text-center">Homepage content unavailable.</div>
      </>
    );
  }

  // Resolve Featured Properties
  let properties: PropertyDocument[] = [];
  try {
    const featuredProps = homepage.featuredProperties || {};
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

  return (
    <>
      {homepage.hero && <Hero hero={homepage.hero} />}
      {homepage.featuredProperties && <FeaturedProperties config={homepage.featuredProperties} properties={properties} />}
      {homepage.whyMiio && <WhyMiio whyMiio={homepage.whyMiio} />}
      {homepage.experiences && <Experiences experiences={homepage.experiences} />}
      {homepage.testimonials && <Testimonials testimonials={homepage.testimonials} />}
      {homepage.faq && <FAQ faq={homepage.faq} />}
      <JournalPreview />
      <PartnerCTA />
      {homepage.newsletter && <Newsletter newsletter={homepage.newsletter} />}
    </>
  );
}
