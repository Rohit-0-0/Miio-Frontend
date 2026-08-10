import { journalService } from '@/services/journal.service';
import { JournalQuery, JournalListResponse } from '@/types/journal';
import { normalizeJournalQuery } from '@/lib/utils/search-params';

export async function getJournalListing(
  rawQuery: Record<string, string | string[] | undefined>,
  options?: RequestInit
): Promise<JournalListResponse> {
  const query: JournalQuery = normalizeJournalQuery(rawQuery);
  
  return journalService.getJournalArticles(query, options);
}
