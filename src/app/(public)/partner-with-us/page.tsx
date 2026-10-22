import { Metadata } from 'next';
import { getPartnerWithUsData } from '@/lib/server/partner-with-us';
import { Container } from '@/components/ui/Container';
import { PartnerForm } from '@/components/partner/PartnerForm';

export const metadata: Metadata = {
  title: 'Partner With Us | Miio',
  description: 'A more considered way to manage your property.',
};

export default async function PartnerWithUsPage() {
  const data = await getPartnerWithUsData({ cache: 'no-store' });

  return (
    <div className="min-h-screen bg-[#FEF6EE] pt-[48px] pb-24">
      <Container>
        <div className="mb-12 text-left">
          <h1 className="font-serif text-[36px] md:text-[44px] text-[#1B1A17] tracking-tight leading-tight mb-4">
            {data?.headline || 'Partner With Us'}
          </h1>
          <p className="font-sans text-[15px] md:text-[16px] text-[#5F4E44] w-full font-light leading-[1.6]">
            {data?.problem || 'A more considered way to manage your property.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          <div className="flex flex-col gap-4 max-w-xl">
            <h2 className="text-2xl font-serif text-[#1B1A17]">Let&apos;s talk</h2>
            <p className="font-sans text-[15px] leading-[1.6] text-[#5F4E44]">
              {data?.solution || 'Fill out the form to get in touch with our partnerships team. We’re excited to explore how we can work together.'}
            </p>
          </div>
          
          <div className="w-full flex justify-start md:justify-end">
            <div className="w-full max-w-[500px] bg-white rounded-[8px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-[#1B1A17]/10 p-8 md:p-10">
              <PartnerForm />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
