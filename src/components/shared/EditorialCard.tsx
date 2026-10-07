import Link from 'next/link';
import { ImageAsset } from '@/types/common';
import { AppImage } from '@/components/media/AppImage';

interface EditorialCardProps {
  title: string;
  description?: string;
  image?: ImageAsset;
  link?: string;
  ctaText?: string;
  className?: string;
}

export function EditorialCard({
  title,
  description,
  image,
  link,
  ctaText = 'Explore', // Keep for backward compatibility, though we won't show it visually
  className = '',
}: EditorialCardProps) {
  const content = (
    <div className={`group block w-full cursor-pointer ${className}`}>
      <div className="relative w-full aspect-[345/460] overflow-hidden bg-[#EAE8E1] mb-3">
        {image ? (
          <AppImage
            image={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-[520ms] ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#7D7975]/40">
            <span className="font-serif text-2xl tracking-widest uppercase">MiiO</span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-[15px] font-medium text-[#1B1A17] capitalize leading-tight line-clamp-1 min-w-0">
          {title}
        </h3>
        {description && (
          <p className="text-[13px] text-[#7D7975] leading-snug line-clamp-1">
            {description}
          </p>
        )}
      </div>
    </div>
  );

  if (link) {
    return (
      <Link href={link} className="block w-full no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-4 rounded-sm">
        {content}
      </Link>
    );
  }

  return content;
}
