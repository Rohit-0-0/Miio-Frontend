import React from 'react';
import { BookmarkCheck, Lock, Coffee, Palette } from 'lucide-react';

interface MiioStandardItem {
  icon: string;
  title: string;
  description: string;
}

interface MiioStandardProps {
  standards?: MiioStandardItem[];
}

const DEFAULT_STANDARDS: MiioStandardItem[] = [
  { icon: 'bookmark', title: 'Premium linens, always', description: '' },
  { icon: 'lock', title: 'Smart locks, seamless access', description: '' },
  { icon: 'coffee', title: 'Nespresso & quality essentials', description: '' },
  { icon: 'palette', title: 'Professionally styled interiors', description: '' },
];

function StandardIcon({ name }: { name: string }) {
  const props = { className: 'w-6 h-6 text-white', strokeWidth: 1.5 };
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

export function MiioStandard({ standards }: MiioStandardProps) {
  const items =
    standards && standards.length > 0 ? standards.slice(0, 4) : DEFAULT_STANDARDS;

  return (
    <section className="pt-8 w-full">
      {/* Figma: tiles sit in the LEFT column under Description, equal width, ~12-16px gap */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full">
        {items.map((standard, index) => (
          <div
            key={index}
            className="w-full h-[160px] rounded-[10px] bg-[rgba(225,219,195,0.1)] shadow-[0_4px_4px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center text-center px-3 gap-[10px]"
          >
            <div className="w-10 h-10 rounded-[20px] bg-[#99583D] p-2 flex items-center justify-center shrink-0">
              <StandardIcon name={standard.icon || standard.title} />
            </div>
            <h3 className="text-[13px] font-medium text-[#1B1A17] leading-snug">
              {standard.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}