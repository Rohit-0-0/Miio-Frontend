import Link from 'next/link';
import { LocationsSection } from '@/types/homepage';
import { AppImage } from '@/components/media/AppImage';
import { HOME_DEFAULTS } from '@/lib/defaults/home';

export function Locations({ locations }: { locations: LocationsSection }) {
  const heading = locations?.heading || HOME_DEFAULTS.locations.heading;
  const items = locations?.items?.length ? locations.items : HOME_DEFAULTS.locations.items;

  if (!items || items.length === 0) return null;

  return (
    <section className="bg-[#FEF6EE] py-[64px]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[188px] flex flex-col space-y-[32px]">
        <h2 className="text-3xl md:text-[36px] font-serif text-[#1B1A17] text-left">
          {heading}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[32px]">
          {items.map((location, i) => (
            <Link 
              key={location.id || i}
              href={location.ctaLink || `/locations/${location.slug || location.id}`}
              className="group flex flex-col space-y-[12px] cursor-pointer"
            >
              <div className="relative w-full aspect-[345/259] overflow-hidden bg-gray-100 mb-1">
                {location.image ? (
                  <AppImage
                    image={location.image}
                    alt={location.name}
                    fill
                    className="object-cover transition-transform duration-[520ms] ease-out group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#F8F5EF] text-[#1B1A17]/20">
                    <span className="font-serif text-2xl tracking-widest uppercase">MiiO</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col space-y-1">
                <h3 className="text-[17px] font-serif text-[#1B1A17]">{location.name}</h3>
                {location.description && (
                  <p className="font-sans text-[13px] font-light text-[#7D7975] line-clamp-2 leading-relaxed">
                    {location.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
