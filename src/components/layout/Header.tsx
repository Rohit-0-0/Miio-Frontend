'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { Container } from '@/components/ui/Container';
import { Logo } from './Logo';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHomepage = pathname === ROUTES.HOME;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial position
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // If not homepage, maybe we want it always solid? 
  // The brief says: "Top: Transparent. Scroll ~80px. Become Cream background, Slight blur, Soft shadow."
  // We'll apply this to the homepage, and maybe everywhere for consistency or keep it solid elsewhere.
  // Let's make it always solid if not on homepage, or transparent if isHomepage && !scrolled.
  const isTransparent = isHomepage && !scrolled;

  const headerClasses = isHomepage
    ? `fixed top-0 z-50 w-full transition-all duration-300 ${
        isTransparent
          ? 'bg-transparent text-white'
          : 'bg-[#F8F5EF]/95 backdrop-blur-md shadow-sm border-b border-gray-200/50 text-[#1B1A17]'
      }`
    : 'sticky top-0 z-50 w-full bg-[#F8F5EF]/95 backdrop-blur-md shadow-sm border-b border-gray-200/50 text-[#1B1A17] transition-all duration-300';

  return (
    <header className={headerClasses}>
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Logo />
          
          <div className="flex items-center space-x-8">
            <DesktopNav />
            
            <div className="hidden md:block">
              <Link
                href={ROUTES.PROPERTIES}
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
