'use client';

import React, { useState, useEffect, useRef } from 'react';
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

function PaymentTrustRow() {
  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[9px] tracking-[0.08em] uppercase text-[#7D7975]">
      <span className="font-medium">Secure checkout</span>
      <span className="opacity-40">·</span>
      <span>Apple Pay</span>
      <span>Amex</span>
      <span>Mastercard</span>
      <span>Visa</span>
    </div>
  );
}

export function BookingCard({ listingId }: BookingCardProps) {
  const searchParams = useSearchParams();
  const cardRef = useRef<HTMLDivElement>(null);

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
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const fetchQuote = async () => {
    if (!checkIn || !checkOut || !listingId || adults < 1) return null;

    setIsLoading(true);
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
          numberOfPets: pets,
        },
      });

      if (response.success && response.data) {
        setQuote(response.data);
        return response.data;
      }
      toast.error(
        "We couldn't confirm availability for these dates. Please try adjusting your selection."
      );
      return null;
    } catch (err: any) {
      let msg = 'Oops! Something went wrong while checking dates. Please try again.';
      const backendMsg = err.response?.data?.message;
      const errMsg = (err.message || '').toLowerCase();
      const status = err.response?.status || err.statusCode;

      if (backendMsg) msg = backendMsg;
      else if (
        status === 404 ||
        errMsg.includes('not available') ||
        errMsg.includes('unavailable') ||
        errMsg.includes('no quotes') ||
        errMsg.includes('minimum stay')
      ) {
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

  useEffect(() => {
    if (debounceIdRef.current) clearTimeout(debounceIdRef.current);
    debounceIdRef.current = setTimeout(fetchQuote, 500);
    return () => {
      if (debounceIdRef.current) clearTimeout(debounceIdRef.current);
    };
  }, [listingId, checkIn, checkOut, adults, children, infants, pets]);

  const handleBookNowClick = () => {
    if (!quote) {
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setIsCheckoutOpen(true);
  };

  const guestLabel =
    `${adults} adult${adults === 1 ? '' : 's'}` +
    (children > 0 ? `, ${children} child${children === 1 ? '' : 'ren'}` : '') +
    (infants > 0 ? `, ${infants} infant${infants === 1 ? '' : 's'}` : '');

  const reserveLabel =
    !checkIn || !checkOut
      ? 'Select dates'
      : isLoading
        ? 'Checking...'
        : quote
          ? 'Book now'
          : 'Check availability';

  return (
    <>
      {/* Same inline booking card on all screen sizes */}
      <div
        ref={cardRef}
        id="property-booking-card"
        className="bg-white rounded-xl p-5 lg:p-6 border border-[#1B1A17]/10 shadow-[0_4px_16px_rgba(0,0,0,0.06)] w-full lg:max-w-[345px]"
      >
        <PriceSummary isLoading={isLoading} quote={quote} />

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
          customTrigger={
            <div className="pb-2 border-b border-[#1B1A17]/20 hover:border-[#1B1A17]/40 transition-colors cursor-pointer mb-5">
              <div className="text-[10px] uppercase tracking-[0.12em] text-[#7D7975] mb-1">Guests</div>
              <div className="text-[14px] text-[#1B1A17]">{guestLabel}</div>
            </div>
          }
        />

        <BookingActions>
          <ReserveButton
            disabled={isLoading || (!!checkIn && !!checkOut && !quote)}
            onClick={handleBookNowClick}
            isLoading={isLoading}
            label={reserveLabel}
          />
        </BookingActions>
        <PaymentTrustRow />
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