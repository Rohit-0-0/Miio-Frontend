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
  const [priceRange, setPriceRange] = useState<string>('All');

  const [isAmenitiesOpen, setIsAmenitiesOpen] = useState(false);
  const amenitiesRef = useRef<HTMLDivElement>(null);

  const toggleAmenity = (amenity: string) => {
    setAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (amenitiesRef.current && !amenitiesRef.current.contains(e.target as Node)) {
        setIsAmenitiesOpen(false);
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
      if (pBeds) setBedrooms(pBeds === '1' ? '1+' : pBeds === '2' ? '2+' : pBeds === '3' ? '3+' : pBeds === '4' ? '4+' : 'All');

      const pBaths = searchParams.get('minBathrooms');
      if (pBaths) setBathrooms(pBaths === '1' ? '1+' : pBaths === '2' ? '2+' : pBaths === '3' ? '3+' : pBaths === '4' ? '4+' : 'All');

      const pMinPrice = searchParams.get('minPrice');
      const pMaxPrice = searchParams.get('maxPrice');
      if (pMinPrice && pMaxPrice) setPriceRange(`$${pMinPrice} - $${pMaxPrice}`);
      else if (pMinPrice) setPriceRange(`$${pMinPrice}+`);
      else if (pMaxPrice) setPriceRange(`$0 - $${pMaxPrice}`);
      else setPriceRange('All');
    }
  }, [searchParams]);

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckIn = e.target.value;
    setCheckIn(newCheckIn);
    
    if (newCheckIn) {
      if (!checkOut) {
        // Automatically focus checkout if empty
        if (checkOutRef.current) {
          checkOutRef.current.focus();
          try {
            checkOutRef.current.showPicker?.();
          } catch (err) {}
        }
      } else {
        // Clear checkout if invalid and open picker
        if (checkOut <= newCheckIn) {
          setCheckOut('');
          // Re-focus checkout after clearing so user can select a valid date
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

  const minCheckOut = checkIn ? getNextDayStr(checkIn) : getNextDayStr(getTodayStr());

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    // Preserve existing params like pagination/sorting (from current URL if we are on properties page)
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

    if (priceRange !== 'All') {
      if (priceRange === '$0 - $250') {
        params.append('minPrice', '0');
        params.append('maxPrice', '250');
      } else if (priceRange === '$250 - $500') {
        params.append('minPrice', '250');
        params.append('maxPrice', '500');
      } else if (priceRange === '$500 - $1000') {
        params.append('minPrice', '500');
        params.append('maxPrice', '1000');
      } else if (priceRange === '$1000+') {
        params.append('minPrice', '1000');
      }
    }

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
          onClick={handleSearch}
          disabled={isPending}
          className="bg-[#1B1A17] text-white px-8 py-3 md:py-0 md:min-h-[64px] md:min-w-[140px] rounded-sm font-medium tracking-widest uppercase text-sm hover:opacity-90 transition-opacity whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending ? (
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

      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-700 bg-white/10 md:bg-transparent p-2 md:p-0 rounded-sm">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded px-3 py-2 cursor-pointer shadow-sm relative group">
          <span className="text-gray-500 whitespace-nowrap">Price per night:</span>
          <select 
            value={priceRange} 
            onChange={e => setPriceRange(e.target.value)}
            className="bg-transparent border-none outline-none font-medium cursor-pointer appearance-none pr-4"
          >
            <option>All</option>
            <option>$0 - $250</option>
            <option>$250 - $500</option>
            <option>$500 - $1000</option>
            <option>$1000+</option>
          </select>
          <div className="absolute right-2 pointer-events-none">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded px-3 py-2 cursor-pointer shadow-sm relative group">
          <span className="text-gray-500 whitespace-nowrap">Property type:</span>
          <select 
            value={propertyType} 
            onChange={e => setPropertyType(e.target.value)}
            className="bg-transparent border-none outline-none font-medium cursor-pointer appearance-none pr-4"
          >
            <option>All</option>
            <option>Apartment</option>
            <option>House</option>
            <option>Villa</option>
            <option>Studio</option>
          </select>
          <div className="absolute right-2 pointer-events-none">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>

        <div ref={amenitiesRef} className="flex items-center gap-2 bg-white border border-gray-200 rounded px-3 py-2 cursor-pointer shadow-sm relative group">
          <div onClick={() => setIsAmenitiesOpen(!isAmenitiesOpen)} className="flex items-center gap-2 w-full">
            <span className="text-gray-500 whitespace-nowrap">Amenities:</span>
            <span className="font-medium text-gray-900 pr-4 whitespace-nowrap">
              {amenities.length === 0 ? 'All' : `${amenities.length} selected`}
            </span>
            <div className="absolute right-2 pointer-events-none">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
          {isAmenitiesOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-100 rounded-md shadow-xl z-50 p-2 flex flex-col gap-1">
              {['Pool', 'WiFi', 'Parking', 'Kitchen', 'Air Conditioning', 'Hot Tub', 'Gym'].map(am => (
                <label key={am} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer text-sm text-gray-700 select-none">
                  <input 
                    type="checkbox" 
                    checked={amenities.includes(am)} 
                    onChange={() => toggleAmenity(am)} 
                    className="rounded border-gray-300 text-gray-900 focus:ring-gray-900 w-4 h-4 cursor-pointer" 
                  />
                  {am}
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded px-3 py-2 cursor-pointer shadow-sm relative group">
          <span className="text-gray-500 whitespace-nowrap">Bedrooms:</span>
          <select 
            value={bedrooms} 
            onChange={e => setBedrooms(e.target.value)}
            className="bg-transparent border-none outline-none font-medium cursor-pointer appearance-none pr-4"
          >
            <option>All</option>
            <option>1+</option>
            <option>2+</option>
            <option>3+</option>
            <option>4+</option>
          </select>
          <div className="absolute right-2 pointer-events-none">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded px-3 py-2 cursor-pointer shadow-sm relative group">
          <span className="text-gray-500 whitespace-nowrap">Bathrooms:</span>
          <select 
            value={bathrooms} 
            onChange={e => setBathrooms(e.target.value)}
            className="bg-transparent border-none outline-none font-medium cursor-pointer appearance-none pr-4"
          >
            <option>All</option>
            <option>1+</option>
            <option>2+</option>
            <option>3+</option>
            <option>4+</option>
          </select>
          <div className="absolute right-2 pointer-events-none">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
}
