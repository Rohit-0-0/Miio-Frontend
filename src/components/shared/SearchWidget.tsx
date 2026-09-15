'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GuestSelector } from '../properties/booking/GuestSelector';
import { getNextDayStr, getTodayStr } from '@/lib/utils/dates';
import { DateRangePicker } from './DateRangePicker';

interface SearchWidgetLabels {
  whereTo?: string;
  chooseLocation?: string;
  dates?: string;
  addDates?: string;
  guests?: string;
  addGuests?: string;
  searchButton?: string;
}

export function SearchWidget({ 
  primaryCtaLabel = 'Search',
  labels 
}: { 
  primaryCtaLabel?: string;
  labels?: SearchWidgetLabels;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkOutRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<'search' | 'filter' | null>(null);

  const [location, setLocation] = useState<string>('');
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
      
      const pLocation = searchParams.get('city');
      if (pLocation) setLocation(pLocation);
      
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
        if (!['city', 'checkIn', 'checkOut', 'adults', 'children', 'infants', 'pets', 'guests', 'propertyType', 'amenities', 'minBedrooms', 'minBathrooms', 'minPrice', 'maxPrice'].includes(key)) {
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

    if (location) params.append('city', location);
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
    <div ref={filterRef} className="w-full flex flex-col gap-2 z-30 relative shadow-2xl">
      <div className="w-full bg-[#FEF6EE] md:bg-white rounded-[16px] md:rounded-full p-4 md:p-2 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 relative">
        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 divide-y divide-[#1B1A17]/20 md:divide-y-0 md:divide-x md:divide-gray-200 bg-transparent rounded-[16px] md:rounded-none overflow-visible">
          
          {/* WHERE TO? */}
          <div className="relative group flex-1 h-full">
            <div 
              onClick={() => setOpenDropdown(openDropdown === 'location' ? null : 'location')}
              className="px-2 md:px-6 py-4 md:py-3 h-full w-full flex justify-between items-center cursor-pointer hover:bg-black/5 transition-colors md:rounded-l-full"
            >
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-widest text-[#1B1A17] uppercase mb-1">{labels?.whereTo || 'WHERE TO?'}</span>
                <span className="text-sm text-[#1B1A17]/70 font-medium truncate">{location || labels?.chooseLocation || 'Choose location'}</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B1A17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 hidden md:block lg:block sm:block xs:block"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            
            {openDropdown === 'location' && (
              <div className="absolute top-full left-0 mt-4 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 py-3 ml-2 md:ml-4">
                {['Bondi', 'Vaucluse', 'Paddington'].map(loc => (
                  <div 
                    key={loc}
                    onClick={() => { setLocation(loc); setOpenDropdown(null); }}
                    className="px-6 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center justify-between text-[#1B1A17] text-sm transition-colors"
                  >
                    <span>{loc}</span>
                    {location === loc && <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1" stroke="#1B1A17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <DateRangePicker 
            checkIn={checkIn}
            checkOut={checkOut}
            onChange={(inDate, outDate) => {
              setCheckIn(inDate);
              setCheckOut(outDate);
            }}
            className="relative"
            triggerClassName="px-2 md:px-6 py-4 md:py-3 h-full flex flex-col justify-center relative group cursor-pointer hover:bg-black/5 transition-colors"
            customTrigger={
              <div 
                onClick={() => setOpenDropdown(null)}
                className="flex w-full px-2 md:px-6 py-4 md:py-3 h-full justify-between items-center group cursor-pointer hover:bg-black/5 transition-colors"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold tracking-widest text-[#1B1A17] uppercase mb-1">{labels?.dates || 'DATES'}</span>
                  <span className="text-sm text-[#1B1A17]/70 font-light truncate">
                    {checkIn ? `${checkIn}${checkOut ? ` - ${checkOut}` : ' - Add Date'}` : (
                      <span>{labels?.addDates || 'Add dates'}</span>
                    )}
                  </span>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B1A17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 hidden md:block lg:block sm:block xs:block"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
            }
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
            triggerClassName="px-2 md:px-6 py-4 md:py-3 h-full flex flex-col justify-center relative group cursor-pointer hover:bg-black/5 transition-colors"
            customTrigger={
              <div 
                onClick={() => setOpenDropdown(null)}
                className="flex w-full px-2 md:px-6 py-4 md:py-3 h-full justify-between items-center group cursor-pointer hover:bg-black/5 transition-colors md:rounded-r-full"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold tracking-widest text-[#1B1A17] uppercase mb-1">{labels?.guests || 'GUESTS'}</span>
                  <span className="text-sm text-[#1B1A17]/70 font-light truncate">
                    {adults + children > 0 || infants > 0 || pets > 0 
                      ? `${adults + children} ${adults + children === 1 ? 'guest' : 'guests'}` + (infants ? `, ${infants} inf` : '') + (pets ? `, ${pets} pets` : '')
                      : (<span>{labels?.addGuests || 'Add guests'}</span>)}
                  </span>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B1A17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 hidden md:block lg:block sm:block xs:block"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
            }
          />
        </div>
        
        <button 
          onClick={() => handleSearch('search')}
          disabled={isPending}
          className="bg-[#C3BA8D] text-black px-8 py-4 md:py-0 md:h-[60px] md:min-w-[140px] rounded-full font-medium tracking-widest uppercase text-sm hover:opacity-90 transition-opacity whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full md:w-auto md:ml-2 shadow-sm"
        >
          {isPending && pendingAction === 'search' ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </>
          ) : (
            <>
              Search <span className="ml-1">→</span>
            </>
          )}
        </button>
      </div>


    </div>
  );
}
