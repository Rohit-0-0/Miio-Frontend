import React from 'react';
import { ImageAsset as ImageType } from '@/types/common';
import { AppImage } from '@/components/media/AppImage';

interface GalleryGridProps {
  images: ImageType[];
  onImageClick?: (index: number) => void;
}

export function GalleryGrid({ images, onImageClick }: GalleryGridProps) {
  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[21/9] bg-gray-100 flex items-center justify-center text-gray-400">
        No images available
      </div>
    );
  }

  const mainImage = images[0];
  const sideImages = images.slice(1, 3); // Max 2 for the side

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 h-[50vh] md:h-[60vh] lg:h-[70vh]">
      <div 
        className={`relative overflow-hidden cursor-pointer ${sideImages.length > 0 ? 'md:col-span-3' : 'md:col-span-4'}`}
        onClick={() => onImageClick?.(0)}
      >
        <AppImage 
          image={mainImage}
          alt="Main Property Image"
          fill
          className="object-cover transition-transform duration-700 hover:scale-105"
        />
      </div>

      {sideImages.length > 0 && (
        <div className="hidden md:grid md:col-span-1 grid-rows-2 gap-2 md:gap-4 h-full">
          {sideImages.map((img, i) => (
            <div 
              key={img.assetId} 
              className="relative overflow-hidden cursor-pointer h-full"
              onClick={() => onImageClick?.(i + 1)}
            >
              <AppImage 
                image={img}
                alt={`Property Image ${i + 2}`}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
