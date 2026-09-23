'use client';

import React, { useState } from 'react';
import { ImageAsset as ImageType } from '@/types/common';
import { GalleryGrid } from './GalleryGrid';
import { CrossfadeCarousel } from '@/components/shared/CrossfadeCarousel';

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
        <div className="hidden md:block">
          <GalleryGrid images={images} onImageClick={handleImageClick} />
        </div>

        <div
          className="block md:hidden h-[50vh] relative cursor-pointer overflow-hidden"
          onClick={() => handleImageClick(0)}
        >
          <CrossfadeCarousel images={images} alt="Location Gallery Image" intervalMs={6000} priority={true} />
        </div>
      </section>

      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white text-sm tracking-wider uppercase"
          >
            Close
          </button>
          <div className="text-white">
            Fullscreen Gallery — Image {initialIndex + 1} of {images.length || 1}
          </div>
        </div>
      )}
    </>
  );
}
