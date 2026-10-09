import Link from 'next/link';
import Image from 'next/image';
import { getHomepage } from '@/lib/server/homepage';
import { NewsletterForm } from './NewsletterForm';
import { PaymentLogos } from '@/components/layout/PaymentLogos';
import { editorialService } from '@/services/about.service';
import { buildImageUrl } from '@/lib/media/buildImageUrl';

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
    { label: 'Partner With Us', href: '/partner' },
    { label: 'Interior Design & Property Styling', href: '/interior-design' }
  ];

  const col1 = hasLinks ? allLinks.slice(0, 5) : fallbackCol1;
  const col2 = hasLinks ? allLinks.slice(5) : fallbackCol2;

  const newsletterHeading = homepage?.newsletter?.heading || 'Join the Miio Club for 10% off your first stay.';

  const socialLinks = homepage?.socialLinks || [];
  const whatsappNumber = homepage?.whatsappNumber || '';
  const newsletterIcon = homepage?.newsletter?.icon;
  const newsletterIconUrl = buildImageUrl(newsletterIcon?.asset?._ref);

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
              <div className="flex gap-4 items-start">
                {newsletterIconUrl && (
                  <div className="shrink-0 mt-1">
                    <Image src={newsletterIconUrl} alt="Newsletter Icon" width={24} height={48} className="object-contain w-auto h-12" />
                  </div>
                )}
                <h3 className="text-[28px] font-serif font-normal text-white leading-[108%] m-0">
                  {newsletterHeading.split('\n').map((line: string, i: number) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </h3>
              </div>
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

          {/* Row 2: Payment Logos & Socials */}
          <div className="flex flex-row justify-between items-end w-full mb-[40px]">
            <div className="flex w-auto justify-start">
              <PaymentLogos images={partnerLogos} isFooter={true} />
            </div>

            <div className="flex gap-16">
              {whatsappNumber && (
                <div className="flex flex-col gap-3">
                  <span className="font-sans text-[12px] text-white/80 uppercase tracking-wide">Contact us</span>
                  <a href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity flex items-center justify-center w-8 h-8 rounded-full border border-white/20">
                    <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  </a>
                </div>
              )}
              {socialLinks.length > 0 && (
                <div className="flex flex-col gap-3">
                  <span className="font-sans text-[12px] text-white/80 uppercase tracking-wide">Connect</span>
                  <div className="flex gap-4">
                    {socialLinks.map((link: any, i: number) => {
                      const iconUrl = buildImageUrl(link.icon?.asset?._ref);
                      return (
                        <a key={i} href={link.url} target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity block">
                          {iconUrl ? (
                            <Image src={iconUrl} alt={link.platform} width={24} height={24} className="object-contain w-6 h-6" />
                          ) : (
                            <span className="text-sm">{link.platform}</span>
                          )}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Row 3: Copyright */}
          <div className="w-full flex justify-center mt-10">
            <p className="font-sans text-[14px] font-normal leading-[23px] text-[#FEF6EE]/60 m-0 text-center">
              © Stay with Miio. All rights reserved.
            </p>
          </div>
        </div>

        {/* === MOBILE LAYOUT === */}
        <div className="flex md:hidden flex-col items-center text-center gap-[48px] w-full">
          {/* Newsletter Form */}
          <div className="flex flex-col gap-[20px] w-full items-center">
            {newsletterIconUrl && (
              <div className="shrink-0 mb-2">
                <Image src={newsletterIconUrl} alt="Newsletter Icon" width={24} height={48} className="object-contain w-auto h-12" />
              </div>
            )}
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
          
          <div className="flex flex-col items-center gap-8 w-full border-t border-[#FEF6EE]/10 pt-8 mt-4">
            {/* Contact & Socials */}
            <div className="flex gap-16 justify-center w-full">
              {whatsappNumber && (
                <div className="flex flex-col items-center gap-3">
                  <span className="font-sans text-[12px] text-white/80 uppercase tracking-wide">Contact us</span>
                  <a href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity flex items-center justify-center w-8 h-8 rounded-full border border-white/20">
                    <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  </a>
                </div>
              )}
              {socialLinks.length > 0 && (
                <div className="flex flex-col items-center gap-3">
                  <span className="font-sans text-[12px] text-white/80 uppercase tracking-wide">Connect</span>
                  <div className="flex gap-4">
                    {socialLinks.map((link: any, i: number) => {
                      const iconUrl = buildImageUrl(link.icon?.asset?._ref);
                      return (
                        <a key={i} href={link.url} target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity block">
                          {iconUrl ? (
                            <Image src={iconUrl} alt={link.platform} width={24} height={24} className="object-contain w-6 h-6" />
                          ) : (
                            <span className="text-sm">{link.platform}</span>
                          )}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Payment Logos */}
            <div className="w-full flex justify-center mt-4">
              <PaymentLogos images={partnerLogos} isFooter={true} />
            </div>
          </div>

          {/* Copyright */}
          <div className="w-full flex justify-center border-t border-[#FEF6EE]/10 pt-8 mt-[-16px]">
            <p className="font-sans text-[14px] font-normal leading-[23px] text-[#FEF6EE]/60 m-0 text-center">
              © Stay with Miio. All rights reserved.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
