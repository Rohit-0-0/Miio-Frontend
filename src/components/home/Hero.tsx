import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { Container } from '@/components/ui/Container';

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-white pt-24 pb-16 md:pt-32 md:pb-24">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content (Order 2 on Mobile, 1 on Desktop) */}
          <div className="flex flex-col space-y-6 order-2 md:order-1">
            <span className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              Welcome to Miio
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
              A New Standard <br /> in Hospitality
            </h1>
            <p className="text-lg text-gray-600 max-w-md leading-relaxed">
              Experience the perfect blend of luxury, comfort, and thoughtful design in our exclusive properties around the world.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href={ROUTES.BOOKING}
                className="inline-flex items-center justify-center rounded-sm bg-gray-900 px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
              >
                Book a Stay
              </Link>
              <Link
                href="/properties"
                className="inline-flex items-center justify-center rounded-sm bg-gray-100 px-8 py-3.5 text-base font-medium text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
              >
                Explore Properties
              </Link>
            </div>
          </div>

          {/* Image (Order 1 on Mobile, 2 on Desktop) */}
          <div className="order-1 md:order-2 w-full aspect-[4/5] md:aspect-square relative overflow-hidden rounded-sm bg-gray-100">
            {/* Using a placeholder div for image for now to keep it lightweight. Next/image can be added later. */}
            <div className="absolute inset-0 bg-gray-200 w-full h-full flex items-center justify-center text-gray-400">
              <span>Placeholder Image</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
