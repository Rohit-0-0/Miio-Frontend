import React, { useState, useEffect, useRef } from 'react';

interface PriceSummaryProps {
  isLoading?: boolean;
  quote?: any;
}

export function PriceSummary({ isLoading, quote }: PriceSummaryProps) {
  const [showDetails, setShowDetails] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!showDetails) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowDetails(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setShowDetails(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDetails]);
  
  // Base display on the first available rate plan if present
  const ratePlanItem = quote?.rates?.ratePlans?.[0];
  const money = ratePlanItem?.ratePlan?.money;
  const currency = money?.currency || quote?.currency || '$';
  
  let priceDisplay = 'POA';
  let nightlyRate = 0;
  
  if (ratePlanItem) {
    const days = ratePlanItem.days || [];
    if (days.length > 0) {
      // Use the first day's rate as the display nightly rate
      nightlyRate = days[0].price || days[0].basePrice || 0;
      if (typeof nightlyRate === 'number') {
        priceDisplay = `${currency}${nightlyRate.toFixed(0)}`;
      }
    }
  }

  return (
    <div className="mb-6 relative" ref={popupRef}>
      <div className="flex justify-between items-end">
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-serif font-bold text-gray-900">
            {isLoading ? <span className="animate-pulse bg-gray-200 h-8 w-16 inline-block rounded"></span> : priceDisplay}
          </span>
          <span className="text-sm text-gray-500">/ night</span>
        </div>
        <div 
          className="text-sm text-gray-500 underline cursor-pointer hover:text-gray-900 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setShowDetails(!showDetails);
          }}
        >
          Price details
        </div>
      </div>

      {showDetails && (
        <div className="absolute top-full right-0 sm:right-0 -left-4 sm:left-auto mt-2 bg-white border border-gray-200 rounded-lg shadow-2xl p-4 z-[100] w-[calc(100vw-3rem)] sm:w-72 max-w-[20rem] text-sm">
          {ratePlanItem && money ? (
            <>
              <h4 className="font-semibold text-gray-900 mb-3 border-b pb-2">Price Breakdown</h4>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Accommodation ({ratePlanItem.days?.length || 1} nights)</span>
                  <span>{money.fareAccommodation !== undefined ? `${currency}${money.fareAccommodation}` : '—'}</span>
                </div>
                {money.fareCleaning !== undefined && (
                  <div className="flex justify-between">
                    <span>Cleaning fee</span>
                    <span>{currency}{money.fareCleaning}</span>
                  </div>
                )}
                {money.totalTaxes !== undefined && (
                  <div className="flex justify-between">
                    <span>Taxes</span>
                    <span>{currency}{money.totalTaxes}</span>
                  </div>
                )}
                {money.totalFees !== undefined && (
                  <div className="flex justify-between">
                    <span>Fees</span>
                    <span>{currency}{money.totalFees}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-gray-900 pt-2 border-t mt-2">
                  <span>Total</span>
                  <span>{money.subTotalPrice !== undefined ? `${currency}${money.subTotalPrice}` : '—'}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-gray-500 py-2">
              Please select valid check-in and check-out dates to view a full price breakdown.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
