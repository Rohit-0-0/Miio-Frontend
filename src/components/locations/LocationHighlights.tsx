import React from 'react';
import { AppImage } from '@/components/media/AppImage';
import { Building2, Coffee, ShoppingBasket } from 'lucide-react';

export interface LocationHighlightItem {
  _key?: string;
  text: string;
  icon?: any;
}

const FALLBACK_ICONS = [Building2, Coffee, ShoppingBasket];

export function LocationHighlights({ items }: { items?: LocationHighlightItem[] }) {
  if (!items || items.length === 0) return null;

  // Figma Quick Facts:
  // 345 x Hug, r10, p24, gap16
  // bg #E1DBC3 @ 10%, shadow 0 4 4 #000 @ 25%
  // icon circle 32x32, r16, #99583D
  // text Instrument Sans 16/500/130% #241D19
  return (
    <aside
      className="w-[345px] max-w-full rounded-[10px] p-6 flex flex-col gap-4"
      style={{
        backgroundColor: 'rgba(225, 219, 195, 0.1)',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      }}
    >
      {items.map((item, index) => {
        const FallbackIcon = FALLBACK_ICONS[index % FALLBACK_ICONS.length];
        return (
          <div key={item._key || index} className="flex items-center gap-3 w-full">
            <div
              className="w-8 h-8 rounded-[16px] flex items-center justify-center shrink-0 overflow-hidden"
              style={{ backgroundColor: '#99583D' }}
            >
              {item.icon ? (
                <div className="relative w-4 h-4">
                  <AppImage
                    image={item.icon}
                    alt=""
                    fill
                    className="object-contain brightness-0 invert"
                  />
                </div>
              ) : (
                <FallbackIcon className="w-4 h-4 text-white" strokeWidth={1.75} />
              )}
            </div>
            <span
              className="flex-1 min-w-0 font-sans text-[16px] font-medium leading-[130%] text-[#241D19]"
            >
              {item.text}
            </span>
          </div>
        );
      })}
    </aside>
  );
}