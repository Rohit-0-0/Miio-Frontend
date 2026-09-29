import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { AppImage } from '@/components/media/AppImage';

interface LogoProps {
  image?: any;
  className?: string;
  isLink?: boolean;
}

export function Logo({ image, className = '', isLink = true }: LogoProps) {
  const content = image ? (
    <div className="relative h-[42px] w-[110px]">
      <AppImage
        image={image}
        alt="MiiO Logo"
        width={110}
        height={42}
        className="h-full w-full object-contain object-center"
      />
    </div>
  ) : (
    <span className={`text-2xl font-bold font-serif tracking-tighter ${className}`}>MiiO</span>
  );

  if (!isLink) {
    return <div className={`flex items-center justify-center ${className}`}>{content}</div>;
  }

  return (
    <Link
      href={ROUTES.HOME}
      className={`text-2xl font-bold font-serif tracking-tighter text-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 rounded-sm flex items-center ${className}`}
      aria-label="MiiO Home"
    >
      {content}
    </Link>
  );
}
