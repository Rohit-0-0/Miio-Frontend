import React from 'react';
import Link from 'next/link';
import { EmptyStateSettings } from '@/types/stays-page';
import { AppImage } from '../media/AppImage';

interface EmptyStateProps {
  config: EmptyStateSettings;
}

export function EmptyState({ config }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-32 px-6">
      {config.image && (
        <div className="w-32 h-32 md:w-48 md:h-48 relative mb-8 rounded-full overflow-hidden bg-gray-50">
          <AppImage image={config.image} fill className="object-cover" />
        </div>
      )}
      <h3 className="font-serif text-3xl text-gray-900 mb-4">{config.heading}</h3>
      <p className="text-gray-500 max-w-md mx-auto mb-10 text-lg leading-relaxed">
        {config.description}
      </p>
      {config.ctaLink && config.ctaText && (
        <Link 
          href={config.ctaLink}
          className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white rounded-sm font-medium hover:bg-gray-800 transition-colors"
        >
          {config.ctaText}
        </Link>
      )}
    </div>
  );
}
