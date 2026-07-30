import Link from 'next/link';
import { AppImage } from '@/components/media/AppImage';
import { getPropertyListing } from '@/lib/server/property';
import { normalizePropertyQuery } from '@/lib/utils/search-params';
import { PageHeader } from '@/components/admin/PageHeader';
import { DataTable } from '@/components/admin/DataTable';
import { Pagination } from '@/components/shared/Pagination';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';
import { PageContainer } from '@/components/admin/shared/PageContainer';
import { AdminPropertyActions } from '@/components/admin/property/AdminPropertyActions';
import { LIFECYCLE_STATUS } from '@/types/property';

export default async function AdminPropertyPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const query = normalizePropertyQuery(resolvedParams);

  let response;
  let hasError = false;

  try {
    response = await getPropertyListing(resolvedParams);
  } catch (error) {
    console.error('Failed to load admin property listing:', error);
    hasError = true;
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader 
          title="Properties CMS" 
          description="Manage your properties, sync status, and visibility."
          action={
            <Link
              href="/admin/properties/new"
              className="inline-flex items-center justify-center rounded-sm bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              Create Property
            </Link>
          }
        />

        <div className="bg-white p-4 border border-gray-200 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <form className="flex-grow max-w-sm" method="GET">
            <input 
              name="search" 
              placeholder="Search properties..." 
              defaultValue={query.search || ''}
              className="w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900"
            />
          </form>
          {/* Extended filters can be added here later */}
        </div>

        {hasError || !response ? (
          <div className="bg-white p-8 border border-gray-200 rounded-sm">
            <ErrorState />
          </div>
        ) : response.data.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-sm">
            <EmptyState 
              title="No properties found"
              description="You haven't added any properties yet, or none match your current filters."
            />
          </div>
        ) : (
          <>
            <DataTable 
              data={response.data}
              keyExtractor={(item) => item.id}
              columns={[
                { 
                  key: 'thumbnail', 
                  header: '', 
                  render: (item) => (
                    <div className="w-12 h-12 bg-gray-100 rounded-sm overflow-hidden flex items-center justify-center">
                      {item.coverImageId || (item.gallery && item.gallery.length > 0) ? (
                        <AppImage 
                          image={{ assetId: item.coverImageId || item.gallery?.[0]?.assetId || '' }}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">No img</span>
                      )}
                    </div>
                  )
                },
                { 
                  key: 'title', 
                  header: 'Title', 
                  render: (item) => <span className="font-medium text-gray-900">{item.title}</span> 
                },
                { 
                  key: 'location', 
                  header: 'Location',
                  render: (item) => [item.city, item.country].filter(Boolean).join(', ') || '-'
                },
                { key: 'propertyType', header: 'Type' },
                { 
                  key: 'status', 
                  header: 'Status',
                  render: (item) => (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${item.lifecycleStatus === LIFECYCLE_STATUS.PUBLISHED ? 'bg-green-100 text-green-800' : 
                        item.lifecycleStatus === LIFECYCLE_STATUS.DRAFT ? 'bg-gray-100 text-gray-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {item.lifecycleStatus}
                    </span>
                  )
                },
                { 
                  key: 'featured', 
                  header: 'Featured',
                  render: (item) => item.featured ? <span className="text-blue-600 font-medium">Yes</span> : 'No'
                },
                { 
                  key: 'sync', 
                  header: 'Sync',
                  render: (item) => (
                    <span className="text-xs text-gray-500">
                      {item.sync?.provider && item.sync?.provider !== 'NONE' ? item.sync?.status || 'UNKNOWN' : 'Unlinked'}
                    </span>
                  )
                },
                { 
                  key: 'updatedAt', 
                  header: 'Last Updated',
                  render: (item) => item._updatedAt ? new Date(item._updatedAt).toLocaleDateString() : '-'
                },
                { 
                  key: 'actions', 
                  header: '',
                  render: (item) => <AdminPropertyActions id={item.id} />
                },
              ]}
            />
            <Pagination pagination={response.pagination} />
          </>
        )}
      </div>
    </PageContainer>
  );
}
