'use client';

import React from 'react';
import {
  Wifi,
  Utensils,
  Tv,
  Waves,
  Car,
  Coffee,
  Snowflake,
  Flame,
  Check,
  Briefcase,
  Shirt,
  Monitor,
  Trees,
  Users,
  Lock,
} from 'lucide-react';

interface Amenity {
  id: string;
  label: string;
  icon?: string;
}

interface AmenitiesSectionProps {
  amenities?: Amenity[];
  featuredAmenityIds?: string[];
  /** Icon grid near the description (top) vs checkmark list (lower section) */
  variant?: 'icons' | 'list';
}

const getAmenityIcon = (label: string) => {
  const l = label.toLowerCase();
  const iconProps = { className: 'w-5 h-5 text-[#7D7975]', strokeWidth: 1.25 };

  if (l.includes('wifi') || l.includes('internet')) return <Wifi {...iconProps} />;
  if (l.includes('kitchen') || l.includes('cook') || l.includes('oven') || l.includes('stove'))
    return <Utensils {...iconProps} />;
  if (l.includes('air conditioning') || l.includes('ac ') || l.includes('cool'))
    return <Snowflake {...iconProps} />;
  if (l.includes('heating') || l.includes('heater') || l.includes('fire') || l.includes('hot water'))
    return <Flame {...iconProps} />;
  if (l.includes('tv') || l.includes('television') || l.includes('screen')) return <Tv {...iconProps} />;
  if (l.includes('pool') || l.includes('hottub') || l.includes('spa')) return <Waves {...iconProps} />;
  if (l.includes('parking') || l.includes('garage') || l.includes('car')) return <Car {...iconProps} />;
  if (l.includes('coffee') || l.includes('espresso') || l.includes('nespresso'))
    return <Coffee {...iconProps} />;
  if (l.includes('workspace') || l.includes('desk')) return <Briefcase {...iconProps} />;
  if (l.includes('washer') || l.includes('dryer') || l.includes('laundry') || l.includes('iron') || l.includes('linen') || l.includes('towel'))
    return <Shirt {...iconProps} />;
  if (l.includes('computer') || l.includes('monitor')) return <Monitor {...iconProps} />;
  if (l.includes('outdoor') || l.includes('garden') || l.includes('patio') || l.includes('beach'))
    return <Trees {...iconProps} />;
  if (l.includes('family') || l.includes('kid') || l.includes('child')) return <Users {...iconProps} />;
  if (l.includes('lock') || l.includes('self check')) return <Lock {...iconProps} />;

  return <Check {...iconProps} />;
};

function resolveDisplayAmenities(
  amenities: Amenity[],
  featuredAmenityIds: string[],
  limit: number
) {
  if (featuredAmenityIds.length > 0) {
    const featured = amenities
      .filter((a) => featuredAmenityIds.includes(a.id))
      .sort((a, b) => featuredAmenityIds.indexOf(a.id) - featuredAmenityIds.indexOf(b.id));
    if (featured.length > 0) return featured.slice(0, limit);
  }
  return amenities.slice(0, limit);
}

export function AmenitiesSection({
  amenities = [],
  featuredAmenityIds = [],
  variant = 'list',
}: AmenitiesSectionProps) {
  if (amenities.length === 0) return null;

  if (variant === 'icons') {
    const displayAmenities = resolveDisplayAmenities(amenities, featuredAmenityIds, 6);
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 mb-10">
        {displayAmenities.map((amenity) => (
          <div key={amenity.id} className="flex items-center gap-3 text-[#1B1A17]">
            <span className="shrink-0">{getAmenityIcon(amenity.label)}</span>
            <span className="text-[14px] leading-snug">{amenity.label}</span>
          </div>
        ))}
      </div>
    );
  }

  const displayAmenities = resolveDisplayAmenities(amenities, featuredAmenityIds, 6);

  return (
    <section className="py-2">
      <h2 className="font-[family-name:var(--font-instrument-sans)] text-[16px] font-medium leading-[130%] text-[#241D19] mb-4 tracking-normal">
        Amenities
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 max-w-[705px]">
        {displayAmenities.map((amenity) => (
          <div key={amenity.id} className="flex items-center gap-3">
            <Check className="w-4 h-4 text-[#241D19] shrink-0" strokeWidth={1.5} />
            <span className="font-[family-name:var(--font-instrument-sans)] text-[14px] font-normal leading-[140%] text-[#5F4E44]">
              {amenity.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
