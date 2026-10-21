import React, { useState, useRef, useEffect } from 'react';

interface GuestSelectorProps {
  adults: number;
  children: number;
  infants: number;
  pets: number;
  onChangeAdults: (val: number) => void;
  onChangeChildren: (val: number) => void;
  onChangeInfants: (val: number) => void;
  onChangePets: (val: number) => void;
  className?: string;
  triggerClassName?: string;
  customTrigger?: React.ReactNode;
  dropdownAlign?: 'left' | 'right' | 'center';
}

export function GuestSelector({ 
  adults, children, infants, pets, 
  onChangeAdults, onChangeChildren, onChangeInfants, onChangePets,
  className = "relative",
  triggerClassName = "border border-gray-300 border-t-0 rounded-b-md p-3 cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-center",
  customTrigger,
  dropdownAlign
}: GuestSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const totalGuests = adults + children; // standard way to display total
  const displayString = `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` + 
                        (infants > 0 ? `, ${infants} infant${infants > 1 ? 's' : ''}` : '') + 
                        (pets > 0 ? `, ${pets} pet${pets > 1 ? 's' : ''}` : '');

  const [dropdownPositionStyle, setDropdownPositionStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const updatePosition = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const viewportWidth = window.innerWidth;
      const dropdownWidth = Math.min(290, viewportWidth - 32);

      // On desktop/tablet, stick to normal behavior unless requested
      if (viewportWidth >= 640) {
        setDropdownPositionStyle({});
        return;
      }

      // On mobile, ensure the dropdown stays fully within the screen margins [16px, viewportWidth - 16px]
      // Desired left relative to container:
      let desiredLeft = 0;
      if (dropdownAlign === 'right') {
        desiredLeft = rect.width - dropdownWidth;
      }

      const absoluteLeft = rect.left + desiredLeft;
      const absoluteRight = absoluteLeft + dropdownWidth;

      if (absoluteLeft < 16) {
        const offset = 16 - rect.left;
        setDropdownPositionStyle({ left: `${offset}px`, right: 'auto', width: `${dropdownWidth}px` });
      } else if (absoluteRight > viewportWidth - 16) {
        const offset = (viewportWidth - 16) - (rect.left + dropdownWidth);
        setDropdownPositionStyle({ left: `${offset}px`, right: 'auto', width: `${dropdownWidth}px` });
      } else {
        setDropdownPositionStyle(dropdownAlign === 'right' ? { right: 0, left: 'auto', width: `${dropdownWidth}px` } : { left: 0, right: 'auto', width: `${dropdownWidth}px` });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [isOpen, dropdownAlign]);

  return (
    <div className={className} ref={containerRef}>
      <div 
        className={customTrigger ? "" : triggerClassName}
        onClick={() => setIsOpen(!isOpen)}
      >
        {customTrigger ? customTrigger : (
          <>
            <div>
              <div className="text-[10px] uppercase font-normal text-gray-900 tracking-wider">Guests</div>
              <div className="text-sm text-gray-900 mt-0.5 truncate max-w-[200px]">{displayString}</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </>
        )}
      </div>

      {isOpen && (
        <div
          style={dropdownPositionStyle}
          className={`absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-2xl p-4 z-[100] space-y-4 min-w-[270px] sm:min-w-[280px] sm:max-w-none ${
            Object.keys(dropdownPositionStyle).length > 0
              ? ''
              : dropdownAlign === 'right'
              ? 'right-0 sm:right-auto sm:left-0'
              : dropdownAlign === 'left'
              ? 'left-0'
              : 'left-0 sm:left-auto sm:-right-4 md:left-0'
          }`}
        >
          <GuestRow label="Adults" description="Age 13+" value={adults} onChange={onChangeAdults} min={1} />
          <GuestRow label="Children" description="Ages 2-12" value={children} onChange={onChangeChildren} min={0} />
          <GuestRow label="Infants" description="Under 2" value={infants} onChange={onChangeInfants} min={0} />
          <GuestRow label="Pets" description="Bringing a service animal?" value={pets} onChange={onChangePets} min={0} />
        </div>
      )}
    </div>
  );
}

function GuestRow({ label, description, value, onChange, min }: { label: string, description: string, value: number, onChange: (val: number) => void, min: number }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm font-semibold text-gray-900">{label}</div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
      <div className="flex items-center space-x-3">
        <button 
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-900 hover:text-gray-900 disabled:opacity-30 disabled:hover:border-gray-300 disabled:hover:text-gray-500 transition-colors"
        >
          -
        </button>
        <span className="text-sm font-medium w-4 text-center">{value}</span>
        <button 
          onClick={() => onChange(value + 1)}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}
