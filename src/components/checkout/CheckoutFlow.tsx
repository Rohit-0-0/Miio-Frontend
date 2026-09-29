'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import { PropertyDetails } from '@/types/property';
import { MinimalPropertyCard } from '@/components/home/MinimalPropertyCard';
import { buildImageUrl } from '@/lib/media/buildImageUrl';
import Link from 'next/link';
import { DateSelector } from '@/components/properties/booking/DateSelector';
import { GuestSelector } from '@/components/properties/booking/GuestSelector';
import { DateRangePicker } from '@/components/shared/DateRangePicker';
import { PaymentLogos } from '@/components/layout/PaymentLogos';
import { format, parseISO } from 'date-fns';

interface CheckoutFlowProps {
  property: PropertyDetails;
  searchParams: {
    checkIn?: string;
    checkOut?: string;
    adults?: string;
    children?: string;
    infants?: string;
    pets?: string;
  };
  paymentTrustImages?: any[];
  cmsContent?: {
    datesHeading?: string;
    guestsHeading?: string;
    continueButton?: string;
    totalLabel?: string;
    flexiblePaymentsText?: string;
    addCodeText?: string;
    freeCancellationText?: string;
    cleaningFeeText?: string;
    includedText?: string;
    nightsText?: string;
    flexiblePaymentLogos?: any[];
  };
}

