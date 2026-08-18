'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GuestSelector } from '../properties/booking/GuestSelector';
import { getNextDayStr, getTodayStr } from '@/lib/utils/dates';
import { DateRangePicker } from './DateRangePicker';

export function SearchWidget({ primaryCtaLabel = 'Search' }: { primaryCtaLabel?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkOutRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<'search' | 'filter' | null>(null);

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [infants, setInfants] = useState<number>(0);
  const [pets, setPets] = useState<number>(0);

  const [propertyType, setPropertyType] = useState<string>('All');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [bedrooms, setBedrooms] = useState<string>('All');
  const [bathrooms, setBathrooms] = useState<string>('All');
  
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const toggleAmenity = (amenity: string) => {
    setAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchParams) {
      const pCheckIn = searchParams.get('checkIn');
      const pCheckOut = searchParams.get('checkOut');
      if (pCheckIn) setCheckIn(pCheckIn);
      if (pCheckOut) setCheckOut(pCheckOut);
      
      const pAdults = searchParams.get('adults');
      if (pAdults) setAdults(parseInt(pAdults, 10));
      const pChildren = searchParams.get('children');
      if (pChildren) setChildren(parseInt(pChildren, 10));
      const pInfants = searchParams.get('infants');
      if (pInfants) setInfants(parseInt(pInfants, 10));
      const pPets = searchParams.get('pets');
      if (pPets) setPets(parseInt(pPets, 10));

      const pType = searchParams.get('propertyType');
      if (pType) setPropertyType(pType);
      
      const pAmenities = searchParams.get('amenities');
      if (pAmenities) setAmenities(pAmenities.split(',').filter(Boolean));

      const pBeds = searchParams.get('minBedrooms');
      if (pBeds) setBedrooms(pBeds === '1' ? '1+' : pBeds);

      const pBaths = searchParams.get('minBathrooms');
      if (pBaths) setBathrooms(pBaths === '1' ? '1+' : pBaths);

      const pMinPrice = searchParams.get('minPrice');
      const pMaxPrice = searchParams.get('maxPrice');
      if (pMinPrice) setMinPrice(pMinPrice);
      if (pMaxPrice) setMaxPrice(pMaxPrice);
    }
  }, [searchParams]);

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckIn = e.target.value;
    setCheckIn(newCheckIn);
    
    if (newCheckIn) {
      if (!checkOut) {
        if (checkOutRef.current) {
          checkOutRef.current.focus();
          try {
            checkOutRef.current.showPicker?.();
          } catch (err) {}
        }
      } else {
        if (checkOut <= newCheckIn) {
          setCheckOut('');
          setTimeout(() => {
            if (checkOutRef.current) {
              checkOutRef.current.focus();
              try {
                checkOutRef.current.showPicker?.();
              } catch (err) {}
            }
          }, 0);
        }
      }
    }
  };

  const handleClearFilters = () => {
    setPropertyType('All');
    setAmenities([]);
    setBedrooms('All');
    setBathrooms('All');
    setMinPrice('');
    setMaxPrice('');

    // If we are on the properties page, update query params but preserve dates/guests
    startTransition(() => {
      const pathname = window.location.pathname;
      if (pathname === '/properties') {
        const params = new URLSearchParams();
        if (checkIn) params.append('checkIn', checkIn);
        if (checkOut) params.append('checkOut', checkOut);
        params.append('adults', adults.toString());
        if (children > 0) params.append('children', children.toString());
        if (infants > 0) params.append('infants', infants.toString());
        if (pets > 0) params.append('pets', pets.toString());
        
        router.push(`/properties?${params.toString()}`);
      }
    });
  };

  const hasActiveFilters = 
    propertyType !== 'All' || 
    amenities.length > 0 || 
    bedrooms !== 'All' || 
    bathrooms !== 'All' || 
    minPrice !== '' || 
    maxPrice !== '';

  const handleSearch = (action: 'search' | 'filter' = 'search') => {
    setPendingAction(action);
    const params = new URLSearchParams();
    
    if (searchParams) {
      searchParams.forEach((value, key) => {
        if (!['checkIn', 'checkOut', 'adults', 'children', 'infants', 'pets', 'guests', 'propertyType', 'amenities', 'minBedrooms', 'minBathrooms', 'minPrice', 'maxPrice'].includes(key)) {
          params.append(key, value);
        }
      });
    }

    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    params.append('adults', adults.toString());
    if (children > 0) params.append('children', children.toString());
    if (infants > 0) params.append('infants', infants.toString());
    if (pets > 0) params.append('pets', pets.toString());

    if (propertyType !== 'All') params.append('propertyType', propertyType);
    if (amenities.length > 0) params.append('amenities', amenities.join(','));
    
    if (bedrooms !== 'All') params.append('minBedrooms', bedrooms.replace('+', ''));
    if (bathrooms !== 'All') params.append('minBathrooms', bathrooms.replace('+', ''));

    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);

    startTransition(() => {
      router.push(`/properties?${params.toString()}`);
    });
  };

  return (
    <div className="w-full flex flex-col gap-2 z-30 relative">
      <div className="w-full bg-white/10 backdrop-blur-md rounded-sm p-2 flex flex-col md:flex-row gap-2 shadow-lg md:shadow-none md:bg-transparent md:backdrop-blur-none relative">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 bg-white rounded-sm overflow-visible shadow-sm border border-gray-100">
          <DateRangePicker 
            checkIn={checkIn}
            checkOut={checkOut}
            onChange={(inDate, outDate) => {
              setCheckIn(inDate);
              setCheckOut(outDate);
            }}
            className="relative"
            triggerClassName="px-6 py-4 h-full flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100 relative group cursor-pointer hover:bg-gray-50 transition-colors"
          />
          <GuestSelector 
            adults={adults}
            children={children}
            infants={infants}
            pets={pets}
            onChangeAdults={setAdults}
            onChangeChildren={setChildren}
            onChangeInfants={setInfants}
            onChangePets={setPets}
            className="relative"
            triggerClassName="px-6 py-4 h-full flex flex-col justify-center relative group cursor-pointer hover:bg-gray-50 transition-colors"
          />
        </div>
        <button 
          onClick={() => handleSearch('search')}
          disabled={isPending}
          className="bg-[#1B1A17] text-white px-8 py-3 md:py-0 md:min-h-[64px] md:min-w-[140px] rounded-sm font-medium tracking-widest uppercase text-sm hover:opacity-90 transition-opacity whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending && pendingAction === 'search' ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </>
          ) : (
            primaryCtaLabel
          )}
        </button>
      </div>

      <div ref={filterRef} className="flex flex-wrap items-center gap-3 mt-4 text-sm text-gray-700 md:bg-transparent rounded-sm">
        
        {/* Price Dropdown */}
        <div className="relative group">
          <button 
            onClick={() => setOpenDropdown(openDropdown === 'price' ? null : 'price')}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-4 py-2.5 cursor-pointer shadow-sm hover:border-gray-300 transition-colors"
          >
            <span className="text-gray-700 whitespace-nowrap">Price per night: {minPrice || maxPrice ? (minPrice ? `A$${minPrice}` : 'A$0') + (maxPrice ? ` - A$${maxPrice}` : '+') : 'All'}</span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          {openDropdown === 'price' && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">A$</span>
                  <input 
                    type="number" 
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="0"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <span className="text-gray-400">-</span>
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">A$</span>
                  <input 
                    type="number" 
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Property Type Dropdown */}
        <div className="relative group">
          <button 
            onClick={() => setOpenDropdown(openDropdown === 'property' ? null : 'property')}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-4 py-2.5 cursor-pointer shadow-sm hover:border-gray-300 transition-colors"
          >
            <span className="text-gray-700 whitespace-nowrap">Property type: {propertyType}</span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          {openDropdown === 'property' && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-2">
              {['All', 'House', 'Apartment', 'Villa', 'Studio'].map(type => (
                <div 
                  key={type}
                  onClick={() => { setPropertyType(type); setOpenDropdown(null); }}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between text-gray-700"
                >
                  <span>{type}</span>
                  {propertyType === type && <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Amenities Dropdown */}
        <div className="relative group">
          <button 
            onClick={() => setOpenDropdown(openDropdown === 'amenities' ? null : 'amenities')}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-4 py-2.5 cursor-pointer shadow-sm hover:border-gray-300 transition-colors"
          >
            <span className="text-gray-700 whitespace-nowrap">
              Amenities: {amenities.length === 0 ? 'All' : `${amenities.length} selected`}
            </span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          {openDropdown === 'amenities' && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-2 flex flex-col gap-1">
              {['Wireless Internet', 'Swimming pool', 'Air conditioning', 'Heating', 'Kitchen', 'Hot Tub', 'Gym'].map(am => (
                <label key={am} className="flex items-center gap-3 px-2 py-2 hover:bg-gray-50 rounded cursor-pointer text-sm text-gray-700 select-none">
                  <input 
                    type="checkbox" 
                    checked={amenities.includes(am)} 
                    onChange={() => toggleAmenity(am)} 
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer" 
                  />
                  {am}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Bedrooms Dropdown */}
        <div className="relative group">
          <button 
            onClick={() => setOpenDropdown(openDropdown === 'bedrooms' ? null : 'bedrooms')}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-4 py-2.5 cursor-pointer shadow-sm hover:border-gray-300 transition-colors"
          >
            <span className="text-gray-700 whitespace-nowrap">Bedrooms: {bedrooms}</span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          {openDropdown === 'bedrooms' && (
            <div className="absolute top-full left-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-2">
              {['All', '1', '2', '3', '4', '5'].map(num => (
                <div 
                  key={num}
                  onClick={() => { setBedrooms(num); setOpenDropdown(null); }}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between text-gray-700"
                >
                  <span>{num}</span>
                  {bedrooms === num && <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bathrooms Dropdown */}
        <div className="relative group">
          <button 
            onClick={() => setOpenDropdown(openDropdown === 'bathrooms' ? null : 'bathrooms')}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-4 py-2.5 cursor-pointer shadow-sm hover:border-gray-300 transition-colors"
          >
            <span className="text-gray-700 whitespace-nowrap">Bathrooms: {bathrooms}</span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          {openDropdown === 'bathrooms' && (
            <div className="absolute top-full left-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-2">
              {['All', '1', '2', '3', '4', '5'].map(num => (
                <div 
                  key={num}
                  onClick={() => { setBathrooms(num); setOpenDropdown(null); }}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between text-gray-700"
                >
                  <span>{num}</span>
                  {bathrooms === num && <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Apply and Clear Filters Buttons */}
        <div className="ml-auto md:ml-4 flex items-center gap-4">
          <button 
            onClick={() => handleSearch('filter')}
            disabled={isPending}
            className="text-[#1B1A17] font-medium hover:opacity-70 transition-opacity flex items-center gap-2"
          >
            {isPending && pendingAction === 'filter' ? (
              <>
                <svg className="animate-spin h-4 w-4 text-[#1B1A17]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Applying...
              </>
            ) : (
              'Apply filters'
            )}
          </button>
          
          {hasActiveFilters && (
            <button 
              onClick={handleClearFilters}
              disabled={isPending}
              className="text-gray-500 font-medium hover:text-gray-900 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
