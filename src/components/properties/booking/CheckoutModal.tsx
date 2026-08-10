'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { X, CheckCircle } from 'lucide-react';
import { apiClient } from '@/lib/api/client';

// Use environment variable for the Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: any;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

const CheckoutForm = ({ quote, onSuccess, onError, onCancel }: { quote: any, onSuccess: (data: any) => void, onError: (msg: string) => void, onCancel: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const ratePlanId = quote?.rates?.ratePlans?.[0]?.ratePlan?._id;
  const money = quote?.rates?.ratePlans?.[0]?.ratePlan?.money;
  const currency = money?.currency || 'USD';
  const total = money?.subTotalPrice || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !ratePlanId) return;

    if (!firstName || !lastName || !email || !phone) {
      onError("Please fill in all guest details.");
      return;
    }

    setIsProcessing(true);
    onError('');

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Stripe element not found");

      // Generate a PaymentMethod from the card element
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: `${firstName} ${lastName}`,
          email: email,
          phone: phone,
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message || "Your payment could not be processed.");
      }

      // Send to backend
      const response = await apiClient.post<any>('/booking/instant', {
        quoteId: quote._id,
        ratePlanId: ratePlanId,
        paymentToken: paymentMethod.id, // e.g. pm_xxxx
        guest: {
          firstName,
          lastName,
          email,
          phone
        }
      });

      if (response.success && response.data) {
        onSuccess(response.data);
      } else {
        throw new Error(response.error || "Your booking could not be completed. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      onError(err.message || "An unexpected error occurred.");
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
          <div className="border border-gray-300 rounded-md p-3 bg-white">
            <CardElement options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': { color: '#aab7c4' },
                },
                invalid: { color: '#9e2146' },
              },
            }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Your payment details are processed securely by Stripe. We do not store your card information.
          </p>
        </div>

      </div>

      <div className="p-6 border-t border-gray-100 flex gap-4 bg-white sticky bottom-0">
        <button type="button" onClick={onCancel} disabled={isProcessing} className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
          Cancel
        </button>
        <button type="submit" disabled={!stripe || isProcessing} className="flex-[2] py-3 px-4 bg-black text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md">
          {isProcessing ? 'Processing payment...' : `Pay & Book (${currency} ${total})`}
        </button>
      </div>
    </form>
  );
};

export function CheckoutModal({ isOpen, onClose, quote, checkIn, checkOut, adults, children, infants, pets }: CheckoutModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any>(null);

  if (!isOpen) return null;

  const handleSuccess = (data: any) => {
    setSuccessData(data);
  };

  const handleClose = () => {
    setSuccessData(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-serif text-gray-900">
            {successData ? 'Booking Confirmed' : 'Complete your booking'}
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
        {!successData ? (
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-gray-50 text-sm text-gray-700 flex flex-wrap gap-x-6 gap-y-2 border-b border-gray-100">
              <div><span className="font-bold text-gray-900">Dates:</span> {checkIn} to {checkOut}</div>
              <div><span className="font-bold text-gray-900">Guests:</span> {adults} Adults {children > 0 && `, ${children} Children`} {infants > 0 && `, ${infants} Infants`} {pets > 0 && `, ${pets} Pets`}</div>
            </div>
            
            <Elements stripe={stripePromise}>
              <CheckoutForm 
                quote={quote} 
                onSuccess={handleSuccess} 
                onError={setError} 
                onCancel={handleClose} 
              />
            </Elements>
          </div>
        ) : (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-6 flex-1 overflow-y-auto">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <CheckCircle size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">Your reservation is confirmed!</h3>
              <p className="text-gray-600">Your payment has been successfully processed.</p>
            </div>
            <div className="w-full bg-gray-50 p-6 rounded-xl border border-gray-100 text-left space-y-4 max-w-md">
              <div className="flex justify-between border-b border-gray-200 pb-3">
                <span className="text-gray-500 font-medium">Confirmation Code</span>
                <span className="font-bold text-gray-900">{successData.confirmationCode || successData.id || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-3">
                <span className="text-gray-500 font-medium">Dates</span>
                <span className="font-bold text-gray-900">{checkIn} to {checkOut}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-3">
                <span className="text-gray-500 font-medium">Guests</span>
                <span className="font-bold text-gray-900">{adults} Adults {children > 0 && `, ${children} Children`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Total Paid</span>
                <span className="font-bold text-gray-900">{quote?.rates?.ratePlans?.[0]?.ratePlan?.money?.currency || 'USD'} {quote?.rates?.ratePlans?.[0]?.ratePlan?.money?.subTotalPrice || 0}</span>
              </div>
            </div>
            <button onClick={handleClose} className="w-full max-w-md py-4 bg-black text-white font-bold rounded-lg hover:opacity-90 transition-opacity">
              Return to property
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
