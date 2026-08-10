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

  const location = await getLocationBySlug(slug, { next: { revalidate: 300 } });
  
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

  // Fetch properties dynamically based on the location's guestyCity
  let properties = [];
  if (location.guestyCity) {
    try {
      const searchParams = new URLSearchParams();
      searchParams.set('city', location.guestyCity);
      
      const propertiesRes = await fetch(`${env.NEXT_PUBLIC_API_URL}/properties?${searchParams.toString()}`, {
        next: { revalidate: 300 } // Cache dynamic listing for 5 minutes
      });
      
      if (propertiesRes.ok) {
        const data = await propertiesRes.json();
        properties = data.data || [];
      }
    } catch (err) {
      console.error('Failed to fetch dynamic properties for location:', err);
    }
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

            {properties.length > 0 && (
              <FeaturedProperties 
                properties={properties} 
                config={{
                  title: 'Featured Stays in ' + location.title,
                  displayMode: 'LATEST',
                  maxProperties: 3
                } as any}
              />
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
    </article>
  );
}
