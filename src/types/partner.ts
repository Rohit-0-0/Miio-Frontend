import { BaseEntity, ImageAsset } from './common';

export interface PartnerData {
  title: string;
  subtitle: string;
  partners: {
    name: string;
    logo: ImageAsset;
    url?: string;
  }[];
}

export interface PartnerDocument extends PartnerData, BaseEntity {}
