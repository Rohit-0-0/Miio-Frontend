import Link from 'next/link';
import { FinalCtaSection } from '@/types/homepage';
import { HOME_DEFAULTS } from '@/lib/defaults/home';

type FinalCtaDefaults = {
  heading: string;
  description: string;
  buttonText: string;
  buttonLink: string;
};

export function FinalCTA({
  finalCta,
  defaults = HOME_DEFAULTS.finalCta,
  /** Optional Tailwind classes. Use to override bg on a single page. */
  className,
}: {
  finalCta?: FinalCtaSection | null;
  defaults?: FinalCtaDefaults;
  className?: string;
}) {
  const heading = finalCta?.heading || defaults.heading;
  const description = finalCta?.description || defaults.description;
  const buttonText = finalCta?.buttonText || defaults.buttonText;
  const buttonLink = finalCta?.buttonLink || defaults.buttonLink;

  // Default bg for Home / Properties. Pass `className` to override on a single page.
  const sectionClassName = [
    'py-[60px] md:py-[120px]',
    className || 'bg-[#E1DBC3]',
  ].join(' ');

  return (
    <section className={sectionClassName}>
      <div className="max-w-[1440px] mx-auto px-4 md:px-[188px] flex flex-col items-center text-center space-y-6">
        <h2 className="text-4xl md:text-[44px] font-serif text-[#1B1A17] leading-tight">
          {heading}
        </h2>

        {description && (
          <p className="font-sans text-base md:text-[17px] font-light text-[#1B1A17]/80 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}

        <div className="pt-6">
          <Link
            href={buttonLink}
            className="font-sans inline-flex items-center justify-center bg-[#1B1A17] text-white px-8 py-3.5 text-[15px] font-medium transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B1A17] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FEF6EE] rounded-full"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}
