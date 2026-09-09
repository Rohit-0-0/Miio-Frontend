'use client';

import React, { useEffect, useState } from 'react';
import { PropertyReview } from '@/types/property';
import { propertyService } from '@/services/property.service';

interface PropertyReviewsProps {
  propertyId: string;
}

export function PropertyReviews({ propertyId }: PropertyReviewsProps) {
  const [reviews, setReviews] = useState<PropertyReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await propertyService.getPropertyReviews(propertyId);
        const fetchedReviews = response.data?.results || response.data?.data || [];
        if (fetchedReviews.length > 0) {
          setReviews(fetchedReviews);
        }
      } catch (error) {
        console.error('Failed to load reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [propertyId]);

  if (loading) {
    return (
      <section className="py-2">
        <div className="animate-pulse h-40 bg-[#F7EEE9] rounded-xl" />
      </section>
    );
  }

  if (reviews.length === 0) return null;

  const review: any = reviews[0];
  const raw = review.rawReview || {};
  const rating = Math.round(raw.overall_rating || review.overallRating || 5);
  const text = raw.public_review || review.publicReview;
  const firstName = review.reviewer?.firstName || 'Guest';
  const dateStr = review.createdAt || review.createdAtGuesty;
  const source = raw.channel || review.channel || 'Airbnb';

  if (!text) return null;

  const dateLabel = dateStr
    ? new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '';

  return (
    <section className="py-2 font-[family-name:var(--font-instrument-sans)]">
      <div className="bg-[#F7EEE9] rounded-xl px-6 py-8 md:px-8 md:py-8 max-w-[705px]">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="flex gap-0.5 text-[#241D19]">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-3.5 h-3.5 ${i < rating ? 'fill-current' : 'fill-[#241D19]/20'}`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="inline-flex items-center rounded-full bg-[#99583D] text-white text-[11px] font-medium px-3 py-1">
            Verified stay
          </span>
        </div>

        <blockquote className="font-serif text-[20px] md:text-[22px] text-[#241D19] leading-relaxed mb-5">
          &ldquo;{text}&rdquo;
        </blockquote>

        <div className="text-[14px] leading-[140%]">
          <p className="font-medium text-[#241D19] m-0">
            {firstName}
            {dateLabel ? `, ${dateLabel}` : ''}
          </p>
          {source ? <p className="font-normal text-[#5F4E44] m-0 mt-0.5">from {source}</p> : null}
        </div>
      </div>
    </section>
  );
}