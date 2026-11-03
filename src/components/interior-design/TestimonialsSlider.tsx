'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface TestimonialItem {
  quote?: string;
  author?: string;
  date?: string;
  featuredImage?: string | null;
}

interface TestimonialsSliderProps {
  testimonials: TestimonialItem[];
  eyebrow?: string;
  supportingText?: string;
}

export function TestimonialsSlider({
  testimonials,
  eyebrow = 'DESIGNED BY MIIO. PROVEN THROUGH MIIO.',
  supportingText = 'A Miio-operated stay, designed and styled by our team.',
}: TestimonialsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const validTestimonials = (testimonials || []).filter((t) => Boolean(t?.quote));

  if (validTestimonials.length === 0) return null;

  const current = validTestimonials[currentIndex] || validTestimonials[0];
  const hasMultiple = validTestimonials.length > 1;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? validTestimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === validTestimonials.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) handleNext();
    if (diff < -50) handlePrev();
    setTouchStart(null);
  };

  // Dynamic typography scale based on quote length
  const quoteLen = (current?.quote || '').length;
  const quoteSizeClass =
    quoteLen > 240
      ? 'text-lg sm:text-xl md:text-2xl lg:text-[26px] leading-relaxed md:leading-[1.6]'
      : quoteLen > 130
      ? 'text-xl sm:text-2xl md:text-3xl lg:text-[32px] leading-relaxed md:leading-[1.5]'
      : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-snug';

  const hasImage = Boolean(current?.featuredImage);

  return (
    <section className="w-full bg-[#E8E1DA] py-20 md:py-28 overflow-hidden font-[family-name:var(--font-instrument-sans)]">
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 xl:px-[188px]">
        {/* Header row: Eyebrow + navigation arrows */}
        <div className="mb-10 md:mb-16 flex items-center justify-between">
          <p className="text-xs md:text-sm font-semibold uppercase tracking-widest text-[#241D19]/70">
            {eyebrow}
          </p>
          {hasMultiple && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous testimonial"
                className="w-9 h-9 rounded-full border border-[#241D19]/20 flex items-center justify-center text-[#241D19] hover:bg-[#241D19] hover:text-[#FEF6EE] transition-colors focus:outline-none"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next testimonial"
                className="w-9 h-9 rounded-full border border-[#241D19]/20 flex items-center justify-center text-[#241D19] hover:bg-[#241D19] hover:text-[#FEF6EE] transition-colors focus:outline-none"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Testimonial Card */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="w-full select-none"
        >
          {hasImage ? (
            /* 2-column layout when image is present */
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
              <div className="flex-1 w-full relative aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden bg-[#D3C7B6]/30 shadow-sm">
                <Image
                  src={current.featuredImage!}
                  alt={current.author || 'Testimonial'}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-center text-center lg:text-left py-4">
                <blockquote
                  className={`font-serif ${quoteSizeClass} text-[#241D19] mb-8 max-w-2xl whitespace-pre-line`}
                >
                  &ldquo;{current.quote}&rdquo;
                </blockquote>
                <div>
                  <p className="font-semibold text-[#241D19] text-base mb-1">{current.author}</p>
                  <p className="text-sm text-[#241D19]/70 max-w-md mx-auto lg:mx-0">
                    {supportingText}
                  </p>
                  {current.date && (
                    <p className="text-xs text-[#241D19]/50 mt-1">{current.date}</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Centered single-column layout when NO image is provided */
            <div className="max-w-4xl mx-auto flex flex-col items-center text-center py-6 md:py-10 px-4">
              <blockquote
                className={`font-serif ${quoteSizeClass} text-[#241D19] mb-8 max-w-3xl whitespace-pre-line`}
              >
                &ldquo;{current.quote}&rdquo;
              </blockquote>
              <div className="flex flex-col items-center">
                <p className="font-semibold text-[#241D19] text-base md:text-lg mb-1">
                  {current.author}
                </p>
                <p className="text-sm text-[#241D19]/70 max-w-md mx-auto">{supportingText}</p>
                {current.date && (
                  <p className="text-xs text-[#241D19]/50 mt-1">{current.date}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dot indicators for multiple testimonials */}
        {hasMultiple && (
          <div className="flex justify-center items-center gap-2 mt-8 md:mt-12">
            {validTestimonials.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to testimonial ${idx + 1}`}
                className={`h-2 transition-all rounded-full ${
                  currentIndex === idx
                    ? 'w-8 bg-[#241D19]'
                    : 'w-2 bg-[#241D19]/30 hover:bg-[#241D19]/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

