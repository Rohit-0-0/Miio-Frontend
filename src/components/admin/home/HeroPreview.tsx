'use client';
import React from 'react';
import { HeroSection } from '@/types/homepage';

export function HeroPreview({ hero }: { hero: Partial<HeroSection> }) {
  if (!hero) return null;
  return (
    <div
      className="relative w-full h-64 bg-gray-200 flex flex-col items-center justify-center text-center overflow-hidden"
      style={{
        backgroundImage: hero.backgroundImage?.assetId ? `url(${hero.backgroundImage.assetId})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div 
        className="absolute inset-0 bg-black" 
        style={{ opacity: hero.overlayOpacity ?? 0 }} 
      />
      <div className="relative z-10 p-6 flex flex-col items-center">
        {hero.eyebrow && <p className="text-sm uppercase mb-2 text-white/80">{hero.eyebrow}</p>}
        <h1 
          className="text-2xl font-bold mb-1 text-white" 
          style={{ textAlign: hero.textAlignment ?? 'center' }}
        >
          {hero.title}
        </h1>
        <p 
          className="mb-4 text-white/90" 
          style={{ textAlign: hero.textAlignment ?? 'center' }}
        >
          {hero.subtitle}
        </p>
        <div className="flex gap-3">
          {hero.primaryCta && (
            <span className="px-4 py-2 bg-white text-black font-semibold rounded cursor-pointer">
              {hero.primaryCta.label || 'Primary CTA'}
            </span>
          )}
          {hero.secondaryCta?.label && (
            <span className="px-4 py-2 border border-white text-white font-semibold rounded cursor-pointer">
              {hero.secondaryCta.label}
            </span>
          )}
        </div>
      </div>
      {hero.showScrollIndicator && (
        <div className="absolute bottom-2 text-white animate-bounce z-10">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      )}
    </div>
  );
}
