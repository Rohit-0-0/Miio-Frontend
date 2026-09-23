'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, ChevronRight, Menu } from 'lucide-react';
import { NAVIGATION, ROUTES, NavItem } from '@/constants/routes';
import { Logo } from './Logo';

export interface MobileNavProps {
  navItems?: NavItem[];
  logo?: any;
}

export function MobileNav({ navItems, logo }: MobileNavProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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

  // Determine items: prepend Home if not present, and append Partner With Us
  const baseItems: NavItem[] = navItems && navItems.length > 0 ? navItems : NAVIGATION;
  const hasHome = baseItems.some(
    (item) => item.href === '/' || item.label.toLowerCase() === 'home'
  );
  const hasPartner = baseItems.some(
    (item) => item.label.toLowerCase().includes('partner')
  );
  
  let itemsToRender: NavItem[] = hasHome
    ? baseItems
    : [{ label: 'HOME', href: ROUTES.HOME }, ...baseItems];
    
  if (!hasPartner) {
    itemsToRender = [...itemsToRender, { label: 'PARTNER WITH US', href: '/partner-with-us' }];
  }

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
          className="fixed inset-0 z-[100] flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          {/* Drawer Panel */}
          <div
            ref={menuRef}
            className="relative flex h-full w-[86vw] max-w-[380px] flex-col overflow-hidden bg-[#FEF6EE] border-l border-[#1B1A17]/10 text-[#1B1A17] shadow-2xl animate-in slide-in-from-right duration-400 ease-out"
          >
            {/* Header Area */}
            <div className="relative z-10 flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#1B1A17]/10">
              <div className="flex items-center">
                <Logo image={logo} />
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close mobile menu"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1B1A17]/15 bg-white/50 text-[#1B1A17] transition-all hover:bg-white hover:shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C3BA8D]"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>

            {/* Scrollable Navigation Body */}
            <div className="relative z-10 flex-1 overflow-y-auto px-5 py-6 space-y-2 scrollbar-thin scrollbar-thumb-[#1B1A17]/10 pb-6">
              <nav className="space-y-1.5">
                {itemsToRender.map((item) => {
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
                      className={`group flex items-center justify-between rounded-xl px-4 py-3.5 transition-all duration-200 ${
                        isActive
                          ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#1B1A17]/5 text-[#1B1A17]'
                          : 'text-[#1B1A17]/70 hover:bg-white/60 hover:text-[#1B1A17]'
                      }`}
                    >
                      <span className="text-[14px] font-medium tracking-[0.15em] uppercase">
                        {item.label}
                      </span>
                      <ChevronRight
                        className={`h-4 w-4 transition-all duration-200 ${
                          isActive
                            ? 'text-[#C3BA8D]'
                            : 'text-[#1B1A17]/30 group-hover:text-[#1B1A17]/70 group-hover:translate-x-0.5'
                        }`}
                        strokeWidth={2}
                      />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Footer Area with Primary Reserve CTA */}
            <div className="relative z-10 border-t border-[#1B1A17]/10 bg-white/50 p-5 backdrop-blur-md">
              <Link
                href={ROUTES.PROPERTIES}
                onClick={() => setIsOpen(false)}
                className="group relative flex w-full items-center justify-center gap-2.5 rounded-full bg-[#C3BA8D] px-6 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase text-[#171310] transition-all hover:brightness-105 active:scale-[0.98] shadow-[0_4px_12px_rgba(195,186,141,0.3)]"
              >
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

