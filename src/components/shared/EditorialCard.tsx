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
  ctaText = 'Explore',
  className = '',
}: EditorialCardProps) {
  const content = (
    <div className={`group flex flex-col space-y-6 cursor-pointer ${className}`}>
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100">
        {image ? (
          <AppImage
            image={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#F8F5EF] text-[#1B1A17]/20">
            {/* Fallback pattern or just solid bg */}
            <span className="font-serif text-2xl tracking-widest uppercase">MiiO</span>
          </div>
        )}
      </div>
      <div className="flex flex-col space-y-3">
        <h3 className="text-2xl md:text-3xl font-serif text-[#1B1A17]">{title}</h3>
        {description && <p className="text-[#1B1A17]/70 font-light leading-relaxed">{description}</p>}
        {link && (
          <span className="text-sm font-medium tracking-widest uppercase text-[#1B1A17] group-hover:underline underline-offset-4 decoration-1 transition-all">
            {ctaText} &rarr;
          </span>
        )}
      </div>
    </div>
  );

  if (link) {
    return (
      <Link href={link} className="block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-4 rounded-sm">
        {content}
      </Link>
    );
  }

  return content;
}
