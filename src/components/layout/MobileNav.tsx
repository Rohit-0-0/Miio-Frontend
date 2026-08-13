'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { NAVIGATION, ROUTES } from '@/constants/routes';
import { useAuth } from '@/components/providers/AuthProvider';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
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

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label="Open mobile menu"
        className="p-2 -mr-2 text-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded-sm z-50 relative"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </button>

        {isOpen && typeof document !== 'undefined' && createPortal(
          <div 
            className="fixed inset-0 z-[100] flex flex-col bg-[#F8F5EF] animate-in fade-in duration-300"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between p-4 px-6 md:px-8 border-b border-gray-200/50">
              <span className="text-xl font-bold font-serif text-gray-900 tracking-wide">MiiO</span>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close mobile menu"
                className="p-2 -mr-2 text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 rounded-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <nav 
              className="flex-1 flex flex-col justify-center items-center space-y-8 p-8"
              ref={menuRef}
            >
              {NAVIGATION.map((item, i) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-4xl font-serif text-gray-900 tracking-wide hover:text-gray-600 transition-colors animate-in slide-in-from-bottom-4 fade-in duration-500"
                  style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
                >
                  {item.label}
                </Link>
              ))}

              <Link
                href="/partner-with-us"
                onClick={() => setIsOpen(false)}
                className="text-4xl font-serif text-gray-900 tracking-wide hover:text-gray-600 transition-colors animate-in slide-in-from-bottom-4 fade-in duration-500"
                style={{ animationDelay: `${NAVIGATION.length * 100}ms`, animationFillMode: 'both' }}
              >
                Partner With Us
              </Link>

            </nav>

            <div className="p-8 pb-12 w-full max-w-sm mx-auto animate-in slide-in-from-bottom-8 fade-in duration-700 delay-300 fill-mode-both">
              <Link
                href={ROUTES.BOOKING}
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center rounded-sm bg-[#1B1A17] px-6 py-4 text-sm font-medium tracking-widest uppercase text-white hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
              >
                Book a Stay
              </Link>
            </div>
          </div>,
          document.body
        )}
      </div>
  );
}
