import { notFound } from 'next/navigation';
import { getPropertyBySlug } from '@/lib/server/property';
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
import { MiioStandard } from '@/components/properties/details/MiioStandard';
import { TrustSignals } from '@/components/properties/details/TrustSignals';
import { FAQSection } from '@/components/properties/details/FAQSection';
import { RelatedProperties } from '@/components/properties/details/RelatedProperties';
import { BookingCard } from '@/components/properties/booking/BookingCard';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const response = await getPropertyBySlug(resolvedParams.slug);
    const property = response.data;
    
    if (!property || property.lifecycleStatus !== LIFECYCLE_STATUS.PUBLISHED || !property.visibleOnWebsite) {
      return { title: 'Not Found | Miio' };
    }

    const seoTitle = property.editorial?.seo?.title || property.seoTitle || `${property.title} | Miio`;
    const seoDesc = property.editorial?.seo?.description || property.seoDescription || property.shortDescription || `Stay at ${property.title} with Miio.`;

    return {
      title: seoTitle,
      description: seoDesc,
      openGraph: {
        images: property.coverImageId
          ? [buildImageUrl(property.coverImageId)!]
          : []
      }
    };
  } catch {
    return { title: 'Miio' };
  }
}

export default async function PropertyDetailPage({ params }: Props) {
  const resolvedParams = await params;
  
  let property;
  try {
    const response = await getPropertyBySlug(resolvedParams.slug);
    property = response.data;
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

  return (
    <article className="min-h-screen bg-white pb-20">
      {/* Hero Gallery */}
      <HeroGallery images={property.gallery || []} />

      <Container className="mt-8 md:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
          
          {/* Main Content Column */}
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

            <TrustSignals reviewCount={0} rating={0} /> {/* Mocked until Guesty integration */}

            <FAQSection faqs={editorial?.faq} />
          </div>

          {/* Sidebar / Booking Card */}
          <div className="lg:col-span-1">
            <BookingCard />
          </div>
          
        </div>
      </Container>
      
      <Container>
        {/* We mock RelatedProperties list for now since PropertyService needs an update to resolve related, or we just pass empty */}
        <RelatedProperties properties={[]} mode={editorial?.relatedProperties?.displayMode || 'OFF'} />
      </Container>
    </article>
  );
}

