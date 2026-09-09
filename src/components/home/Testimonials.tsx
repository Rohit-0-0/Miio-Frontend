import React from 'react';
import { TestimonialsSection } from '@/types/homepage';

function sourceLabel(source?: string, location?: string) {
  const raw = (source || location || '').trim();
  if (!raw) return '';
  if (/^from\s+/i.test(raw)) return raw;
  return `from ${raw}`;
}

function authorInitial(author?: string) {
  const letter = (author || 'G').trim().charAt(0).toUpperCase();
  return letter || 'G';
}

export function Testimonials({ testimonials }: { testimonials: TestimonialsSection }) {
  const items = testimonials?.items?.filter((item) => item?.quote) || [];
  if (items.length === 0) return null;

  return (
    <section className="w-full bg-[#E1DBC3] py-14 md:py-[72px]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[188px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {items.map((item, index) => {
            const from = sourceLabel(item.source, item.location);
            const rating = Math.min(5, Math.max(0, Math.round(item.rating || 5)));

            return (
              <article
                key={`${item.author}-${index}`}
                className="bg-[#FEF6EE] rounded-2xl p-7 md:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.06)] flex flex-col justify-between gap-8 min-h-[280px]"
              >
                <div className="flex flex-col gap-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-0.5 text-[#241D19]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`w-3.5 h-3.5 ${i < rating ? 'fill-current' : 'fill-[#241D19]/20'}`}
                          viewBox="0 0 20 20"
                          aria-hidden
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="inline-flex items-center rounded-full bg-[#99583D] text-white text-[11px] font-medium px-3 py-1">
                      Verified stay
                    </span>
                  </div>

                  <blockquote className="font-serif text-[20px] md:text-[22px] text-[#241D19] leading-[1.45]">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                </div>

                <div className="flex items-end justify-between gap-4">
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[14px] font-medium text-[#241D19]">
                      {item.author}
                      {item.date ? `, ${item.date}` : ''}
                    </span>
                    {from ? (
                      <span className="text-[13px] text-[#5F4E44]">{from}</span>
                    ) : null}
                  </div>

                  {item.sourceLogo ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-[#241D19]/10 bg-white">
                      <img
                        src={`/api/sanity/image?id=${(item.sourceLogo as any).asset?._ref || (item.sourceLogo as any).asset?._id || (item.sourceLogo as any).assetId}`}
                        alt={item.source || 'Source'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white text-sm font-medium"
                      style={{ backgroundColor: '#6B4C9A' }}
                      aria-hidden
                    >
                      {authorInitial(item.author)}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}