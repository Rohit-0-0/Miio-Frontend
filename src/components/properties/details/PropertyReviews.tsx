'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PropertyReview } from '@/types/property';
import { propertyService } from '@/services/property.service';

export interface CuratedReviewItem {
  _key?: string;
  reviewId: string;
  quote: string;
  author: string;
  date?: string;
  rating?: number;
  source?: string;
}

interface PropertyReviewsProps {
  propertyId: string;
  curatedReviews?: CuratedReviewItem[];
  rating?: string;
  reviewCount?: string;
  reviewsLink?: {
    text?: string;
    href?: string;
  };
}

interface NormalizedReview {
  id: string;
  text: string;
  author: string;
  dateLabel: string;
  source: string;
  rating: number;
}

function SingleReviewCard({ review }: { review: NormalizedReview }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const textRef = React.useRef<HTMLQuoteElement>(null);

  React.useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const checkOverflow = () => {
      if (!isExpanded) {
        setIsClamped(el.scrollHeight > el.clientHeight + 1);
      }
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [review.text, isExpanded]);

  return (
    <article className="bg-[#E1DBC3]/10 rounded-[10px] px-6 py-8 md:px-8 md:py-8 w-full max-w-[707px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] border border-[#1B1A17]/5">
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex gap-0.5 text-[#241D19]">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : 'fill-[#241D19]/20'}`}
              viewBox="0 0 20 20"
              aria-hidden
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="inline-flex items-center rounded-full bg-[#99583D] text-white text-[11px] font-medium px-3 py-1 font-sans">
          Verified stay
        </span>
      </div>

      <div className="mb-5">
        <blockquote
          ref={textRef}
          className={`font-serif text-[20px] md:text-[22px] text-[#241D19] leading-relaxed transition-all duration-300 ${
            !isExpanded ? 'line-clamp-4' : ''
          }`}
        >
          &ldquo;{review.text}&rdquo;
        </blockquote>
        {(isClamped || isExpanded) && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[14px] font-sans font-medium text-[#99583D] hover:text-[#241D19] transition-colors mt-2 focus:outline-none cursor-pointer"
          >
            {isExpanded ? 'Read less' : 'Read more'}
          </button>
        )}
      </div>

      <div className="text-[14px] leading-[140%]">
        <p className="font-medium text-[#241D19] m-0">
          {review.author}
          {review.dateLabel ? `, ${review.dateLabel}` : ''}
        </p>
        {review.source ? (
          <p className="font-normal text-[#5F4E44] m-0 mt-0.5">
            {/^from\s+/i.test(review.source) ? review.source : `from ${review.source}`}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export function PropertyReviews({
  propertyId,
  curatedReviews,
  rating = '4.97',
  reviewCount = '128 reviews',
  reviewsLink,
}: PropertyReviewsProps) {
  const [liveReviews, setLiveReviews] = useState<PropertyReview[]>([]);
  const [loading, setLoading] = useState(false);

  // If curated reviews are provided from Sanity, use them directly without extra API call
  const hasCurated = Array.isArray(curatedReviews) && curatedReviews.length > 0;

  useEffect(() => {
    if (hasCurated) return;

    let isMounted = true;
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await propertyService.getPropertyReviews(propertyId);
        const fetched = response.data?.results || response.data?.data || [];
        if (isMounted && fetched.length > 0) {
          setLiveReviews(fetched);
        }
      } catch (error) {
        console.error('Failed to load reviews:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchReviews();

    return () => {
      isMounted = false;
    };
  }, [propertyId, hasCurated]);

  if (loading) {
    return (
      <section className="py-2">
        <div className="animate-pulse h-40 bg-[#F7EEE9] rounded-xl max-w-[705px]" />
      </section>
    );
  }

  // Determine list to render
  let displayReviews: NormalizedReview[] = [];

  if (hasCurated) {
    displayReviews = curatedReviews
      .filter((r) => Boolean(r.quote))
      .map((r, idx) => ({
        id: r.reviewId || r._key || String(idx),
        text: r.quote,
        author: r.author || 'Guest',
        dateLabel: r.date
          ? new Date(r.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
          : '',
        source: r.source || 'Airbnb',
        rating: Math.round(r.rating || 5),
      }));
  } else if (liveReviews.length > 0) {
    // If live reviews fallback, display ONLY 1 review (the latest one)
    displayReviews = liveReviews
      .map((r: any, idx: number) => {
        const raw = r.rawReview || {};
        const text = raw.public_review || r.publicReview || '';
        const dateStr = r.createdAt || r.createdAtGuesty;
        return {
          id: r._id || r.id || String(idx),
          text,
          author: r.reviewer?.firstName || 'Guest',
          dateLabel: dateStr
            ? new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            : '',
          source: raw.channel || r.channel || 'Airbnb',
          rating: Math.round(raw.overall_rating || r.overallRating || 5),
        };
      })
      .filter((r) => Boolean(r.text))
      .slice(0, 1);
  }

  const formattedCount = reviewCount.includes('review')
    ? reviewCount
    : `${reviewCount} reviews`;

  const linkText = reviewsLink?.text || 'Read all reviews';
  const linkHref = reviewsLink?.href || 'https://airbnb.com';
  const isExternal = /^https?:\/\//i.test(linkHref);

  return (
    <section className="py-2 font-[family-name:var(--font-instrument-sans)]">
      {/* Section Header as per Figma screenshot */}
      <div className="mb-4">
        <h2 className="font-sans font-medium text-[16px] leading-[130%] text-[#241D19] mb-2">
          Guest reviews
        </h2>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] text-[#241D19]">
          <div className="flex items-center gap-2">
            <span className="font-medium">{rating}</span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className="w-3.5 h-3.5 fill-[#241D19]"
                  viewBox="0 0 20 20"
                  aria-hidden
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-[#5F4E44]">· {formattedCount}</span>
          </div>

          {/* Read all reviews link right after review count */}
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

      <div className="flex flex-col gap-6 max-w-[705px]">
        {displayReviews.map((rev) => (
          <SingleReviewCard key={rev.id} review={rev} />
        ))}
      </div>
    </section>
  );
}