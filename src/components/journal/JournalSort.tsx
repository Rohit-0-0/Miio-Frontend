'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export function JournalSort({ currentSort }: { currentSort?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sort = e.target.value;
    const params = new URLSearchParams(searchParams);
    
    if (sort) {
      params.set('sort', sort);
      // Default order to desc when sort is selected, this can be refined later if needed
      params.set('order', 'desc');
    } else {
      params.delete('sort');
      params.delete('order');
    }
    params.delete('page'); // Reset to page 1
    
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="sort" className="text-sm font-medium text-gray-600">Sort by:</label>
      <select
        id="sort"
        value={currentSort || ''}
        onChange={handleSortChange}
        className="rounded-sm border border-gray-200 bg-white px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
      >
        <option value="">Default</option>
        <option value="publishedAt">Newest</option>
        <option value="title">Title A-Z</option>
      </select>
    </div>
  );
}
