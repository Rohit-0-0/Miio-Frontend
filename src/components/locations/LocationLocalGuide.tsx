import React from 'react';
import Link from 'next/link';
import { AppImage } from '@/components/media/AppImage';

export interface LocalGuideItem {
  _key?: string;
  title: string;
  description?: string;
  image?: any;
  href?: string;
}

interface LocationLocalGuideProps {
  heading?: string;
  items?: LocalGuideItem[];
  relatedJournalsCta?: string;
  journalHref?: string;
  showRelatedLink?: boolean;
}

export function LocationLocalGuide({
  heading = 'Local guide',
  items,
  relatedJournalsCta = 'Related journal articles ->',
  journalHref = '/journal',
  showRelatedLink = true,
}: LocationLocalGuideProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="w-full bg-[#E1DBC3] py-14 md:py-[72px]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[188px]">
        <h2 className="font-serif text-[28px] md:text-[32px] text-[#241D19] mb-8 md:mb-10">
          {heading}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {items.map((item, index) => {
            const content = (
              <>
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#D4D0BC]">
                  {item.image ? (
                    <AppImage
                      image={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-[520ms] ease-out group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : null}
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-[#241D19] leading-snug">
                    {item.title}
                  </h3>
                  {item.description ? (
                    <p className="text-[13px] font-normal text-[#5F4E44] leading-snug mt-1">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </>
            );

            if (item.href) {
              return (
                <Link
                  key={item._key || item.href || index}
                  href={item.href}
                  className="group flex flex-col gap-3 no-underline"
                >
                  {content}
                </Link>
              );
            }

            return (
              <article key={item._key || index} className="flex flex-col gap-3">
                {content}
              </article>
            );
          })}
        </div>

        {showRelatedLink && (
          <div className="mt-10 md:mt-12 flex justify-center">
            <Link
              href={journalHref}
              className="text-[13px] text-[#5F4E44] hover:text-[#241D19] transition-colors"
            >
              {relatedJournalsCta}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}