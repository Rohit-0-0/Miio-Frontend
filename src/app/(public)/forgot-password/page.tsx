"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Container } from '@/components/ui/Container';
import { authService } from '@/services/auth.service';

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await authService.forgotPassword({ email });
      toast.success('Reset link sent!', { description: 'Please check your email for the OTP.' });
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      console.error(err);
      toast.error('Request failed', { description: err?.message || 'Failed to send reset link.' });
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
              Account Recovery
            </span>
            <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-gray-900">
              Forgot your password?
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Enter your email address and we&apos;ll send you a 6-digit code to reset your password.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                disabled={isSubmitting}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:border-gray-950 focus:ring-1 focus:ring-gray-950 disabled:bg-gray-50 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || !email}
                className="w-full inline-flex items-center justify-center rounded-sm bg-gray-900 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Code'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Remembered your password?{' '}
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
