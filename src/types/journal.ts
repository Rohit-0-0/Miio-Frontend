import { BaseEntity, ImageAsset, SeoMetadata } from './common';
import { PaginatedResponse } from '@/types/api';

export type JournalStatus = 'draft' | 'published' | 'archived';

export interface JournalArticle extends BaseEntity {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: ImageAsset;
  author?: string;
  category?: string;
  tags?: string[];
  status: JournalStatus;
  featured?: boolean;
  publishedAt?: string;
  readingTime?: number;
  seo?: SeoMetadata;
}

export interface JournalQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: JournalStatus;
  featured?: boolean;
  author?: string;
  sort?: 'publishedAt' | 'createdAt' | 'updatedAt' | 'title';
  order?: 'asc' | 'desc';
}

export type JournalListResponse = PaginatedResponse<JournalArticle>;
