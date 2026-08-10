import React, { useRef } from 'react';
import { getNextDayStr, getTodayStr } from '@/lib/utils/dates';

interface DateSelectorProps {
  checkIn: string | null;
  checkOut: string | null;
  onChangeCheckIn: (date: string | null) => void;
  onChangeCheckOut: (date: string | null) => void;
}

export function DateSelector({ checkIn, checkOut, onChangeCheckIn, onChangeCheckOut }: DateSelectorProps) {
  const checkOutRef = useRef<HTMLInputElement>(null);

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckIn = e.target.value;
    onChangeCheckIn(newCheckIn);
    
    if (newCheckIn) {
      if (!checkOut) {
        // Automatically focus checkout if empty
        if (checkOutRef.current) {
          checkOutRef.current.focus();
          try {
            checkOutRef.current.showPicker?.();
          } catch (err) {
            // ignore if showPicker is unsupported
          }
        }
      } else {
        // Clear checkout if invalid and open picker
        if (checkOut <= newCheckIn) {
          onChangeCheckOut('');
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

  return (
    <div className="flex border border-gray-300 rounded-t-md overflow-hidden divide-x divide-gray-300">
      <div className="flex-1 p-3 hover:bg-gray-50 transition-colors relative">
        <div className="text-[10px] uppercase font-bold text-gray-900 tracking-wider">Check-in</div>
        <input 
          type="date" 
          min={getTodayStr()}
          value={checkIn || ''}
          onChange={handleCheckInChange}
          className="text-sm text-gray-900 mt-0.5 bg-transparent border-none p-0 outline-none w-full cursor-pointer"
        />
      </div>
      <div className="flex-1 p-3 hover:bg-gray-50 transition-colors relative">
        <div className="text-[10px] uppercase font-bold text-gray-900 tracking-wider">Check-out</div>
        <input 
          ref={checkOutRef}
          type="date" 
          min={minCheckOut}
          value={checkOut || ''}
          onChange={(e) => onChangeCheckOut(e.target.value)}
          className="text-sm text-gray-900 mt-0.5 bg-transparent border-none p-0 outline-none w-full cursor-pointer"
        />
      </div>
    </div>
  );
}
