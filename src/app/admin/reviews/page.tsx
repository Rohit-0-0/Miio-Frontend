'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { PageContainer } from '@/components/admin/shared/PageContainer';
import { PageHeader } from '@/components/admin/PageHeader';
import { reviewsService, type GuestyReviewListItem } from '@/services/reviews.service';

const PAGE_SIZE = 20;

export default function AdminReviewsPage() {
  const [items, setItems] = useState<GuestyReviewListItem[]>([]);
  const [count, setCount] = useState(0);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [listingFilter, setListingFilter] = useState('');

  const load = useCallback(async (nextSkip = 0, listingId?: string) => {
    setLoading(true);
    try {
      const result = await reviewsService.list({
        limit: PAGE_SIZE,
        skip: nextSkip,
        listingId: listingId || undefined,
      });
      setItems(result.items);
      setCount(result.pagination.count);
      setSkip(result.pagination.skip);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || 'Failed to load Guesty reviews');
      setItems([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(0);
  }, [load]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    load(0, listingFilter.trim() || undefined);
  };

  const handleToggle = async (review: GuestyReviewListItem) => {
    setTogglingId(review.id);
    try {
      await reviewsService.toggleFeatured({
        reviewId: review.id,
        listingId: review.listingId,
        featured: !review.featured,
      });
      setItems((prev) =>
        prev.map((item) =>
          item.id === review.id ? { ...item, featured: !item.featured } : item
        )
      );
      toast.success(review.featured ? 'Removed from homepage' : 'Featured on homepage');
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || 'Failed to update featured state');
    } finally {
      setTogglingId(null);
    }
  };

  const page = Math.floor(skip / PAGE_SIZE) + 1;
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const featuredCount = items.filter((i) => i.featured).length;

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Reviews"
          description="Guesty reviews from all listings. Mark Featured to show on the public homepage. Reviews cannot be edited here."
        />

        <form onSubmit={handleSearch} className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Filter by listing ID (optional)
            </label>
            <input
              value={listingFilter}
              onChange={(e) => setListingFilter(e.target.value)}
              placeholder="Guesty listingId"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm min-w-[260px]"
            />
          </div>
          <button
            type="submit"
            className="bg-[#1B1A17] text-white text-sm px-4 py-2 rounded-lg hover:opacity-90"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => {
              setListingFilter('');
              load(0);
            }}
            className="border border-gray-200 text-sm px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            Clear
          </button>
        </form>

        <div className="text-sm text-gray-500">
          {loading ? 'Loading…' : `${count} review${count === 1 ? '' : 's'} · ${featuredCount} featured on this page`}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Guest</th>
                <th className="px-4 py-3">Review</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Listing</th>
                <th className="px-4 py-3 text-right">Featured</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                    Loading Guesty reviews…
                  </td>
                </tr>
              )}
              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                    No reviews found.
                  </td>
                </tr>
              )}
              {!loading &&
                items.map((review) => (
                  <tr key={review.id} className="border-t border-gray-100 align-top">
                    <td className="px-4 py-4 font-medium text-[#1B1A17] whitespace-nowrap">
                      {review.author}
                      <div className="text-xs text-amber-700 mt-1">
                        {'★'.repeat(Math.min(5, Math.max(0, review.rating)))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-700 max-w-md">
                      <p className="line-clamp-3">{review.quote}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-500 whitespace-nowrap">{review.source}</td>
                    <td className="px-4 py-4 text-gray-500 whitespace-nowrap">{review.date || '—'}</td>
                    <td className="px-4 py-4 text-xs text-gray-400 font-mono break-all max-w-[140px]">
                      {review.listingId || '—'}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        disabled={togglingId === review.id}
                        onClick={() => handleToggle(review)}
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          review.featured
                            ? 'bg-[#C2B991] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        } disabled:opacity-50`}
                      >
                        {togglingId === review.id
                          ? 'Saving…'
                          : review.featured
                            ? 'Featured'
                            : 'Feature'}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            disabled={loading || skip <= 0}
            onClick={() => load(Math.max(0, skip - PAGE_SIZE), listingFilter.trim() || undefined)}
            className="border border-gray-200 text-sm px-4 py-2 rounded-lg disabled:opacity-40 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={loading || skip + PAGE_SIZE >= count}
            onClick={() => load(skip + PAGE_SIZE, listingFilter.trim() || undefined)}
            className="border border-gray-200 text-sm px-4 py-2 rounded-lg disabled:opacity-40 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </PageContainer>
  );
}