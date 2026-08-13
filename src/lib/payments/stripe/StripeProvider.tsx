import React, { forwardRef, useImperativeHandle } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PaymentToken } from '../types';

const stripePromises = new Map<string, Promise<Stripe | null>>();

const getStripe = (accountId: string | null) => {
  const key = 'default';
  
  if (!stripePromises.has(key)) {
    console.log(`[Payment Verification]\nStripe account context\nGuesty providerAccountId: ${accountId || 'none'}\nStripe account context configured: false\nStripe initialization account context: ${key}`);
    stripePromises.set(key, loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''));
  }
  return stripePromises.get(key)!;
};

export interface StripeProviderRef {
  tokenizePayment: (billingDetails: { name: string; email: string; phone: string }) => Promise<PaymentToken>;
}

const StripeForm = forwardRef<StripeProviderRef, {}>((props, ref) => {
  const stripe = useStripe();
  const elements = useElements();

  useImperativeHandle(ref, () => ({
    tokenizePayment: async (billingDetails) => {
      console.log(`[Payment Verification]\nPaymentElement submit started`);
      
      if (!stripe || !elements) {
        console.log(`[Payment Verification]\nStripe confirmation token creation failed\nerrorCode: initialization_error\nerrorType: initialization_error\nerrorMessage: Stripe is not initialized.`);
        throw new Error('Stripe is not initialized.');
      }

      const { error: submitError } = await elements.submit();
      if (submitError) {
        console.log(`[Payment Verification]\nStripe confirmation token creation failed\nerrorCode: ${submitError.code}\nerrorType: ${submitError.type}\nerrorMessage: ${submitError.message}`);
        throw new Error(submitError.message || 'Unable to process the payment details. Please try again.');
      }
      
      console.log(`[Payment Verification]\nPaymentElement submit succeeded`);
      console.log(`[Payment Verification]\nStripe confirmation token creation started`);

      const { error, confirmationToken } = await stripe.createConfirmationToken({
        elements,
        params: {
          payment_method_data: {
            billing_details: billingDetails,
          }
        }
      });

      if (error) {
        console.log(`[Payment Verification]\nStripe confirmation token creation failed\nerrorCode: ${error.code}\nerrorType: ${error.type}\nerrorMessage: ${error.message}`);
        throw new Error(error.message || 'Unable to process the card details. Please try again.');
      }

      if (!confirmationToken) {
        console.log(`[Payment Verification]\nStripe confirmation token creation failed\nerrorCode: unknown\nerrorType: unknown\nerrorMessage: Failed to create confirmation token.`);
        throw new Error('Failed to create confirmation token.');
      }

      console.log(`[Payment Verification]\nStripe confirmation token creation succeeded\ntokenPresent: true\ntokenPrefix: ${confirmationToken.id.split('_')[0]}_`);

      return {
        provider: 'stripe',
        token: confirmationToken.id,
      };
    },
  }));

  return (
    <div className="p-4 border border-gray-200 rounded-md bg-white">
      <PaymentElement />
    </div>
  );
});
StripeForm.displayName = 'StripeForm';

interface StripeProviderProps {
  providerAccountId: string | null;
  amount: number;
  currency: string;
}

export const StripeProvider = forwardRef<StripeProviderRef, StripeProviderProps>(({ providerAccountId, amount, currency }, ref) => {
  return (
    <Elements 
      stripe={getStripe(providerAccountId)}
      options={{
        mode: 'payment',
        amount: Math.max(1, Math.round(amount * 100)),
        currency: currency.toLowerCase(),
      }}
    >
      <StripeForm ref={ref} />
    </Elements>
  );
});
StripeProvider.displayName = 'StripeProvider';
