import { apiClient } from '@/lib/api/client';
import { JournalArticle, JournalListResponse, JournalQuery, CreateJournalInput, UpdateJournalInput } from '@/types/journal';
import { ApiResponse } from '@/types/api';

class JournalService {
  private readonly basePath = '/journal';

  async getJournalArticles(query?: JournalQuery): Promise<JournalListResponse> {
    const params = new URLSearchParams();
    
    if (query) {
      if (query.page) params.append('page', query.page.toString());
      if (query.limit) params.append('limit', query.limit.toString());
      if (query.search) params.append('search', query.search);
      if (query.category) params.append('category', query.category);
      if (query.status) params.append('status', query.status);
      if (query.featured !== undefined) params.append('featured', query.featured.toString());
      if (query.author) params.append('author', query.author);
      if (query.sort) params.append('sort', query.sort);
      if (query.order) params.append('order', query.order);
    }

    const queryString = params.toString();
    const endpoint = queryString ? `${this.basePath}?${queryString}` : this.basePath;
    
    return apiClient.get<JournalListResponse>(endpoint);
  }

  async getArticleBySlug(slug: string): Promise<ApiResponse<JournalArticle>> {
    return apiClient.get<ApiResponse<JournalArticle>>(`${this.basePath}/${slug}`);
  }

  async getArticleById(id: string): Promise<ApiResponse<JournalArticle>> {
    return apiClient.get<ApiResponse<JournalArticle>>(`${this.basePath}/id/${id}`);
  }

  async getFeaturedArticles(): Promise<JournalListResponse> {
    return this.getJournalArticles({ featured: true, limit: 3 });
  }

  async createArticle(data: CreateJournalInput): Promise<ApiResponse<JournalArticle>> {
    return apiClient.post<ApiResponse<JournalArticle>>(this.basePath, data);
  }

  async updateArticle(id: string, data: UpdateJournalInput): Promise<ApiResponse<JournalArticle>> {
    return apiClient.put<ApiResponse<JournalArticle>>(`${this.basePath}/${id}`, data);
  }

  async deleteArticle(id: string): Promise<ApiResponse<null>> {
    return apiClient.delete<ApiResponse<null>>(`${this.basePath}/${id}`);
  }
}

export const journalService = new JournalService();
