import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';

export function AboutPreview() {
  return (
    <Section className="bg-white">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Image Column */}
          <div className="w-full aspect-square md:aspect-[4/5] relative overflow-hidden rounded-sm bg-gray-100">
            <div className="absolute inset-0 bg-gray-200 w-full h-full flex items-center justify-center text-gray-400">
              <span>Placeholder Image</span>
            </div>
          </div>
          
          {/* Text Column */}
          <div className="flex flex-col space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Redefining the <br className="hidden lg:block" /> Art of Living
            </h2>
            
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>
                At Miio, we believe that where you stay should be as inspiring as why you travel. We curate spaces that celebrate thoughtful design, blending contemporary aesthetics with enduring comfort to create a sanctuary away from home.
              </p>
              <p>
                Every property in our collection is meticulously selected and maintained to the highest standards. From the moment you step through the door, you&apos;ll experience a level of care and attention to detail that transforms a simple stay into a memorable retreat.
              </p>
              <p>
                Our commitment extends beyond beautiful interiors. We embrace sustainable practices and foster connections with local communities, ensuring our presence enriches both our guests and the neighborhoods we call home.
              </p>
            </div>
            
            <div className="pt-6">
              <Link
                href={ROUTES.ABOUT}
                className="inline-flex items-center text-base font-medium text-gray-900 hover:text-gray-600 transition-colors focus-visible:outline-none focus-visible:underline rounded-sm"
              >
                Learn More About Miio
                <span className="ml-2" aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
