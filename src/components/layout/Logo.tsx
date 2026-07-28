import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export function Logo() {
  return (
    <Link
      href={ROUTES.HOME}
      className="text-2xl font-bold font-serif tracking-tighter text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 rounded-sm"
      aria-label="MiiO Home"
    >
      MiiO
    </Link>
  );
}
