import Link from 'next/link';
import { AppImage } from '@/components/media/AppImage';
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

  const slugStr = typeof article.slug === 'object' ? (article.slug as any)?.current : article.slug;

  return (
    <article className="group flex flex-col h-full relative">
    <Link 
      href={`${ROUTES.JOURNAL}/${slugStr}`} 
      prefetch={true}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 rounded-sm mb-6"
    >
        <div className="relative w-full aspect-[4/3] md:aspect-[3/2] overflow-hidden rounded-sm bg-gray-100">
          <AppImage
            image={article.coverImage}
            alt={article.coverImage?.alt || article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
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
          <Link href={`${ROUTES.JOURNAL}/${slugStr}`} className="focus-visible:outline-none focus-visible:underline rounded-sm">
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
