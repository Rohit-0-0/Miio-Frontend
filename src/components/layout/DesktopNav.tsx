import Link from 'next/link';
import { NAVIGATION } from '@/constants/routes';

export function DesktopNav() {
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
    </nav>
  );
}
