import { notFound } from 'next/navigation';
import { getPropertyBySlug } from '@/lib/server/property';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { LIFECYCLE_STATUS } from '@/types/property';
import { Metadata } from 'next';
import { buildImageUrl } from '@/lib/media/buildImageUrl';
import { AppImage } from '@/components/media/AppImage';
import { RichTextRenderer } from '@/components/ui/editor';

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

    return {
      title: property.seoTitle || `${property.title} | Miio`,
      description: property.seoDescription || property.shortDescription || `Stay at ${property.title} with Miio.`,
      openGraph: {
    images: property.coverImageId
        ? [buildImageUrl(property.coverImageId)!]
        : []
}
    };
  } catch (e) {
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

  const coverImageUrl = buildImageUrl(
  property.coverImageId || property.gallery?.[0]?.assetId
);
  const location = [property.city, property.state, property.country].filter(Boolean).join(', ');

  return (
    <article className="min-h-screen bg-white pb-20">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] md:h-[80vh] bg-gray-100">
        {coverImageUrl ? (
          <div className="absolute inset-0 z-0">
            <AppImage
              image={{ assetId: property.coverImageId || property.gallery?.[0]?.assetId || '' }}
              alt={property.title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gray-200 w-full h-full flex items-center justify-center text-gray-400">
            <span>No Image Available</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/30" />
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white">
          <Container>
            <span className="text-sm md:text-base font-semibold uppercase tracking-wider mb-2 md:mb-4 block">
              {location}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-4 drop-shadow-md">
              {property.title}
            </h1>
          </Container>
        </div>
      </div>

      <Container className="mt-12 md:mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 border-b pb-4">
                About this home
              </h2>
              <div className="prose prose-lg text-gray-600">
                {property.longDescription ? (
                  <RichTextRenderer html={property.longDescription} />
                ) : (
                  <p>{property.shortDescription}</p>
                )}
              </div>
            </section>

            {property.amenities && property.amenities.length > 0 && (
              <section>
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 border-b pb-4">
                  Amenities
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map(amenity => (
                    <div key={amenity.id} className="flex items-center space-x-3 text-gray-700">
                      <div className="w-5 h-5 flex-shrink-0 bg-gray-100 rounded-sm" />
                      <span>{amenity.label}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {property.gallery && property.gallery.length > 0 && (
              <section>
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 border-b pb-4">
                  Gallery
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.gallery.map(img => (
                    <div key={img.assetId} className="aspect-[4/3] rounded-sm overflow-hidden bg-gray-100">
                      <AppImage
                        image={img}
                        alt="Gallery Image"
                        fill
                        className="transition-transform duration-500 hover:scale-105 object-cover"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar / Quick Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 p-8 border border-gray-200 rounded-sm bg-gray-50 space-y-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
                  Property Details
                </h3>
                <ul className="space-y-4 text-gray-900">
                  <li className="flex justify-between items-center border-b border-gray-200 pb-4">
                    <span>Type</span>
                    <span className="font-medium">{property.propertyType}</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-gray-200 pb-4">
                    <span>Guests</span>
                    <span className="font-medium">{property.maxGuests || '-'}</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-gray-200 pb-4">
                    <span>Bedrooms</span>
                    <span className="font-medium">{property.bedrooms || '-'}</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-gray-200 pb-4">
                    <span>Bathrooms</span>
                    <span className="font-medium">{property.bathrooms || '-'}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
                  House Rules
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center space-x-2">
                    <span className={property.petsAllowed ? "text-green-600" : "text-gray-400"}>
                      {property.petsAllowed ? '✓ Pets allowed' : '× No pets'}
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className={property.smokingAllowed ? "text-green-600" : "text-gray-400"}>
                      {property.smokingAllowed ? '✓ Smoking allowed' : '× No smoking'}
                    </span>
                  </li>
                  {property.minimumStay && (
                    <li className="text-gray-600">
                      Minimum stay: {property.minimumStay} nights
                    </li>
                  )}
                </ul>
              </div>

              <button className="w-full py-4 bg-gray-900 text-white rounded-sm font-medium hover:bg-gray-800 transition-colors">
                Request to Book
              </button>
            </div>
          </div>
          
        </div>
      </Container>
    </article>
  );
}
