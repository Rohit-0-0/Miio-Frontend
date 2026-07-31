"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuth } from '@/components/providers/AuthProvider';
import { ROUTES } from '@/constants/routes';
import { Container } from '@/components/ui/Container';
import { authService } from '@/services/auth.service';

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect based on role
  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') {
        router.push(ROUTES.ADMIN);
      } else {
        router.push(ROUTES.HOME);
      }
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!displayName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.register({ displayName, email, password });
      toast.success('Registration successful!', { description: 'Please verify your email address.' });
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex flex-1 items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <Container className="max-w-md w-full">
        <div className="bg-white px-8 py-10 shadow-sm border border-gray-100 rounded-sm">
          <div className="mb-8 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Create an account
            </span>
            <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-gray-900">
              Join Miio
            </h2>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-sm bg-red-50 border-l-4 border-red-500 text-sm text-red-700">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="displayName"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2"
              >
                Full Name
              </label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                autoComplete="name"
                required
                disabled={isSubmitting || loading}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:border-gray-950 focus:ring-1 focus:ring-gray-950 disabled:bg-gray-50 transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={isSubmitting || loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:border-gray-950 focus:ring-1 focus:ring-gray-950 disabled:bg-gray-50 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                disabled={isSubmitting || loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:border-gray-950 focus:ring-1 focus:ring-gray-950 disabled:bg-gray-50 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                disabled={isSubmitting || loading}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:border-gray-950 focus:ring-1 focus:ring-gray-950 disabled:bg-gray-50 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full inline-flex items-center justify-center rounded-sm bg-gray-900 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting || loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    Creating account...
                  </span>
                ) : (
                  'Sign Up'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-gray-950 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
