import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { Container } from '@/components/ui/Container';
import { Logo } from './Logo';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Logo />
          
          <div className="flex items-center space-x-8">
            <DesktopNav />
            
            <div className="hidden md:block">
              <Link
                href={ROUTES.BOOKING}
                className="inline-flex items-center justify-center rounded-md bg-gray-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
              >
                Book a Stay
              </Link>
            </div>
            
            <MobileNav />
          </div>
        </div>
      </Container>
    </header>
  );
}
