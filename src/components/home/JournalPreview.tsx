import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { JournalSection } from '@/types/homepage';
import { AppImage } from '@/components/media/AppImage';
import { HOME_DEFAULTS } from '@/lib/defaults/home';

// We assume articles are fetched by the parent component and passed in
interface JournalPreviewProps {
  journal: JournalSection;
  articles?: any[]; // Replace with actual Journal article type when available
}

export function JournalPreview({ journal, articles = [] }: JournalPreviewProps) {
  const heading = journal?.heading || HOME_DEFAULTS.journal.heading;

  return (
    <section className="bg-[#FEF6EE] py-[65px]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[188px] flex flex-col space-y-[32px]">
        <h2 className="text-[24px] font-serif font-bold text-[#241D19] text-left">
          {heading}
        </h2>
        
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[32px]">
            {articles.slice(0, 3).map((article) => {
              const slugStr = typeof article.slug === 'object' ? article.slug?.current : article.slug;
              const key = slugStr || article._id || article.id || Math.random().toString();
              return (
                <Link 
                  key={key}
                  href={`/journal/${slugStr}`}
                  className="group flex flex-col space-y-[12px] cursor-pointer"
                >
                  <div className="relative w-full aspect-[345/259] overflow-hidden bg-gray-100 mb-1">
                    {article.coverImage ? (
                      <AppImage
                        image={article.coverImage}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-[520ms] ease-out group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#F8F5EF] text-[#1B1A17]/20">
                        <span className="font-serif text-2xl tracking-widest uppercase">MiiO</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1">
                    <h3 className="text-[15px] font-serif text-[#1B1A17]">{article.title}</h3>
                    {/* Assuming the tag/category is mapped to article.category or similar, we fallback to a placeholder if not present */}
                    <p className="font-sans text-[13px] font-light text-[#7D7975] leading-relaxed">
                      {article.category?.name || article.category?.title || 'Journal entry'}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-[#1B1A17]/50 italic">
            No articles available at the moment.
          </div>
        )}
      </div>
    </section>
  );
}
