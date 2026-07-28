'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const CATEGORIES = ['Travel', 'Design', 'Culture', 'Food', 'Wellness'];

export function JournalCategoryFilter({ currentCategory }: { currentCategory?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    const params = new URLSearchParams(searchParams);
    
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    params.delete('page'); // Reset to page 1
    
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="category" className="text-sm font-medium text-gray-600">Category:</label>
      <select
        id="category"
        value={currentCategory || ''}
        onChange={handleCategoryChange}
        className="rounded-sm border border-gray-200 bg-white px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
      >
        <option value="">All</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  );
}
