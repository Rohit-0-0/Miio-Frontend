import { ImageAsset } from './common';

export interface GeneralSettings {
  heading: string;
  introText: string;
}

export interface FilterConfiguration {
  showLocationFilter: boolean;
  showGuestsFilter: boolean;
  showPriceFilter: boolean;
  enableMapButton: boolean;
  defaultSort: 'newest' | 'price_asc' | 'price_desc' | 'recommended';
}

export interface EmptyStateSettings {
  heading: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  image?: ImageAsset;
}

export interface SeoSettings {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: ImageAsset;
  metaRobots?: string;
}

export interface StaysPageData {
  version: number;
  general: GeneralSettings;
  filters: FilterConfiguration;
  emptyState: EmptyStateSettings;
  seo?: SeoSettings;
}
