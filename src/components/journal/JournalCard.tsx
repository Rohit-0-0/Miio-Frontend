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

  const metaParts = [
    article.author || 'Miio Team',
    publishedDate,
  ].filter(Boolean);

  return (
    <Link 
      href={`${ROUTES.JOURNAL}/${slugStr}`} 
      prefetch={true}
      className="group block no-underline cursor-pointer w-full"
    >
      <div className="relative w-full aspect-[345/460] overflow-hidden bg-[#EAE8E1] mb-3">
        {article.coverImage ? (
          <AppImage
            image={article.coverImage}
            alt={article.coverImage?.alt || article.title}
            fill
            className="object-cover transition-transform duration-[520ms] ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#7D7975]/40">
            <span className="font-serif text-2xl tracking-widest uppercase">MiiO</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-baseline gap-3">
          <h3 className="text-[15px] font-medium text-[#1B1A17] capitalize leading-tight line-clamp-1 min-w-0">
            {article.title}
          </h3>
        </div>
        
        <p className="text-[13px] text-[#7D7975] leading-snug truncate">
          {metaParts.join(' · ')}
        </p>
      </div>
    </Link>
  );
}
