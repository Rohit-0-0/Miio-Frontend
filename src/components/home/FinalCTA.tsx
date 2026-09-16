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
    'py-[40px] md:py-[120px]',
    className || 'bg-[#E1DBC3]',
  ].join(' ');

  return (
    <section className={sectionClassName}>
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 xl:px-[188px] flex flex-col items-center text-center gap-[16px] md:gap-[24px]">
        <h2 className="text-[24px] md:text-[44px] font-serif font-normal text-[#241D19] leading-[108%] m-0">
          {heading}
        </h2>

        {description && (
          <p className="font-sans text-[14px] md:text-[17px] font-normal text-[#5F4E44] max-w-2xl leading-[140%] m-0 px-2 md:px-0">
            {description}
          </p>
        )}

        <div>
          <Link
            href={buttonLink}
            className="font-sans inline-flex items-center justify-center bg-[#241D19] text-[#FEF6EE] px-[32px] py-[16px] text-[14px] font-medium transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#241D19] focus-visible:ring-offset-2 focus-visible:ring-offset-[#E1DBC3] rounded-full"
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}
