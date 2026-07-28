'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export function JournalSearch({ defaultValue = '' }: { defaultValue?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;
    
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    params.delete('page'); // Reset to page 1
    
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-sm" role="search">
      <div className="relative">
        <label htmlFor="search" className="sr-only">Search journal</label>
        <input
          type="text"
          id="search"
          name="search"
          defaultValue={defaultValue}
          placeholder="Search articles..."
          className="w-full rounded-sm border border-gray-200 bg-white px-4 py-2 pl-10 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
        />
        <svg
          className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" x2="16.65" y1="21" y2="16.65" />
        </svg>
      </div>
    </form>
  );
}
