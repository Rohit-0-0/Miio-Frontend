import type { ComponentProps } from 'react';
import { PaymentLogos } from '@/components/layout/PaymentLogos';
import { LegalLinks } from '@/components/legal/LegalLinks';

interface CheckoutFooterProps {
  footerLogos?: ComponentProps<typeof PaymentLogos>['images'];
  className?: string;
}

export function CheckoutFooter({ footerLogos = [], className = '' }: CheckoutFooterProps) {
  return (
    <footer className={`w-full bg-[#1B1A17] text-white py-8 ${className}`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 xl:px-[188px] flex flex-col md:flex-row justify-between items-center text-xs">
        <div className="flex items-center gap-4 order-1 md:order-2 mb-6 md:mb-0">
          <div className="flex gap-2 [&_img]:!h-[20px] [&_img:first-child]:!h-[20px]">
            <PaymentLogos images={footerLogos} isFooter={true} />
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-white/60 order-2 md:order-1">
          <span>© Stay with Miio. All rights reserved.</span>
          <LegalLinks
            openInNewTab
            className="flex gap-4 mt-1 md:mt-0"
            linkClassName="hover:text-white transition-colors"
          />
        </div>
      </div>
    </footer>
  );
}
