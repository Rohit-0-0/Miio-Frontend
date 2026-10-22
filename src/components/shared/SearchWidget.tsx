'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GuestSelector } from '../properties/booking/GuestSelector';
import { getNextDayStr, getTodayStr } from '@/lib/utils/dates';
import { DateRangePicker } from './DateRangePicker';
import { trackEvent } from '@/lib/analytics';
import * as meta from '@/lib/analytics/meta';
import { format, parseISO } from 'date-fns';

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

    // Track Search event
    trackEvent('search', {
      search_term: location || 'All',
      check_in: checkIn || '',
      check_out: checkOut || '',
      adults: adults,
      children: children
    });
    meta.event('Search', {
      search_string: location || 'All',
      content_category: propertyType !== 'All' ? propertyType : undefined
    });

    startTransition(() => {
      router.push(`/properties?${params.toString()}`);
    });
  };

  return (
    <div ref={filterRef} className="w-full flex flex-col gap-2 z-30 relative shadow-2xl md:shadow-2xl">
      <div className="w-full max-w-[342px] sm:max-w-[360px] md:max-w-none mx-auto bg-[#FAF7F2] md:bg-[#FAF7F2] rounded-[16px] md:rounded-full p-5 md:p-3 md:pl-8 md:pr-3 flex flex-col md:flex-row items-center justify-between gap-5 md:gap-6 relative shadow-[0_4px_20px_rgba(0,0,0,0.08)] md:shadow-[0_4px_30px_rgba(0,0,0,0.12)] border border-[#5F4E44]/10">
        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 bg-transparent rounded-none gap-4 md:gap-8 overflow-visible">
          
          {/* WHERE TO? */}
          <div className="relative group flex-1 h-full">
            <div 
              onClick={() => setOpenDropdown(openDropdown === 'location' ? null : 'location')}
              className="px-1 md:px-0 py-1 md:py-2 h-full w-full flex items-center cursor-pointer transition-colors font-sans"
            >
              <div className="flex flex-col items-start justify-center w-full">
                <span className="text-[11px] md:text-[11px] text-[#1B1A17] uppercase tracking-wider leading-tight font-medium">{labels?.whereTo || 'WHERE TO?'}</span>
                <div className="flex items-center justify-between w-full mt-1.5 pb-2 border-b border-[#5F4E44]">
                  <span className={`text-[14px] md:text-[15px] font-normal truncate leading-tight text-left ${location ? 'text-[#1B1A17]' : 'text-[#5F4E44]/70'}`}>
                    {location || labels?.chooseLocation || 'Choose location'}
                  </span>
                  <svg className="w-4 h-4 text-[#5F4E44] shrink-0 md:hidden ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {openDropdown === 'location' && (
              <div className="absolute top-full left-0 mt-4 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 py-3 ml-2 md:ml-0 font-sans">
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
            className="relative font-sans"
            triggerClassName="px-1 md:px-0 py-1 md:py-2 h-full flex flex-col justify-center relative group cursor-pointer transition-colors"
            customTrigger={
              <div 
                onClick={() => setOpenDropdown(null)}
                className="flex w-full px-1 md:px-0 py-1 md:py-2 h-full items-center group cursor-pointer transition-colors font-sans"
              >
                <div className="flex flex-col items-start justify-center w-full">
                  <span className="text-[11px] md:text-[11px] text-[#1B1A17] uppercase tracking-wider leading-tight font-medium">{labels?.dates || 'DATES'}</span>
                  <div className="flex items-center justify-between w-full mt-1.5 pb-2 border-b border-[#5F4E44]">
                    <span className={`text-[14px] md:text-[15px] font-normal truncate leading-tight text-left ${checkIn ? 'text-[#1B1A17]' : 'text-[#5F4E44]/70'}`}>
                      {checkIn ? `${format(parseISO(checkIn), 'd MMM yyyy')}${checkOut ? ` - ${format(parseISO(checkOut), 'd MMM yyyy')}` : ' - Add Date'}` : (
                        <span>{labels?.addDates || 'Add dates'}</span>
                      )}
                    </span>
                    <svg className="w-4 h-4 text-[#5F4E44] shrink-0 md:hidden ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                </div>
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
            className="relative font-sans"
            triggerClassName="px-1 md:px-0 py-1 md:py-2 h-full flex flex-col justify-center relative group cursor-pointer transition-colors"
            customTrigger={
              <div 
                onClick={() => setOpenDropdown(null)}
                className="flex w-full px-1 md:px-0 py-1 md:py-2 h-full items-center group cursor-pointer transition-colors font-sans"
              >
                <div className="flex flex-col items-start justify-center w-full">
                  <span className="text-[11px] md:text-[11px] text-[#1B1A17] uppercase tracking-wider leading-tight font-medium">{labels?.guests || 'GUESTS'}</span>
                  <div className="flex items-center justify-between w-full mt-1.5 pb-2 border-b border-[#5F4E44]">
                    <span className={`text-[14px] md:text-[15px] font-normal truncate leading-tight text-left ${adults + children > 0 || infants > 0 || pets > 0 ? 'text-[#1B1A17]' : 'text-[#5F4E44]/70'}`}>
                      {adults + children > 0 || infants > 0 || pets > 0 
                        ? `${adults + children} ${adults + children === 1 ? 'guest' : 'guests'}` + (infants ? `, ${infants} inf` : '') + (pets ? `, ${pets} pets` : '')
                        : (<span>{labels?.addGuests || 'Add guests'}</span>)}
                    </span>
                    <svg className="w-4 h-4 text-[#5F4E44] shrink-0 md:hidden ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                </div>
              </div>
            }
          />
        </div>
        
        <button 
          onClick={() => handleSearch('search')}
          disabled={isPending}
          className="bg-[#C3BA8D] text-[#1B1A17] px-8 h-[56px] md:h-[58px] md:min-w-[150px] rounded-full font-sans font-medium text-[15px] hover:opacity-90 transition-opacity whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full md:w-auto shadow-sm"
        >
          {isPending && pendingAction === 'search' ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#1B1A17]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </>
          ) : (
            <>
              <span>Search</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </>
          )}
        </button>
      </div>


    </div>
  );
}
