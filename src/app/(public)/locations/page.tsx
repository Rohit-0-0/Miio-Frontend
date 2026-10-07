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
    <div className="min-h-screen bg-[#FEF6EE] pt-[48px] pb-24">
      <Container>
        <div className="mb-16 border-b border-[#1B1A17]/10 pb-12 text-left">
          <h1 className="font-serif text-[40px] md:text-[56px] text-[#1B1A17] tracking-tight leading-tight mb-4">
            {pageData?.title || "Explore our locations"}
          </h1>
          <p className="font-sans text-[15px] md:text-[16px] text-[#5F4E44] w-full font-light leading-[1.6]">
            {pageData?.description || "A collection of thoughtfully curated homes designed for calm, effortless stays — each one shaped by its location and a considered approach to living."}
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
