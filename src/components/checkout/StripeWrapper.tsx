'use client';

import { loadStripe } from '@stripe/stripe-js';
import { PaymentFlow } from './PaymentFlow';
import { PropertyDetails } from '@/types/property';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeWrapperProps {
  property: PropertyDetails;
  searchParams: { [key: string]: string | string[] | undefined };
  cmsContent?: any;
}

export function StripeWrapper({ property, searchParams, cmsContent }: StripeWrapperProps) {
  return <PaymentFlow property={property} searchParams={searchParams} cmsContent={cmsContent} stripePromise={stripePromise} />;
}
