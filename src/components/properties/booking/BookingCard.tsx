'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PriceSummary } from './PriceSummary';
import { DateSelector } from './DateSelector';
import { GuestSelector } from './GuestSelector';
import { BookingActions } from './BookingActions';
import { ReserveButton } from './ReserveButton';
import { CheckoutModal } from './CheckoutModal';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';

import { buildImageUrl } from '@/lib/media/buildImageUrl';

interface BookingCardProps {
  listingId: string;
  paymentTrustImages?: any[];
  hideMobileSticky?: boolean;
  isCheckout?: boolean;
  hideSubmit?: boolean;
}

import { PaymentLogos } from '@/components/layout/PaymentLogos';

export function BookingCard({ listingId, paymentTrustImages, hideMobileSticky = false, isCheckout = false, hideSubmit = false }: BookingCardProps) {
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

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const router = useRouter();

  const handleBookNowClick = () => {
    if (!checkIn || !checkOut) {
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const params = new URLSearchParams({
      propertyId: listingId,
      checkIn: checkIn,
      checkOut: checkOut,
      adults: adults.toString(),
      children: children.toString(),
      infants: infants.toString(),
      pets: pets.toString(),
    });
    router.push(`/checkout?${params.toString()}`);
  };

  const guestLabel =
    `${adults} adult${adults === 1 ? '' : 's'}` +
    (children > 0 ? `, ${children} child${children === 1 ? '' : 'ren'}` : '') +
    (infants > 0 ? `, ${infants} infant${infants === 1 ? '' : 's'}` : '');

  const reserveLabel = !checkIn || !checkOut ? 'Select dates' : 'Book now';

  const datesLabel = checkIn && checkOut ? `${checkIn} – ${checkOut}` : 'Select dates';

  return (
    <>
      {/* Same inline booking card on all screen sizes */}
      <div
        ref={cardRef}
        id="property-booking-card"
        className="bg-white rounded-xl p-5 lg:p-6 border border-[#1B1A17]/10 shadow-[0_4px_16px_rgba(0,0,0,0.06)] w-full lg:max-w-[345px]"
      >
        <PriceSummary isLoading={false} quote={null} />

        <DateSelector
          checkIn={checkIn}
          checkOut={checkOut}
          onChangeCheckIn={setCheckIn}
          onChangeCheckOut={setCheckOut}
          guestyId={listingId}
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

        {!hideSubmit && (
          <BookingActions>
            <ReserveButton
              disabled={!checkIn || !checkOut}
              onClick={handleBookNowClick}
              isLoading={false}
              label={reserveLabel}
            />
          </BookingActions>
        )}
        <PaymentLogos images={paymentTrustImages} />
      </div>

      {/* Mobile Sticky Checkout Bar */}
      {!hideMobileSticky && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] bg-[#FEF6EE] sm:bg-white border-t border-[#1B1A17]/10 px-5 py-3.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-md lg:hidden flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-[17px] font-semibold text-[#1B1A17]">
                Check dates for prices
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="text-[12px] text-[#7D7975] underline font-medium text-left hover:text-[#1B1A17] transition-colors"
            >
              {datesLabel}
            </button>
          </div>

          <button
            type="button"
            onClick={handleBookNowClick}
            disabled={!checkIn || !checkOut}
            className={`font-semibold py-2.5 px-6 rounded-full text-xs uppercase tracking-wider transition-all flex items-center justify-center ${
              !checkIn || !checkOut
                ? 'bg-[#C3BA8D]/60 text-black/60 cursor-not-allowed'
                : 'bg-[#C3BA8D] text-black hover:opacity-90 active:scale-95 shadow-md shadow-black/10'
            }`}
          >
            {reserveLabel}
          </button>
        </div>
      )}
    </>
  );
}