'use client';

import React, { useState, useRef, useEffect } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, parseISO, isBefore, startOfToday, differenceInCalendarDays } from 'date-fns';
import 'react-day-picker/style.css';

interface DateRangePickerProps {
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  onChange: (checkIn: string, checkOut: string) => void;
  className?: string;
  triggerClassName?: string;
  customTrigger?: React.ReactNode;
  popoverAlign?: 'left' | 'right';
  inline?: boolean;
  guestyId?: string;
  blockUnavailableDates?: boolean;
}

export function DateRangePicker({
  checkIn,
  checkOut,
  onChange,
  className = "relative",
  triggerClassName = "px-6 py-4 flex flex-col justify-center relative group cursor-pointer hover:bg-gray-50 transition-colors",
  customTrigger,
  popoverAlign = 'left',
  inline = false,
  guestyId,
  blockUnavailableDates = false
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [calendarDays, setCalendarDays] = useState<any[]>([]);

  // Convert string YYYY-MM-DD to Date objects for DayPicker
  const selectedRange: DateRange | undefined = React.useMemo(() => {
    if (!checkIn) return undefined;
    const from = parseISO(checkIn);
    const to = checkOut ? parseISO(checkOut) : undefined;
    return { from, to };
  }, [checkIn, checkOut]);

  useEffect(() => {
    if (!guestyId || !blockUnavailableDates) return;

    const fetchCalendar = async () => {
      try {
        const today = new Date();
        const startDate = format(today, 'yyyy-MM-dd');
        // Fetch up to 1 year ahead
        const end = new Date(today);
        end.setFullYear(end.getFullYear() + 1);
        const endDate = format(end, 'yyyy-MM-dd');

        // Need to import apiClient if not already imported
        const { apiClient } = await import('@/lib/api/client');
        const res = await apiClient.get<any>(`/booking/calendar/${guestyId}?startDate=${startDate}&endDate=${endDate}`);
        
        if (res.success && res.data) {
          // Find the array of days. Depending on Guesty's API response structure:
          // it might be res.data.data, res.data.days, etc.
          let days = res.data.data || res.data.days || res.data;
          if (!Array.isArray(days)) {
            // It might be nested if data is an object with a days property
            if (res.data.data && Array.isArray(res.data.data.days)) {
              days = res.data.data.days;
            } else if (res.data.data && Array.isArray(res.data.data.data)) {
              days = res.data.data.data;
            }
          }

          if (Array.isArray(days)) {
            setCalendarDays(days);
            
            const disabled: Date[] = [];
            days.forEach((day: any) => {
              if (day.status !== 'available') {
                try {
                  const d = parseISO(day.date);
                  // Ensure we add valid dates
                  if (!isNaN(d.getTime())) {
                    disabled.push(d);
                  }
                } catch(e) {}
              }
            });
            setBlockedDates(disabled);
          }
        }
      } catch (err) {
        console.error('Failed to fetch calendar for DateRangePicker', err);
      }
    };
    
    fetchCalendar();
  }, [guestyId]);

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

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Check on initial mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const displayString = checkIn 
    ? `${format(parseISO(checkIn), 'MMM dd')}${checkOut ? ` - ${format(parseISO(checkOut), 'MMM dd')}` : ' - Add Date'}` 
    : 'Add Dates';

  const disabledDates = React.useCallback((date: Date) => {
    // Disable past dates
    if (isBefore(date, startOfToday())) return true;
    
    if (!blockUnavailableDates) return false;

    // Disable dates explicitly blocked from Guesty
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayInfo = calendarDays.find(d => d.date === dateStr);
    
    if (dayInfo && dayInfo.status !== 'available') {
      return true;
    }
    
    return false;
  }, [calendarDays, selectedRange]);

  if (inline) {
    return (
      <div className={`${className} flex justify-center pb-4`}>
        <div style={{ '--rdp-cell-size': inline ? '32px' : '40px' } as React.CSSProperties}>
          <DayPicker
            mode="range"
            selected={selectedRange}
            onSelect={handleSelect}
            numberOfMonths={isMobile ? 1 : 2}
            pagedNavigation
            disabled={disabledDates}
            showOutsideDays={false}
          />
        </div>
      </div>
    );
  }

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
          <div style={{ '--rdp-cell-size': '40px' } as React.CSSProperties}>
            <DayPicker
              mode="range"
              selected={selectedRange}
              onSelect={handleSelect}
              numberOfMonths={isMobile ? 1 : 2}
              pagedNavigation
              disabled={disabledDates}
              showOutsideDays={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}
