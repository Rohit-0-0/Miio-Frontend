'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { PaymentProviderType, PaymentToken } from '@/lib/payments/types';
import { StripeProvider, StripeProviderRef } from '@/lib/payments/stripe/StripeProvider';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: any;
  listingId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  infants: number;
  pets: number;
  onRefreshQuote?: () => Promise<any>;
}

const CheckoutForm = ({ 
  quote, 
  listingId,
  providerType,
  providerAccountId,
  onSuccess, 
  onError, 
  onCancel, 
  onRefreshQuote 
}: { 
  quote: any, 
  listingId: string,
  providerType: PaymentProviderType,
  providerAccountId: string | null,
  onSuccess: (data: any, isTestMode?: boolean) => void, 
  onError: (msg: string) => void, 
  onCancel: () => void, 
  onRefreshQuote?: () => Promise<any> 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const paymentProviderRef = useRef<StripeProviderRef | null>(null);

  const ratePlanId = quote?.rates?.ratePlans?.[0]?.ratePlan?._id;
  const money = quote?.rates?.ratePlans?.[0]?.ratePlan?.money;
  const currency = money?.currency || 'USD';
  const total = money?.subTotalPrice || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratePlanId) return;

    if (!firstName || !lastName || !email || !phone) {
      onError("Please fill in all guest details.");
      return;
    }

    if (providerType === 'unsupported' || !paymentProviderRef.current) {
      onError("Online payment is not currently supported for this property.");
      return;
    }

    setIsProcessing(true);
    onError('');

    try {
      // 1. Tokenize payment through provider abstraction
      console.log(`[Payment Provider] Tokenization started for ${providerType}`);
      const paymentToken = await paymentProviderRef.current.tokenizePayment({
        name: `${firstName} ${lastName}`,
        email,
        phone
      });
      console.log(`[Payment Verification] Tokenization completed`);

      console.log(`[Payment Verification] Submitting instant-charge booking\n  quoteId: ${quote._id}`);
      
      // 2. Submit to backend instant booking endpoint
      const response = await apiClient.post<any>('/booking/instant-charge', {
        quoteId: quote._id || quote.id,
        listingId,
        ratePlanId,
        confirmationToken: paymentToken.token,
        provider: paymentToken.provider,
        guest: { firstName, lastName, email, phone },
        acceptPolicies: true
      });

      if (response.success) {
        onSuccess(response.data, response.errorCode === 'BOOKING_DISABLED');
      } else {
        throw new Error(response.error || "Payment could not be completed. Please try again.");
      }
      
    } catch (err: any) {
      console.error(err);
      
      // Handle known error codes gracefully
      const errCode = err.errorCode || err.response?.data?.errorCode;
      
      if (errCode === 'QUOTE_EXPIRED' || err.message?.includes('quote has expired')) {
        onError("Your price quote has expired. Refreshing the price...");
        if (onRefreshQuote) {
          const newQuote = await onRefreshQuote();
          if (newQuote) {
            onError("Price updated. Please review the new total before payment.");
          } else {
            onError("This property is no longer available for your selected dates.");
          }
        }
      } else if (errCode === 'PROPERTY_UNAVAILABLE' || errCode === 'RESERVATION_CONFLICT') {
        onError("This property is no longer available for your selected dates.");
      } else if (errCode === 'UNSUPPORTED_PAYMENT_PROVIDER') {
        onError("Online payment is not currently supported for this property.");
      } else if (errCode === 'BOOKING_DISABLED') {
        // We actually want to treat this as a success but show a specific message, 
        // if backend returned success: false but errorCode BOOKING_DISABLED it means tokenized but not sent to Guesty
        onSuccess(null, true); 
      } else {
        onError(err.message || err.response?.data?.error || "An unexpected error occurred.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-8 min-h-0">
        
        {/* Booking Summary Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Summary</h3>
          <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Accommodation</span>
              <span>{currency} {money?.fareAccommodation || 0}</span>
            </div>
            {money?.fareCleaning > 0 && (
              <div className="flex justify-between">
                <span>Cleaning Fee</span>
                <span>{currency} {money.fareCleaning}</span>
              </div>
            )}
            {money?.totalFees > 0 && (
              <div className="flex justify-between">
                <span>Other Fees</span>
                <span>{currency} {money.totalFees}</span>
              </div>
            )}
            {money?.totalTaxes > 0 && (
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>{currency} {money.totalTaxes}</span>
              </div>
            )}
            <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between font-bold text-gray-900 text-base">
              <span>Total</span>
              <span>{currency} {total}</span>
            </div>
          </div>
        </div>

        {/* Guest Details Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">First Name</label>
              <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required disabled={isProcessing} className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-black outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Last Name</label>
              <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required disabled={isProcessing} className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-black outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={isProcessing} className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-black outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Phone</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required disabled={isProcessing} className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-1 focus:ring-black outline-none" />
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment</h3>
          
          {providerType === 'stripe' && (
            <StripeProvider 
              ref={paymentProviderRef as any} 
              providerAccountId={providerAccountId}
              amount={total}
              currency={currency}
            />
          )}
          
          {providerType === 'unsupported' && (
            <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-100 text-sm">
              Online payment is not currently supported for this property.
            </div>
          )}

          <p className="text-xs text-gray-500 mt-2">
            Your payment details are processed securely. We do not store your card information.
          </p>
        </div>

      </div>

      <div className="p-6 border-t border-gray-100 flex gap-4 bg-white sticky bottom-0">
        <button type="button" onClick={onCancel} disabled={isProcessing} className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
          Cancel
        </button>
        <button type="submit" disabled={isProcessing || providerType === 'unsupported'} className="flex-[2] py-3 px-4 bg-black text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md">
          {isProcessing ? 'Processing payment...' : `Pay & Book (${currency} ${total})`}
        </button>
      </div>
    </form>
  );
};

export function CheckoutModal({ isOpen, onClose, quote, listingId, checkIn, checkOut, adults, children, infants, pets, onRefreshQuote }: CheckoutModalProps) {
  console.log(`[Payment Verification]\nCheckoutModal module loaded`);
  console.log(`[Payment Verification]\nCheckoutModal component rendered`);

  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any>(null);
  const [isTestMode, setIsTestMode] = useState(false);

  const [providerType, setProviderType] = useState<PaymentProviderType | 'loading'>('loading');
  const [providerAccountId, setProviderAccountId] = useState<string | null>(null);

  console.log(`[Payment Verification]\nCheckout state\n{\n  isOpen: ${isOpen},\n  hasQuote: ${!!quote},\n  quoteId: ${quote?._id},\n  listingId: ${listingId},\n  providerType: ${providerType},\n  providerAccountId: ${providerAccountId},\n  error: ${error}\n}`);

  useEffect(() => {
    console.log(`[Payment Verification]\nCheckoutModal initialization effect started`);
    if (isOpen) {
      console.log(`[Payment Verification]\nListing ID check\nlistingId: ${listingId}\nlistingIdPresent: ${!!listingId}`);
      if (!listingId) {
        console.log(`[Payment Verification]\nPAYMENT_PROVIDER_BLOCKED_MISSING_LISTING_ID`);
        return;
      }
      setProviderType('loading');
      setError(null);
      console.log(`[Payment Verification]\nCheckout initialized\nListing ID: ${listingId}`);
      
      console.log(`[Payment Verification]\nPayment provider request starting\nlistingIdPresent: true`);
      apiClient.get<any>(`/booking/payment-provider/${listingId}`)
        .then(res => {
          console.log(`[Payment Verification]\nPayment provider response received\nsuccess: ${res.success}\nproviderType: ${res.provider}\nproviderAccountIdPresent: ${!!res.accountId}`);
          if (res.success && res.provider) {
            console.log(`[Payment Verification]\nGuesty payment provider response received\nlistingId: ${listingId}\nproviderType: ${res.provider}\nproviderAccountIdPresent: ${!!res.accountId}\nproviderStatus: ACTIVE`);
            setProviderType(res.provider);
            setProviderAccountId(res.accountId);
          } else {
            console.log(`[Payment Verification]\nGuesty payment provider response received\nlistingId: ${listingId}\nproviderType: unsupported\nproviderStatus: INACTIVE`);
            setProviderType('unsupported');
            setError("Online payment is not currently supported for this property.");
          }
        })
        .catch(err => {
          console.error(`[Payment Verification]\nPayment provider request FAILED\nstatus: ${err.response?.status}\nerror: ${err.message}`);
          console.error(`[Payment Verification] Checkout initialization FAILED`, err);
          setProviderType('unsupported');
          setError("Failed to verify payment provider.");
        });
    }
  }, [isOpen, listingId]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!isOpen || !mounted) return null;

  const handleSuccess = (data: any, testMode: boolean = false) => {
    setSuccessData(data);
    setIsTestMode(testMode);
  };

  const handleClose = () => {
    setSuccessData(null);
    setIsTestMode(false);
    setError(null);
    onClose();
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm md:p-4">
      <div className="bg-white md:rounded-2xl shadow-2xl w-full h-full md:h-auto md:max-h-[90vh] max-w-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-serif text-gray-900">
            {successData || isTestMode ? (isTestMode ? 'Payment Setup Completed' : 'Booking confirmed') : 'Complete your booking'}
          </h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-6 px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Content */}
        {(!successData && !isTestMode) ? (
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-gray-50 text-sm text-gray-700 flex flex-wrap gap-x-6 gap-y-2 border-b border-gray-100">
              <div><span className="font-bold text-gray-900">Dates:</span> {checkIn} to {checkOut}</div>
              <div><span className="font-bold text-gray-900">Guests:</span> {adults} Adults {children > 0 && `, ${children} Children`} {infants > 0 && `, ${infants} Infants`} {pets > 0 && `, ${pets} Pets`}</div>
            </div>
            
            {providerType === 'loading' ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-gray-500">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin mr-3 mb-4"></div>
                <p>Initializing secure checkout...</p>
              </div>
            ) : (
              <CheckoutForm 
                quote={quote} 
                listingId={listingId}
                providerType={providerType as PaymentProviderType}
                providerAccountId={providerAccountId}
                onSuccess={handleSuccess} 
                onError={setError} 
                onCancel={handleClose} 
                onRefreshQuote={onRefreshQuote}
              />
            )}
          </div>
        ) : (
          <div className="p-8 flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            
            {isTestMode ? (
              <div className="space-y-2">
                <h3 className="text-2xl font-serif text-gray-900">Payment Setup Completed</h3>
                <p className="text-gray-600 max-w-sm mx-auto">
                  Payment setup completed, but booking confirmation is currently disabled while Guesty Sandbox payment configuration is being completed.
                </p>
              </div>
            ) : (
              <div className="space-y-4 w-full">
                <h3 className="text-2xl font-serif text-gray-900">Your reservation is confirmed!</h3>
                <div className="bg-gray-50 p-6 rounded-xl text-sm text-gray-700 space-y-3 text-left w-full max-w-md mx-auto">
                  {successData?.confirmationCode && (
                    <div className="flex justify-between border-b border-gray-200 pb-3">
                      <span className="font-bold">Confirmation Code</span>
                      <span className="font-mono bg-white px-2 py-1 rounded border border-gray-200">{successData.confirmationCode}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2">
                    <span className="font-bold">Dates</span>
                    <span>{checkIn} to {checkOut}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">Guests</span>
                    <span>{adults} Adults {children > 0 ? `, ${children} Children` : ''}</span>
                  </div>
                  <div className="flex justify-between pt-3 mt-3 border-t border-gray-200">
                    <span className="font-bold">Total Paid</span>
                    <span className="font-bold">{quote?.rates?.ratePlans?.[0]?.ratePlan?.money?.currency} {quote?.rates?.ratePlans?.[0]?.ratePlan?.money?.subTotalPrice}</span>
                  </div>
                </div>
              </div>
            )}
            
            <button 
              onClick={handleClose}
              className="px-8 py-3 bg-black text-white font-bold rounded-lg hover:opacity-90 transition-opacity mt-4"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
