import React from 'react';
import { ScrollToTopOnNavigate } from '@/components/checkout/ScrollToTopOnNavigate';

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FEF6EE]">
      <ScrollToTopOnNavigate />
      {children}
    </div>
  );
}
