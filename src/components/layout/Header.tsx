'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES, NavItem } from '@/constants/routes';
import { Container } from '@/components/ui/Container';
import { Logo } from './Logo';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';
interface HeaderProps {
  logo?: any;
  navItems?: NavItem[];
  utilityBarLink?: {
    text?: string;
    href?: string;
  };
}

export function Header({ logo, navItems, utilityBarLink }: HeaderProps = {}) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  // Pages with a full-bleed hero where the header floats transparently initially
  const isHeroPage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      // Past ~80vh: window.innerHeight * 0.8
      const threshold = window.innerHeight * 0.8;
      setIsScrolled(window.scrollY > threshold);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine whether the main nav should be transparent
  const isTransparent = isHeroPage && !isScrolled;

  // Utility bar link resolution - ONLY Partner with us
  const partnerText = utilityBarLink?.text || 'Partner with us';
  const partnerHref = utilityBarLink?.href || '/partner-with-us';
  const cleanPartnerHref = partnerHref.startsWith('/') || partnerHref.startsWith('http') ? partnerHref : `/${partnerHref}`;

  return (
    <header className={`${isHeroPage ? 'fixed' : 'sticky'} top-0 left-0 right-0 z-50 w-full transition-all duration-300`}>
      {/* Utility Bar - Stays pinned at the very top above the main nav at all scroll positions */}
      <div className="w-full bg-[#241D19] text-[#F8F5EF] relative z-20">
        <Container>
          <div className="flex justify-end items-center h-8 md:h-9 text-[10px] md:text-xs font-semibold tracking-wider">
            <Link href={cleanPartnerHref} className="hover:text-white transition-colors duration-200">
              {partnerText}
            </Link>
          </div>
        </Container>
      </div>

      {/* Main Nav - Floating transparently over hero, becoming solid Paper (#FEF6EE) with hairline border once scrolled past ~80vh */}
      <div
        className={`w-full transition-all duration-300 ${
          isTransparent
            ? 'bg-transparent text-[#FEF6EE] border-b border-transparent'
            : 'bg-[#FEF6EE] text-[#1B1A17] border-b border-[#1B1A17]/10 shadow-sm'
        }`}
      >
        <Container>
          <div className="flex h-[56px] md:h-[88px] items-center justify-between">
            <Logo 
              image={logo} 
              className={isTransparent ? 'brightness-0 invert text-[#FEF6EE]' : 'text-[#1B1A17]'} 
            />
            
            <div className="flex items-center space-x-8">
              <DesktopNav navItems={navItems} isTransparent={isTransparent} />
              
              <div className="hidden md:block">
                <Link
                  href={ROUTES.PROPERTIES}
                  className="inline-flex items-center justify-center rounded-full px-8 h-[48px] text-[14px] font-medium tracking-wide transition-all duration-200 hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-[#C3BA8D] text-black focus-visible:ring-[#C3BA8D] shadow-sm"
                >
                  Reserve
                </Link>
              </div>
              <MobileNav navItems={navItems} logo={logo} isTransparent={isTransparent} />
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
}
