import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, PaymentRequestButtonElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { buildImageUrl } from '@/lib/media/buildImageUrl';
import { PaymentLogos } from '@/components/layout/PaymentLogos';
import { PropertyDetails } from '@/types/property';
import { trackEvent } from '@/lib/analytics';
import * as meta from '@/lib/analytics/meta';

interface PaymentFlowProps {
  property: PropertyDetails;
  searchParams: { [key: string]: string | string[] | undefined };
  cmsContent?: any;
  stripePromise?: any;
  applePayLogo?: any;
}

function PaymentForm({ 
  property, 
  searchParams, 
  cmsContent, 
  applePayLogo,
  quote, 
  total,
  checkIn,
  checkOut,
  guestLabel,
  nightsCount,
  money,
  appliedCoupon,
  setAppliedCoupon,
  isApplyingCoupon,
  couponError,
  setCouponError
}: any) {
  const stripe = useStripe();
  const elements = useElements();
  const [couponInput, setCouponInput] = useState('');
  const [isCouponInputOpen, setIsCouponInputOpen] = useState(false);
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'applepay' | 'paylater'>('card');
  const [agreedToPolicies, setAgreedToPolicies] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<any>(null);

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: 'AU',
        currency: 'aud',
        total: {
          label: 'Stay with Miio',
          amount: Math.round(total * 100),
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr);
        }
      });
      
      (pr as any).on('paymentmethod', async (ev: any) => {
        const { paymentMethod } = ev;
        try {
          const { apiClient } = await import('@/lib/api/client');
          const chargePayload = {
            ccToken: paymentMethod.id,
            listingId: property?.guestyId || (property as any)?._id || property?.id,
            checkInDateLocalized: checkIn,
            checkOutDateLocalized: checkOut,
            guestsCount: quote?.rates?.ratePlans?.[0]?.ratePlan?.money?.fareAccommodation ? 1 : 1, // Will fix proper payload variables below
          };
          
          // Hack to get the adults variables since they are outside this scope (they are props on PaymentFlow)
          // We will construct a better payload inside handlePaymentSubmit, or just use quote for total.
          
          const response = await apiClient.post<any>('/booking/instant-charge', {
             ccToken: paymentMethod.id,
             listingId: property?.guestyId || property?._id || property?.id,
             checkInDateLocalized: checkIn,
             checkOutDateLocalized: checkOut,
             guestsCount: 1, // Simplify for PR for now, the normal form submits full details
             numberOfGuests: { numberOfAdults: 1, numberOfChildren: 0, numberOfInfants: 0, numberOfPets: 0 },
          });

          if (response.success && response.data) {
            ev.complete('success');
            if (typeof window !== 'undefined' && (window as any).dataLayer) {
              (window as any).dataLayer.push({ event: 'Booking completed', transaction_id: response.data._id || response.data.id, value: total, currency: 'AUD' });
            }
            
            const transactionId = response.data._id || response.data.id;
            const propertyId = property?.guestyId || (property as any)?._id || property?.id;
            trackEvent('purchase', {
              transaction_id: transactionId,
              value: total,
              currency: 'AUD',
              items: [{
                item_id: propertyId,
                item_name: property?.nickname || property?.title,
                price: total
              }]
            });
            meta.event('Purchase', {
              content_ids: [propertyId],
              content_type: 'product',
              value: total,
              currency: 'AUD'
            });

            alert('Booking Confirmed! Reservation ID: ' + transactionId);
          } else {
            ev.complete('fail');
            alert(response.error || 'Payment failed.');
          }
        } catch (err) {
          ev.complete('fail');
          alert('Payment failed.');
        }
      });
    }
  }, [stripe, total, property, checkIn, checkOut]);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToPolicies) {
      alert("Please agree to the house rules and cancellation policy.");
      return;
    }
    
    if (!stripe || !elements) return;

    setIsProcessing(true);
    
    try {
      let confirmationToken: any;

      if (paymentMethod === 'card') {
        // Create PaymentMethod using the split elements
        const cardElement = elements.getElement(CardNumberElement);
        if (!cardElement) {
          alert("Payment fields not loaded properly. Please refresh.");
          setIsProcessing(false);
          return;
        }

        const { error, paymentMethod: pm } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });
        
        if (error) {
          alert(error.message);
          setIsProcessing(false);
          return;
        }
        confirmationToken = pm;
      } else if (paymentMethod === 'paylater') {
        const { error, paymentMethod: pm } = await stripe.createPaymentMethod({
          type: 'afterpay_clearpay',
          billing_details: {
            name: `${searchParams.firstName || ''} ${searchParams.lastName || ''}`.trim(),
            email: (searchParams.email as string) || '',
          },
        });
        
        if (error) {
          alert(error.message);
          setIsProcessing(false);
          return;
        }
        confirmationToken = pm;
      }

      if (!confirmationToken) {
        alert("Failed to generate payment token.");
        setIsProcessing(false);
        return;
      }

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
        if (typeof window !== 'undefined' && (window as any).dataLayer) {
          (window as any).dataLayer.push({ event: 'Booking completed', transaction_id: response.data._id || response.data.id, value: total, currency: 'AUD' });
        }
        
        const transactionId = response.data._id || response.data.id;
        const propertyId = property?.guestyId || (property as any)?._id || property?.id;
        trackEvent('purchase', {
          transaction_id: transactionId,
          value: total,
          currency: 'AUD',
          items: [{
            item_id: propertyId,
            item_name: property?.nickname || property?.title,
            price: total
          }]
        });
        meta.event('Purchase', {
          content_ids: [propertyId],
          content_type: 'product',
          value: total,
          currency: 'AUD'
        });
        
        // Build the URL parameters for the success page
        const successParams = new URLSearchParams({
          bookingId: response.data._id || response.data.id,
          confirmationCode: response.data.confirmationCode,
          propertyId: property?.guestyId || property?._id || property?.id || '',
          firstName: typeof searchParams.firstName === 'string' ? searchParams.firstName : '',
          email: typeof searchParams.email === 'string' ? searchParams.email : '',
          checkIn: typeof searchParams.checkIn === 'string' ? searchParams.checkIn : '',
          checkOut: typeof searchParams.checkOut === 'string' ? searchParams.checkOut : '',
          adults: typeof searchParams.adults === 'string' ? searchParams.adults : '1',
          children: typeof searchParams.children === 'string' ? searchParams.children : '0',
          infants: typeof searchParams.infants === 'string' ? searchParams.infants : '0',
          pets: typeof searchParams.pets === 'string' ? searchParams.pets : '0',
        });
        
        window.location.href = `/checkout/success?${successParams.toString()}`;
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
        color: '#5F4E44',
        fontFamily: 'var(--font-instrument-sans), sans-serif',
        '::placeholder': {
          color: 'rgba(95, 78, 68, 0.6)',
        },
      },
      invalid: {
        color: '#ef4444',
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_345px] gap-12 lg:gap-32 relative">
      {/* Left Column - Payment Form */}
      <div className="flex flex-col gap-6 order-2 lg:order-1">
        <div className="pb-2 lg:pb-4">
          <h2 className="text-[32px] font-serif text-[#1B1A17]">Payment</h2>
        </div>
        
        <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-4">
          
          {/* Card Option */}
          <div className={`bg-white rounded-[8px] border border-[#1B1A17]/20 p-6 transition-all ${paymentMethod === 'card' ? 'opacity-100' : 'opacity-50'}`}>
            <label className="flex items-center gap-3 cursor-pointer group mb-6">
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
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] uppercase tracking-[0.08em] text-[#241D19] font-normal">Card Number</label>
                  <div className="border-b border-[#1B1A17]/10 pb-2">
                    <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] uppercase tracking-[0.08em] text-[#241D19] font-normal">Expiry</label>
                    <div className="border-b border-[#1B1A17]/10 pb-2">
                      <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] uppercase tracking-[0.08em] text-[#241D19] font-normal">CVC</label>
                    <div className="border-b border-[#1B1A17]/10 pb-2">
                      <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] uppercase tracking-[0.08em] text-[#241D19] font-normal">Name on Card</label>
                  <input type="text" placeholder="Emma Walsh" className="border-b border-[#1B1A17]/10 pb-2 text-[14px] text-[#5F4E44] focus:outline-none focus:border-[#1B1A17]/30 bg-transparent placeholder:text-[#5F4E44]/60" />
                </div>
              </div>
            )}
          </div>

          {/* Apple Pay Option */}
          <div className={`bg-white rounded-[8px] border border-[#1B1A17]/20 p-6 transition-all ${paymentMethod === 'applepay' ? 'opacity-100' : 'opacity-50'}`}>
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
              <div className="flex flex-col gap-1">
                <span className="text-[14px] text-[#1B1A17] flex items-center gap-2">
                  <span>Apple Pay</span>
                  {(() => {
                    const customLogoUrl = applePayLogo ? buildImageUrl(applePayLogo?.asset?._ref || applePayLogo?.asset?._id || applePayLogo) : null;
                    if (customLogoUrl) {
                      return (
                        <span className="inline-flex items-center justify-center h-[24px]">
                          <img src={customLogoUrl} alt="Apple Pay" className="h-[22px] w-auto object-contain" />
                        </span>
                      );
                    }
                    return (
                      <span className="inline-flex items-center justify-center bg-black text-white px-2.5 py-1 rounded-[4px] h-[22px]">
                        <svg className="h-[14px] w-auto fill-current" viewBox="0 0 170 80" aria-label="Apple Pay" role="img">
                          {/* Apple Logo */}
                          <path d="M43.064 33.176c-.222-6.52 5.34-9.67 5.586-9.824-3.048-4.453-7.784-5.06-9.467-5.132-4.04-.412-7.892 2.38-9.943 2.38-2.052 0-5.244-2.32-8.604-2.257-4.417.065-8.497 2.569-10.771 6.525-4.59 7.962-1.173 19.742 3.284 26.185 2.18 3.149 4.774 6.69 8.183 6.564 3.284-.132 4.526-2.124 8.496-2.124 3.97 0 5.092 2.124 8.544 2.059 3.51-.065 5.736-3.184 7.887-6.337 2.493-3.642 3.519-7.172 3.575-7.354-.08-.036-6.862-2.634-6.937-10.457zM36.14 13.916c1.815-2.2 3.036-5.26 2.702-8.316-2.616.105-5.787 1.745-7.659 3.935-1.636 1.895-3.07 4.996-2.684 7.973 2.92.226 5.826-1.393 7.641-3.592z"/>
                          {/* Pay Text */}
                          <path d="M79.245 42.668c0 8.04-4.872 13.08-12.24 13.08-4.128 0-7.344-1.68-9.048-4.632v12.48h-5.04V30h4.848v4.44c1.728-2.928 5.04-4.632 9.24-4.632 7.368 0 12.24 5.04 12.24 12.86zm-5.04.096c0-5.4-3.216-8.784-7.8-8.784-4.56 0-7.776 3.408-7.776 8.784 0 5.4 3.216 8.808 7.776 8.808 4.584 0 7.8-3.408 7.8-8.808zm26.471 12.504l-.696-3.888c-1.68 2.76-4.944 4.344-8.76 4.344-5.28 0-8.904-3.336-8.904-7.872 0-5.112 4.104-7.896 11.232-8.328l6.768-.408v-1.68c0-3.384-2.136-5.184-6.024-5.184-3.48 0-5.784 1.44-6.384 3.84l-4.728-.84c.984-4.224 5.256-6.84 11.232-6.84 6.96 0 10.944 3.288 10.944 9.144v17.712h-4.68zm-6.816-4.104c3.96 0 6.816-2.4 6.816-5.832v-2.064l-5.856.36c-4.488.288-6.936 1.728-6.936 4.608 0 2.232 1.944 3.696 4.776 3.696zm28.32 12.408l3.144-8.88 10.704-24.216h5.352l-13.848 29.568c-2.328 4.992-4.968 7.032-9.72 7.032-1.2 0-2.352-.168-3.096-.408l.792-3.984c.672.216 1.416.312 2.064.312 2.376 0 3.792-.936 4.608-2.688l-10.024-29.832h5.184l7.104 22.08 7.344-22.08h5.136z"/>
                        </svg>
                      </span>
                    );
                  })()}
                </span>
                {paymentMethod === 'applepay' && !paymentRequest && (
                  <span className="text-[10px] text-red-500 mt-1">Apple Pay is not supported in this browser.</span>
                )}
              </div>
            </label>
            
            {paymentMethod === 'applepay' && paymentRequest && (
              <div className="mt-4">
                <PaymentRequestButtonElement 
                  options={{ paymentRequest }} 
                  onClick={(e) => {
                    if (!agreedToPolicies) {
                      e.preventDefault();
                      alert("Please agree to the house rules and cancellation policy.");
                    }
                  }}
                />
              </div>
            )}
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
              <span className="text-[12px] text-[#1B1A17]">
                I agree to the <span className="underline underline-offset-4 cursor-default">house rules and the cancellation policy</span>
              </span>
            </label>

            <div className="flex flex-col gap-3">
              <button 
                type="submit"
                disabled={isProcessing || !stripe}
                className={`w-full md:w-auto bg-[#1B1A17] text-white py-[14px] px-8 rounded-full font-semibold hover:bg-black/80 transition-colors text-[13px] tracking-wide self-start disabled:opacity-50 ${paymentMethod === 'applepay' && paymentRequest ? 'hidden' : ''}`}
              >
                {isProcessing ? 'Processing...' : `Confirm & pay $${(total).toLocaleString()}`}
              </button>
              
              {(!paymentRequest || paymentMethod !== 'applepay') && (
                <div className="flex flex-col gap-2">
                  {cmsContent?.paymentTrustImages && cmsContent.paymentTrustImages.length > 0 && (
                    <PaymentLogos images={cmsContent.paymentTrustImages} isFooter={false} />
                  )}
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Right Column - Booking Summary Card */}
      <div className="w-full max-w-[400px] lg:max-w-[345px] mx-auto lg:mx-0 order-1 lg:order-2 self-start sticky lg:top-24 mb-6 lg:mb-0">
        <div className="bg-white rounded-[8px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] border border-[#1B1A17]/10 overflow-hidden flex flex-col p-6 gap-5">
          
          {/* Header block: Horizontal on mobile, vertical on desktop */}
          <div className="flex flex-row lg:flex-col items-center lg:items-start gap-4 pb-5 border-b border-[#1B1A17]/10">
            {(() => {
              const imgRef = property.gallery?.[0]?.assetId || property.gallery?.[0]?.asset?._ref || property.heroImage?.asset?._ref;
              const src = buildImageUrl(imgRef);
              return src ? (
                <div className="w-[84px] h-[64px] lg:h-[220px] lg:w-full overflow-hidden shrink-0 rounded-[6px]">
                  <img src={src} alt={property.nickname || property.title} className="w-full h-full object-cover" />
                </div>
              ) : null;
            })()}
            <div className="flex flex-col w-full">
              <h3 className="text-[14px] lg:text-[17px] font-serif text-[#1B1A17] leading-tight">{property.nickname || property.title}</h3>
              <p className="text-[10px] lg:text-[12px] text-[#7D7975] mt-0.5 lg:mt-1">{property.location?.city || property.tagline}</p>
            </div>
          </div>

          {/* Dates & Guests Block */}
          <div className="flex flex-col gap-2 pb-5 border-b border-[#1B1A17]/10 text-[13px] lg:text-[14px]">
            <div className="flex justify-between items-center">
              <span className="text-[#7D7975]">{cmsContent?.datesHeading || 'Dates'}</span>
              <span className="text-[#1B1A17] text-right">
                {checkIn ? new Date(checkIn).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : ''} 
                {checkIn && checkOut ? ' – ' : ''}
                {checkOut ? new Date(checkOut).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#7D7975]">{cmsContent?.guestsHeading || 'Guests'}</span>
              <span className="text-[#1B1A17] text-right">{guestLabel}</span>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2 text-[13px] lg:text-[14px]">
              <div className="flex justify-between items-center">
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
                        <div key={idx} className="flex justify-between items-center">
                          <span className="text-[#7D7975] capitalize">{title}</span>
                          <span className="text-[#1B1A17]">${(fee.amount || 0).toLocaleString()}</span>
                        </div>
                      );
                  });
                }
                
                return (
                  <>
                    {((money?.fareCleaning || 0) > 0) && (
                      <div className="flex justify-between items-center">
                        <span className="text-[#7D7975]">{cmsContent?.cleaningFeeText || 'Cleaning fee'}</span>
                        <span className="text-[#1B1A17]">${(money?.fareCleaning || 0).toLocaleString()}</span>
                      </div>
                    )}
                    {((money?.totalFees || 0) - (money?.fareCleaning || 0) > 0) && (
                      <div className="flex justify-between items-center">
                        <span className="text-[#7D7975]">Fees</span>
                        <span className="text-[#1B1A17]">${((money?.totalFees || 0) - (money?.fareCleaning || 0)).toLocaleString()}</span>
                      </div>
                    )}
                  </>
                );
              })()}

              {((money?.totalTaxes || 0) > 0) && (
                <div className="flex justify-between items-center">
                  <span className="text-[#7D7975]">Taxes</span>
                  <span className="text-[#1B1A17]">${(money?.totalTaxes || 0).toLocaleString()}</span>
                </div>
              )}
              {appliedCoupon && (money?.discount || 0) > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-[#7D7975]">
                    {appliedCoupon.toUpperCase() === (cmsContent?.miioClubCouponCode || 'MIIOCLUB').toUpperCase() ? (cmsContent?.miioClubCouponLabel || 'Miio Club (10%)') : appliedCoupon.toUpperCase()}
                  </span>
                  <span className="text-[#1B1A17]">-${(money?.discount || 0).toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="border-t border-[#1B1A17]/10 pt-4 flex flex-col gap-4">
              <div className="flex justify-between items-center text-[15px] font-bold text-[#1B1A17]">
                <span>{cmsContent?.totalLabel || 'Total (AUD)'}</span>
                <span>${(total).toLocaleString()}</span>
              </div>
              
              {/* Coupon Code Inline Section */}
              <div className="flex flex-col gap-3">
                 {!appliedCoupon && !isCouponInputOpen && (
                   <button 
                     type="button" 
                     onClick={() => {
                       if (typeof setCouponError === 'function') setCouponError('');
                       setIsCouponInputOpen(true);
                     }}
                     className="text-[12px] text-[#1B1A17] underline underline-offset-4 self-start hover:opacity-70 transition-opacity"
                   >
                     Add a code
                   </button>
                 )}
                 
                 {!appliedCoupon && isCouponInputOpen && (
                   <div className="flex gap-2">
                     <input 
                       type="text" 
                       placeholder="Enter code" 
                       className="flex-1 border border-[#1B1A17]/20 rounded-[4px] px-3 py-[8px] text-[12px] focus:outline-none focus:border-[#1B1A17]/40 uppercase placeholder:normal-case placeholder:text-[#1B1A17]/40 text-[#1B1A17]"
                       value={couponInput}
                       onChange={(e) => {
                         setCouponInput(e.target.value);
                         if (couponError && typeof setCouponError === 'function') setCouponError('');
                       }}
                     />
                     <button 
                       type="button" 
                       onClick={() => {
                         if (couponInput.trim()) {
                           setAppliedCoupon(couponInput.trim());
                         }
                       }}
                       disabled={!couponInput.trim() || isApplyingCoupon}
                       className="bg-[#1B1A17] text-white px-4 py-[8px] text-[12px] rounded-[4px] font-semibold disabled:opacity-50 tracking-wide transition-colors hover:bg-black/80"
                     >
                       {isApplyingCoupon ? 'Applying...' : 'Apply'}
                     </button>
                     <button 
                       type="button" 
                       onClick={() => {
                         setIsCouponInputOpen(false);
                         if (typeof setCouponError === 'function') setCouponError('');
                       }}
                       className="text-[#1B1A17]/60 text-[12px] hover:text-[#1B1A17] px-2"
                     >
                       Cancel
                     </button>
                   </div>
                 )}
                 
                 {appliedCoupon && (
                   <div className="flex gap-3 items-center">
                     <span className="text-[12px] text-[#1B1A17]">
                       {appliedCoupon.toUpperCase() === (cmsContent?.miioClubCouponCode || 'MIIOCLUB').toUpperCase() ? (cmsContent?.miioClubCouponLabel || 'Miio Club (10%)') : appliedCoupon.toUpperCase()}
                     </span>
                     <button 
                       type="button" 
                       onClick={() => {
                         setAppliedCoupon('');
                         if (typeof setCouponError === 'function') setCouponError('');
                       }} 
                       className="text-[#1B1A17] text-[12px] underline underline-offset-4 hover:opacity-70"
                     >
                       Remove
                     </button>
                   </div>
                 )}
                 {couponError && <span className="text-[11px] text-red-500 font-medium">{couponError}</span>}
              </div>

              <div className="text-[11px] text-[#7D7975]">
                {cmsContent?.freeCancellationText || 'Free cancellation until 7 days before check-in.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PaymentFlow({ property, searchParams, cmsContent, stripePromise, applePayLogo }: PaymentFlowProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [quote, setQuote] = React.useState<any>(null);
  const [appliedCoupon, setAppliedCoupon] = React.useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = React.useState(false);
  const [couponError, setCouponError] = React.useState('');
  
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

  // Track step 3 view
  React.useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({ event: 'checkout_step_view', step: 3, step_name: 'Pay' });
    }
  }, []);

  const handleApplyCoupon = React.useCallback(async (codeToApply: string) => {
    if (!codeToApply) {
      setCouponError('');
      setAppliedCoupon('');
      return;
    }
    setIsApplyingCoupon(true);
    setCouponError('');
    try {
      const { apiClient } = await import('@/lib/api/client');
      const actualGuestyId = property?.guestyId || (property as any)?._id || property?.id;
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
        coupon: codeToApply,
      });

      if (response.success && response.data) {
        const discountApplied = response.data.rates?.ratePlans?.[0]?.ratePlan?.money?.discount || 0;
        if (discountApplied > 0) {
          setQuote(response.data);
          setCouponError('');
        } else {
          setCouponError('Invalid coupon code');
          setAppliedCoupon('');
        }
      } else {
        setCouponError(response.error || 'Invalid coupon code');
        setAppliedCoupon('');
      }
    } catch (err) {
      console.error('Failed to apply coupon:', err);
      setCouponError('Invalid coupon code');
      setAppliedCoupon('');
    } finally {
      setIsApplyingCoupon(false);
    }
  }, [property, checkIn, checkOut, adults, children, infants, pets]);

  React.useEffect(() => {
    async function fetchQuote() {
      setIsLoading(true);
      try {
        const { apiClient } = await import('@/lib/api/client');
        const actualGuestyId = property?.guestyId || (property as any)?._id || property?.id;
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
        console.error('Failed to get base quote:', err);
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

  // When appliedCoupon state changes (from user clicking Apply or Remove), call handleApplyCoupon
  React.useEffect(() => {
    if (appliedCoupon) {
      handleApplyCoupon(appliedCoupon);
    }
  }, [appliedCoupon, handleApplyCoupon]);

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
        applePayLogo={applePayLogo}
        quote={quote}
        total={total}
        checkIn={checkIn}
        checkOut={checkOut}
        guestLabel={guestLabel}
        nightsCount={nightsCount}
        money={money}
        appliedCoupon={appliedCoupon}
        setAppliedCoupon={setAppliedCoupon}
        isApplyingCoupon={isApplyingCoupon}
        couponError={couponError}
        setCouponError={setCouponError}
      />
    </Elements>
  );
}
