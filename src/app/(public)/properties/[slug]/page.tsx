import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getPropertyBySlug, getPropertyById } from '@/lib/server/property';
import { LIFECYCLE_STATUS, PropertyDetails } from '@/types/property';
import { Metadata } from 'next';
import { staysPageService } from '@/services/stays-page.service';

import { HeroGallery } from '@/components/properties/details/HeroGallery';
import { PropertyHeader } from '@/components/properties/details/PropertyHeader';
import { QuickInfo } from '@/components/properties/details/QuickInfo';
import { EditorialDescription } from '@/components/properties/details/EditorialDescription';
import { PropertyExperience } from '@/components/properties/details/PropertyExperience';
import { AmenitiesSection } from '@/components/properties/details/AmenitiesSection';
import { MiioStandard } from '@/components/properties/details/MiioStandard';
import { FAQSection } from '@/components/properties/details/FAQSection';
import { BookingCard } from '@/components/properties/booking/BookingCard';
import { PropertyBackLink } from '@/components/properties/details/PropertyBackLink';
import { PropertyReviews } from '@/components/properties/details/PropertyReviews';
import { FinalCTA } from '@/components/home/FinalCTA';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ id?: string }>;
};

const STAYS_FINAL_CTA_DEFAULTS = {
  heading: 'A more direct way to stay',
  description: 'Book directly for the best available rates and a more seamless experience.',
  buttonText: 'Browse by location',
  buttonLink: '/locations',
};

async function resolveProperty(
  slug: string,
  guestyId: string | undefined,
  options?: RequestInit
): Promise<PropertyDetails | undefined> {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(slug);
  const idHint = guestyId || (isObjectId ? slug : undefined);

  // Prefer Guesty id when present — slug lookup can miss until backend syncs
  if (idHint) {
    const byId = await getPropertyById<PropertyDetails>(idHint, options);
    if (byId?.data) return byId.data;
  }

  const bySlug = await getPropertyBySlug<PropertyDetails>(slug, options);
  return bySlug?.data || undefined;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const slug = resolvedParams.slug;
  const guestyId = resolvedSearchParams.id;

  try {
    const property = await resolveProperty(slug, guestyId, { next: { revalidate: 300 } });

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

export default async function PropertyDetailPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const slug = resolvedParams.slug;
  const guestyId = resolvedSearchParams.id;

  let property: PropertyDetails | undefined;

  try {
    property = await resolveProperty(slug, guestyId, { cache: 'no-store' });
  } catch (error) {
    console.error('Failed to fetch property details:', error);
    notFound();
  }

  // Guesty-mapped details always set these; treat missing as published for id-based fetches
  const isPublished =
    !property?.lifecycleStatus || property.lifecycleStatus === LIFECYCLE_STATUS.PUBLISHED;
  const isVisible = property?.visibleOnWebsite !== false;

  if (!property || !isPublished || !isVisible) {
    notFound();
  }

  const editorial = property.editorial;
  const actualGuestyId =
    guestyId || property.guestyId || property.id || (/^[0-9a-fA-F]{24}$/.test(slug) ? slug : undefined);

  let finalCta = STAYS_FINAL_CTA_DEFAULTS;
  try {
    const staysPage = await staysPageService.get({ next: { revalidate: 300 } });
    if (staysPage?.finalCta) {
      finalCta = {
        ...STAYS_FINAL_CTA_DEFAULTS,
        ...staysPage.finalCta,
        description:
          staysPage.finalCta.description ?? STAYS_FINAL_CTA_DEFAULTS.description,
      };
    }
  } catch {
    // keep defaults
  }

  return (
    <article className="min-h-screen bg-[#FEF6EE] pb-0">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[188px] pt-10 md:pt-10">
        <PropertyBackLink />

        <div className="mb-8 md:mb-10">
          <HeroGallery images={property.gallery || []} />
        </div>

        {/* Figma mobile: booking after amenity icons; desktop: sticky right column */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_345px] gap-8 lg:gap-10 items-start">
          <div className="lg:col-start-1">
            <PropertyHeader title={property.nickname || property.title} />
            <QuickInfo
              guests={property.maxGuests}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              beds={property.beds}
            />

            <AmenitiesSection
              amenities={property.amenities}
              featuredAmenityIds={editorial?.featuredAmenityIds}
              variant="icons"
            />
          </div>

          <div className="w-full lg:w-[345px] lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-28">
            <Suspense
              fallback={
                <div className="bg-white border border-[#1B1A17]/10 rounded-xl p-6 h-[337px] animate-pulse" />
              }
            >
              {actualGuestyId ? (
                <BookingCard listingId={actualGuestyId} />
              ) : (
                <div className="bg-white border border-[#1B1A17]/10 rounded-xl p-6 text-[#7D7975]">
                  Booking is unavailable for this property.
                </div>
              )}
            </Suspense>
          </div>

          <div className="lg:col-start-1">
            <EditorialDescription
              description={editorial?.description}
              fallbackDescription={property.longDescription || property.shortDescription}
            />

            <MiioStandard standards={editorial?.miioStandard} />
          </div>
        </div>

        <div className="flex flex-col gap-10 md:gap-12 mt-14 md:mt-16 pb-16 md:pb-20">
          <PropertyExperience experience={editorial?.experience} />
          <AmenitiesSection
            amenities={property.amenities}
            featuredAmenityIds={editorial?.featuredAmenityIds}
            variant="list"
          />
          {(actualGuestyId || property.guestyId || property.id) && (
            <PropertyReviews propertyId={actualGuestyId || property.guestyId || property.id} />
          )}
          <FAQSection faqs={editorial?.faq} />
        </div>
      </div>

      <FinalCTA finalCta={finalCta} defaults={STAYS_FINAL_CTA_DEFAULTS} />
    </article>
  );
}
