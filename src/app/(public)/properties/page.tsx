import { getPropertyListing } from '@/lib/server/property';
import { PropertyCard } from '@/components/home/PropertyCard';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Pagination } from '@/components/shared/Pagination';
import { normalizePropertyQuery } from '@/lib/utils/search-params';

export const metadata = {
  title: 'Luxury Properties | Miio',
  description: 'Explore our curated collection of luxury properties available for your next unforgettable stay.',
};

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const query = normalizePropertyQuery(resolvedParams);

  // Enforce public rules
  query.status = 'PUBLISHED';
  query.visibleOnWebsite = 'true';
  query.limit = query.limit || 12;

  let response;
  let hasError = false;

  try {
    response = await getPropertyListing(query as Record<string, string | string[] | undefined>);
  } catch (error) {
    console.error('Failed to fetch public properties:', error);
    hasError = true;
  }

  const properties = response?.data || [];

  return (
    <div className="min-h-screen bg-white">
      <Section className="bg-gray-50 pt-32 pb-16">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
              Our Collection
            </h1>
            <p className="text-xl text-gray-600">
              Discover exceptional homes designed to provide unforgettable stays in the world&apos;s most captivating locations.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="py-16">
        <Container>
          {hasError ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to load properties</h3>
              <p className="text-gray-600">Please try refreshing the page or check back later.</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">No properties available</h3>
              <p className="text-gray-600">We couldn&apos;t find any properties matching your current criteria.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-12">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    slug={property.slug}
                    name={property.title}
                    location={[property.location?.city, property.location?.country].filter(Boolean).join(', ') || 'Various Locations'}
                    description={property.shortDescription || property.longDescription?.substring(0, 150) || ''}
                    coverImage={property.coverImageId || property.gallery?.[0]?.assetId}
                  />
                ))}
              </div>
              {response?.pagination && <Pagination pagination={response.pagination} />}
            </>
          )}
        </Container>
      </Section>
    </div>
  );
}
