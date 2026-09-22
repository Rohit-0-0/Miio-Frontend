'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAVIGATION, NavItem } from '@/constants/routes';

interface DesktopNavProps {
  navItems?: NavItem[];
}

export function DesktopNav({ navItems }: DesktopNavProps = {}) {
  const pathname = usePathname();

  const itemsToRender: NavItem[] = navItems && navItems.length > 0 ? navItems : NAVIGATION;

  return (
    <nav className="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
      {itemsToRender.map((item) => {
        // Active if exact match or if we are on a sub-route (e.g. /properties/123)
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        
        return (
          <Link
            key={item.href}
            href={item.href}
            target={item.isExternal ? '_blank' : undefined}
            rel={item.isExternal ? 'noopener noreferrer' : undefined}
            className={`text-sm font-medium text-current transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 rounded-sm py-1 border-b-2 ${
              isActive ? 'opacity-100 border-current' : 'opacity-80 hover:opacity-100 border-transparent hover:border-current/30'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
