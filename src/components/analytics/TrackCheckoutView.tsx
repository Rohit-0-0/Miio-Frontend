'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';
import * as meta from '@/lib/analytics/meta';

export function TrackCheckoutView({ 
  propertyId, 
  title,
  price,
  currency = 'AUD',
  items,
}: { 
  propertyId: string;
  title: string;
  price: number;
  currency?: string;
  items?: any[];
}) {
  const tracked = useRef(false);

  useEffect(() => {
    // Only track once per component mount (prevents double tracking in StrictMode)
    if (tracked.current) return;
    tracked.current = true;

    // GA4 Event - begin_checkout
    trackEvent('begin_checkout', {
      currency,
      value: price,
      items: items || [{
        item_id: propertyId,
        item_name: title,
        price: price
      }],
    });

    // Meta Pixel Event - InitiateCheckout
    meta.event('InitiateCheckout', {
      content_ids: [propertyId],
      content_name: title,
      content_type: 'product',
      value: price,
      currency,
    });
  }, [propertyId, title, price, currency, items]);

  return null;
}
