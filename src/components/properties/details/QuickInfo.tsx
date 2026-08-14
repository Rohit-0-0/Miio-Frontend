import React from 'react';
import { Users, DoorOpen, Bed, Bath } from 'lucide-react';

interface QuickInfoProps {
  guests?: number;
  bedrooms?: number;
  bathrooms?: number;
  beds?: number;
}

export function QuickInfo({ guests, bedrooms, bathrooms, beds }: QuickInfoProps) {
  return (
    <div className="flex flex-col mb-10 pb-10 border-b border-gray-100 mt-8">
      <h3 className="text-xl font-serif font-bold text-gray-900 mb-6">Property features</h3>
      <div className="flex items-start gap-8 flex-wrap">
        {guests && (
          <div className="flex flex-col items-center space-y-3">
            <Users className="w-10 h-10 text-gray-600" strokeWidth={1} />
            <span className="text-sm text-gray-700">{guests} Guests</span>
          </div>
        )}
        {bedrooms && (
          <div className="flex flex-col items-center space-y-3">
            <DoorOpen className="w-10 h-10 text-gray-600" strokeWidth={1} />
            <span className="text-sm text-gray-700">{bedrooms} Bedrooms</span>
          </div>
        )}
        {beds && (
          <div className="flex flex-col items-center space-y-3">
            <Bed className="w-10 h-10 text-gray-600" strokeWidth={1} />
            <span className="text-sm text-gray-700">{beds} Beds</span>
          </div>
        )}
        {bathrooms && (
          <div className="flex flex-col items-center space-y-3">
            <Bath className="w-10 h-10 text-gray-600" strokeWidth={1} />
            <span className="text-sm text-gray-700">{bathrooms} Bathrooms</span>
          </div>
        )}
      </div>
    </div>
  );
}
