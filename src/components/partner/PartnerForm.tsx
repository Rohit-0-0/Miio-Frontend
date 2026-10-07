'use client';

import React, { useState } from 'react';
import { apiClient } from '@/lib/api/client';

export function PartnerForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg(null);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;

    try {
      const response = await apiClient.post<any>('/newsletter/subscribe', {
        email,
        firstName,
        lastName,
        source: 'Partner Form'
      });

      if (response.success) {
        setStatusMsg({ type: 'success', text: "Thank you! We'll be in touch soon." });
        (e.target as HTMLFormElement).reset();
      } else {
        setStatusMsg({ type: 'error', text: response.error || 'Something went wrong. Please try again.' });
      }
    } catch (error: any) {
      setStatusMsg({ type: 'error', text: error.message || 'Network error. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[500px]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-2">
        <label htmlFor="firstName" className="font-sans text-[15px] text-[#241D19]">First name</label>
        <input 
          type="text" 
          id="firstName" 
          name="firstName" 
          className="w-full bg-transparent border-b border-[#241D19]/20 pb-2 pt-2 text-[#241D19] font-sans text-[16px] focus:outline-none focus:border-[#241D19] transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="lastName" className="font-sans text-[15px] text-[#241D19]">Last name</label>
        <input 
          type="text" 
          id="lastName" 
          name="lastName" 
          className="w-full bg-transparent border-b border-[#241D19]/20 pb-2 pt-2 text-[#241D19] font-sans text-[16px] focus:outline-none focus:border-[#241D19] transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="font-sans text-[15px] text-[#241D19]">Email *</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          required
          className="w-full bg-transparent border-b border-[#241D19]/20 pb-2 pt-2 text-[#241D19] font-sans text-[16px] focus:outline-none focus:border-[#241D19] transition-colors"
        />
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-[#241D19] text-[#FEF6EE] px-10 py-3 rounded-full font-sans text-[14px] uppercase tracking-wide hover:bg-[#241D19]/80 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
        {statusMsg && (
          <span className={`text-[14px] font-sans ${statusMsg.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
            {statusMsg.text}
          </span>
        )}
      </div>
    </form>
    </div>
  );
}
