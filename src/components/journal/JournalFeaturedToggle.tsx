'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export function JournalFeaturedToggle({ isFeatured }: { isFeatured?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleToggle = () => {
    const params = new URLSearchParams(searchParams);
    
    if (!isFeatured) {
      params.set('featured', 'true');
    } else {
      params.delete('featured');
    }
    params.delete('page'); // Reset to page 1
    
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleToggle}
        aria-pressed={!!isFeatured}
        className={`px-3 py-2 text-sm font-medium rounded-sm border focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors ${
          isFeatured 
            ? 'bg-gray-900 text-white border-gray-900' 
            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
        }`}
      >
        Featured Only
      </button>
    </div>
  );
}
