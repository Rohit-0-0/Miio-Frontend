import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getPropertyById } from '@/lib/server/property';
import { PropertyDetails } from '@/types/property';
import { CheckoutFlow } from '@/components/checkout/CheckoutFlow';
import { Logo } from '@/components/layout/Logo';
import { PaymentLogos } from '@/components/layout/PaymentLogos';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CheckoutPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const propertyId = typeof resolvedParams.propertyId === 'string' ? resolvedParams.propertyId : undefined;

  if (!propertyId) {
    notFound();
  }

  let property: PropertyDetails | null = null;
  try {
    const res = await getPropertyById<PropertyDetails>(propertyId);
    if (res?.data) {
      property = res.data;
    }
  } catch (error) {
    console.error('Failed to fetch property details for checkout:', error);
  }

  if (!property) {
    notFound();
  }

  let siteSettings: any = null;
  let homepage: any = null;
  try {
    const { editorialService } = await import('@/services/about.service');
    const settingsReq = await editorialService.getSiteSettings();
    if (settingsReq?.success) {
      siteSettings = settingsReq.data;
    }
    const { getHomepage } = await import('@/lib/server/homepage');
    homepage = await getHomepage();
  } catch (err) {
    console.error('Failed to fetch site settings or homepage:', err);
  }

  const footerLogos = homepage?.footerLogos || [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Checkout Header */}
      <header className="w-full bg-[#FEF6EE] pt-8 pb-4">
        <div className="flex justify-center mb-6">
          <Logo image={siteSettings?.logo} className="text-[#1B1A17]" isLink={false} />
        </div>
        <div className="border-t border-[#1B1A17]/10">
          <div className="max-w-[1440px] mx-auto px-4 md:px-[188px] flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 py-4 text-[10px] sm:text-xs tracking-wider">
            <a 
              href={`/properties/${property.slug}?${new URLSearchParams({
                checkIn: (resolvedParams.checkIn as string) || '',
                checkOut: (resolvedParams.checkOut as string) || '',
                adults: (resolvedParams.adults as string) || '1',
                children: (resolvedParams.children as string) || '0',
                infants: (resolvedParams.infants as string) || '0',
                pets: (resolvedParams.pets as string) || '0',
              }).toString()}`} 
              className="text-[#7D7975] hover:text-black transition-colors uppercase font-medium text-center sm:text-left w-full sm:w-auto"
            >
              &larr; Back to {property.nickname || property.title}
            </a>
            <div className="flex items-center justify-between sm:justify-center w-full sm:w-auto gap-2 sm:gap-3 uppercase text-[9px] sm:text-[10px]">
              <span className="text-[#1B1A17] font-semibold whitespace-nowrap">1 Dates</span>
              <div className="h-[1px] bg-[#1B1A17]/20 flex-1 sm:w-8 sm:flex-none"></div>
              <span className="opacity-40 text-[#7D7975] whitespace-nowrap">2 Details</span>
              <div className="h-[1px] bg-[#1B1A17]/20 flex-1 sm:w-8 sm:flex-none"></div>
              <span className="opacity-40 text-[#7D7975] whitespace-nowrap">3 Pay</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-[#FEF6EE]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-[188px] pt-12 pb-24">
          <Suspense fallback={<div className="flex justify-center p-20"><div className="animate-pulse w-8 h-8 rounded-full border-2 border-[#C4A997] border-t-transparent" /></div>}>
            <CheckoutFlow 
              property={property} 
              searchParams={resolvedParams as any} 
              paymentTrustImages={siteSettings?.paymentTrustImages}
              cmsContent={siteSettings?.checkoutTunnel}
            />
          </Suspense>
        </div>
      </main>

      {/* Checkout Footer */}
      <footer className="w-full bg-[#1B1A17] text-white py-8">
        <div className="max-w-[1440px] mx-auto px-4 md:px-[188px] flex flex-col md:flex-row justify-between items-center text-xs">
          <div className="flex gap-4 text-white/60 mb-4 md:mb-0">
            <span>© Stay with Miio. All rights reserved.</span>
            <a href="/terms" className="hover:text-white">Terms</a>
            <a href="/privacy" className="hover:text-white">Privacy</a>
          </div>
          <div className="flex items-center gap-4">
            {/* Real Payment Logos from Sanity (which includes the Secure Checkout lock) */}
            <div className="flex gap-2 [&_img]:!h-[20px] [&_img:first-child]:!h-[20px]">
               <PaymentLogos images={footerLogos} isFooter={true} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
