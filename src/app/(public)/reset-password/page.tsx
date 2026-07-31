"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Container } from '@/components/ui/Container';
import { authService } from '@/services/auth.service';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !otp || !password || !confirmPassword) return;

    if (otp.length !== 6) {
      toast.error('Invalid OTP', { description: 'OTP must be exactly 6 digits.' });
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match', { description: 'Please make sure both passwords are the same.' });
      return;
    }

    if (password.length < 8) {
      toast.error('Password too short', { description: 'Password must be at least 8 characters long.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.resetPassword({ email, otp, password });
      toast.success('Password reset!', { description: 'Your password has been successfully changed.' });
      router.push('/login');
    } catch (err: any) {
      console.error(err);
      toast.error('Reset failed', { description: err?.message || 'Invalid or expired OTP.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white px-8 py-10 shadow-sm border border-gray-100 rounded-sm">
      <div className="mb-8 text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Account Recovery
        </span>
        <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-gray-900">
          Set new password
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Enter the 6-digit code we sent you and choose a new password.
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
          <label htmlFor="otp" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            6-Digit Code
          </label>
          <input
            id="otp"
            type="text"
            required
            maxLength={6}
            disabled={isSubmitting}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
            className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:border-gray-950 focus:ring-1 focus:ring-gray-950 tracking-widest text-center text-lg disabled:bg-gray-50 transition-colors"
            placeholder="000000"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            New Password
          </label>
          <input
            id="password"
            type="password"
            required
            disabled={isSubmitting}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:border-gray-950 focus:ring-1 focus:ring-gray-950 disabled:bg-gray-50 transition-colors"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            disabled={isSubmitting}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-sm border border-gray-200 px-4 py-3 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:border-gray-950 focus:ring-1 focus:ring-gray-950 disabled:bg-gray-50 transition-colors"
            placeholder="••••••••"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting || otp.length !== 6 || password.length < 8}
            className="w-full inline-flex items-center justify-center rounded-sm bg-gray-900 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Reset Password'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <section className="flex flex-1 items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <Container className="max-w-md w-full">
        <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </Container>
    </section>
  );
}
