import React from 'react';

export default function CheckoutLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Skeleton Header */}
      <header className="w-full bg-[#FEF6EE] pt-8 pb-4">
        <div className="flex justify-center mb-6">
          <div className="w-[120px] h-[32px] animate-shimmer rounded bg-[#EAE8E1]" />
        </div>
        <div className="border-t border-[#1B1A17]/10">
          <div className="max-w-[1440px] mx-auto px-4 md:px-[188px] flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 py-4">
            <div className="w-48 h-4 animate-shimmer rounded bg-[#EAE8E1]" />
            <div className="w-64 h-4 animate-shimmer rounded bg-[#EAE8E1]" />
          </div>
        </div>
      </header>

      {/* Skeleton Main Content */}
      <main className="flex-1 bg-[#FEF6EE]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-[188px] pt-12 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 md:gap-24">
            {/* Left Column Skeleton */}
            <div className="flex flex-col gap-12 order-2 lg:order-1">
              <div className="w-64 h-8 animate-shimmer rounded bg-[#EAE8E1]" />
              <div className="w-full h-[400px] animate-shimmer rounded bg-[#EAE8E1]" />
            </div>
            
            {/* Right Column (Summary Card) Skeleton */}
            <div className="order-1 lg:order-2">
              <div className="w-full h-[600px] animate-shimmer rounded bg-[#EAE8E1]" />
            </div>
          </div>
        </div>
      </main>
      
      {/* Skeleton Footer */}
      <footer className="w-full bg-[#1B1A17] text-white py-8">
        <div className="max-w-[1440px] mx-auto px-4 md:px-[188px] flex flex-col md:flex-row justify-between items-center h-4">
          <div className="w-64 h-4 bg-white/20 animate-shimmer rounded" />
          <div className="w-48 h-4 bg-white/20 animate-shimmer rounded mt-4 md:mt-0" />
        </div>
      </footer>
    </div>
  );
}
