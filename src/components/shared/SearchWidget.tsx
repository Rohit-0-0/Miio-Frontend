'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GuestSelector } from '../properties/booking/GuestSelector';
import { getNextDayStr, getTodayStr } from '@/lib/utils/dates';
import { DateRangePicker } from './DateRangePicker';

export function SearchWidget({ primaryCtaLabel = 'Search' }: { primaryCtaLabel?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkOutRef = useRef<HTMLInputElement>(null);

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [infants, setInfants] = useState<number>(0);
  const [pets, setPets] = useState<number>(0);

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
        if (!['checkIn', 'checkOut', 'adults', 'children', 'infants', 'pets', 'guests'].includes(key)) {
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

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="w-full bg-white/10 backdrop-blur-md rounded-sm p-2 flex flex-col md:flex-row gap-2 shadow-lg md:shadow-none md:bg-transparent md:backdrop-blur-none z-50 relative">
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
        className="bg-[#1B1A17] text-white px-8 py-4 md:py-0 md:min-h-[72px] rounded-sm font-medium tracking-widest uppercase text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
      >
        {primaryCtaLabel}
      </button>
    </div>
  );
}
