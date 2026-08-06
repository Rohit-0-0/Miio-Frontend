'use client';

import { useState, useEffect } from 'react';
import { AppImage } from '@/components/media/AppImage';
import { ImageAsset } from '@/types/common';

interface CrossfadeCarouselProps {
  images: ImageAsset[];
  alt?: string;
  intervalMs?: number;
  className?: string;
}

export function CrossfadeCarousel({ 
  images, 
  alt = 'Image', 
  intervalMs = 8000,
  className = ''
}: CrossfadeCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, intervalMs);
    
    return () => clearInterval(interval);
  }, [images, intervalMs]);

  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    // Single image behavior - static, no animations
    return (
      <div className={`relative w-full h-full ${className}`}>
        <AppImage 
          image={images[0]} 
          alt={alt}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  // Multiple images carousel with infinite crossfade animation
  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#1B1A17] ${className}`}>
      {images.map((img, index) => (
        <div 
          key={`${img.assetId || 'carousel-img'}-${index}`}
          className={`absolute inset-0 z-0 transition-opacity duration-[2000ms] ease-in-out ${index === activeIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <AppImage 
            image={img} 
            alt={alt}
            fill
            className="object-cover animate-in fade-in zoom-in-105 duration-[2000ms] ease-out fill-mode-both"
          />
        </div>
      ))}
    </div>
  );
}
