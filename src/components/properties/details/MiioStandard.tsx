import React from 'react';
import { BookmarkCheck, Lock, Coffee, Palette } from 'lucide-react';
import { ImageAsset } from '@/types/common';
import { AppImage } from '@/components/media/AppImage';
import { buildImageUrl } from '@/lib/media/buildImageUrl';

interface MiioStandardItem {
  icon: string;
  title: string;
  description: string;
}

interface MiioStandardProps {
  standards?: MiioStandardItem[];
  images?: ImageAsset[];
}

const DEFAULT_STANDARDS: MiioStandardItem[] = [
  { icon: 'bookmark', title: 'Premium linens,\nalways', description: '' },
  { icon: 'lock', title: 'Smart locks,\nseamless access', description: '' },
  { icon: 'coffee', title: 'Nespresso &\nquality essentials', description: '' },
  { icon: 'palette', title: 'Professionally\nstyled interiors', description: '' },
];

function StandardIcon({ name }: { name: string }) {
  const props = { className: 'w-5 h-5 text-white', strokeWidth: 1.5 };
  const key = (name || '').toLowerCase();
  if (key.includes('lock') || key.includes('smart')) return <Lock {...props} />;
  if (key.includes('coffee') || key.includes('nespresso') || key.includes('bean'))
    return <Coffee {...props} />;
  if (
    key.includes('palette') ||
    key.includes('swatch') ||
    key.includes('pencil') ||
    key.includes('style') ||
    key.includes('interior')
  )
    return <Palette {...props} />;
  return <BookmarkCheck {...props} />;
}

export function MiioStandard({ standards, images = [] }: MiioStandardProps) {
  const items =
    standards && standards.length > 0 ? standards.slice(0, 4) : DEFAULT_STANDARDS;

  return (
    <section className="pt-8 w-full">
      <h2 className="font-sans font-medium text-[16px] leading-[130%] text-[#241D19] mb-4">
        The Miio Standard
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 w-full">
        {items.map((standard, index) => {
          const bgImage = images.length > 0 ? images[index % images.length] : undefined;
          const assetId = bgImage
            ? bgImage.assetId || (bgImage as any).asset?._ref || (bgImage as any).asset?._id || (bgImage as any).url
            : undefined;
          const imageUrl = assetId ? buildImageUrl(assetId) : undefined;

          return (
            <div
              key={index}
              className="relative w-full h-[145px] rounded-[10px] overflow-hidden flex flex-col items-center justify-between py-4 px-2 text-center shadow-[0_4px_4px_rgba(0,0,0,0.25)] bg-[#E1DBC3]/10"
            >
              {/* Background image filling 100% of card at 20% opacity */}
              {imageUrl && (
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                />
              )}

              {/* Terracotta Circle Badge */}
              <div className="relative z-10 w-10 h-10 rounded-full bg-[#99583D] flex items-center justify-center shrink-0 shadow-sm mt-1">
                <StandardIcon name={standard.icon || standard.title} />
              </div>

              {/* Title on top of background */}
              <h3 className="relative z-10 font-sans font-medium text-[13px] md:text-[14px] text-[#241D19] leading-[130%] whitespace-pre-line px-1">
                {standard.title}
              </h3>
            </div>
          );
        })}
      </div>
    </section>
  );
}