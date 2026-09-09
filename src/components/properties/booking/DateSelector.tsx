import React from 'react';
import { DateRangePicker } from '../../shared/DateRangePicker';
import { format, parseISO } from 'date-fns';

interface DateSelectorProps {
  checkIn: string | null;
  checkOut: string | null;
  onChangeCheckIn: (date: string | null) => void;
  onChangeCheckOut: (date: string | null) => void;
}

export function DateSelector({
  checkIn,
  checkOut,
  onChangeCheckIn,
  onChangeCheckOut,
}: DateSelectorProps) {
  const customTrigger = (
    <div className="flex gap-4 cursor-pointer">
      <div className="flex-1 pb-2 border-b border-[#1B1A17]/20 hover:border-[#1B1A17]/40 transition-colors">
        <div className="text-[10px] uppercase tracking-[0.12em] text-[#7D7975] mb-1">Check in</div>
        <div className="text-[14px] text-[#1B1A17] min-h-[20px]">
          {checkIn ? format(parseISO(checkIn), 'd MMM') : 'Add date'}
        </div>
      </div>
      <div className="flex-1 pb-2 border-b border-[#1B1A17]/20 hover:border-[#1B1A17]/40 transition-colors">
        <div className="text-[10px] uppercase tracking-[0.12em] text-[#7D7975] mb-1">Check out</div>
        <div className="text-[14px] text-[#1B1A17] min-h-[20px]">
          {checkOut ? format(parseISO(checkOut), 'd MMM') : 'Add date'}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full relative mb-4">
      <DateRangePicker
        checkIn={checkIn || ''}
        checkOut={checkOut || ''}
        onChange={(inDate, outDate) => {
          onChangeCheckIn(inDate || null);
          onChangeCheckOut(outDate || null);
        }}
        className="w-full"
        customTrigger={customTrigger}
        popoverAlign="right"
      />
    </div>
  );
}
