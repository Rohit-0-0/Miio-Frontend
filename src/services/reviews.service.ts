import { apiClient } from '@/lib/api/client';

export interface GuestyReviewListItem {
  id: string;
  listingId: string;
  quote: string;
  author: string;
  date: string;
  source: string;
  rating: number;
  createdAt?: string;
  featured: boolean;
}

export interface FeaturedReviewRef {
  reviewId: string;
  listingId: string;
  _key?: string;
}

export const reviewsService = {
  list: async (params?: {
    listingId?: string;
    limit?: number;
    skip?: number;
  }): Promise<{
    items: GuestyReviewListItem[];
    pagination: { count: number; limit: number; skip: number };
  }> => {
    const search = new URLSearchParams();
    if (params?.listingId) search.set('listingId', params.listingId);
    if (params?.limit !== undefined) search.set('limit', String(params.limit));
    if (params?.skip !== undefined) search.set('skip', String(params.skip));
    const qs = search.toString();

    const response = await apiClient.get<{
      success: boolean;
      data: GuestyReviewListItem[];
      pagination: { count: number; limit: number; skip: number };
    }>(`/reviews${qs ? `?${qs}` : ''}`);

    return {
      items: response.data || [],
      pagination: response.pagination || {
        count: response.data?.length || 0,
        limit: params?.limit || 20,
        skip: params?.skip || 0,
      },
    };
  },

  toggleFeatured: async (payload: {
    reviewId: string;
    listingId?: string;
    featured: boolean;
  }): Promise<FeaturedReviewRef[]> => {
    const response = await apiClient.patch<{
      success: boolean;
      data: FeaturedReviewRef[];
    }>('/reviews/featured/toggle', payload);
    return response.data;
  },
};