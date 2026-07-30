'use client';

import React, { useState } from 'react';
import { ImageAsset } from '@/lib/media/imageTypes';
import { ImageUploader } from './ImageUploader';
import { buildImageUrl } from '@/lib/media/buildImageUrl';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (image: { src: string; alt: string; caption?: string }) => void;
}

export function MediaLibraryModal({ isOpen, onClose, onSelect }: MediaLibraryModalProps) {
  const [asset, setAsset] = useState<ImageAsset | null>(null);
  const [alt, setAlt] = useState('');
  const [caption, setCaption] = useState('');

  if (!isOpen) return null;

  const handleSelect = () => {
    if (asset) {
      const src = buildImageUrl(asset.assetId) || asset.url || '';
      onSelect({ src, alt: alt || asset.alt || '', caption });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-sm shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Media Library</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
        </div>

        <div className="p-6 space-y-6">
          <ImageUploader 
            value={asset}
            onChange={setAsset}
            label="Upload Image"
          />

          {asset && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Alt Text (Required for accessibility)</label>
                <input
                  type="text"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  className="mt-1 w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900 text-sm"
                  placeholder="Describe the image"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Caption (Optional)</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="mt-1 w-full rounded-sm border-gray-300 px-3 py-2 border focus:ring-gray-900 focus:border-gray-900 text-sm"
                  placeholder="Image caption"
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end gap-2 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-sm">
            Cancel
          </button>
          <button 
            onClick={handleSelect}
            disabled={!asset}
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-sm hover:bg-gray-800 disabled:opacity-50"
          >
            Insert Image
          </button>
        </div>
      </div>
    </div>
  );
}
