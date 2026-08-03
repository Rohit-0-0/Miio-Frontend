import { LocationsSection } from '@/types/homepage';
import { EditorialCard } from '@/components/shared/EditorialCard';
import { SectionHeader } from '@/components/shared/SectionHeader';

export function Locations({ locations }: { locations: LocationsSection }) {
  if (!locations || !locations.items || locations.items.length === 0) return null;

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 flex flex-col space-y-16">
        <SectionHeader title={locations.heading} align="center" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {locations.items.map((location) => (
            <EditorialCard
              key={location.id}
              title={location.name}
              description={location.description}
              image={location.image}
              link={`/locations/${location.id}`}
              ctaText="Explore Location"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
