import Link from 'next/link';
import { getJournalListing } from '@/lib/server/journal';
import { normalizeJournalQuery } from '@/lib/utils/search-params';
import { PageHeader } from '@/components/admin/PageHeader';
import { DataTable } from '@/components/admin/DataTable';
import { Pagination } from '@/components/shared/Pagination';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { JournalSearch } from '@/components/journal/JournalSearch';
import { JournalCategoryFilter } from '@/components/journal/JournalCategoryFilter';
import { JournalFeaturedToggle } from '@/components/journal/JournalFeaturedToggle';
import { AdminJournalActions } from '@/components/admin/AdminJournalActions';

export default async function AdminJournalPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const query = normalizeJournalQuery(resolvedParams);

  let response;
  let hasError = false;

  try {
    response = await getJournalListing(resolvedParams);
  } catch (error) {
    console.error('Failed to load admin journal listing:', error);
    hasError = true;
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Journal CMS" 
        description="Manage your editorial content, stories, and news."
        action={
          <Link
            href="/admin/journal/new"
            className="inline-flex items-center justify-center rounded-sm bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            Create Article
          </Link>
        }
      />

      <div className="bg-white p-4 border border-gray-200 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <JournalSearch defaultValue={query.search} />
        <div className="flex items-center space-x-4">
          <JournalCategoryFilter currentCategory={query.category} />
          <JournalFeaturedToggle isFeatured={query.featured} />
        </div>
      </div>

      {hasError || !response ? (
        <div className="bg-white p-8 border border-gray-200 rounded-sm">
          <ErrorState />
        </div>
      ) : response.data.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-sm">
          <EmptyState 
            title="No articles found"
            description="You haven't created any articles yet, or none match your current filters."
          />
        </div>
      ) : (
        <>
          <DataTable 
            data={response.data}
            keyExtractor={(item) => item._id}
            columns={[
              { 
                key: 'title', 
                header: 'Title', 
                render: (item) => <span className="font-medium text-gray-900">{item.title}</span> 
              },
              { key: 'category', header: 'Category' },
              { 
                key: 'status', 
                header: 'Status',
                render: (item) => (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${item.status === 'published' ? 'bg-green-100 text-green-800' : 
                      item.status === 'draft' ? 'bg-gray-100 text-gray-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {item.status}
                  </span>
                )
              },
              { 
                key: 'featured', 
                header: 'Featured',
                render: (item) => item.featured ? 'Yes' : 'No'
              },
              { 
                key: 'publishedAt', 
                header: 'Published',
                render: (item) => item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : '-'
              },
              { 
                key: 'actions', 
                header: '',
                render: (item) => <AdminJournalActions id={item._id} />
              },
            ]}
          />
          <Pagination pagination={response.pagination} />
        </>
      )}
    </div>
  );
}
