import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';

export function PartnerCTA() {
  return (
    <Section className="bg-white py-20 md:py-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center flex flex-col items-center">
          <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Partner With Us
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
            Own a premium property? Join our exclusive portfolio and let our expert team handle the details while you enjoy the returns. We partner with homeowners who share our dedication to quality and design.
          </p>
          <Link
            href={ROUTES.PARTNERS}
            className="inline-flex items-center justify-center rounded-sm bg-gray-900 px-8 py-4 text-base font-medium text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
          >
            Learn About Partnership
          </Link>
        </div>
      </Container>
    </Section>
  );
}
