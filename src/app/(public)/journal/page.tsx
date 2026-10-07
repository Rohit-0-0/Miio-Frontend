import { getJournalListing } from '@/lib/server/journal';
import { JournalListResponse } from '@/types/journal';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { JournalCard } from '@/components/journal/JournalCard';
import { Pagination } from '@/components/shared/Pagination';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { normalizeJournalQuery } from '@/lib/utils/search-params';
import { editorialService } from '@/services/about.service';

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
  let pageData: any;
  let hasError = false;

  try {
    const [listingRes, pageRes] = await Promise.all([
      getJournalListing(resolvedParams),
      editorialService.getJournalPage()
    ]);
    response = listingRes;
    pageData = pageRes.data;
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
    <div className="flex flex-col bg-[#FEF6EE] min-h-screen pt-[48px] pb-24">
      <Container>
        <div className="mb-12 border-b border-[#1B1A17]/10 pb-12 text-left">
          <h1 className="font-serif text-[40px] md:text-[56px] text-[#1B1A17] tracking-tight leading-tight mb-4">
            {pageData?.title || 'Stories & Inspiration'}
          </h1>
          <p className="font-sans text-[15px] md:text-[16px] text-[#5F4E44] w-full font-light leading-[1.6]">
            {pageData?.description || 'Thoughts, stories, travel inspiration, and local experiences from Miio.'}
          </p>
        </div>

        {response.data.length === 0 ? (
          <div className="bg-white rounded-sm border border-gray-100">
            <EmptyState 
              title="No articles found"
              description="We couldn't find any articles at this time."
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
    </div>
  );
}
