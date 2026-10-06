import { sendGAEvent } from '@next/third-parties/google';

/**
 * Reusable analytics utility for Google Analytics 4.
 * Wraps @next/third-parties/google functionality to allow for future
 * expansion (e.g. adding other analytics providers, validating payloads).
 */

export const isAnalyticsEnabled = () => {
  return typeof window !== 'undefined' && Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
};

export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (!isAnalyticsEnabled()) {
    // In development or if GA is not configured, we just log to console
    if (process.env.NODE_ENV !== 'development') {
      console.log(`[Analytics - Track Event] ${eventName}`, params);
    }
    return;
  }

  sendGAEvent('event', eventName, params || {});
};

export const trackPageView = (url: string) => {
  trackEvent('page_view', { page_path: url });
};
