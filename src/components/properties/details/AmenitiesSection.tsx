'use client';

import React, { useState } from 'react';

interface Amenity {
  id: string;
  label: string;
  icon?: string;
}

interface AmenitiesSectionProps {
  amenities?: Amenity[];
  featuredAmenityIds?: string[];
}

export function AmenitiesSection({ amenities = [], featuredAmenityIds = [] }: AmenitiesSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  
  if (amenities.length === 0) return null;

  // Render featured amenities first if available, otherwise just grab the first 6
  let displayAmenities = amenities;
  if (featuredAmenityIds.length > 0) {
    const featured = amenities.filter(a => featuredAmenityIds.includes(a.id));
    // Sort them according to the featured order
    displayAmenities = featured.sort((a, b) => featuredAmenityIds.indexOf(a.id) - featuredAmenityIds.indexOf(b.id));
    if (displayAmenities.length === 0) {
      displayAmenities = amenities.slice(0, 6);
    }
  } else {
    displayAmenities = amenities.slice(0, 6);
  }

  return (
    <section className="mb-12 pt-12 border-t border-gray-100">
      <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
        What this place offers
      </h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {displayAmenities.map(amenity => (
          <div key={amenity.id} className="flex items-center space-x-3 text-gray-700">
            <div className="w-6 h-6 flex-shrink-0 bg-gray-100 rounded-sm flex items-center justify-center text-xs">
              {/* Icon goes here */}
              Icon
            </div>
            <span className="text-lg">{amenity.label}</span>
          </div>
        ))}
      </div>

      {amenities.length > displayAmenities.length && (
        <button 
          onClick={() => setModalOpen(true)}
          className="px-6 py-3 border border-gray-900 text-gray-900 rounded-md font-medium hover:bg-gray-50 transition-colors"
        >
          Show all {amenities.length} amenities
        </button>
      )}

      {/* Modal placeholder */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
           <div className="bg-white p-8 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto relative">
             <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-xl">&times;</button>
             <h3 className="text-2xl font-serif font-bold mb-6">All Amenities</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {amenities.map(amenity => (
                  <div key={amenity.id} className="flex items-center space-x-3 text-gray-700 py-2 border-b border-gray-100">
                    <span>{amenity.label}</span>
                  </div>
                ))}
             </div>
           </div>
        </div>
      )}
    </section>
  );
}
