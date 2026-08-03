"use client";

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

export function TrackAboutView() {
  useEffect(() => {
    trackEvent('about_page_view');
  }, []);

  return null;
}
