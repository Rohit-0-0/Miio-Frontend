'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { ImageAsset } from '@/lib/media/imageTypes';
import { buildImageUrl } from '@/lib/media/buildImageUrl';
import { ImagePlaceholder } from './ImagePlaceholder';

interface AppImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  image?: ImageAsset | null;
  alt?: string;
  fallbackAlt?: string;
}

export function AppImage({ image, alt, fallbackAlt = 'Image', className = '', ...props }: AppImageProps) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!image || !image.assetId) {
    return <ImagePlaceholder className={className} />;
  }

  const url = buildImageUrl(image.assetId);

  if (!url || error) {
    return <ImagePlaceholder className={className} />;
  }

  const finalAlt = alt || image.alt || fallbackAlt;

  return (
    <div className={`relative overflow-hidden ${props.fill ? 'w-full h-full' : ''} ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse z-10" />
      )}
      <Image
        src={url}
        alt={finalAlt}
        className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'} ${props.fill ? 'object-cover' : ''}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
        {...props}
      />
    </div>
  );
}
