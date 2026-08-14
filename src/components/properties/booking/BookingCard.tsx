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
import { toast } from 'sonner';

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
        toast.error('We couldn\'t confirm availability for these dates. Please try adjusting your selection.');
        return null;
      }
    } catch (err: any) {
      console.error(err);
      
      let msg = 'Oops! Something went wrong while checking dates. Please try again.';
      const backendMsg = err.response?.data?.message;
      const errMsg = (err.message || '').toLowerCase();
      const status = err.response?.status || err.statusCode;
      
      if (backendMsg) {
        // Use the clean message sent by our backend
        msg = backendMsg;
      } else if (status === 404 || errMsg.includes('not available') || errMsg.includes('unavailable') || errMsg.includes('no quotes') || errMsg.includes('minimum stay')) {
        msg = 'Sorry, these dates are unavailable or do not meet the minimum stay requirements.';
      } else if (status === 400 || errMsg.includes('invalid') || errMsg.includes('date')) {
        msg = 'Please select valid check-in and check-out dates to check availability.';
      }
      
      toast.error(msg);
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

  // Mobile expanded state
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  return (
    <>
      <div className={`bg-white border-t lg:border border-gray-200 lg:rounded-xl p-4 lg:p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] lg:shadow-xl lg:shadow-gray-200/50 fixed lg:sticky bottom-0 lg:bottom-auto lg:top-32 left-0 right-0 z-40 lg:z-10 w-full transition-all duration-300 ${isMobileExpanded ? 'max-h-[90vh] rounded-t-2xl overflow-y-auto' : 'max-h-[85vh] overflow-visible'} lg:max-h-none lg:overflow-visible flex flex-col`}>
        
        {/* Mobile Drag Handle */}
        {isMobileExpanded && (
          <div className="lg:hidden flex justify-center pb-4 pt-1" onClick={() => setIsMobileExpanded(false)}>
            <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
          </div>
        )}

        <div className="flex justify-between items-center lg:block">
          <div className="flex-1" onClick={() => setIsMobileExpanded(true)}>
            <PriceSummary 
              isLoading={isLoading} 
              quote={quote} 
            />
          </div>
          
          {/* Mobile "Edit" button for price summary if collapsed */}
          {!isMobileExpanded && (
            <button 
              className="lg:hidden text-sm font-bold underline ml-4"
              onClick={() => setIsMobileExpanded(true)}
            >
              Edit
            </button>
          )}
        </div>
        
        <div className={`w-full mt-4 lg:mt-0 space-y-4 lg:space-y-0 ${isMobileExpanded ? 'block' : 'hidden lg:block'}`}>
          <div className="pt-2">
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
          
          {isMobileExpanded && (
            <button 
              onClick={() => setIsMobileExpanded(false)}
              className="lg:hidden w-full py-3 border border-black text-black font-bold rounded-lg mb-2"
            >
              Done Editing
            </button>
          )}
        </div>
        
        <div className="mt-4">
          <BookingActions>
            <ReserveButton 
              disabled={!quote || isLoading} 
              onClick={() => {
                if (!quote && !isMobileExpanded) {
                  setIsMobileExpanded(true);
                } else {
                  handleBookNowClick();
                }
              }}
              isLoading={isLoading}
              label={!checkIn || !checkOut ? 'Select dates' : isLoading ? 'Checking...' : quote ? 'Book Now' : 'Check Availability'}
            />
          </BookingActions>
        </div>
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
