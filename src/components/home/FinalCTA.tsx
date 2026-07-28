import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { Container } from '@/components/ui/Container';

export function FinalCTA() {
  return (
    <section className="relative w-full py-32 md:py-48 lg:py-56 overflow-hidden">
      {/* Background Image Placeholder */}
      <div className="absolute inset-0 z-0 bg-gray-900">
        {/* We would use Next/Image here later */}
        <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80')] bg-cover bg-center mix-blend-multiply" />
      </div>

      <Container className="relative z-10">
        <div className="mx-auto max-w-2xl text-center flex flex-col items-center">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-8 leading-tight">
            Ready for your next getaway?
          </h2>
          <Link
            href={ROUTES.BOOKING}
            className="inline-flex items-center justify-center rounded-sm bg-white px-10 py-4 text-base font-medium text-gray-900 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 shadow-lg"
          >
            Book Your Stay
          </Link>
        </div>
      </Container>
    </section>
  );
}
