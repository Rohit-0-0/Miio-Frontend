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

  const ratePlanItem = quote?.rates?.ratePlans?.[0];
  const money = ratePlanItem?.ratePlan?.money;
  const currency = money?.currency || quote?.currency || '$';

  let priceDisplay = '—';

  if (ratePlanItem) {
    const days = ratePlanItem.days || [];
    if (days.length > 0) {
      const nightlyRate = days[0].price || days[0].basePrice || 0;
      if (typeof nightlyRate === 'number') {
        priceDisplay = `${currency}${nightlyRate.toFixed(0)}`;
      }
    }
  }

  return (
    <div className="mb-6 relative" ref={popupRef}>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[18px] font-medium text-[#1B1A17]">
          {isLoading ? (
            <span className="animate-pulse bg-[#EAE8E1] h-6 w-24 inline-block rounded" />
          ) : (
            <>From {priceDisplay}</>
          )}
        </span>
        <span className="text-[14px] text-[#7D7975]">/ night</span>
        {quote && (
          <button
            type="button"
            className="ml-auto text-[12px] text-[#7D7975] underline hover:text-[#1B1A17] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(!showDetails);
            }}
          >
            Details
          </button>
        )}
      </div>

      {showDetails && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-[#1B1A17]/10 rounded-xl shadow-xl p-4 z-[100] w-72 max-w-[20rem] text-sm">
          {ratePlanItem && money ? (
            <>
              <h4 className="font-semibold text-[#1B1A17] mb-3 border-b border-[#1B1A17]/10 pb-2">
                Price breakdown
              </h4>
              <div className="space-y-2 text-[#7D7975]">
                <div className="flex justify-between">
                  <span>Accommodation ({ratePlanItem.days?.length || 1} nights)</span>
                  <span>
                    {money.fareAccommodation !== undefined
                      ? `${currency}${money.fareAccommodation}`
                      : '—'}
                  </span>
                </div>
                {money.fareCleaning !== undefined && (
                  <div className="flex justify-between">
                    <span>Cleaning fee</span>
                    <span>
                      {currency}
                      {money.fareCleaning}
                    </span>
                  </div>
                )}
                {money.totalTaxes !== undefined && (
                  <div className="flex justify-between">
                    <span>Taxes</span>
                    <span>
                      {currency}
                      {money.totalTaxes}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-medium text-[#1B1A17] pt-2 border-t border-[#1B1A17]/10 mt-2">
                  <span>Total</span>
                  <span>
                    {money.subTotalPrice !== undefined ? `${currency}${money.subTotalPrice}` : '—'}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-[#7D7975] py-2">
              Select check-in and check-out dates to view a full price breakdown.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
