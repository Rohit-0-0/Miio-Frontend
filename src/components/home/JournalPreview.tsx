import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { JournalSection } from '@/types/homepage';
import { EditorialCard } from '@/components/shared/EditorialCard';
import { SectionHeader } from '@/components/shared/SectionHeader';

// We assume articles are fetched by the parent component and passed in
interface JournalPreviewProps {
  journal: JournalSection;
  articles?: any[]; // Replace with actual Journal article type when available
}

export function JournalPreview({ journal, articles = [] }: JournalPreviewProps) {
  if (!journal) return null;

  return (
    <section className="bg-[#F8F5EF] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 flex flex-col space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <SectionHeader 
            title={journal.heading || 'The Journal'} 
            align="left" 
          />
          
          <div className="hidden md:block pb-2">
            <Link
              href={journal.ctaLink || ROUTES.JOURNAL}
              className="text-sm font-medium tracking-widest uppercase text-[#1B1A17] hover:underline underline-offset-4 decoration-1 transition-all"
            >
              {journal.ctaText || 'View All Articles'} &rarr;
            </Link>
          </div>
        </div>
        
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {articles.slice(0, 3).map((article) => (
              <EditorialCard
                key={article.slug || article.id}
                title={article.title}
                description={article.excerpt || article.summary}
                image={article.coverImage} // Ensure this maps to ImageAsset if available
                link={`/journal/${article.slug}`}
                ctaText="Read Article"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-[#1B1A17]/50 italic">
            No articles available at the moment.
          </div>
        )}

        <div className="md:hidden pt-8 flex justify-center">
          <Link
            href={journal.ctaLink || ROUTES.JOURNAL}
            className="text-sm font-medium tracking-widest uppercase text-[#1B1A17] hover:underline underline-offset-4 decoration-1 transition-all"
          >
            {journal.ctaText || 'View All Articles'} &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
