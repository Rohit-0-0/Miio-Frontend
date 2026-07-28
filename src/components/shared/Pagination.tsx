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
    <nav className="flex items-center justify-center space-x-2 mt-12" aria-label="Pagination">
      {pagination.hasPreviousPage ? (
        <Link
          href={createPageUrl(pagination.page - 1)}
          className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 rounded-sm"
          aria-label="Previous page"
        >
          Previous
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
          Previous
        </span>
      )}

      <ul className="flex items-center space-x-1 hidden sm:flex">
        {pages.map((page) => (
          <li key={page}>
            <Link
              href={createPageUrl(page)}
              className={`px-3 py-2 text-sm font-medium rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 ${
                page === pagination.page
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50'
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
          className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 rounded-sm"
          aria-label="Next page"
        >
          Next
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
          Next
        </span>
      )}
    </nav>
  );
}
