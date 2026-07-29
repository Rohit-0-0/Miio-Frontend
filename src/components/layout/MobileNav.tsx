'use client';

import { useState, useEffect, useRef } from 'react';
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

  // Focus trap
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const focusableElements = menuRef.current.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    firstElement.focus();
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label="Open mobile menu"
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
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20"
            aria-hidden="true"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="relative w-full max-w-sm bg-white h-full shadow-xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="text-xl font-bold font-serif text-gray-900">MiiO</span>
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

            <nav className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4">
              {NAVIGATION.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-2 py-3 text-lg font-medium text-gray-900 hover:bg-gray-50 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
                >
                  {item.label}
                </Link>
              ))}

              {!user ? (
                <Link
                  href={ROUTES.LOGIN}
                  onClick={() => setIsOpen(false)}
                  className="block px-2 py-3 text-lg font-medium text-gray-900 hover:bg-gray-50 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
                >
                  Login
                </Link>
              ) : user.role === 'ADMIN' ? (
                <>
                  <Link
                    href={ROUTES.ADMIN}
                    onClick={() => setIsOpen(false)}
                    className="block px-2 py-3 text-lg font-medium text-gray-900 hover:bg-gray-50 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-2 py-3 text-lg font-medium text-gray-900 hover:bg-gray-50 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-2 py-3 text-lg font-medium text-gray-900 hover:bg-gray-50 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 cursor-pointer"
                >
                  Logout
                </button>
              )}
            </nav>

            <div className="p-4 border-t border-gray-100">
              <Link
                href={ROUTES.BOOKING}
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center rounded-md bg-gray-900 px-4 py-3 text-base font-medium text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
              >
                Book a Stay
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
