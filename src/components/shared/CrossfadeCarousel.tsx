'use client';

import { useState, useEffect } from 'react';
import { AppImage } from '@/components/media/AppImage';
import { ImageAsset } from '@/types/common';

interface CrossfadeCarouselProps {
  images: ImageAsset[];
  alt?: string;
  intervalMs?: number;
  className?: string;
  priority?: boolean;
}

export function CrossfadeCarousel({ 
  images, 
  alt = 'Image', 
  intervalMs = 8000,
  className = '',
  priority = false
}: CrossfadeCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!images || images.length <= 1 || isPaused) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, intervalMs);
    
    return () => clearInterval(interval);
  }, [images, intervalMs, isPaused]);

  const handleDotClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex(index);
    setIsPaused(true);
  };

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe || isRightSwipe) {
      setIsPaused(true);
      if (isLeftSwipe) {
        setActiveIndex((current) => (current + 1) % images.length);
      }
      if (isRightSwipe) {
        setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1));
      }
    }
  };

  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    // Single image behavior - static, no animations
    return (
      <div className={`relative w-full h-full ${className}`}>
        <AppImage 
          image={images[0]} 
          alt={alt}
          fill
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  // Multiple images carousel with infinite crossfade animation
  return (
    <div 
      className={`relative w-full h-full overflow-hidden bg-[#1B1A17] touch-pan-y ${className}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEndHandler}
    >
      {images.map((img, index) => (
        <div 
          key={`${img.assetId || 'carousel-img'}-${index}`}
          className={`absolute inset-0 z-0 transition-opacity ${isPaused ? 'duration-500' : 'duration-[2000ms]'} ease-in-out ${index === activeIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <AppImage 
            image={img} 
            alt={alt}
            fill
            priority={priority && index === 0}
            className={`object-cover animate-in fade-in zoom-in-105 ${isPaused ? 'duration-500' : 'duration-[2000ms]'} ease-out fill-mode-both`}
          />
        </div>
      ))}
      <div className="absolute bottom-4 left-0 right-0 px-4 flex justify-center z-10 pointer-events-none">
        <div className="flex gap-2 items-center max-w-[60%] overflow-x-auto no-scrollbar pointer-events-auto py-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => handleDotClick(index, e)}
              className={`w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300 ${
                index === activeIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
