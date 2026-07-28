import { getJournalListing } from '@/lib/server/journal';
import { JournalListResponse } from '@/types/journal';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { JournalCard } from '@/components/journal/JournalCard';
import { JournalSearch } from '@/components/journal/JournalSearch';
import { JournalCategoryFilter } from '@/components/journal/JournalCategoryFilter';
import { JournalSort } from '@/components/journal/JournalSort';
import { JournalFeaturedToggle } from '@/components/journal/JournalFeaturedToggle';
import { Pagination } from '@/components/shared/Pagination';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { normalizeJournalQuery } from '@/lib/utils/search-params';

export const metadata = {
  title: 'Journal',
  description: 'Thoughts, stories, travel inspiration, and local experiences from Miio.',
};

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const query = normalizeJournalQuery(resolvedParams);

  let response: JournalListResponse | undefined;
  let hasError = false;

  try {
    response = await getJournalListing(resolvedParams);
  } catch (error) {
    console.error('Failed to load journal articles:', error);
    hasError = true;
  }

  if (hasError || !response) {
    return (
      <div className="flex flex-col bg-gray-50 flex-1 justify-center items-center py-24">
        <ErrorState />
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gray-50 flex-1">
      <Section className="bg-white border-b border-gray-100 py-16 md:py-24">
        <Container>
          <div className="max-w-3xl">
            <span className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4 block">
              Journal
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Stories & Inspiration
            </h1>
            <p className="text-xl text-gray-600">
              Thoughts, stories, travel inspiration, and local experiences from Miio.
            </p>
          </div>
        </Container>
      </Section>

      <Section className="py-8 md:py-12">
        <Container>
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center justify-between mb-12">
            <JournalSearch defaultValue={query.search} />
            
            <div className="flex flex-wrap items-center gap-4">
              <JournalCategoryFilter currentCategory={query.category} />
              <JournalFeaturedToggle isFeatured={query.featured} />
              <JournalSort currentSort={query.sort} />
            </div>
          </div>

          {response.data.length === 0 ? (
            <div className="bg-white rounded-sm border border-gray-100">
              <EmptyState 
                title="No articles found"
                description="We couldn't find any articles matching your current filters. Try adjusting your search criteria."
              />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                {response.data.map((article) => (
                  <JournalCard key={article._id} article={article} />
                ))}
              </div>
              
              <Pagination pagination={response.pagination} />
            </>
          )}
        </Container>
      </Section>
    </div>
  );
}
