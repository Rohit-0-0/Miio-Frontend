import React from 'react';
import { FilterConfiguration } from '@/types/stays-page';
import { FilterPill } from './FilterPill';

interface BrowseFiltersProps {
  config: FilterConfiguration;
}

export function BrowseFilters({ config }: BrowseFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-8 border-b border-gray-100">
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        {config.showLocationFilter && (
          <FilterPill label="Location" value="Any" />
        )}
        {config.showGuestsFilter && (
          <FilterPill label="Guests" value="Add guests" />
        )}
        {config.showPriceFilter && (
          <FilterPill label="Price" value="Any" />
        )}
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
        {config.enableMapButton && (
          <button 
            type="button" 
            disabled
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium border border-gray-200 bg-white text-gray-400 opacity-60 cursor-not-allowed"
            title="Map view coming soon"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <span>Map View</span>
          </button>
        )}
      </div>
    </div>
  );
}
