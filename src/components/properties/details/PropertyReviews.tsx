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
      <section className="py-16 md:py-24 border-t border-gray-100">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-24 bg-gray-100 rounded w-full"></div>
          <div className="h-24 bg-gray-100 rounded w-full"></div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <section className="py-16 md:py-24 border-t border-gray-100">
      <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-12 tracking-tight">
        Guest Experiences
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {reviews.slice(0, 6).map((review: any) => {
          const raw = review.rawReview || {};
          const rating = raw.overall_rating || review.overallRating || 5;
          const text = raw.public_review || review.publicReview;
          const firstName = review.reviewer?.firstName || 'Guest';
          const pic = review.reviewer?.pictureUrl;
          const dateStr = review.createdAt || review.createdAtGuesty;
          
          if (!text) return null;

          return (
            <div key={review._id || review.createdAt} className="flex flex-col space-y-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
                  {pic ? (
                    <img src={pic} alt={firstName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-300 text-gray-600 font-medium text-lg">
                      {firstName[0]}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{firstName}</h4>
                  <p className="text-sm text-gray-500">
                    {dateStr ? new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-1 text-gray-900">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className={`w-4 h-4 ${i < rating ? 'fill-current' : 'fill-gray-300'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              <p className="text-gray-600 leading-relaxed text-sm">
                "{text}"
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
