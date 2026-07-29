import { Metadata } from 'next';

export const dynamic = 'force-dynamic';
import { getPartnerData } from '@/lib/server/partner';
import { ErrorState } from '@/components/shared/ErrorState';
import { EmptyState } from '@/components/shared/EmptyState';
import { AppImage } from '@/components/media/AppImage';

export const metadata: Metadata = {
  title: 'Partner With Us | Miio',
  description: 'Join Miio as a partner and help us redefine luxury hospitality.',
};

export default async function PartnersPage() {
  let partnerData;
  let errorMsg = null;

  try {
    const response = await getPartnerData();
    if (response.success && response.data) {
      partnerData = response.data;
    } else {
      errorMsg = 'Failed to load Partner data';
    }
  } catch (e: unknown) {
    errorMsg = e instanceof Error ? e.message : 'An unexpected error occurred';
  }

  if (errorMsg) {
    return (
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4">
        <ErrorState title="Unable to Load Page" message={errorMsg} />
      </div>
    );
  }

  if (!partnerData) {
    return (
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4">
        <EmptyState title="Page Not Found" description="The Partner page content is currently unavailable." />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="pt-40 pb-20 px-4 bg-gray-50 text-center">
        <h1 className="text-4xl md:text-6xl font-light text-gray-900 tracking-tight">{partnerData.title || 'Partner With Us'}</h1>
        {partnerData.subtitle && (
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto font-light">
            {partnerData.subtitle}
          </p>
        )}
      </section>

      {/* Partners List */}
      {partnerData.partners && partnerData.partners.length > 0 && (
        <section className="py-24 bg-white px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              {partnerData.partners.map((partner, i) => {
                return (
                  <div key={i} className="flex justify-center">
                    {partner.url ? (
                      <a href={partner.url} target="_blank" rel="noopener noreferrer" className="block transition-transform hover:scale-105">
                        {partner.logo?.assetId ? (
                          <div className="relative w-40 h-20">
                            <AppImage image={partner.logo} alt={partner.name} fill className="object-contain" />
                          </div>
                        ) : (
                          <span className="text-xl font-bold text-gray-400">{partner.name}</span>
                        )}
                      </a>
                    ) : (
                      <div className="block">
                        {partner.logo?.assetId ? (
                          <div className="relative w-40 h-20">
                            <AppImage image={partner.logo} alt={partner.name} fill className="object-contain" />
                          </div>
                        ) : (
                          <span className="text-xl font-bold text-gray-400">{partner.name}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
