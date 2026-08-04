import React from 'react';
import { PriceSummary } from './PriceSummary';
import { DateSelector } from './DateSelector';
import { GuestSelector } from './GuestSelector';
import { BookingActions } from './BookingActions';
import { ReserveButton } from './ReserveButton';

export function BookingCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xl shadow-gray-200/50 sticky top-32 z-10">
      <PriceSummary />
      
      <div className="w-full">
        <DateSelector />
        <GuestSelector />
      </div>
      
      <BookingActions>
        <ReserveButton />
      </BookingActions>
    </div>
  );
}
