import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { AppImage } from '@/components/media/AppImage';

interface LogoProps {
  image?: any;
}

export function Logo({ image }: LogoProps) {
  return (
    <Link
      href={ROUTES.HOME}
      className="text-2xl font-bold font-serif tracking-tighter text-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 rounded-sm flex items-center"
      aria-label="MiiO Home"
    >
      {image ? (
        <div className="relative h-[42px] w-[110px]">
          <AppImage
            image={image}
            alt="MiiO Logo"
            width={110}
            height={42}
            className="h-full w-full object-contain object-left"
          />
        </div>
      ) : (
        'MiiO'
      )}
    </Link>
  );
}
