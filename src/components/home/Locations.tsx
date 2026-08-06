import { LocationsSection } from '@/types/homepage';
import { EditorialCard } from '@/components/shared/EditorialCard';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { HOME_DEFAULTS } from '@/lib/defaults/home';

export function Locations({ locations }: { locations: LocationsSection }) {
  const heading = locations?.heading || HOME_DEFAULTS.locations.heading;
  const items = locations?.items?.length ? locations.items : HOME_DEFAULTS.locations.items;

  if (!items || items.length === 0) return null;

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 flex flex-col space-y-16">
        <SectionHeader title={heading} align="center" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {items.map((location, i) => (
            <EditorialCard
              key={location.id || i}
              title={location.name}
              description={location.description}
              image={location.image}
              link={location.ctaLink || `/locations/${location.slug || location.id}`}
              ctaText={location.ctaText || 'Explore Location'}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
