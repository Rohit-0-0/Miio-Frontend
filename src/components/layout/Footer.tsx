import Link from 'next/link';
import { getHomepage } from '@/lib/server/homepage';
import { NewsletterForm } from './NewsletterForm';
import { PaymentLogos } from '@/components/layout/PaymentLogos';
import { editorialService } from '@/services/about.service';

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const homepage = await getHomepage();
  
  let siteSettings: any = null;
  try {
    const settingsReq = await editorialService.getSiteSettings();
    if (settingsReq?.success) {
      siteSettings = settingsReq.data;
    }
  } catch (err) {
    console.error('Failed to fetch site settings:', err);
  }

  // Use the homepage footerLogos (which maps to the Footer singleton in the CMS)
  const partnerLogos = homepage?.footerLogos || [];

  const allLinks = homepage?.footerColumns?.flatMap((col: any) => col.links) || [];
  const hasLinks = allLinks.length > 0;
  
  // Fallback links matching Figma if Sanity isn't set up yet
  const fallbackCol1 = [
    { label: 'Site map', href: '/sitemap' },
    { label: 'Stays', href: '/stays' },
    { label: 'Locations', href: '/locations' },
    { label: 'Journal', href: '/journal' },
    { label: 'About', href: '/about' }
  ];
  const fallbackCol2 = [
    { label: 'Partner With Us', href: '/partner' }
  ];

  const col1 = hasLinks ? allLinks.slice(0, 5) : fallbackCol1;
  const col2 = hasLinks && allLinks.length > 5 ? allLinks.slice(5) : fallbackCol2;

  const newsletterHeading = homepage?.newsletter?.heading || 'Join the Miio Club for 10% off your first stay.';

  return (
    <footer className="shrink-0 bg-[#241D19] text-[#FEF6EE] pt-[60px] pb-[40px] md:pt-[65px] md:pb-[65px] transform-gpu will-change-transform" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 xl:px-[188px] w-full">
        
        {/* === DESKTOP LAYOUT === */}
        <div className="hidden md:flex flex-col w-full">
          
          {/* Row 1: Newsletter & Links */}
          <div className="flex flex-row justify-between items-start w-full mb-[60px] xl:mb-[90px]">
            {/* LEFT: Newsletter */}
            <div className="flex flex-col gap-[14px] w-full max-w-[400px]">
              <h3 className="text-[28px] font-serif font-normal text-white leading-[108%] m-0">
                {newsletterHeading.split('\n').map((line: string, i: number) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </h3>
              <NewsletterForm />
            </div>

            {/* RIGHT: Navigation Links */}
            <div className="flex gap-[64px] justify-end w-auto">
              <ul className="flex flex-col gap-[12px]">
                {col1.map((link: any, i: number) => (
                  <li key={i}>
                    <Link href={link.href || '#'} className="font-sans text-[14px] leading-[18px] text-white hover:opacity-80 transition-opacity whitespace-nowrap">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {col2.length > 0 && (
                <ul className="flex flex-col gap-[12px]">
                  {col2.map((link: any, i: number) => (
                    <li key={i}>
                      <Link href={link.href || '#'} className="font-sans text-[14px] leading-[18px] text-white hover:opacity-80 transition-opacity whitespace-nowrap">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Row 2: Payment Logos */}
          <div className="flex w-full mb-[40px] justify-start">
            <PaymentLogos images={partnerLogos} isFooter={true} />
          </div>

          {/* Row 3: Copyright */}
          <div className="w-full flex justify-center">
            <p className="font-sans text-[14px] font-normal leading-[23px] text-[#FEF6EE] m-0 text-center">
              © Stay with Miio. All rights reserved.
            </p>
          </div>
        </div>

        {/* === MOBILE LAYOUT === */}
        <div className="flex md:hidden flex-col items-center text-center gap-[48px] w-full">
          {/* Newsletter Form */}
          <div className="flex flex-col gap-[20px] w-full">
            <h3 className="text-[28px] font-serif font-normal text-white leading-[108%] m-0">
              {newsletterHeading}
            </h3>
            <NewsletterForm />
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-[32px] items-center w-full">
            <ul className="flex flex-col gap-[16px]">
              {[...col1, ...col2].map((link: any, i: number) => (
                <li key={i}>
                  <Link href={link.href || '#'} className="font-sans text-[16px] leading-[20px] text-white hover:opacity-80 transition-opacity whitespace-nowrap">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Logos */}
          <div className="w-full flex justify-center">
            <PaymentLogos images={partnerLogos} isFooter={true} />
          </div>

          {/* Copyright */}
          <div className="w-full flex justify-center border-t border-[#FEF6EE]/10 pt-8 mt-[-16px]">
            <p className="font-sans text-[14px] font-normal leading-[23px] text-[#FEF6EE] m-0 text-center">
              © Stay with Miio. All rights reserved.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
