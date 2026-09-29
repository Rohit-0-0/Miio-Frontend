import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getPropertyById } from '@/lib/server/property';
import { PropertyDetails } from '@/types/property';
import { Logo } from '@/components/layout/Logo';
import { StripeWrapper } from '@/components/checkout/StripeWrapper';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PaymentPage({ searchParams }: Props) {
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
    console.error('Failed to fetch property details:', error);
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
    console.error('Failed to fetch CMS:', err);
  }

  const footerLogos = homepage?.footerLogos || [];

  return (
    <div className="flex flex-col min-h-screen bg-[#FEF6EE]">
      {/* Checkout Header (Step 3 Active) */}
      <header className="w-full pt-8 pb-4">
        <div className="flex justify-center mb-6">
          <Logo image={siteSettings?.logo} className="text-[#1B1A17]" />
        </div>
        <div className="border-t border-[#1B1A17]/10">
          <div className="max-w-[1440px] mx-auto px-4 md:px-[188px] flex justify-between items-center py-4 text-xs tracking-wider">
            <a href={`/checkout/details?${new URLSearchParams(resolvedParams as any).toString()}`} className="text-[#7D7975] hover:text-black transition-colors uppercase">
              ← Back to {property.nickname || property.title}
            </a>
            <div className="flex gap-2 text-[10px] md:text-[12px] uppercase">
              <a href={`/checkout?${new URLSearchParams(resolvedParams as any).toString()}`} className="text-[#7D7975] hover:text-black transition-colors">1 Dates</a>
              <span className="text-[#1B1A17]/30">—</span>
              <a href={`/checkout/details?${new URLSearchParams(resolvedParams as any).toString()}`} className="text-[#7D7975] hover:text-black transition-colors">2 Details</a>
              <span className="text-[#1B1A17]/30">—</span>
              <span className="text-[#1B1A17] font-semibold">3 Pay</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-[188px] py-8 md:py-12">
        <Suspense fallback={<div className="animate-pulse h-96 bg-black/5 rounded-lg" />}>
          <StripeWrapper 
            property={property} 
            searchParams={resolvedParams}
            cmsContent={siteSettings?.checkoutTunnel}
          />
        </Suspense>
      </main>

      {/* Checkout Footer (Minimal) */}
      <footer className="w-full bg-[#1B1A17] text-white py-6">
        <div className="max-w-[1440px] mx-auto px-4 md:px-[188px] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[10px] text-white/50 tracking-wider">
            © Stay with Miio. All rights reserved. <a href="/terms" className="ml-4 hover:text-white transition-colors">Terms</a> <a href="/privacy" className="ml-4 hover:text-white transition-colors">Privacy</a>
          </div>
          {footerLogos.length > 0 && (
            <div className="flex gap-4 items-center">
              <span className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                SECURE CHECKOUT
              </span>
              {footerLogos.map((img: any, i: number) => {
                const src = img?.asset?.url || img?.asset?._ref || '';
                if (!src) return null;
                const url = src.startsWith('image-') ? `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${src.replace('image-', '').replace('-png', '.png').replace('-jpg', '.jpg').replace('-svg', '.svg')}` : src;
                return <img key={i} src={url} alt="footer logo" className="h-[20px] object-contain opacity-70" />;
              })}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
