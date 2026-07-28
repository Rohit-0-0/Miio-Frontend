export interface BaseEntity {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
}

export interface ImageAsset {
  assetId: string;
  alt: string;
}

export interface SeoMetadata {
  title: string;
  description: string;
  keywords: string[];
}
