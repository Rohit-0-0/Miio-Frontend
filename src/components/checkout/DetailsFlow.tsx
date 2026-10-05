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
    [key: string]: string | undefined;
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

export function DetailsFlow({ property, searchParams, paymentTrustImages, cmsContent }: CheckoutFlowProps) {
  const router = useRouter();
  
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [quote, setQuote] = useState<any>(null);
  
  const checkIn = searchParams.checkIn;
  const checkOut = searchParams.checkOut;
  const adults = parseInt(searchParams.adults || '1', 10);
  const children = parseInt(searchParams.children || '0', 10);
  const infants = parseInt(searchParams.infants || '0', 10);
  const pets = parseInt(searchParams.pets || '0', 10);

  const guestLabel = `${adults} adult${adults === 1 ? '' : 's'}` + 
    (children > 0 ? `, ${children} child${children === 1 ? '' : 'ren'}` : '');

  const actualGuestyId = property.guestyId || property.id;

  const [firstName, setFirstName] = useState(searchParams.firstName || '');
  const [lastName, setLastName] = useState(searchParams.lastName || '');
  const [email, setEmail] = useState(searchParams.email || '');
  const [phone, setPhone] = useState(searchParams.phone || '');
  const [notes, setNotes] = useState(searchParams.notes || '');
  const [marketing, setMarketing] = useState(searchParams.marketing === 'true');

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
        } else {
          setQuote(null);
        }
      } catch (err: any) {
        console.warn('Quote failed on details page');
        setQuote(null);
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
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
        leftDatesStr = `${format(inD, 'd')} - ${format(outD, 'd MMM')}`; 
        rightDatesStr = `${format(inD, 'd')} - ${format(outD, 'd MMM yyyy')}`; 
      } else {
        leftDatesStr = `${format(inD, 'd MMM')} - ${format(outD, 'd MMM')}`; 
        rightDatesStr = `${format(inD, 'd MMM')} - ${format(outD, 'd MMM yyyy')}`; 
      }
    } catch(e) {}
  }

  const nights = Math.max(1, Math.floor((parseISO(checkOut || new Date().toISOString()).getTime() - parseISO(checkIn || new Date().toISOString()).getTime()) / (1000 * 60 * 60 * 24)));

  const ratePlanItem = quote?.rates?.ratePlans?.[0];
  const money = ratePlanItem?.ratePlan?.money;
  const total = money?.subTotalPrice || 0;

  const summaryCard = (
    <div className="bg-white rounded-lg lg:rounded-[4px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[#1B1A17]/5 overflow-hidden self-start order-1 lg:order-2 w-full max-w-[400px] lg:max-w-none mx-auto lg:mx-0 p-4 lg:p-0 flex flex-row lg:flex-col items-center lg:items-start gap-4 lg:gap-0 mb-0 lg:mb-0">
      {coverImageUrl && (
        <div className="w-[84px] h-[64px] lg:h-[220px] lg:w-full overflow-hidden lg:p-3 lg:pb-0 shrink-0">
          <img src={coverImageUrl} alt={propertyTitle} className="w-full h-full object-cover rounded-[6px] lg:rounded-t-[8px] lg:rounded-b-none" />
        </div>
      )}
      <div className="lg:px-5 lg:py-5 flex flex-col lg:gap-4 w-full">
        <div>
          <h3 className="text-[14px] lg:text-[17px] font-serif text-[#1B1A17] leading-tight">{propertyTitle}</h3>
          <p className="text-[10px] lg:text-[12px] text-[#7D7975] mt-0.5 lg:mt-1">{property.location?.city}</p>
        </div>

        <div className="hidden lg:flex border-t border-[#1B1A17]/10 pt-4 flex-col gap-2 text-[12px]">
          <div className="flex justify-between">
            <span className="text-[#7D7975]">{cmsContent?.datesHeading || 'Dates'}</span>
            {quote ? (
              <span className="text-[#1B1A17] text-right max-w-[120px]">{rightDatesStr}</span>
            ) : (
              <span className="text-[#1B1A17] text-right max-w-[120px] underline cursor-pointer hover:text-black">Choose new dates</span>
            )}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[#7D7975]">{cmsContent?.guestsHeading || 'Guests'}</span>
            <span className="text-[#1B1A17] text-right max-w-[120px]">{guestLabel}</span>
          </div>
        </div>

        {quote ? (
          <>
            <div className="hidden lg:flex border-t border-[#1B1A17]/10 pt-4 flex-col gap-2 text-[12px]">
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

            <div className="hidden lg:flex border-t border-[#1B1A17]/10 pt-4 flex-col gap-4">
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
          </>
        ) : (
          <div className="hidden lg:flex border-t border-[#1B1A17]/10 pt-4 flex-col gap-4">
            <div className="text-[12px] text-[#7D7975]">
              The total updates once new dates are chosen.
            </div>
            <div className="text-[10px] text-[#7D7975] mt-1">
              {cmsContent?.freeCancellationText || 'Free cancellation until 7 days before check-in.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (quote) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_345px] gap-12 lg:gap-32 relative">
        {isLoading && <LoadingOverlay />}
        
        {/* Left Side: Form */}
        <div className="flex flex-col gap-8 order-2 lg:order-1">
          <div>
            <h2 className="text-[32px] font-serif text-[#1B1A17] mb-12">Details</h2>
            
            <form 
              className="flex flex-col gap-10 w-full max-w-[630px]"
              onSubmit={async (e) => {
                e.preventDefault();
                if (marketing && email) {
                  if (typeof window !== 'undefined' && (window as any).dataLayer) {
                    (window as any).dataLayer.push({ event: 'checkout_newsletter_signup', email });
                  }
                  // Hit our Klaviyo API directly
                  try {
                    await apiClient.post('/newsletter/subscribe', { email });
                  } catch (err) {
                    console.error('Failed to subscribe during checkout', err);
                  }
                }
                const params = new URLSearchParams(searchParams as any);
                if (firstName) params.set('firstName', firstName);
                if (lastName) params.set('lastName', lastName);
                if (email) params.set('email', email);
                if (phone) params.set('phone', phone);
                if (notes) params.set('notes', notes);
                if (marketing) params.set('marketing', 'true');
                router.push(`/checkout/payment?${params.toString()}`);
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* First Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] uppercase tracking-[0.08em] text-[#241D19] font-normal">First Name</label>
                  <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" className="border-b border-[#1B1A17]/10 pb-2 text-[14px] text-[#5F4E44] focus:outline-none focus:border-[#1B1A17]/30 bg-transparent placeholder:text-[#5F4E44]/50" />
                </div>
                {/* Last Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] uppercase tracking-[0.08em] text-[#241D19] font-normal">Last Name</label>
                  <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" className="border-b border-[#1B1A17]/10 pb-2 text-[14px] text-[#5F4E44] focus:outline-none focus:border-[#1B1A17]/30 bg-transparent placeholder:text-[#5F4E44]/50" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Email */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] uppercase tracking-[0.08em] text-[#241D19] font-normal">Email</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="border-b border-[#1B1A17]/10 pb-2 text-[14px] text-[#5F4E44] focus:outline-none focus:border-[#1B1A17]/30 bg-transparent placeholder:text-[#5F4E44]/50" />
                </div>
                {/* Phone */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] uppercase tracking-[0.08em] text-[#241D19] font-normal">Phone</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-0 bottom-2 text-[14px] text-[#5F4E44]/50 pointer-events-none">+</span>
                    <input type="tel" required maxLength={15} value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^0-9\s-]/g, ''))} placeholder="61 400 000 000" className="pl-3 w-full border-b border-[#1B1A17]/10 pb-2 text-[14px] text-[#5F4E44] focus:outline-none focus:border-[#1B1A17]/30 bg-transparent placeholder:text-[#5F4E44]/50" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] uppercase tracking-[0.08em] text-[#241D19] font-normal">Anything we should know? (Optional)</label>
                <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any requests..." className="border-b border-[#1B1A17]/10 pb-2 text-[14px] text-[#5F4E44] focus:outline-none focus:border-[#1B1A17]/30 bg-transparent placeholder:text-[#5F4E44]/50" />
              </div>

              <div className="flex items-center gap-4 mt-2">
                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="appearance-none w-5 h-5 border border-[#1B1A17]/20 rounded-[2px] checked:bg-transparent transition-colors peer cursor-pointer" />
                    <svg className="absolute w-3 h-3 text-[#1B1A17] opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-[12px] text-[#7D7975]">Stay close — letters from Miio, once a season.</span>
                </label>
              </div>

              <div className="mt-4">
                <button 
                  type="submit"
                  className="w-full md:w-auto bg-[#1B1A17] text-white py-[14px] px-8 rounded-full font-semibold hover:bg-black/80 transition-colors text-[13px] tracking-wide"
                >
                  Continue to payment
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Summary Card */}
        {summaryCard}
      </div>
    );
  }

  // STATE 2: NOT AVAILABLE / EXPIRED
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="bg-[#E1DBC3] px-6 py-4 rounded-[8px]">
        <p className="text-[14px] text-[#1B1A17]">
          The selected dates are no longer available for {propertyTitle}. Please return to step 1 to choose available dates.
        </p>
      </div>
      <Link 
        href={`/checkout?${new URLSearchParams(searchParams as any).toString()}`}
        className="inline-block bg-[#1B1A17] text-white px-6 py-3 rounded-full text-[13px] font-semibold self-start hover:bg-black/80"
      >
        &larr; Back to Dates
      </Link>
    </div>
  );
}
