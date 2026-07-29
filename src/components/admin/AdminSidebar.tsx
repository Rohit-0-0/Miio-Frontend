import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export function AdminSidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col hidden md:flex">
      <div className="p-6">
        <Link href="/admin/journal" className="text-2xl font-serif font-bold tracking-widest text-white">
          MIIO <span className="text-sm font-sans font-normal text-gray-400">Admin</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link 
          href="/admin/journal" 
          className="flex items-center px-4 py-3 bg-gray-800 text-white rounded-sm transition-colors"
        >
          Journal CMS
        </Link>
        {/* Additional links can go here */}
      </nav>
      <div className="p-6 border-t border-gray-800">
        <Link href={ROUTES.HOME} className="text-sm text-gray-400 hover:text-white transition-colors">
          &larr; Back to Public Site
        </Link>
      </div>
    </aside>
  );
}
