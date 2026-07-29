import { BaseEntity, ImageAsset, SeoMetadata } from './common';

export interface AboutData {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: ImageAsset;
    cta: {
      label: string;
      href: string;
    };
  };

  story: {
    title: string;
    content: string;
    image: ImageAsset;
  };

  mission: {
    title: string;
    description: string;
  };

  vision: {
    title: string;
    description: string;
  };

  values: {
    title: string;
    description: string;
    icon: string;
  }[];

  seo: SeoMetadata;
}

export interface AboutDocument extends AboutData, BaseEntity {}
