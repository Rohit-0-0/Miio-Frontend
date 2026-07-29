"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { ROUTES } from '@/constants/routes';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, verifySession } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      if (loading) return;

      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (user && token) {
        if (user.role !== 'ADMIN') {
          router.push(ROUTES.HOME);
        } else {
          setChecking(false);
        }
        return;
      }

      const currentUser = await verifySession();

      if (!currentUser) {
        router.push(ROUTES.LOGIN);
      } else if (currentUser.role !== 'ADMIN') {
        router.push(ROUTES.HOME);
      } else {
        setChecking(false);
      }
    };

    check();
  }, [user, loading, router, verifySession]);

  if (loading || checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-gray-900 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-sm font-medium text-gray-600 font-sans">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
