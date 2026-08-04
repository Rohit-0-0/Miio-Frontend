'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { PaginationMeta } from '@/types/api';

export function Pagination({ pagination }: { pagination: PaginationMeta }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (pagination.totalPages <= 1) return null;

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const pages = Array.from({ length: pagination.totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center space-x-4 mt-16 pb-8" aria-label="Pagination">
      {pagination.hasPreviousPage ? (
        <Link
          href={createPageUrl(pagination.page - 1)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
          aria-label="Previous page"
        >
          <span aria-hidden="true">&larr;</span> Previous
        </Link>
      ) : (
        <span className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 cursor-not-allowed">
          <span aria-hidden="true">&larr;</span> Previous
        </span>
      )}

      <ul className="flex items-center space-x-2 hidden md:flex">
        {pages.map((page) => (
          <li key={page}>
            <Link
              href={createPageUrl(page)}
              className={`w-10 h-10 flex items-center justify-center text-sm transition-all rounded-full ${
                page === pagination.page
                  ? 'bg-gray-900 text-white font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              aria-current={page === pagination.page ? 'page' : undefined}
            >
              {page}
            </Link>
          </li>
        ))}
      </ul>

      {pagination.hasNextPage ? (
        <Link
          href={createPageUrl(pagination.page + 1)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
          aria-label="Next page"
        >
          Next <span aria-hidden="true">&rarr;</span>
        </Link>
      ) : (
        <span className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 cursor-not-allowed">
          Next <span aria-hidden="true">&rarr;</span>
        </span>
      )}
    </nav>
  );
}
