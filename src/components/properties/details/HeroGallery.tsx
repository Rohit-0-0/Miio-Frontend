'use client';

import React, { useState } from 'react';
import { ImageAsset as ImageType } from '@/types/common';
import { GalleryGrid } from './GalleryGrid';

interface HeroGalleryProps {
  images: ImageType[];
}

export function HeroGallery({ images }: HeroGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setInitialIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <section className="w-full">
        {/* Desktop and Tablet Grid - Mobile will just show the first image or a slider in a full implementation */}
        <div className="hidden md:block">
          <GalleryGrid images={images} onImageClick={handleImageClick} />
        </div>
        
        {/* Mobile View - Fallback to just the first image for now, later replaced by GalleryCarousel */}
        <div className="block md:hidden">
          <GalleryGrid images={images} onImageClick={handleImageClick} />
        </div>
      </section>

      {/* Lightbox Placeholder */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button 
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white text-sm tracking-wider uppercase"
          >
            Close
          </button>
          <div className="text-white">
            Fullscreen Gallery (Phase 2) - Image {initialIndex + 1}
          </div>
        </div>
      )}
    </>
  );
}
