import React from 'react';

interface TrustSignalsProps {
  reviewCount?: number;
  rating?: number;
}

export function TrustSignals({ reviewCount, rating }: TrustSignalsProps) {
  // If review data is unavailable, gracefully hide the section as per PRD
  if (!reviewCount || !rating || reviewCount === 0) return null;

  return (
    <section className="mb-12 pt-12 border-t border-gray-100 flex items-center space-x-6">
      <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg min-w-[150px]">
         <div className="text-4xl font-bold text-gray-900 mb-1">{rating.toFixed(2)}</div>
         <div className="flex text-yellow-400 text-lg">
           ★ ★ ★ ★ ★
         </div>
      </div>
      <div className="flex flex-col">
        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-1">Verified Stay</h3>
        <p className="text-gray-600">Based on {reviewCount} guest reviews</p>
      </div>
    </section>
  );
}
