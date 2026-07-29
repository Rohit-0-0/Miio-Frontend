export interface BaseEntity {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
}

export * from '@/lib/media/imageTypes';
export interface SeoMetadata {
  title: string;
  description: string;
  keywords: string[];
}
