import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { buildImageUrl } from '@/lib/media/buildImageUrl';
import { PaymentLogos } from '@/components/layout/PaymentLogos';
import { PropertyDetails } from '@/types/property';
interface PaymentFlowProps {
  property: PropertyDetails;
  searchParams: { [key: string]: string | string[] | undefined };
  cmsContent?: any;
  stripePromise?: any;
}

function PaymentForm({ 
  property, 
  searchParams, 
  cmsContent, 
  quote, 
  total,
  checkIn,
  checkOut,
  guestLabel,
  nightsCount,
  money
}: any) {
  const stripe = useStripe();
  const elements = useElements();
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'applepay' | 'paylater'>('card');
  const [agreedToPolicies, setAgreedToPolicies] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToPolicies) {
      alert("Please agree to the house rules and cancellation policy.");
      return;
    }
    
    if (!stripe || !elements) return;

    setIsProcessing(true);
    
    try {
      // Create PaymentMethod using the split elements
      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) {
        alert("Payment fields not loaded properly. Please refresh.");
        setIsProcessing(false);
        return;
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });
      
      if (error) {
        alert(error.message);
        setIsProcessing(false);
        return;
      }

      if (!paymentMethod) {
        alert("Failed to generate payment token.");
        setIsProcessing(false);
        return;
      }

      const confirmationToken = paymentMethod;

      const guest = {
        firstName: typeof searchParams.firstName === 'string' ? searchParams.firstName : '',
        lastName: typeof searchParams.lastName === 'string' ? searchParams.lastName : '',
        email: typeof searchParams.email === 'string' ? searchParams.email : '',
        phone: typeof searchParams.phone === 'string' ? searchParams.phone : '',
      };

      const chargePayload = {
        listingId: property?.guestyId || property?._id || property?.id,
        quoteId: quote._id || quote.id,
        ratePlanId: quote.rates?.ratePlans?.[0]?.ratePlan?._id,
        confirmationToken: confirmationToken.id,
        provider: 'stripe',
        guest,
        acceptPolicies: agreedToPolicies,
      };

      const { apiClient } = await import('@/lib/api/client');
      const response = await apiClient.post<any>('/booking/instant-charge', chargePayload);

      if (response.success && response.data) {
        alert('Booking Confirmed! Reservation ID: ' + (response.data._id || response.data.id));
        // TODO: Redirect to a success page
      } else {
        alert(response.error || 'Payment failed. Please try again.');
      }

      setIsProcessing(false);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'An error occurred during payment.');
      setIsProcessing(false);
    }
  };

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        fontSize: '14px',
        color: '#1B1A17',
        fontFamily: 'var(--font-instrument-sans), sans-serif',
        '::placeholder': {
          color: 'rgba(27, 26, 23, 0.2)',
        },
      },
      invalid: {
        color: '#ef4444',
      },
    },
  };

  return (
    <div className="flex flex-col md:flex-row gap-12 md:gap-24 w-full justify-between items-start">
      {/* Left Column - Payment Form */}
      <div className="flex-1 w-full max-w-[630px]">
        <h2 className="text-[32px] font-serif text-[#1B1A17] mb-12">Payment</h2>
        
        <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-8">
          
          {/* Card Option */}
          <div className={`border-b border-[#1B1A17]/10 pb-6 transition-all ${paymentMethod === 'card' ? 'opacity-100' : 'opacity-50'}`}>
            <label className="flex items-center gap-3 cursor-pointer group mb-8">
              <div className={`w-4 h-4 rounded-full border border-[#1B1A17] flex items-center justify-center transition-colors ${paymentMethod === 'card' ? 'border-[5px] border-[#1B1A17]' : 'group-hover:border-[#1B1A17]/60'}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="card" 
                  checked={paymentMethod === 'card'} 
                  onChange={() => setPaymentMethod('card')}
                  className="hidden" 
                />
              </div>
              <span className="text-[14px] text-[#1B1A17]">Card</span>
            </label>
            
            {paymentMethod === 'card' && (
              <div className="pl-7 flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-[0.12em] text-[#7D7975]">Card Number</label>
                  <div className="border-b border-[#1B1A17]/10 pb-2">
                    <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-[0.12em] text-[#7D7975]">Expiry</label>
                    <div className="border-b border-[#1B1A17]/10 pb-2">
                      <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase tracking-[0.12em] text-[#7D7975]">CVC</label>
                    <div className="border-b border-[#1B1A17]/10 pb-2">
                      <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-[0.12em] text-[#7D7975]">Name on Card</label>
                  <input type="text" placeholder="Emma Walsh" className="border-b border-[#1B1A17]/10 pb-2 text-[14px] text-[#1B1A17] focus:outline-none focus:border-[#1B1A17]/30 bg-transparent placeholder:text-[#1B1A17]/20" />
                </div>
              </div>
            )}
          </div>

          {/* Apple Pay Option */}
          <div className={`border-b border-[#1B1A17]/10 pb-6 transition-all ${paymentMethod === 'applepay' ? 'opacity-100' : 'opacity-50'}`}>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 rounded-full border border-[#1B1A17] flex items-center justify-center transition-colors ${paymentMethod === 'applepay' ? 'border-[5px] border-[#1B1A17]' : 'group-hover:border-[#1B1A17]/60'}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="applepay" 
                  checked={paymentMethod === 'applepay'} 
                  onChange={() => setPaymentMethod('applepay')}
                  className="hidden" 
                />
              </div>
              <span className="text-[14px] text-[#1B1A17] flex items-center gap-2">
                Apple Pay 
                <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center justify-center tracking-tighter">Pay</span>
              </span>
            </label>
          </div>

          {/* Pay Later Option */}
          <div className={`border-b border-[#1B1A17]/10 pb-6 transition-all ${paymentMethod === 'paylater' ? 'opacity-100' : 'opacity-50'}`}>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 rounded-full border border-[#1B1A17] flex items-center justify-center transition-colors ${paymentMethod === 'paylater' ? 'border-[5px] border-[#1B1A17]' : 'group-hover:border-[#1B1A17]/60'}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="paylater" 
                  checked={paymentMethod === 'paylater'} 
                  onChange={() => setPaymentMethod('paylater')}
                  className="hidden" 
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] text-[#1B1A17] flex items-center gap-3">
                  Pay later 
                  <div className="flex items-center gap-1.5 opacity-80">
                    <span className="text-[10px] font-bold tracking-tighter text-[#B2FCE4] bg-black px-1.5 rounded-sm">afterpay</span>
                    <span className="text-[10px] font-bold tracking-tighter text-pink-200 bg-black px-1.5 rounded-sm">Klarna.</span>
                    <span className="text-[10px] font-bold tracking-tighter text-white bg-black px-1.5 rounded-sm">zip</span>
                  </div>
                </span>
                <span className="text-[10px] text-[#7D7975] mt-1">with Afterpay, Klarna or Zip</span>
              </div>
            </label>
          </div>

          <div className="mt-4 flex flex-col gap-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 rounded-[3px] border border-[#1B1A17] flex items-center justify-center transition-colors ${agreedToPolicies ? 'bg-[#1B1A17]' : 'group-hover:border-[#1B1A17]/60'}`}>
                <input 
                  type="checkbox" 
                  checked={agreedToPolicies}
                  onChange={(e) => setAgreedToPolicies(e.target.checked)}
                  className="hidden" 
                />
                {agreedToPolicies && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className="text-[12px] text-[#1B1A17]">I agree to the house rules and the cancellation policy</span>
            </label>

            <button 
              type="submit"
              disabled={isProcessing || !stripe}
              className="w-full md:w-auto bg-[#1B1A17] text-white py-[14px] px-8 rounded-full font-semibold hover:bg-black/80 transition-colors text-[13px] tracking-wide self-start disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : `Confirm & pay $${(total).toLocaleString()}`}
            </button>
          </div>
        </form>
      </div>

      {/* Right Column - Booking Summary Card */}
      <div className="w-full md:w-[400px] lg:w-[440px] shrink-0 sticky top-24">
        <div className="bg-white rounded-[4px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[#1B1A17]/5 overflow-hidden flex flex-col">
          {(() => {
            const imgRef = property.gallery?.[0]?.assetId || property.gallery?.[0]?.asset?._ref || property.heroImage?.asset?._ref;
            const src = buildImageUrl(imgRef);
            return src ? (
              <div className="h-[220px] w-full overflow-hidden p-3 pb-0">
                <img src={src} alt={property.nickname || property.title} className="w-full h-full object-cover rounded-t-[8px]" />
              </div>
            ) : null;
          })()}
          <div className="px-5 py-5 flex flex-col gap-4">
            <div>
              <h3 className="text-[17px] font-serif text-[#1B1A17]">{property.nickname || property.title}</h3>
              <p className="text-[12px] text-[#7D7975] mt-1">{property.location?.city || property.tagline}</p>
            </div>

          {/* Booking Info */}
          <div className="py-6 border-b border-[#1B1A17]/10 flex flex-col gap-4 text-[14px]">
            <div className="flex justify-between items-start">
              <span className="text-[#7D7975]">{cmsContent?.datesHeading || 'Dates'}</span>
              <span className="text-[#1B1A17] text-right">
                {checkIn ? new Date(checkIn).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : ''} 
                {checkIn && checkOut ? ' - ' : ''}
                {checkOut ? new Date(checkOut).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-[#7D7975]">{cmsContent?.guestsHeading || 'Guests'}</span>
              <span className="text-[#1B1A17] text-right">{guestLabel}</span>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="pt-6 flex flex-col gap-4 text-[14px]">
            <div className="flex flex-col gap-3 pb-6">
              <div className="flex justify-between">
                <span className="text-[#7D7975]">${Math.round(money?.fareAccommodation / nightsCount || 0).toLocaleString()} &times; {nightsCount} {cmsContent?.nightsText || 'nights'}</span>
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

              <div className="text-[10px] text-[#7D7975] mt-2">
                {cmsContent?.freeCancellationText || 'Free cancellation until 7 days before check-in.'}
              </div>
            </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export function PaymentFlow({ property, searchParams, cmsContent, stripePromise }: PaymentFlowProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [quote, setQuote] = React.useState<any>(null);
  
  // Details from previous step
  const checkIn = typeof searchParams.checkIn === 'string' ? searchParams.checkIn : '';
  const checkOut = typeof searchParams.checkOut === 'string' ? searchParams.checkOut : '';
  const adults = parseInt(searchParams.adults as string || '1', 10);
  const children = parseInt(searchParams.children as string || '0', 10);
  const infants = parseInt(searchParams.infants as string || '0', 10);
  const pets = parseInt(searchParams.pets as string || '0', 10);

  const guestLabel = `${adults} adult${adults === 1 ? '' : 's'}` + 
    (children > 0 ? `, ${children} child${children === 1 ? '' : 'ren'}` : '') +
    (infants > 0 ? `, ${infants} infant${infants === 1 ? '' : 's'}` : '') +
    (pets > 0 ? `, ${pets} pet${pets === 1 ? '' : 's'}` : '');

  React.useEffect(() => {
    async function fetchQuote() {
      try {
        const { apiClient } = await import('@/lib/api/client');
        const actualGuestyId = property?.guestyId || property?._id || property?.id;
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
        }
      } catch (err) {
        console.error('Failed to get quote:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (checkIn && checkOut) {
      fetchQuote();
    } else {
      setIsLoading(false);
    }
  }, [property, checkIn, checkOut, adults, children, infants, pets]);

  const ratePlanItem = quote?.rates?.ratePlans?.[0];
  const money = ratePlanItem?.ratePlan?.money;
  const total = money?.subTotalPrice || quote?.financials?.total?.amount || 0;
  const nightsCount = quote?.nightsCount || 1;

  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row gap-12 w-full max-w-[1440px] relative">
        <div className="flex-1 animate-pulse bg-black/5 h-96 rounded-xl" />
        <div className="w-full md:w-[400px] lg:w-[480px] animate-pulse bg-black/5 h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ 
      mode: 'payment',
      amount: Math.round(total * 100) || 1099,
      currency: 'aud',
    }}>
      <PaymentForm 
        property={property} 
        searchParams={searchParams} 
        cmsContent={cmsContent}
        quote={quote}
        total={total}
        checkIn={checkIn}
        checkOut={checkOut}
        guestLabel={guestLabel}
        nightsCount={nightsCount}
        money={money}
      />
    </Elements>
  );
}
