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
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 rounded-sm"
        >
          {item.label}
        </Link>
      ))}

      {!user ? (
        <Link
          href={ROUTES.LOGIN}
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 rounded-sm"
        >
          Login
        </Link>
      ) : user.role === 'ADMIN' ? (
        <>
          <Link
            href={ROUTES.ADMIN}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 rounded-sm"
          >
            Dashboard
          </Link>
          <button
            onClick={() => logout()}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 rounded-sm cursor-pointer"
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={() => logout()}
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 rounded-sm cursor-pointer"
        >
          Logout
        </button>
      )}
    </nav>
  );
}
