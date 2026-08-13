'use client';

import Link from 'next/link';
import { NAVIGATION, ROUTES } from '@/constants/routes';
import { useAuth } from '@/components/providers/AuthProvider';

export function DesktopNav() {
  const { user, logout } = useAuth();

  return (
    <nav className="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
      {NAVIGATION.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm font-medium text-current opacity-80 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 rounded-sm"
        >
          {item.label}
        </Link>
      ))}

      <Link
        href="/partner-with-us"
        className="text-sm font-medium text-current opacity-80 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 rounded-sm"
      >
        Partner With Us
      </Link>

    </nav>
  );
}
