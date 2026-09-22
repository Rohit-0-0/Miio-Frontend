'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Building2,
  MapPin,
  BookOpen,
  Sparkles,
  User,
  Briefcase,
  LogOut,
  X,
  ChevronRight,
  Calendar,
  Compass,
  ArrowRight,
  Menu
} from 'lucide-react';
import { NAVIGATION, ROUTES, NavItem } from '@/constants/routes';
import { useAuth } from '@/components/providers/AuthProvider';

export interface MobileNavProps {
  navItems?: NavItem[];
}

export function MobileNav({ navItems }: MobileNavProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Determine items: prepend Home if not present
  const baseItems: NavItem[] = navItems && navItems.length > 0 ? navItems : NAVIGATION;
  const hasHome = baseItems.some(
    (item) => item.href === '/' || item.label.toLowerCase() === 'home'
  );
  const itemsToRender: NavItem[] = hasHome
    ? baseItems
    : [{ label: 'HOME', href: ROUTES.HOME }, ...baseItems];

  const getIconForItem = (label: string, href: string) => {
    const l = label.toLowerCase();
    const h = href.toLowerCase();
    if (l.includes('home') || h === '/') return Home;
    if (l.includes('stay') || l.includes('properties') || h.includes('properties'))
      return Building2;
    if (l.includes('location') || h.includes('location')) return MapPin;
    if (l.includes('journal') || l.includes('news') || l.includes('blog'))
      return BookOpen;
    if (l.includes('about') || l.includes('story')) return Sparkles;
    return Compass;
  };

  return (
    <div className="md:hidden">
      {/* Mobile Menu Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label="Open mobile menu"
        className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/40 text-[#1B1A17] backdrop-blur-sm transition-all hover:bg-white/80 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C3BA8D]"
      >
        <Menu className="h-5 w-5 transition-transform group-hover:scale-105" strokeWidth={1.75} />
      </button>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          {/* Drawer Panel */}
          <div
            ref={menuRef}
            className="relative flex h-full w-[86vw] max-w-[380px] flex-col overflow-hidden border-l border-white/10 bg-gradient-to-b from-[#3a271e] via-[#241D19] to-[#14100e] text-[#FEF6EE] shadow-2xl animate-in slide-in-from-right duration-400 ease-out"
          >
            {/* Ambient Background Glows */}
            <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-[#C3BA8D]/15 blur-3xl" />
            <div className="pointer-events-none absolute top-1/2 -right-20 h-60 w-60 rounded-full bg-[#8c462b]/20 blur-3xl" />

            {/* Header Area */}
            <div className="relative z-10 flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                {/* 3 luxury status dots inspired by modern interfaces */}
                <div className="flex items-center space-x-1.5 opacity-80">
                  <span className="h-2 w-2 rounded-full bg-[#C3BA8D]" />
                  <span className="h-2 w-2 rounded-full bg-[#a35e40]" />
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-xl tracking-[0.2em] font-medium text-[#FEF6EE]">
                    MiiO
                  </span>
                  <span className="text-[8px] font-sans tracking-[0.25em] text-[#C3BA8D] uppercase">
                    Curated Stays
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close mobile menu"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:bg-white/15 hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C3BA8D]"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>

            {/* Scrollable Navigation Body */}
            <div className="relative z-10 flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 pb-6">
              {/* Primary Navigation */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[9px] font-semibold tracking-[0.25em] text-[#C3BA8D]/80 uppercase">
                    Navigation
                  </span>
                  <div className="h-px flex-1 ml-3 bg-white/10" />
                </div>

                <nav className="space-y-1">
                  {itemsToRender.map((item) => {
                    const Icon = getIconForItem(item.label, item.href);
                    const isActive =
                      item.href === '/'
                        ? pathname === '/'
                        : pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        target={item.isExternal ? '_blank' : undefined}
                        rel={item.isExternal ? 'noopener noreferrer' : undefined}
                        className={`group flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-[#C3BA8D]/25 via-[#C3BA8D]/10 to-transparent border-l-2 border-[#C3BA8D] text-white'
                            : 'text-white/80 hover:bg-white/5 hover:text-white hover:translate-x-1'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-colors ${
                              isActive
                                ? 'border-[#C3BA8D]/40 bg-[#C3BA8D]/20 text-[#C3BA8D]'
                                : 'border-white/10 bg-white/5 text-[#C3BA8D]/80 group-hover:border-[#C3BA8D]/30 group-hover:text-[#C3BA8D]'
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                          </div>
                          <span className="text-[12px] font-medium tracking-[0.15em] uppercase">
                            {item.label}
                          </span>
                        </div>

                        <ChevronRight
                          className={`h-3.5 w-3.5 transition-all duration-200 ${
                            isActive
                              ? 'text-[#C3BA8D] translate-x-0.5'
                              : 'text-white/30 group-hover:text-white/70 group-hover:translate-x-0.5'
                          }`}
                          strokeWidth={2}
                        />
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Guest Services / Secondary */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[9px] font-semibold tracking-[0.25em] text-[#C3BA8D]/80 uppercase">
                    Services
                  </span>
                  <div className="h-px flex-1 ml-3 bg-white/10" />
                </div>

                <div className="space-y-1">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center justify-between rounded-xl px-3 py-2 text-white/75 transition-all hover:bg-white/5 hover:text-white hover:translate-x-1"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 group-hover:text-[#C3BA8D] group-hover:border-[#C3BA8D]/30 transition-colors">
                        <User className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </div>
                      <span className="text-[11px] font-medium tracking-[0.14em] uppercase">
                        Guest Login
                      </span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-white/30 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all" strokeWidth={2} />
                  </Link>

                  <Link
                    href="/partner-with-us"
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center justify-between rounded-xl px-3 py-2 text-white/75 transition-all hover:bg-white/5 hover:text-white hover:translate-x-1"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 group-hover:text-[#C3BA8D] group-hover:border-[#C3BA8D]/30 transition-colors">
                        <Briefcase className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </div>
                      <span className="text-[11px] font-medium tracking-[0.14em] uppercase">
                        Partner With Us
                      </span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-white/30 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all" strokeWidth={2} />
                  </Link>
                </div>
              </div>

              {/* Guest / Member Card (inspired by references 1 & 3) */}
              <div className="pt-2">
                {user ? (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 flex items-center justify-between backdrop-blur-sm">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#C3BA8D] text-[#1B1A17] font-semibold text-sm">
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">
                          {user.displayName || user.email.split('@')[0]}
                        </p>
                        <p className="text-[10px] text-[#C3BA8D] tracking-wider uppercase">
                          {user.role === 'ADMIN' ? 'Admin Access' : 'Miio Guest'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        await logout();
                        setIsOpen(false);
                      }}
                      title="Log Out"
                      className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="group block rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur-sm transition-all hover:bg-white/[0.07] hover:border-white/20"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C3BA8D]/40 bg-[#C3BA8D]/15 text-[#C3BA8D]">
                          <User className="h-4 w-4" strokeWidth={1.75} />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-white tracking-wide">
                            Miio Privilege Club
                          </p>
                          <p className="text-[10px] text-white/50">
                            Sign in to manage bookings
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-[#C3BA8D] group-hover:translate-x-1 transition-transform" strokeWidth={2} />
                    </div>
                  </Link>
                )}
              </div>
            </div>

            {/* Footer Area with Primary Reserve CTA */}
            <div className="relative z-10 border-t border-white/10 bg-black/20 p-5 backdrop-blur-md">
              <Link
                href={ROUTES.PROPERTIES}
                onClick={() => setIsOpen(false)}
                className="group relative flex w-full items-center justify-center gap-2.5 rounded-full bg-[#C3BA8D] px-6 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase text-[#171310] transition-all hover:brightness-105 active:scale-[0.98] shadow-lg shadow-black/30"
              >
                <Calendar className="h-4 w-4" strokeWidth={2} />
                <span>Reserve Your Stay</span>
              </Link>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

