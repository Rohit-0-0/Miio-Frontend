import { journalService } from '@/services/journal.service';
import { JournalQuery, JournalListResponse } from '@/types/journal';
import { normalizeJournalQuery } from '@/lib/utils/search-params';

export async function getJournalListing(
  rawQuery: Record<string, string | string[] | undefined>
): Promise<JournalListResponse> {
  const query: JournalQuery = normalizeJournalQuery(rawQuery);
  
  // Here we can easily add caching strategies later
  // such as Next.js cache() wrapper or custom revalidation tags
  return journalService.getJournalArticles(query);
}
