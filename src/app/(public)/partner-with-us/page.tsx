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
        <div className="mb-16 border-b border-[#1B1A17]/10 pb-12 text-left">
          <h1 className="font-serif text-[40px] md:text-[56px] text-[#1B1A17] tracking-tight leading-tight mb-4">
            {data?.headline || 'Partner With Us'}
          </h1>
          <p className="font-sans text-[15px] md:text-[16px] text-[#5F4E44] w-full max-w-2xl font-light leading-[1.6]">
            {data?.problem || 'Subscribe to learn how Miio can work for you.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-serif text-[#1B1A17]">Let&apos;s talk</h2>
            <p className="font-sans text-[15px] leading-[1.6] text-[#5F4E44]">
              {data?.solution || 'Fill out the form to get in touch with our partnerships team. We’re excited to explore how we can work together.'}
            </p>
          </div>
          
          <div className="flex justify-start md:justify-end">
            <PartnerForm />
          </div>
        </div>
      </Container>
    </div>
  );
}
