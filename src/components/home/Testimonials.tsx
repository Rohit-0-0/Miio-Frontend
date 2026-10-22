'use client';

import React, { useState } from 'react';

import Link from 'next/link';
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

function TestimonialCard({ item }: { item: any }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const textRef = React.useRef<HTMLQuoteElement>(null);
  
  const from = sourceLabel(item.source, item.location);
  const rating = Math.min(5, Math.max(0, Math.round(item.rating || 5)));

  React.useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;
    // Check if the content is actually overflowing the 4-line clamped height
    const checkOverflow = () => {
      if (!isExpanded) {
        setIsClamped(el.scrollHeight > el.clientHeight + 4);
      }
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [item.quote, isExpanded]);

  return (
    <article className="bg-[#FEF6EE] rounded-[10px] p-8 shadow-[0_4px_4px_rgba(0,0,0,0.25)] flex flex-col justify-between gap-4 h-full min-h-[262px] max-w-[520px]">
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
          <span className="font-sans inline-flex items-center rounded-full bg-[#99583D] text-white text-[11px] font-medium px-3 py-1">
            Verified stay
          </span>
        </div>

        <div className="flex flex-col gap-2 items-start">
          <blockquote 
            ref={textRef}
            className={`font-serif text-[20px] md:text-[22px] text-[#241D19] leading-[1.45] transition-all duration-300 ${!isExpanded ? 'line-clamp-4' : ''}`}
          >
            &ldquo;{item.quote}&rdquo;
          </blockquote>
          {(isClamped || isExpanded) && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)} 
              className="font-sans text-[13px] font-normal text-[#5F4E44] hover:text-[#1B1A17] hover:opacity-70 transition-all mt-1 focus:outline-none cursor-pointer"
            >
              {isExpanded ? 'Read less' : 'Read more'}
            </button>
          )}
        </div>
      </div>

      <div className="flex items-end justify-between gap-4 mt-auto">
        <div className="font-sans flex flex-col gap-0.5 min-w-0">
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
}

export function Testimonials({ 
  testimonials,
  reviewsLink
}: { 
  testimonials: TestimonialsSection;
  reviewsLink?: { text?: string; href?: string };
}) {
  const items = testimonials?.items?.filter((item) => item?.quote) || [];
  if (items.length === 0) return null;

  const linkText = reviewsLink?.text || 'Read all reviews';
  const linkHref = reviewsLink?.href || 'https://airbnb.com';
  const isExternal = /^https?:\/\//i.test(linkHref);

  return (
    <section className="w-full bg-[#E1DBC3] py-14 md:py-[72px]">
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 xl:px-[188px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 items-start">
          {items.map((item, index) => (
            <TestimonialCard key={`${item.author}-${index}`} item={item} />
          ))}
        </div>

        {/* Read all reviews link below the review cards */}
        <div className="mt-6 flex justify-end">
          {isExternal ? (
            <a
              href={linkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-[family-name:var(--font-instrument-sans)] text-[14px] font-normal leading-[140%] text-[#5F4E44] hover:text-[#241D19] transition-colors"
            >
              <span>{linkText}</span>
              <span aria-hidden="true">&rarr;</span>
            </a>
          ) : (
            <Link
              href={linkHref}
              className="inline-flex items-center gap-1.5 font-[family-name:var(--font-instrument-sans)] text-[14px] font-normal leading-[140%] text-[#5F4E44] hover:text-[#241D19] transition-colors"
            >
              <span>{linkText}</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}