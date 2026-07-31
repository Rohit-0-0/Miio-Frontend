'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/components/providers/AuthProvider';
import { 
  LayoutDashboard, 
  Home, 
  BookOpen, 
  Info, 
  Handshake, 
  Building2, 
  Image as ImageIcon, 
  Settings,
  ArrowLeft,
  LogOut,
  Map as MapIcon
} from 'lucide-react';

const sidebarItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Homepage', href: '/admin/home', icon: Home },
  { label: 'Journal', href: '/admin/journal', icon: BookOpen },
  { label: 'Properties', href: '/admin/properties', icon: Building2 },
  { label: 'Maps', href: '/admin/maps', icon: MapIcon },
  { label: 'About', href: '/admin/about', icon: Info },
  { label: 'Partners', href: '/admin/partners', icon: Handshake },
  { label: 'Media', href: '/admin/media', icon: ImageIcon },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push(ROUTES.LOGIN);
  };

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
      
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Link 
          href={ROUTES.HOME} 
          className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-900 transition-colors px-3 py-2 rounded-sm hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Site</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors px-3 py-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
