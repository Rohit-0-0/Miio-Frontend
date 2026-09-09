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
      <div className="w-full aspect-[16/9] bg-[#EAE8E1] flex items-center justify-center text-[#7D7975]">
        No images available
      </div>
    );
  }

  const mainImage = images[0];
  const sideImages = images.slice(1, 3);
  const remainingCount = Math.max(0, images.length - 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-2 md:gap-3 h-[320px] md:h-[420px] lg:h-[480px]">
      <div
        className="relative overflow-hidden cursor-pointer bg-[#EAE8E1]"
        onClick={() => onImageClick?.(0)}
      >
        <AppImage
          image={mainImage}
          alt="Main Property Image"
          fill
          className="object-cover transition-transform duration-700 hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 66vw"
        />
      </div>

      {sideImages.length > 0 && (
        <div className="hidden md:grid grid-rows-2 gap-2 md:gap-3 h-full">
          {sideImages.map((img, i) => {
            const isLast = i === sideImages.length - 1;
            const showMore = isLast && remainingCount > 0;

            return (
              <div
                key={img.assetId || i}
                className="relative overflow-hidden cursor-pointer bg-[#EAE8E1]"
                onClick={() => onImageClick?.(i + 1)}
              >
                <AppImage
                  image={img}
                  alt={`Property Image ${i + 2}`}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                  sizes="33vw"
                />
                {showMore && (
                  <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                    <span className="text-white text-[15px] font-medium tracking-wide">
                      +{remainingCount} more photos
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
