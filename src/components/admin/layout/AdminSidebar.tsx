'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { 
  LayoutDashboard, 
  Home, 
  BookOpen, 
  Info, 
  Handshake, 
  Building2, 
  Image as ImageIcon, 
  Settings,
  ArrowLeft
} from 'lucide-react';

const sidebarItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Homepage', href: '/admin/homepage', icon: Home },
  { label: 'Journal', href: '/admin/journal', icon: BookOpen },
  { label: 'About', href: '/admin/about', icon: Info },
  { label: 'Partners', href: '/admin/partners', icon: Handshake },
  { label: 'Properties', href: '/admin/properties', icon: Building2 },
  { label: 'Media', href: '/admin/media', icon: ImageIcon },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen flex flex-col hidden md:flex sticky top-0 h-screen">
      <div className="p-6 border-b border-gray-200">
        <Link href="/admin" className="text-2xl font-serif font-bold tracking-widest text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 rounded-sm inline-block">
          MIIO <span className="text-sm font-sans font-normal text-gray-500">Admin</span>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center space-x-3 px-3 py-2.5 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 ${
                isActive 
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-200 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'}`} strokeWidth={isActive ? 2 : 1.5} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <Link 
          href={ROUTES.HOME} 
          className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-900 transition-colors px-3 py-2 rounded-sm hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Site</span>
        </Link>
      </div>
    </aside>
  );
}
