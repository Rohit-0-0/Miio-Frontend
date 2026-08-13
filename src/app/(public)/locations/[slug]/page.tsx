import { notFound } from 'next/navigation';
import { getLocationBySlug } from '@/lib/server/location';
import { Container } from '@/components/ui/Container';
import { Metadata } from 'next';
import { buildImageUrl } from '@/lib/media/buildImageUrl';
import { HeroGallery } from '@/components/properties/details/HeroGallery';
import { PropertyHeader } from '@/components/properties/details/PropertyHeader';
import { EditorialDescription } from '@/components/properties/details/EditorialDescription';
import { FeaturedProperties } from '@/components/home/FeaturedProperties';
import { JournalPreview } from '@/components/home/JournalPreview';
import { env } from '@/config/env';
import { Suspense } from 'react';
import { FloatingBackButton } from '@/components/ui/FloatingBackButton';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  if (!slug) {
    return { title: 'Not Found | Miio' };
  }

  const location = await getLocationBySlug(slug, { cache: 'no-store' });
  
  if (!location) {
    return { title: 'Not Found | Miio' };
  }

  const seoTitle = location.seo?.title || `${location.title} | Miio`;
  const seoDesc = location.seo?.description || location.description || `Discover ${location.title} with Miio.`;

  return {
    title: seoTitle,
    description: seoDesc,
    openGraph: {
      images: location.heroImage?.asset?._ref
        ? [buildImageUrl(location.heroImage.asset._ref)!]
        : []
    }
  };
}

export default async function LocationDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  if (!slug) {
    notFound();
  }

  const location = await getLocationBySlug(slug);

  if (!location) {
    notFound();
  }

  const articles = (location.nearbyJournals || []).map((j: any) => ({
    ...j,
    slug: j.slug,
  }));

  return (
    <article className="min-h-screen bg-white pb-20">
      <HeroGallery images={location.heroImage ? [location.heroImage] : []} />

      <Container className="mt-8 md:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
          <div className="lg:col-span-2 flex flex-col space-y-12">
            <PropertyHeader title={location.title} location="Location" />

            <EditorialDescription 
              description={undefined} 
              fallbackDescription={location.description} 
            />

            {location.guestyCity && (
              <Suspense fallback={<div className="h-40 bg-gray-50 animate-pulse rounded-xl"></div>}>
                <LocationDynamicProperties guestyCity={location.guestyCity} locationTitle={location.title} />
              </Suspense>
            )}

            {location.journalContent && (
              <section className="prose prose-lg max-w-none font-serif text-gray-700">
                {/* Simplified rendering of portable text or markdown */}
                <p>{location.journalContent}</p>
              </section>
            )}
            
          </div>

          <div className="lg:col-span-1">
            {/* Sidebar content */}
          </div>
        </div>
      </Container>
      
      {articles.length > 0 && (
        <JournalPreview 
          journal={{ heading: 'Nearby Experiences' } as any}
          articles={articles}
        />
      )}
      <FloatingBackButton />
    </article>
  );
}

async function LocationDynamicProperties({ guestyCity, locationTitle }: { guestyCity: string, locationTitle: string }) {
  let properties = [];
  try {
    const searchParams = new URLSearchParams();
    searchParams.set('city', guestyCity);
    
    const propertiesRes = await fetch(`${env.NEXT_PUBLIC_API_URL}/booking/search?${searchParams.toString()}`, {
      cache: 'no-store'
    });
    
    if (propertiesRes.ok) {
      const data = await propertiesRes.json();
      properties = data.data || [];
    }
  } catch (err) {
    console.error('Failed to fetch dynamic properties for location:', err);
  }

  if (properties.length === 0) return null;

  const mappedProperties = properties.map((p: any) => {
    // Attempt to find an image URL from Guesty
    const rawImage = p.picture?.large || p.picture?.regular || p.pictures?.[0]?.original;
    // We hack the assetId to be the raw URL. 
    // Wait, AppImage in PropertyCard uses buildImageUrl(image.assetId). 
    // If we pass a raw URL to buildImageUrl, it will fail.
    // Instead of doing that, let's just pass the raw URL to a new prop on PropertyCard, or 
    // we can just use PropertyBrowseCard here directly instead of FeaturedProperties!
    // But FeaturedProperties uses a specific grid and SectionHeader.
    // Let's map it so FeaturedProperties can just render it. 
    // BUT we need to modify FeaturedProperties/PropertyCard to support raw strings.
    return {
      id: p._id || p.id,
      slug: p._id || p.id,
      title: p.nickname || p.title || 'Unknown Property',
      nickname: p.nickname,
      unitType: p.propertyType,
      location: { city: p.address?.city, country: p.address?.country },
      maxGuests: p.accommodates || 2,
      bedrooms: p.bedrooms || 1,
      guestyImageUrl: rawImage // We will pass this and modify FeaturedProperties to use it
    };
  });

  return (
    <FeaturedProperties 
      properties={mappedProperties as any} 
      config={{
        title: 'Featured Stays in ' + locationTitle,
        displayMode: 'LATEST',
        maxProperties: 3
      } as any}
    />
  );
}
