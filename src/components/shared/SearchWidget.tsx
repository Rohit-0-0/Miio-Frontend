'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function SearchWidget({ primaryCtaLabel = 'Search' }: { primaryCtaLabel?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');

  useEffect(() => {
    if (searchParams) {
      const pCheckIn = searchParams.get('checkIn');
      const pCheckOut = searchParams.get('checkOut');
      const pGuests = searchParams.get('guests');
      if (pCheckIn) setCheckIn(pCheckIn);
      if (pCheckOut) setCheckOut(pCheckOut);
      if (pGuests) setGuests(pGuests);
    }
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    // Preserve existing params like pagination/sorting (from current URL if we are on properties page)
    if (searchParams) {
      searchParams.forEach((value, key) => {
        if (key !== 'checkIn' && key !== 'checkOut' && key !== 'guests') {
          params.append(key, value);
        }
      });
    }

    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    if (guests) params.append('guests', guests);

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="w-full bg-white/10 backdrop-blur-md rounded-sm p-2 flex flex-col md:flex-row gap-2 shadow-lg md:shadow-none md:bg-transparent md:backdrop-blur-none">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 bg-white rounded-sm overflow-hidden shadow-sm border border-gray-100">
        <div className="px-6 py-4 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100 relative group cursor-pointer hover:bg-gray-50 transition-colors">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Check In</span>
          <input 
            type="date" 
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="text-sm font-medium text-gray-900 bg-transparent border-none p-0 focus:ring-0 w-full cursor-pointer outline-none" 
          />
        </div>
        <div className="px-6 py-4 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100 relative group cursor-pointer hover:bg-gray-50 transition-colors">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Check Out</span>
          <input 
            type="date" 
            value={checkOut}
            min={checkIn}
            onChange={(e) => setCheckOut(e.target.value)}
            className="text-sm font-medium text-gray-900 bg-transparent border-none p-0 focus:ring-0 w-full cursor-pointer outline-none" 
          />
        </div>
        <div className="px-6 py-4 flex flex-col justify-center relative group cursor-pointer hover:bg-gray-50 transition-colors">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Guests</span>
          <select 
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="text-sm font-medium text-gray-900 bg-transparent border-none p-0 focus:ring-0 w-full cursor-pointer outline-none appearance-none"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
              <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>
            ))}
          </select>
        </div>
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
