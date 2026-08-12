'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PriceSummary } from './PriceSummary';
import { DateSelector } from './DateSelector';
import { GuestSelector } from './GuestSelector';
import { BookingActions } from './BookingActions';
import { ReserveButton } from './ReserveButton';
import { CheckoutModal } from './CheckoutModal';
import { apiClient } from '@/lib/api/client';

interface BookingCardProps {
  listingId: string;
}

export function BookingCard({ listingId }: BookingCardProps) {
  const searchParams = useSearchParams();

  const [checkIn, setCheckIn] = useState<string | null>(searchParams?.get('checkIn') || null);
  const [checkOut, setCheckOut] = useState<string | null>(searchParams?.get('checkOut') || null);
  const parseGuestCount = (val: string | null, fallback: number) => {
    if (!val) return fallback;
    const num = parseInt(val, 10);
    return isNaN(num) ? fallback : num;
  };

  const [adults, setAdults] = useState<number>(parseGuestCount(searchParams?.get('adults'), 1));
  const [children, setChildren] = useState<number>(parseGuestCount(searchParams?.get('children'), 0));
  const [infants, setInfants] = useState<number>(parseGuestCount(searchParams?.get('infants'), 0));
  const [pets, setPets] = useState<number>(parseGuestCount(searchParams?.get('pets'), 0));
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [quote, setQuote] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const fetchQuote = async () => {
    if (!checkIn || !checkOut || !listingId || adults < 1) return null;
    
    setIsLoading(true);
    setError(null);
    setQuote(null);
    try {
      const response = await apiClient.post<any>('/booking/quotes', {
        listingId,
        checkInDateLocalized: checkIn,
        checkOutDateLocalized: checkOut,
        guestsCount: adults + children + infants,
        numberOfGuests: {
          numberOfAdults: adults,
          numberOfChildren: children,
          numberOfInfants: infants,
          numberOfPets: pets
        }
      });
      
      if (response.success && response.data) {
        console.log(`[Quote] Generated\n  quoteId: ${response.data._id}`);
        setQuote(response.data);
        return response.data;
      } else {
        setError('Failed to fetch quote');
        return null;
      }
    } catch (err: any) {
      console.error(err);
      
      let msg = 'Unable to check availability right now.';
      const errMsg = (err.message || '').toLowerCase();
      const status = err.response?.status || err.statusCode;
      
      if (status === 404 || errMsg.includes('not available') || errMsg.includes('unavailable') || errMsg.includes('no quotes')) {
        msg = 'This property is not available for your selected dates.';
      } else if (status === 400 || errMsg.includes('invalid') || errMsg.includes('date')) {
        msg = 'Please select valid check-in and check-out dates.';
      }
      
      setError(msg);
      setQuote(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const debounceIdRef = React.useRef<NodeJS.Timeout | null>(null);

  // When dates or guests change, if we have valid dates and guests, fetch a quote
  useEffect(() => {
    if (debounceIdRef.current) clearTimeout(debounceIdRef.current);
    debounceIdRef.current = setTimeout(fetchQuote, 500);
    return () => {
      if (debounceIdRef.current) clearTimeout(debounceIdRef.current);
    };
  }, [listingId, checkIn, checkOut, adults, children, infants, pets]);

  const handleBookNowClick = () => {
    console.log(`[BookingCard] Active quote\n  quoteId: ${quote?._id}`);
    if (!quote) return;
    setError(null);
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xl shadow-gray-200/50 sticky top-32 z-10">
        <PriceSummary 
          isLoading={isLoading} 
          quote={quote} 
        />
        
        {error && (
          <div className="text-red-500 text-sm mb-4 px-3 py-2 bg-red-50 rounded border border-red-100">
            {error}
          </div>
        )}
        
        <div className="w-full">
          <DateSelector 
            checkIn={checkIn}
            checkOut={checkOut}
            onChangeCheckIn={setCheckIn}
            onChangeCheckOut={setCheckOut}
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
          />
        </div>
        
        <BookingActions>
          <ReserveButton 
            disabled={!quote || isLoading} 
            onClick={handleBookNowClick}
            isLoading={isLoading}
            label={!checkIn || !checkOut ? 'Select dates' : isLoading ? 'Checking...' : quote ? 'Book Now' : 'Unavailable'}
          />
        </BookingActions>
      </div>

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        quote={quote}
        listingId={listingId}
        checkIn={checkIn || ''}
        checkOut={checkOut || ''}
        adults={adults}
        children={children}
        infants={infants}
        pets={pets}
        onRefreshQuote={fetchQuote}
      />
    </>
  );
}
