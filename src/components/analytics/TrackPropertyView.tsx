'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';
import * as meta from '@/lib/analytics/meta';

export function TrackPropertyView({ 
  propertyId, 
  title 
}: { 
  propertyId: string;
  title: string;
}) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    // GA4 Event
    trackEvent('view_item', {
      currency: 'AUD',
      items: [{
        item_id: propertyId,
        item_name: title,
      }],
    });

    // Meta Pixel Event
    meta.event('ViewContent', {
      content_ids: [propertyId],
      content_name: title,
      content_type: 'product',
      currency: 'AUD',
    });
  }, [propertyId, title]);

  return null;
}
