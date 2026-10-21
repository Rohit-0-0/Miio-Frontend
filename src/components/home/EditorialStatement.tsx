import Link from 'next/link';
import { EditorialStatementSection } from '@/types/homepage';
import { HOME_DEFAULTS } from '@/lib/defaults/home';

export function EditorialStatement({ statement }: { statement: EditorialStatementSection }) {
  const heading = statement?.heading || HOME_DEFAULTS.editorialStatement.heading;
  const description = statement?.description || HOME_DEFAULTS.editorialStatement.description;
  const buttonText = statement?.buttonText || statement?.ctaText || HOME_DEFAULTS.editorialStatement.cta.text;
  const buttonLink = statement?.buttonLink || statement?.ctaLink || HOME_DEFAULTS.editorialStatement.cta.href;

  return (
    <div className="flex flex-col justify-center items-center text-center gap-[20px] md:gap-[35px]">
      <h2 className="text-[24px] md:text-[36px] font-serif font-normal text-[#1B1A17] leading-[115%] md:leading-[112%] max-w-[1020px] mx-auto">
        {heading}
      </h2>
      <p className="font-sans text-[14px] md:text-[15px] font-normal text-[#5F4E44] leading-[140%] max-w-[760px] mx-auto">
        {description}
      </p>
      
      <div>
        <Link 
          href={buttonLink} 
          className="font-sans bg-[#241D19] text-[#FEF6EE] px-8 h-[52px] rounded-full font-medium text-[14px] hover:bg-black transition-colors whitespace-nowrap inline-flex items-center justify-center shadow-sm"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}
