import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

interface JournalCardProps {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
}

export function JournalCard({ slug, category, title, excerpt }: JournalCardProps) {
  return (
    <div className="group flex flex-col h-full">
    <Link 
      href={`${ROUTES.JOURNAL}/${slug}`} 
      prefetch={true}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 rounded-sm mb-6"
    >
        <div className="relative w-full aspect-[4/3] md:aspect-[3/2] overflow-hidden rounded-sm bg-gray-100">
          <div className="absolute inset-0 bg-gray-200 w-full h-full flex items-center justify-center text-gray-400 transition-transform duration-500 group-hover:scale-105">
            <span>Placeholder Image</span>
          </div>
        </div>
      </Link>
      
      <div className="flex flex-col flex-grow">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
          {category}
        </span>
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-3 group-hover:text-gray-600 transition-colors">
          <Link href={`${ROUTES.JOURNAL}/${slug}`} className="focus-visible:outline-none focus-visible:underline rounded-sm">
            {title}
          </Link>
        </h3>
        <p className="text-sm text-gray-600 mb-6 flex-grow line-clamp-3">
          {excerpt}
        </p>
        
        <div className="mt-auto">
          <Link
            href={`${ROUTES.JOURNAL}/${slug}`}
            className="inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors focus-visible:outline-none focus-visible:underline rounded-sm"
          >
            Read More
            <span className="ml-2" aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
