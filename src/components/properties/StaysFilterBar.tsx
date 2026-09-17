'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { GuestSelector } from '@/components/properties/booking/GuestSelector';
import { ChevronDown } from 'lucide-react';

const LOCATIONS = ['Bondi', 'Vaucluse', 'Paddington'];

function FilterPill({
  label,
  active,
  open,
}: {
  label: string;
  active?: boolean;
  open?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border bg-[#FEF6EE] px-3.5 py-2 text-[13px] transition-colors cursor-pointer select-none ${
        active
          ? 'border-[#1B1A17] text-[#1B1A17]'
          : 'border-[#1B1A17]/25 text-[#1B1A17] hover:border-[#1B1A17]/45'
      }`}
    >
      <span>{label}</span>
      <ChevronDown
        className={`h-3.5 w-3.5 opacity-60 transition-transform ${open ? 'rotate-180' : ''}`}
        strokeWidth={1.5}
      />
    </span>
  );
}

interface StaysFilterBarProps {
  resultLabel?: string;
}

export function StaysFilterBar({ resultLabel }: StaysFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const filterRef = useRef<HTMLDivElement>(null);

  const [openDropdown, setOpenDropdown] = useState<'location' | 'price' | null>(null);

  const [location, setLocation] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    if (!searchParams) return;
    setLocation(searchParams.get('city') || '');
    setAdults(parseInt(searchParams.get('adults') || '1', 10));
    setChildren(parseInt(searchParams.get('children') || '0', 10));
    setInfants(parseInt(searchParams.get('infants') || '0', 10));
    setPets(parseInt(searchParams.get('pets') || '0', 10));
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const applyParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams?.toString() || '');
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') params.delete(key);
      else params.set(key, value);
    });
    startTransition(() => {
      router.push(`/properties?${params.toString()}`);
    });
  };

  const syncGuests = (
    nextAdults: number,
    nextChildren: number,
    nextInfants: number,
    nextPets: number
  ) => {
    applyParams({
      adults: nextAdults.toString(),
      children: nextChildren > 0 ? nextChildren.toString() : null,
      infants: nextInfants > 0 ? nextInfants.toString() : null,
      pets: nextPets > 0 ? nextPets.toString() : null,
    });
  };

  const guestCount = adults + children;
  const guestsActive = adults > 1 || children > 0 || infants > 0 || pets > 0;
  const guestLabel = guestsActive
    ? `${guestCount} guest${guestCount === 1 ? '' : 's'}`
    : 'Guests';

  const priceActive = Boolean(minPrice || maxPrice);
  const priceLabel =
    minPrice && maxPrice
      ? `$${minPrice}–$${maxPrice}`
      : minPrice
        ? `From $${minPrice}`
        : maxPrice
          ? `Up to $${maxPrice}`
          : 'Price';

  return (
    <div
      ref={filterRef}
      className={`flex flex-col items-start md:flex-row md:items-center md:justify-between gap-4 mb-8 ${
        isPending ? 'opacity-70' : ''
      }`}
    >
      <div className="flex flex-wrap items-center gap-2 w-full">
        {/* Location */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === 'location' ? null : 'location')}
            aria-expanded={openDropdown === 'location'}
          >
            <FilterPill
              label={location || 'Location'}
              active={Boolean(location)}
              open={openDropdown === 'location'}
            />
          </button>
          {openDropdown === 'location' && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-[#1B1A17]/10 rounded-2xl shadow-lg z-50 py-2">
              <button
                type="button"
                className="w-full px-4 py-2.5 text-left text-sm text-[#7D7975] hover:bg-[#FEF6EE] transition-colors"
                onClick={() => {
                  setLocation('');
                  applyParams({ city: null });
                  setOpenDropdown(null);
                }}
              >
                All locations
              </button>
              {LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  className="w-full px-4 py-2.5 text-left text-sm text-[#1B1A17] hover:bg-[#FEF6EE] transition-colors flex items-center justify-between"
                  onClick={() => {
                    setLocation(loc);
                    applyParams({ city: loc });
                    setOpenDropdown(null);
                  }}
                >
                  <span>{loc}</span>
                  {location === loc && (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path
                        d="M1 5L4.5 8.5L11 1"
                        stroke="#1B1A17"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Guests */}
        <div className="relative" onClick={() => setOpenDropdown(null)}>
          <GuestSelector
            adults={adults}
            children={children}
            infants={infants}
            pets={pets}
            onChangeAdults={(val) => {
              setAdults(val);
              syncGuests(val, children, infants, pets);
            }}
            onChangeChildren={(val) => {
              setChildren(val);
              syncGuests(adults, val, infants, pets);
            }}
            onChangeInfants={(val) => {
              setInfants(val);
              syncGuests(adults, children, val, pets);
            }}
            onChangePets={(val) => {
              setPets(val);
              syncGuests(adults, children, infants, val);
            }}
            customTrigger={<FilterPill label={guestLabel} active={guestsActive} />}
          />
        </div>

        {/* Price */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === 'price' ? null : 'price')}
            aria-expanded={openDropdown === 'price'}
          >
            <FilterPill label={priceLabel} active={priceActive} open={openDropdown === 'price'} />
          </button>
          {openDropdown === 'price' && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-[#1B1A17]/10 rounded-2xl shadow-lg z-50 p-4">
              <div className="flex gap-3 mb-4">
                <label className="flex-1">
                  <span className="block text-[11px] uppercase tracking-wider text-[#7D7975] mb-1.5">
                    Min
                  </span>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full rounded-lg border border-[#1B1A17]/15 bg-transparent px-3 py-2 text-sm text-[#1B1A17] outline-none focus:border-[#1B1A17]/40"
                  />
                </label>
                <label className="flex-1">
                  <span className="block text-[11px] uppercase tracking-wider text-[#7D7975] mb-1.5">
                    Max
                  </span>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="Any"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full rounded-lg border border-[#1B1A17]/15 bg-transparent px-3 py-2 text-sm text-[#1B1A17] outline-none focus:border-[#1B1A17]/40"
                  />
                </label>
              </div>
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  className="text-[13px] text-[#7D7975] hover:text-[#1B1A17] transition-colors"
                  onClick={() => {
                    setMinPrice('');
                    setMaxPrice('');
                    applyParams({ minPrice: null, maxPrice: null });
                    setOpenDropdown(null);
                  }}
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => {
                    applyParams({
                      minPrice: minPrice || null,
                      maxPrice: maxPrice || null,
                    });
                    setOpenDropdown(null);
                  }}
                  className="rounded-full bg-[#1B1A17] text-white px-4 py-2 text-[13px] hover:opacity-90 transition-opacity"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {resultLabel && (
        <p className="text-[13px] text-[#7D7975] whitespace-nowrap shrink-0">
          {resultLabel}
        </p>
      )}
    </div>
  );
}
