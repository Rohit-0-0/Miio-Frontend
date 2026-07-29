import { BaseEntity, ImageAsset, SeoMetadata } from './common';

export interface HeroSection {
  eyebrow?: string;
  title: string;
  subtitle: string;
  backgroundImage: ImageAsset;
  backgroundAlt?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  overlayOpacity?: number;
  textAlignment?: 'left' | 'center' | 'right';
  heroHeight?: string;
  showScrollIndicator?: boolean;
}

export interface HomepageData {
  hero: HeroSection;
  featuredProperties?: unknown;
  whyMiio?: unknown;
  experiences?: unknown;
  testimonials?: unknown;
  faq?: unknown;
  newsletter?: unknown;
  seo?: SeoMetadata;
}

export interface HomepageDocument extends HomepageData, BaseEntity {}
