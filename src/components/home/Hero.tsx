'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeroSection } from '@/types/homepage';
import { AppImage } from '@/components/media/AppImage';

export function Hero({ hero }: { hero: HeroSection }) {
  const images = hero?.heroImages?.length ? hero.heroImages : (hero?.backgroundImage ? [hero.backgroundImage] : []);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 8000); // 8 seconds per image
    return () => clearInterval(interval);
  }, [images.length]);

  if (!hero) return null;

  return (
    <section 
      className="relative w-full h-[100svh] flex flex-col justify-end pb-24 md:pb-32 overflow-hidden bg-[#1B1A17]"
      role="banner"
      aria-label={hero.backgroundAlt || hero.title}
    >
      {/* Background Images Carousel */}
      {images.map((img, index) => (
        <div 
          key={img.assetId + index}
          className={`absolute inset-0 z-0 transition-opacity duration-[2000ms] ease-in-out ${index === activeIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <AppImage 
            image={img} 
            alt={hero.backgroundAlt || hero.title}
            fill
            className="object-cover animate-in fade-in zoom-in-105 duration-[2000ms] ease-out fill-mode-both"
          />
        </div>
      ))}

      {/* Gradient Overlay for Text Readability */}
      <div 
        className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10"
        style={{ opacity: hero.overlayOpacity ?? 1 }}
      />

      {/* Content */}
      <div className="relative z-10 w-full px-6 md:px-10 lg:px-16 mx-auto max-w-7xl flex flex-col items-start animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300 fill-mode-both">
        
        {hero.eyebrow && (
          <span className="text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-white/80 mb-6 block">
            {hero.eyebrow}
          </span>
        )}
        
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium tracking-wide text-white leading-[1.1] mb-6 max-w-4xl">
          {hero.title}
        </h1>
        
        <p className="text-lg md:text-xl font-light text-white/90 max-w-2xl leading-relaxed mb-12">
          {hero.subtitle}
        </p>
        
        {/* Search Component (UI Only - Matches Guesty layout) */}
        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md rounded-sm p-2 flex flex-col md:flex-row gap-2">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 bg-white rounded-sm overflow-hidden">
            <div className="px-6 py-4 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Check In</span>
              <span className="text-sm font-medium text-gray-900">Add dates</span>
            </div>
            <div className="px-6 py-4 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Check Out</span>
              <span className="text-sm font-medium text-gray-900">Add dates</span>
            </div>
            <div className="px-6 py-4 flex flex-col justify-center cursor-pointer hover:bg-gray-50 transition-colors">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Guests</span>
              <span className="text-sm font-medium text-gray-900">2 guests</span>
            </div>
          </div>
          <button className="bg-[#1B1A17] text-white px-8 py-4 md:py-0 rounded-sm font-medium tracking-widest uppercase text-sm hover:opacity-90 transition-opacity whitespace-nowrap">
            {hero.primaryCta?.label || 'Explore Stays'}
          </button>
        </div>
      </div>
    </section>
  );
}
