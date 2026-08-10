'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PriceSummary } from './PriceSummary';
import { DateSelector } from './DateSelector';
import { GuestSelector } from './GuestSelector';
import { BookingActions } from './BookingActions';
import { ReserveButton } from './ReserveButton';
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
  const [success, setSuccess] = useState<string | null>(null);

  // When dates or guests change, if we have valid dates and guests, fetch a quote
  useEffect(() => {
    if (!checkIn || !checkOut || !listingId || adults < 1) return;

    const fetchQuote = async () => {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      setQuote(null);
      try {
        const response = await apiClient.post<any>('/booking/quotes', {
          listingId,
          checkInDateLocalized: checkIn,
          checkOutDateLocalized: checkOut,
          guestsCount: adults + children + infants, // Total humans
          numberOfGuests: {
            numberOfAdults: adults,
            numberOfChildren: children,
            numberOfInfants: infants,
            numberOfPets: pets
          }
        });
        
        if (response.success && response.data) {
          setQuote(response.data);
        } else {
          setError('Failed to fetch quote');
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
      } finally {
        setIsLoading(false);
      }
    };

    const debounceId = setTimeout(fetchQuote, 500);
    return () => clearTimeout(debounceId);
  }, [listingId, checkIn, checkOut, adults, children, infants, pets]);

  const handleReserve = async () => {
    if (!quote) return;
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const availableRatePlans = quote.rates?.ratePlans || [];
      const ratePlanId = quote.ratePlanId || (availableRatePlans.length > 0 ? availableRatePlans[0].ratePlan?._id : '') || quote._id;
      
      const res = await apiClient.post<any>('/booking/reservations', {
        quoteId: quote._id,
        ratePlanId,
        guest: {
          firstName: 'Guest',
          lastName: 'User',
          email: 'guest@example.com' // Mocking for now, normally you'd open a modal to collect this
        }
      });
      if (res.success) {
        setSuccess('Your booking request has been submitted. We\'ll confirm your stay shortly.');
      } else {
        setError('Failed to request reservation');
      }
    } catch (err: any) {
      const msg = err.message || 'Failed to request reservation';
      setError(msg);
      if (msg.toLowerCase().includes('no longer valid')) {
        setQuote(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xl shadow-gray-200/50 sticky top-32 z-10">
      <PriceSummary 
        isLoading={isLoading} 
        quote={quote} 
      />
      
      {error && (
        <div className="text-red-500 text-sm mb-4 px-2 py-1 bg-red-50 rounded border border-red-100">
          {error}
        </div>
      )}

      {success && (
        <div className="text-green-600 text-sm mb-4 px-2 py-1 bg-green-50 rounded border border-green-100">
          {success}
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
          onClick={handleReserve}
          isLoading={isLoading}
          label={!checkIn || !checkOut ? 'Select dates' : isLoading ? (quote ? 'Submitting request...' : 'Checking...') : quote ? (success ? 'Request submitted' : 'Reserve') : 'Unavailable'}
        />
      </BookingActions>
    </div>
  );
}
