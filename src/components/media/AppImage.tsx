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

  const resolvedAssetId = image?.assetId || (image as any)?.asset?._ref || (image as any)?.asset?._id || (image as any)?._ref || (image as any)?._id || (image as any)?.url;

  if (!image || !resolvedAssetId) {
    return <ImagePlaceholder className={className} />;
  }

  const url = buildImageUrl(resolvedAssetId);

  if (!url || error) {
    return <ImagePlaceholder className={className} />;
  }

  const finalAlt = alt || image.alt || fallbackAlt;

  return (
    <div 
      className={`relative overflow-hidden ${props.fill ? 'w-full h-full' : ''} ${className}`}
      suppressHydrationWarning
    >
      {isLoading && (
        <div className="absolute inset-0 animate-shimmer z-10" />
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
