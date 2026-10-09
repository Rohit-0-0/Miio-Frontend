'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api/client';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await apiClient.post<any>('/newsletter/subscribe', { 
        email, 
        source: 'Newsletter Signup' 
      });
      if (response.success) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
        setErrorMessage(response.error || 'Failed to subscribe');
      }
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Network error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex w-full max-w-[400px] h-[44px] bg-[#FEF6EE] rounded-full p-[3px] items-center justify-center">
        <span className="text-[12px] font-medium text-[#1B1A17]">Thanks for subscribing!</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[400px]">
      <form 
        className="flex w-full h-[44px] bg-[#FEF6EE] rounded-full p-[3px] pl-6 items-center" 
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col flex-1 justify-center items-start space-y-0.5 w-full">
          <label className="text-[10px] font-normal text-[#7D7975] uppercase tracking-wider leading-none text-left w-full">Email</label>
          <input 
            type="email" 
            placeholder="you@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            className="bg-transparent border-none p-0 text-[14px] font-normal text-[#1B1A17] placeholder:text-[#7D7975]/70 focus:outline-none focus:ring-0 leading-none h-[14px] w-full text-left"
          />
        </div>
        <button 
          type="submit"
          disabled={status === 'loading'}
          className="bg-[#C3BA8D] text-[#1B1A17] w-[93px] h-[38px] rounded-full text-[14px] font-medium hover:bg-[#b0a77f] transition-colors flex items-center justify-center p-0 disabled:opacity-50"
        >
          {status === 'loading' ? '...' : 'Sign up'}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-red-500 text-[10px] mt-1 ml-4">{errorMessage}</p>
      )}
    </div>
  );
}
