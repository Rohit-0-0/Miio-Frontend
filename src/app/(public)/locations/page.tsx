import { Metadata } from 'next';
import { getLocations } from '@/lib/server/location';
import { Container } from '@/components/ui/Container';
import { EditorialCard } from '@/components/shared/EditorialCard';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { editorialService } from '@/services/about.service';

export const metadata: Metadata = {
  title: 'Locations | Miio',
  description: 'Explore our curated collection of luxury locations.',
};

export default async function LocationsPage() {
  const [locations, pageRes] = await Promise.all([
    getLocations(),
    editorialService.getLocationsPage().catch(() => ({ data: null }))
  ]);
  
  const pageData = pageRes?.data;

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <Container>
        <div className="mb-16">
          <SectionHeader title={pageData?.title || "Locations"} align="left" />
          <p className="text-xl text-gray-600 mt-6 max-w-2xl font-light">
            {pageData?.description || "Discover our exclusive properties in the world's most sought-after destinations."}
          </p>
        </div>

        {locations && locations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {locations.map((location: any) => (
              <EditorialCard
                key={location._id}
                title={location.title}
                description={location.description}
                image={location.heroImage}
                link={`/locations/${location.slug}`}
                ctaText="Explore Location"
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <h3 className="text-2xl font-serif text-gray-900 mb-4">No locations found</h3>
            <p className="text-gray-500">We are currently updating our collection.</p>
          </div>
        )}
      </Container>
    </div>
  );
}
