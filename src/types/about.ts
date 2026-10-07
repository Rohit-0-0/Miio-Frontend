import { BaseEntity, ImageAsset, SeoMetadata } from './common';

export interface AboutData {
  hero: {
    title: string;
    subtitle: string;
  };
  intro: {
    label: string;
    body: string;
  };
  story: {
    label: string;
    heading: string;
    paragraphs: string[];
    founderImage: ImageAsset;
  };
  pullQuote: {
    text: string;
  };
  philosophy: {
    label: string;
    heading: string;
    paragraphs: string[];
  };
  closing: {
    body: string;
    cta: {
      text: string;
      href: string;
      style?: string;
    };
  };
  seo: SeoMetadata;
}

export interface AboutDocument extends AboutData, BaseEntity {}
