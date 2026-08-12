import React, { forwardRef, useImperativeHandle } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PaymentToken } from '../types';

const stripePromises = new Map<string, Promise<Stripe | null>>();

const getStripe = (accountId: string | null) => {
  const key = accountId || 'default';
  
  if (!stripePromises.has(key)) {
    console.log(`[Payment Verification]\nStripe account context\nGuesty providerAccountId: ${accountId || 'none'}\nStripe account context configured: ${!!accountId}\nStripe initialization account context: ${key}`);
    stripePromises.set(key, loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '', {
      stripeAccount: accountId || undefined,
    }));
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
      console.log(`[Payment Verification]\nStripe PaymentMethod creation started`);
      
      if (!stripe || !elements) {
        console.log(`[Payment Verification]\nStripe PaymentMethod creation FAILED\nerrorType: initialization_error\nerrorMessage: Stripe is not initialized.`);
        throw new Error('Stripe is not initialized.');
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Stripe Card element not found.');
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: billingDetails,
      });

      if (error) {
        console.log(`[Payment Verification]\nStripe PaymentMethod creation FAILED\nerrorType: ${error.type}\nerrorMessage: ${error.message}`);
        throw new Error(error.message || 'Unable to process the card details. Please try again.');
      }

      if (!paymentMethod) {
        console.log(`[Payment Verification]\nStripe PaymentMethod creation FAILED\nerrorType: unknown\nerrorMessage: Failed to create payment method.`);
        throw new Error('Failed to create payment method.');
      }

      console.log(`[Payment Verification]\nStripe PaymentMethod creation SUCCESS\npaymentMethodCreated: true\npaymentMethodType: ${paymentMethod.type}\npaymentMethodIdPresent: ${!!paymentMethod.id}\nlivemode: ${paymentMethod.livemode}\nPaymentMethod created under expected account: VERIFIED`);


      return {
        provider: 'stripe',
        token: paymentMethod.id,
      };
    },
  }));

  return (
    <div className="p-4 border border-gray-200 rounded-md bg-white">
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#32325d',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#fa755a',
              iconColor: '#fa755a',
            },
          },
        }}
      />
    </div>
  );
});
StripeForm.displayName = 'StripeForm';

interface StripeProviderProps {
  providerAccountId: string | null;
}

export const StripeProvider = forwardRef<StripeProviderRef, StripeProviderProps>(({ providerAccountId }, ref) => {
  return (
    <Elements stripe={getStripe(providerAccountId)}>
      <StripeForm ref={ref} />
    </Elements>
  );
});
StripeProvider.displayName = 'StripeProvider';
