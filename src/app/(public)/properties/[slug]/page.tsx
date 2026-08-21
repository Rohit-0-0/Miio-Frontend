import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getPropertyBySlug } from '@/lib/server/property';
import { getPropertyById } from '@/lib/server/property';
import { Container } from '@/components/ui/Container';
import { LIFECYCLE_STATUS } from '@/types/property';
import { Metadata } from 'next';
import { buildImageUrl } from '@/lib/media/buildImageUrl';

// New Reusable Components
import { HeroGallery } from '@/components/properties/details/HeroGallery';
import { PropertyHeader } from '@/components/properties/details/PropertyHeader';
import { QuickInfo } from '@/components/properties/details/QuickInfo';
import { EditorialDescription } from '@/components/properties/details/EditorialDescription';
import { PropertyExperience } from '@/components/properties/details/PropertyExperience';
import { AmenitiesSection } from '@/components/properties/details/AmenitiesSection';
import { PropertyDetails } from '@/types/property';
import { MiioStandard } from '@/components/properties/details/MiioStandard';
import { TrustSignals } from '@/components/properties/details/TrustSignals';
import { FAQSection } from '@/components/properties/details/FAQSection';
import { RelatedProperties } from '@/components/properties/details/RelatedProperties';
import { BookingCard } from '@/components/properties/booking/BookingCard';
import { PropertyMap } from '@/components/properties/details/PropertyMap';
import { FloatingBackButton } from '@/components/ui/FloatingBackButton';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ id?: string }>;
};

import { RelatedJournals } from '@/components/properties/details/RelatedJournals';

// Dynamic metadata based on the property SEO from CMS
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const slug = resolvedParams.slug;
  const guestyId = resolvedSearchParams.id;
  
  try {
    let response = await getPropertyBySlug<PropertyDetails>(slug, { next: { revalidate: 300 } });
    if ((!response || !response.data) && (guestyId || /^[0-9a-fA-F]{24}$/.test(slug))) {
      response = await getPropertyById<PropertyDetails>(guestyId || slug, { next: { revalidate: 300 } });
    }
    
    const property = response?.data;
    if (property?.editorial?.seo) {
      return {
        title: property.editorial.seo.title || property.title,
        description: property.editorial.seo.description || property.shortDescription || '',
      };
    }
    
    if (property) {
      return {
        title: property.title,
        description: property.shortDescription || '',
      };
    }
  } catch (error) {
    console.error('Failed to generate dynamic metadata for property:', error);
  }

  return {
    title: 'Luxury Property | Miio',
    description: 'Stay at one of our premium curated properties with Miio.',
  };
}

import { PropertyReviews } from '@/components/properties/details/PropertyReviews';

export default async function PropertyDetailPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const slug = resolvedParams.slug;
  const guestyId = resolvedSearchParams.id;

  let property: PropertyDetails | undefined;
  
  try {
    // First try the local DB slug
    let response = await getPropertyBySlug<PropertyDetails>(slug, { cache: 'no-store' });
    
    // If not found in local DB, and we have a guestyId or the slug is a guestyId, fallback to Guesty
    if ((!response || !response.data) && (guestyId || /^[0-9a-fA-F]{24}$/.test(slug))) {
      response = await getPropertyById<PropertyDetails>(guestyId || slug, { cache: 'no-store' });
    }
    
    property = response?.data;
  } catch (error) {
    console.error('Failed to fetch property details:', error);
    notFound();
  }

  // 404 for missing or hidden properties
  if (!property || property.lifecycleStatus !== LIFECYCLE_STATUS.PUBLISHED || !property.visibleOnWebsite) {
    notFound();
  }

  const location = [property.location?.city, property.location?.state, property.location?.country].filter(Boolean).join(', ');
  const editorial = property.editorial;
  const actualGuestyId = guestyId || ( /^[0-9a-fA-F]{24}$/.test(slug) ? slug : undefined );

  return (
    <article className="min-h-screen bg-white pb-96 lg:pb-20">
      <HeroGallery images={property.gallery || []} />

      <Container className="mt-8 md:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
          
          <div className="lg:col-span-2">
            <PropertyHeader title={property.title} location={location} />
            <QuickInfo 
              guests={property.maxGuests}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              beds={property.beds}
            />

            <EditorialDescription 
              description={editorial?.description} 
              fallbackDescription={property.longDescription || property.shortDescription} 
            />

            <PropertyExperience experience={editorial?.experience} />

            <AmenitiesSection 
              amenities={property.amenities}
              featuredAmenityIds={editorial?.featuredAmenityIds}
            />

            <MiioStandard standards={editorial?.miioStandard} />

            <TrustSignals reviewCount={property.reviews?.total || 0} rating={property.reviews?.avg || 0} />

            {property.location?.latitude && property.location?.longitude && (
              <PropertyMap 
                latitude={property.location.latitude}
                longitude={property.location.longitude}
                title={property.title}
              />
            )}

            <FAQSection faqs={editorial?.faq} />
          </div>

          <div className="lg:col-span-1">
            <Suspense fallback={<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xl h-[400px] animate-pulse"></div>}>
              {actualGuestyId ? (
                <BookingCard listingId={actualGuestyId} />
              ) : (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xl">
                  Booking is unavailable for this property.
                </div>
              )}
            </Suspense>
          </div>
          
        </div>
      </Container>
      
      <Container>
        <RelatedProperties properties={[]} mode={editorial?.relatedProperties?.displayMode || 'OFF'} />
        <RelatedJournals journals={editorial?.relatedJournals || []} />
        {(actualGuestyId || property.guestyId || property.id) && (
          <PropertyReviews propertyId={actualGuestyId || property.guestyId || property.id} />
        )}
      </Container>
      <FloatingBackButton />
    </article>
  );
}

