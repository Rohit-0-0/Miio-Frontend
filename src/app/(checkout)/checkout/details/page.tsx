import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getPropertyById } from '@/lib/server/property';
import { PropertyDetails } from '@/types/property';
import { Logo } from '@/components/layout/Logo';
import { PaymentLogos } from '@/components/layout/PaymentLogos';
import { DetailsFlow } from '@/components/checkout/DetailsFlow';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function DetailsPage({ searchParams }: Props) {
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
      {/* Checkout Header (Step 2 Active) */}
      <header className="w-full pt-8 pb-4">
        <div className="flex justify-center mb-6">
          <Logo image={siteSettings?.logo} className="text-[#1B1A17]" />
        </div>
        <div className="border-t border-[#1B1A17]/10">
          <div className="max-w-[1440px] mx-auto px-4 md:px-[188px] flex justify-between items-center py-4 text-xs tracking-wider">
            <a href={`/checkout?${new URLSearchParams(resolvedParams as any).toString()}`} className="text-[#7D7975] hover:text-black transition-colors uppercase">
              &larr; Back to {property.nickname || property.title}
            </a>
            <div className="flex items-center gap-4 uppercase">
              <a href={`/checkout?${new URLSearchParams(resolvedParams as any).toString()}`} className="text-[#7D7975] hover:text-black transition-colors">1 Dates</a>
              <span className="opacity-40 text-[#7D7975]">-</span>
              <span className="text-[#1B1A17] font-bold">2 Details</span>
              <span className="opacity-40 text-[#7D7975]">-</span>
              <span className="opacity-50 text-[#7D7975]">3 Pay</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content scaffold */}
      <main className="flex-1">
        <div className="max-w-[1440px] mx-auto px-4 md:px-[188px] pt-12 pb-24">
          <DetailsFlow 
            property={property as any}
            searchParams={resolvedParams as any}
            paymentTrustImages={(siteSettings?.paymentTrustImages?.length > 0) ? siteSettings.paymentTrustImages : footerLogos}
            cmsContent={siteSettings?.checkoutTunnel}
          />
        </div>
      </main>

      {/* Checkout Footer */}
      <footer className="w-full bg-[#1B1A17] text-white py-8 mt-auto">
        <div className="max-w-[1440px] mx-auto px-4 md:px-[188px] flex flex-col md:flex-row justify-between items-center text-xs">
          <div className="flex gap-4 text-white/60 mb-4 md:mb-0">
            <span>© Stay with Miio. All rights reserved.</span>
            <a href="/terms" className="hover:text-white">Terms</a>
            <a href="/privacy" className="hover:text-white">Privacy</a>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2 [&_img]:!h-[20px] [&_img:first-child]:!h-[20px]">
               <PaymentLogos images={footerLogos} isFooter={true} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
