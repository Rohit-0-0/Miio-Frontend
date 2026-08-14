import React from 'react';
import { DateRangePicker } from '../../shared/DateRangePicker';
import { format, parseISO } from 'date-fns';

interface DateSelectorProps {
  checkIn: string | null;
  checkOut: string | null;
  onChangeCheckIn: (date: string | null) => void;
  onChangeCheckOut: (date: string | null) => void;
}

export function DateSelector({ checkIn, checkOut, onChangeCheckIn, onChangeCheckOut }: DateSelectorProps) {
  
  const customTrigger = (
    <div className="flex border border-gray-300 rounded-t-md overflow-hidden divide-x divide-gray-300 cursor-pointer">
      <div className="flex-1 p-3 hover:bg-gray-50 transition-colors relative">
        <div className="text-[10px] uppercase font-bold text-gray-900 tracking-wider">Check-in</div>
        <div className="text-sm text-gray-900 mt-0.5 min-h-[20px]">
          {checkIn ? format(parseISO(checkIn), 'MM/dd/yyyy') : 'Add date'}
        </div>
      </div>
      <div className="flex-1 p-3 hover:bg-gray-50 transition-colors relative">
        <div className="text-[10px] uppercase font-bold text-gray-900 tracking-wider">Check-out</div>
        <div className="text-sm text-gray-900 mt-0.5 min-h-[20px]">
          {checkOut ? format(parseISO(checkOut), 'MM/dd/yyyy') : 'Add date'}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full relative">
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