export function CheckoutFlow({ property, searchParams, paymentTrustImages, cmsContent }: CheckoutFlowProps) {
  const router = useRouter();
  
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [quote, setQuote] = useState<any>(null);
  const [alternatives, setAlternatives] = useState<any[]>([]);
  
  // Date states for the calendar
  const [checkInState, setCheckInState] = useState<string | null>(searchParams.checkIn || null);
  const [checkOutState, setCheckOutState] = useState<string | null>(searchParams.checkOut || null);

  const checkIn = searchParams.checkIn;
  const checkOut = searchParams.checkOut;
  const adults = parseInt(searchParams.adults || '1', 10);
  const children = parseInt(searchParams.children || '0', 10);
  const infants = parseInt(searchParams.infants || '0', 10);
  const pets = parseInt(searchParams.pets || '0', 10);

  const guestLabel = `${adults} adult${adults === 1 ? '' : 's'}` + 
    (children > 0 ? `, ${children} child${children === 1 ? '' : 'ren'}` : '');

  const actualGuestyId = property.guestyId || property.id;

  useEffect(() => {
    // If the user selects new dates in the calendar, update the URL to trigger a re-fetch of the quote
    if ((checkInState && checkInState !== checkIn) || (checkOutState && checkOutState !== checkOut)) {
      const params = new URLSearchParams({
        ...searchParams,
        checkIn: checkInState || '',
        checkOut: checkOutState || ''
      });
      router.push(`/checkout?${params.toString()}`, { scroll: false });
    }
  }, [checkInState, checkOutState, checkIn, checkOut, searchParams, router]);

  useEffect(() => {
    const fetchAvailability = async () => {
      setIsLoading(true);
      if (!checkIn || !checkOut || !actualGuestyId) {
        setIsLoading(false);
        setIsInitialLoad(false);
        return;
      }

      try {
        const response = await apiClient.post<any>('/booking/quotes', {
          listingId: actualGuestyId,
          checkInDateLocalized: checkIn,
          checkOutDateLocalized: checkOut,
          guestsCount: adults + children + infants,
          numberOfGuests: {
            numberOfAdults: adults,
            numberOfChildren: children,
            numberOfInfants: infants,
            numberOfPets: pets,
          },
        });

        if (response.success && response.data) {
          setQuote(response.data);
          setAlternatives([]);
        } else {
          setQuote(null);
          await fetchAlternatives();
        }
      } catch (err: any) {
        console.warn('Quote failed, fetching alternatives');
        setQuote(null);
        await fetchAlternatives();
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    };

    const fetchAlternatives = async () => {
      try {
        const params = new URLSearchParams();
        if (checkIn) params.append('checkIn', checkIn);
        if (checkOut) params.append('checkOut', checkOut);
        params.append('adults', adults.toString());
        if (children) params.append('children', children.toString());
        if (infants) params.append('infants', infants.toString());
        if (pets) params.append('pets', pets.toString());

        const res = await apiClient.get<any>(`/booking/search?${params.toString()}`);
        if (res.success && res.data) {
          // Filter out the current property
          const otherProps = res.data.filter((p: any) => p._id !== actualGuestyId && p.id !== actualGuestyId);
          setAlternatives(otherProps.slice(0, 2)); // Just show top 2
        } else {
          setAlternatives([]);
        }
      } catch (err) {
        console.error('Failed to fetch alternatives', err);
        setAlternatives([]);
      }
    };

    fetchAvailability();
  }, [actualGuestyId, checkIn, checkOut, adults, children, infants, pets]);

  // Loading Overlay Component
  const LoadingOverlay = () => (
    <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-50 flex items-center justify-center rounded-[inherit] min-h-[200px]">
      <div className="w-8 h-8 border-2 border-[#C4A997] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (isInitialLoad && isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-12 h-12 border-4 border-[#C4A997] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#7D7975] uppercase tracking-widest text-xs">Checking availability...</p>
      </div>
    );
  }

  // Common UI elements
  const imageObj = property.gallery?.[0];
  const coverImageUrl = imageObj ? buildImageUrl(imageObj.assetId || (imageObj as any).asset?._ref) : null;
  const propertyTitle = property.nickname || property.title;

  let leftDatesStr = `${checkIn} - ${checkOut}`;
  let rightDatesStr = `${checkIn} - ${checkOut}`;
  if (checkIn && checkOut) {
    try {
      const inD = parseISO(checkIn);
      const outD = parseISO(checkOut);
      if (inD.getMonth() === outD.getMonth()) {
        leftDatesStr = `${format(inD, 'd')} - ${format(outD, 'd MMM')}`; // 12 - 16 Jun
        rightDatesStr = `${format(inD, 'd')} - ${format(outD, 'd MMM yyyy')}`; // 12 - 16 Jun 2026
      } else {
        leftDatesStr = `${format(inD, 'd MMM')} - ${format(outD, 'd MMM')}`; // 30 Jun - 2 Jul
        rightDatesStr = `${format(inD, 'd MMM')} - ${format(outD, 'd MMM yyyy')}`; // 30 Jun - 2 Jul 2026
      }
    } catch(e) {}
  }

  const nights = Math.max(1, Math.floor((parseISO(checkOut || new Date().toISOString()).getTime() - parseISO(checkIn || new Date().toISOString()).getTime()) / (1000 * 60 * 60 * 24)));

  if (quote) {
    // STATE 1: AVAILABLE
    const ratePlanItem = quote?.rates?.ratePlans?.[0];
    const money = ratePlanItem?.ratePlan?.money;
    const total = money?.subTotalPrice || 0;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_345px] gap-12 lg:gap-32 relative">
        {isLoading && <LoadingOverlay />}
        
        {/* Left Side: Calendar / Dates */}
        <div className="flex flex-col gap-8 order-2 lg:order-1">
          <div>
            <h2 className="text-4xl font-serif text-[#1B1A17] mb-2">{cmsContent?.datesHeading || 'Dates'}</h2>
            <p className="text-sm text-[#7D7975]">{leftDatesStr}, {quote?.rates?.ratePlans?.[0]?.days?.length || 1} {cmsContent?.nightsText || 'nights'}</p>
          </div>
          
          <div className="rounded-xl mt-4">
            <DateSelector
              checkIn={checkInState}
              checkOut={checkOutState}
              onChangeCheckIn={setCheckInState}
              onChangeCheckOut={setCheckOutState}
              inline={true} 
            />
          </div>

          <div className="mt-2">
            <GuestSelector
              adults={adults}
              children={children}
              infants={infants}
              pets={pets}
              onChangeAdults={(val) => {
                const params = new URLSearchParams(searchParams as any);
                params.set('adults', val.toString());
                router.push(`/checkout?${params.toString()}`, { scroll: false });
              }}
              onChangeChildren={(val) => {
                const params = new URLSearchParams(searchParams as any);
                params.set('children', val.toString());
                router.push(`/checkout?${params.toString()}`, { scroll: false });
              }}
              onChangeInfants={(val) => {
                const params = new URLSearchParams(searchParams as any);
                params.set('infants', val.toString());
                router.push(`/checkout?${params.toString()}`, { scroll: false });
              }}
              onChangePets={(val) => {
                const params = new URLSearchParams(searchParams as any);
                params.set('pets', val.toString());
                router.push(`/checkout?${params.toString()}`, { scroll: false });
              }}
              customTrigger={
                <div className="cursor-pointer group">
                  <div className="text-[10px] uppercase tracking-[0.12em] text-[#7D7975] mb-2 group-hover:text-black transition-colors">{cmsContent?.guestsHeading || 'GUESTS'}</div>
                  <div className="text-[14px] text-[#1B1A17] pb-6 border-b border-[#1B1A17]/10 mb-8 group-hover:border-[#1B1A17]/30 transition-colors flex justify-between items-center">
                    <span>{guestLabel}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-50">
                       <path d="M6 9L12 15L18 9" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              }
            />
             <button 
                onClick={() => {
                  const params = new URLSearchParams(searchParams as any);
                  router.push(`/checkout/details?${params.toString()}`);
                }}
                className="w-full lg:w-auto bg-[#1B1A17] text-white py-3 px-8 rounded-full font-semibold hover:bg-black/80 transition-colors text-[14px]"
              >
                {cmsContent?.continueButton || 'Continue to details'}
              </button>
          </div>
        </div>

        {/* Right Side: Summary Card */}
        <div className="bg-white rounded-[4px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[#1B1A17]/5 overflow-hidden self-start order-1 lg:order-2 w-full max-w-[400px] lg:max-w-none mx-auto lg:mx-0">
          {coverImageUrl && (
            <div className="h-[220px] w-full overflow-hidden p-3 pb-0">
              <img src={coverImageUrl} alt={propertyTitle} className="w-full h-full object-cover rounded-t-[8px]" />
            </div>
          )}
          <div className="px-5 py-5 flex flex-col gap-4">
            <div>
              <h3 className="text-[17px] font-serif text-[#1B1A17]">{propertyTitle}</h3>
              <p className="text-[12px] text-[#7D7975] mt-1">{property.location?.city}</p>
            </div>

            <div className="border-t border-[#1B1A17]/10 pt-4 flex flex-col gap-2 text-[12px]">
              <div className="flex justify-between">
                <span className="text-[#7D7975]">{cmsContent?.datesHeading || 'Dates'}</span>
                <span className="text-[#1B1A17] text-right max-w-[120px]">{rightDatesStr}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[#7D7975]">{cmsContent?.guestsHeading || 'Guests'}</span>
                <span className="text-[#1B1A17] text-right max-w-[120px]">{guestLabel}</span>
              </div>
            </div>

            <div className="border-t border-[#1B1A17]/10 pt-4 flex flex-col gap-2 text-[12px]">
              <div className="flex justify-between">
                <span className="text-[#7D7975]">
                  ${Math.round((money?.fareAccommodation || 0) / (quote?.rates?.ratePlans?.[0]?.days?.length || 1)).toLocaleString()} × {quote?.rates?.ratePlans?.[0]?.days?.length || 1} {cmsContent?.nightsText || 'nights'}
                </span>
                <span className="text-[#1B1A17]">${(money?.fareAccommodation || 0).toLocaleString()}</span>
              </div>
              {(() => {
                const extractFees = (obj: any): any[] => {
                  if (!obj || typeof obj !== 'object') return [];
                  if (Array.isArray(obj)) {
                    if (obj.length > 0 && obj[0]?.title && obj[0]?.amount !== undefined && obj[0]?.type) return obj;
                    for (const item of obj) {
                      const res = extractFees(item);
                      if (res.length > 0) return res;
                    }
                    return [];
                  }
                  if (Array.isArray(obj.itemizedFees) && obj.itemizedFees.length > 0 && obj.itemizedFees[0]?.title) return obj.itemizedFees;
                  if (Array.isArray(obj.fees) && obj.fees.length > 0 && obj.fees[0]?.title) return obj.fees;
                  for (const key in obj) {
                    const res = extractFees(obj[key]);
                    if (res.length > 0) return res;
                  }
                  return [];
                };

                const itemizedFees = extractFees(quote);
                const hasItemizedFees = Array.isArray(itemizedFees) && itemizedFees.length > 0;
                
                if (hasItemizedFees) {
                  return itemizedFees
                    .filter((fee: any) => {
                      const titleStr = (fee.title || '').toLowerCase();
                      return fee.type !== 'ACCOMMODATION' && !titleStr.includes('accommodation');
                    })
                    .map((fee: any, idx: number) => {
                      let title = fee.title || 'Fee';
                      if (fee.type === 'CLEANING' || title.toLowerCase().includes('cleaning')) {
                        title = cmsContent?.cleaningFeeText || title;
                      }
                      return (
                        <div key={idx} className="flex justify-between">
                          <span className="text-[#7D7975] capitalize">{title}</span>
                          <span className="text-[#1B1A17]">${(fee.amount || 0).toLocaleString()}</span>
                        </div>
                      );
                  });
                }
                
                // Fallback if no itemized array is provided
                return (
                  <>
                    {((money?.fareCleaning || 0) > 0) && (
                      <div className="flex justify-between">
                        <span className="text-[#7D7975]">{cmsContent?.cleaningFeeText || 'Cleaning fee'}</span>
                        <span className="text-[#1B1A17]">${(money?.fareCleaning || 0).toLocaleString()}</span>
                      </div>
                    )}
                    {((money?.totalFees || 0) - (money?.fareCleaning || 0) > 0) && (
                      <div className="flex justify-between">
                        <span className="text-[#7D7975]">Fees</span>
                        <span className="text-[#1B1A17]">${((money?.totalFees || 0) - (money?.fareCleaning || 0)).toLocaleString()}</span>
                      </div>
                    )}
                  </>
                );
              })()}

              {((money?.totalTaxes || 0) > 0) && (
                <div className="flex justify-between">
                  <span className="text-[#7D7975]">Taxes</span>
                  <span className="text-[#1B1A17]">${(money?.totalTaxes || 0).toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="border-t border-[#1B1A17]/10 pt-4 flex flex-col gap-4">
              <div className="flex justify-between text-[14px] font-bold text-[#1B1A17]">
                <span>{cmsContent?.totalLabel || 'Total (AUD)'}</span>
                <span>${(total).toLocaleString()}</span>
              </div>

              <div>
                <p className="text-[10px] text-[#7D7975] mb-2">{cmsContent?.flexiblePaymentsText || 'or flexible payments with'}</p>
                {cmsContent?.flexiblePaymentLogos && cmsContent.flexiblePaymentLogos.length > 0 ? (
                  <PaymentLogos images={cmsContent.flexiblePaymentLogos} isFooter={false} />
                ) : (
                  <div className="flex gap-2 text-[10px] tracking-widest font-bold text-[#1B1A17]/70 uppercase mt-5">
                    <span>Afterpay</span>
                    <span>·</span>
                    <span>Klarna</span>
                    <span>·</span>
                    <span>Zip</span>
                  </div>
                )}
              </div>

              <div className="mt-2 text-[12px]">
                <a href="#" className="text-[#1B1A17] underline decoration-[#1B1A17]/30 hover:decoration-[#1B1A17]">{cmsContent?.addCodeText || 'Add a code'}</a>
              </div>

              <div className="text-[10px] text-[#7D7975] mt-1">
                {cmsContent?.freeCancellationText || 'Free cancellation until 7 days before check-in.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STATE 2: NOT AVAILABLE
  return (
    <div className="flex flex-col gap-12 max-w-4xl relative">
      {isLoading && <LoadingOverlay />}
      
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-serif text-[#1B1A17]">{cmsContent?.datesHeading || 'Dates'}</h2>
        <p className="text-[14px] text-[#7D7975]">{leftDatesStr}, {nights} {cmsContent?.nightsText || 'nights'}</p>
      </div>

      {alternatives.length > 0 ? (
        <>
          <div className="bg-[#E1DBC3] px-6 py-3 rounded-[8px] inline-flex self-start">
            <p className="text-[14px] text-[#1B1A17]">
              These dates are booked for {propertyTitle} — but these Miio homes are available:
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
            {alternatives.map(alt => (
              <MinimalPropertyCard
                key={alt._id || alt.id}
                id={alt._id || alt.id}
                slug={alt.id || alt._id}
                name={alt.title || alt.nickname}
                nickname={alt.nickname}
                unitType={alt.unitType}
                location={alt.address?.city || 'Various Locations'}
                guests={alt.accommodates || 2}
                bedrooms={alt.bedrooms || 1}
                bathrooms={alt.bathrooms}
                propertyType={alt.propertyType}
                reviews={undefined}
                price={alt.prices?.basePrice ? `$${Math.round(alt.prices.basePrice).toLocaleString()}` : '$0'} 
                priceLabel={alt.prices?.basePrice ? "/ night" : undefined}
                coverImage={alt.picture?.large || alt.thumbnail}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="bg-[#E1DBC3] px-6 py-3 rounded-[8px] inline-flex self-start">
          <p className="text-[14px] text-[#1B1A17]">
            These dates are booked for {propertyTitle}. No other homes are available for these exact dates.
          </p>
        </div>
      )}

      <div className="pt-8 border-t border-[#1B1A17]/10 mt-4">
        <div className="bg-[#E1DBC3] px-6 py-3 rounded-[8px] inline-flex self-start mb-8">
          <p className="text-[14px] text-[#1B1A17]">
            Other available dates for {propertyTitle}:
          </p>
        </div>
        
        <div className="rounded-xl relative">
           <DateSelector
              checkIn={checkInState}
              checkOut={checkOutState}
              onChangeCheckIn={setCheckInState}
              onChangeCheckOut={setCheckOutState}
              inline={true} 
            />
        </div>
      </div>
    </div>
  );
}
