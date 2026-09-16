import Link from 'next/link';
import { LocationsSection } from '@/types/homepage';
import { AppImage } from '@/components/media/AppImage';
import { HOME_DEFAULTS } from '@/lib/defaults/home';

export function Locations({ locations }: { locations: LocationsSection }) {
  const heading = locations?.heading || HOME_DEFAULTS.locations.heading;
  const items = locations?.items?.length ? locations.items : HOME_DEFAULTS.locations.items;

  if (!items || items.length === 0) return null;

  return (
    <section className="bg-[#FEF6EE] py-[40px] md:py-[64px]">
      <div className="max-w-[1440px] mx-auto px-5 md:px-[188px] flex flex-col gap-[24px] md:gap-[32px]">
        <h2 className="text-[24px] md:text-[36px] font-serif text-[#1B1A17] text-center md:text-left leading-tight">
          {heading}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] md:gap-[32px]">
          {items.map((location, i) => (
            <Link 
              key={location.id || i}
              href={location.ctaLink || `/locations/${location.slug || location.id}`}
              className="group flex flex-col gap-[12px] cursor-pointer"
            >
              <div className="relative w-full aspect-[35/31] overflow-hidden bg-gray-100">
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
              <div className="flex flex-col gap-0">
                <h3 className="font-sans text-[16px] font-medium leading-[130%] text-[#1B1A17]">{location.name}</h3>
                {location.description && (
                  <p className="font-sans text-[13px] font-normal text-[#5F4E44]/75 line-clamp-2 leading-[135%]">
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
