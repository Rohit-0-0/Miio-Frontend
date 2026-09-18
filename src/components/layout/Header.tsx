'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { Container } from '@/components/ui/Container';
import { Logo } from './Logo';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';

interface HeaderProps {
  logo?: any;
  navItems?: { label: string; href: string; isExternal?: boolean }[];
}

export function Header({ logo, navItems }: HeaderProps = {}) {
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

  // The user requested the header nav to match Figma: bg #FEF6EE, border #E6E6E6, height 88px.
  // We remove the transparent logic to ensure it matches the solid design.
  const headerClasses = 'sticky top-0 z-50 w-full bg-[#FEF6EE] text-[#1B1A17] transition-all duration-300 border-b border-[#E6E6E6]';

  return (
    <header className={headerClasses}>
      {/* Utility Bar */}
      <div className="w-full bg-[#241D19] text-[#F8F5EF]">
        <Container>
          <div className="flex justify-center md:justify-end items-center h-8 md:h-10 space-x-6 text-[10px] md:text-xs font-semibold tracking-widest uppercase">
            <Link href="/login" className="hover:text-white transition-colors">Guest Login</Link>
            <Link href="/partner-with-us" className="hover:text-white transition-colors">Partner With Us</Link>
          </div>
        </Container>
      </div>

      <Container>
        <div className="flex h-[56px] md:h-[88px] items-center justify-between">
          <Logo image={logo} />
          
          <div className="flex items-center space-x-8">
            <DesktopNav navItems={navItems} />
            
            <div className="hidden md:block">
              <Link
                href={ROUTES.PROPERTIES}
                className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold tracking-widest uppercase transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-[#C3BA8D] text-black focus-visible:ring-[#C3BA8D]"
              >
                Reserve
              </Link>
            </div>
            
            <MobileNav navItems={navItems} />
          </div>
        </div>
      </Container>
    </header>
  );
}
