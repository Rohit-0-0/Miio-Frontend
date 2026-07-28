import Link from 'next/link';
import Image from 'next/image';
import { ROUTES } from '@/constants/routes';
import { JournalArticle } from '@/types/journal';

export function JournalCard({ article }: { article: JournalArticle }) {
  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <article className="group flex flex-col h-full relative">
      <Link href={`${ROUTES.JOURNAL}/${article.slug}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 rounded-sm mb-6">
        <div className="relative w-full aspect-[4/3] md:aspect-[3/2] overflow-hidden rounded-sm bg-gray-100">
          {article.coverImage?.assetId ? (
            <Image
              src={`https://cdn.sanity.io/images/placeholder/production/${article.coverImage.assetId}`} // Assuming standard sanity CDN format for placeholder, backend should ideally provide full URL
              alt={article.coverImage.alt || article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-200 w-full h-full flex items-center justify-center text-gray-400 transition-transform duration-500 group-hover:scale-105">
              <span>No Image Available</span>
            </div>
          )}
          
          {article.featured && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-xs font-bold uppercase tracking-wider text-gray-900 rounded-sm shadow-sm">
              Featured
            </div>
          )}
        </div>
      </Link>
      
      <div className="flex flex-col flex-grow">
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
          {article.category && <span>{article.category}</span>}
          {article.category && article.readingTime && <span>&middot;</span>}
          {article.readingTime && <span>{article.readingTime} min read</span>}
        </div>
        
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-3 group-hover:text-gray-600 transition-colors">
          <Link href={`${ROUTES.JOURNAL}/${article.slug}`} className="focus-visible:outline-none focus-visible:underline rounded-sm">
            {article.title}
          </Link>
        </h3>
        
        {article.excerpt && (
          <p className="text-sm text-gray-600 mb-6 flex-grow line-clamp-3">
            {article.excerpt}
          </p>
        )}
        
        <div className="mt-auto flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-4">
          <span className="font-medium">{article.author || 'Miio Team'}</span>
          {publishedDate && <span>{publishedDate}</span>}
        </div>
      </div>
    </article>
  );
}
