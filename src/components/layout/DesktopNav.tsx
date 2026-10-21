'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAVIGATION, NavItem } from '@/constants/routes';

interface DesktopNavProps {
  navItems?: NavItem[];
  isTransparent?: boolean;
}

export function DesktopNav({ navItems, isTransparent = false }: DesktopNavProps = {}) {
  const pathname = usePathname();

  const itemsToRender: NavItem[] = navItems && navItems.length > 0 ? navItems : NAVIGATION;

  return (
    <nav className="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
      {itemsToRender.map((item) => {
        // Active if exact match or if we are on a sub-route (e.g. /properties/123)
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        
        // When header is transparent over hero:
        // Default text-[#FEF6EE]/80, hover text-[#FEF6EE], active text-[#FEF6EE] font-semibold.
        // When solid paper:
        // Default text-[#1B1A17]/75, hover text-[#1B1A17], active text-[#1B1A17] font-semibold.
        const colorClasses = isTransparent
          ? isActive
            ? 'text-[#FEF6EE] font-semibold'
            : 'text-[#FEF6EE]/80 hover:text-[#FEF6EE]'
          : isActive
            ? 'text-[#1B1A17] font-semibold'
            : 'text-[#1B1A17]/75 hover:text-[#1B1A17]';

        return (
          <Link
            key={item.href}
            href={item.href}
            target={item.isExternal ? '_blank' : undefined}
            rel={item.isExternal ? 'noopener noreferrer' : undefined}
            className={`text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 rounded-sm py-1 ${colorClasses}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
