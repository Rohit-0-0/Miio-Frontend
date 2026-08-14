'use client';

import React, { useState, useRef, useEffect } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, parseISO, isBefore, startOfToday } from 'date-fns';
import 'react-day-picker/dist/style.css';

interface DateRangePickerProps {
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  onChange: (checkIn: string, checkOut: string) => void;
  className?: string;
  triggerClassName?: string;
  customTrigger?: React.ReactNode;
  popoverAlign?: 'left' | 'right';
}

export function DateRangePicker({
  checkIn,
  checkOut,
  onChange,
  className = "relative",
  triggerClassName = "px-6 py-4 flex flex-col justify-center relative group cursor-pointer hover:bg-gray-50 transition-colors",
  customTrigger,
  popoverAlign = 'left'
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Convert string YYYY-MM-DD to Date objects for DayPicker
  const selectedRange: DateRange | undefined = React.useMemo(() => {
    if (!checkIn) return undefined;
    const from = parseISO(checkIn);
    const to = checkOut ? parseISO(checkOut) : undefined;
    return { from, to };
  }, [checkIn, checkOut]);

  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (range: DateRange | undefined, selectedDay: Date) => {
    // If user already had a full range selected, and they click a new day,
    // we want to START a new range from that day, rather than expanding the old range.
    if (checkIn && checkOut) {
      onChange(format(selectedDay, 'yyyy-MM-dd'), '');
      return;
    }

    if (!range) {
      onChange('', '');
      return;
    }
    const { from, to } = range;
    
    // If from and to are the same date, we haven't selected a checkout date yet.
    // In property bookings, checkout must be at least the day after checkin.
    const isSameDate = from && to && from.getTime() === to.getTime();
    
    const fromStr = from ? format(from, 'yyyy-MM-dd') : '';
    const toStr = (to && !isSameDate) ? format(to, 'yyyy-MM-dd') : '';
    
    onChange(fromStr, toStr);

    // Allow manual closing only (via click outside)
  };

  const displayString = checkIn 
    ? `${format(parseISO(checkIn), 'MMM dd')}${checkOut ? ` - ${format(parseISO(checkOut), 'MMM dd')}` : ' - Add Date'}` 
    : 'Add Dates';

  return (
    <div className={className} ref={containerRef}>
      <div 
        className={customTrigger ? "" : triggerClassName}
        onClick={() => setIsOpen(!isOpen)}
      >
        {customTrigger ? customTrigger : (
          <div className="flex flex-col w-full">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Check-in / Check-out</span>
            <div className="text-sm font-medium text-gray-900 truncate">
              {displayString}
            </div>
          </div>
        )}
      </div>

      {isOpen && (
        <div className={`absolute top-full ${popoverAlign === 'right' ? 'right-0' : 'left-0'} mt-2 bg-white border border-gray-200 rounded-lg shadow-2xl p-4 z-[100] md:w-max`}>
          <style>{`
            .rdp {
              --rdp-cell-size: 40px;
              --rdp-accent-color: #000000;
              --rdp-background-color: #f3f4f6;
              --rdp-accent-color-dark: #333333;
              --rdp-background-color-dark: #e5e7eb;
              --rdp-outline: 2px solid var(--rdp-accent-color);
              --rdp-outline-selected: 2px solid rgba(0, 0, 0, 0.3);
              margin: 0;
            }
            .rdp-months {
              display: flex;
              flex-direction: column;
              gap: 1.5rem;
            }
            @media (min-width: 768px) {
              .rdp-months {
                flex-direction: row;
              }
            }
            .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
              background-color: var(--rdp-accent-color);
              color: white;
            }
            .rdp-day_selected.rdp-day_range_middle {
              background-color: var(--rdp-background-color);
              color: var(--rdp-accent-color);
            }
            .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
              background-color: var(--rdp-background-color);
            }
          `}</style>
          <DayPicker
            mode="range"
            selected={selectedRange}
            onSelect={handleSelect}
            numberOfMonths={2}
            pagedNavigation
            disabled={{ before: startOfToday() }}
            showOutsideDays={false}
          />
        </div>
      )}
    </div>
  );
}
