import React from 'react';
import Image from 'next/image';
import { ImageAsset } from '@/lib/media/imageTypes';
import { buildImageUrl } from '@/lib/media/buildImageUrl';

interface ImagePreviewProps {
  image: ImageAsset;
  onRemove: () => void;
  onReplace: () => void;
}

export function ImagePreview({ image, onRemove, onReplace }: ImagePreviewProps) {
  const url = buildImageUrl(image.assetId);

  return (
    <div className="relative group overflow-hidden rounded-sm border border-gray-200 bg-gray-50 aspect-video flex items-center justify-center">
      {url ? (
        <Image
          src={url}
          alt={image.alt || 'Image preview'}
          fill
          className="object-cover transition-opacity group-hover:opacity-50"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ) : (
        <div className="text-sm text-gray-400 font-medium z-0">Invalid image</div>
      )}

      <div className={`absolute inset-0 flex items-center justify-center gap-3 transition-opacity z-10 ${url ? 'opacity-0 group-hover:opacity-100 bg-black/10' : 'opacity-100 bg-gray-100/50'}`}>
        <button
          type="button"
          onClick={onReplace}
          className="px-4 py-2 text-sm font-medium text-gray-900 bg-white rounded-sm shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          Replace
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="px-4 py-2 text-sm font-medium text-red-600 bg-white rounded-sm shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600"
        >
          Remove
        </button>
      </div>
      
      {image.filename && (
        <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-xs text-white truncate px-1">{image.filename}</p>
        </div>
      )}
    </div>
  );
}
