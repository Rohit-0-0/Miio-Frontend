import Link from 'next/link';
import { NAVIGATION } from '@/constants/routes';
import { getHomepage } from '@/lib/server/homepage';
import { NewsletterForm } from './NewsletterForm';

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const homepage = await getHomepage();
  // Provide defaults if not yet populated in Sanity
  const partnerTags = (homepage?.footerTags && homepage.footerTags.length > 0) 
    ? homepage.footerTags 
    : ['GUESTY', 'STRIPE', 'AIRBNB', 'BOOKING.COM', 'SSL SECURED', 'KLAVIYO'];

  return (
    <footer className="shrink-0 bg-[#241D19] text-[#FEF6EE] pt-[40px] pb-[60px] md:py-[65px] transform-gpu will-change-transform" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 xl:px-[188px] w-full">
        
        {/* === MOBILE LAYOUT === */}
        <div className="flex md:hidden flex-col gap-[38px] w-full">
          {/* Mobile Newsletter */}
          <div className="flex flex-col gap-[14px] w-full items-center text-center">
            <h3 className="text-[24px] font-serif font-normal text-white leading-[108%] m-0">
              {homepage?.newsletter?.heading?.split('\n').map((line: string, i: number) => (
                <span key={i}>
                  {line}
                  <br className="hidden" />
                </span>
              ))}
            </h3>
            <NewsletterForm />
          </div>

          {/* Mobile Partner Tags */}
          {partnerTags && partnerTags.length > 0 && (
            <div className="flex flex-wrap justify-center items-center gap-[8px]">
              {partnerTags.map((tag: string, idx: number) => (
                <div key={idx} className="font-sans px-[12px] py-[6px] border border-white/20 rounded-full text-[12px] font-normal leading-[130%] tracking-normal uppercase text-white/70">
                  {tag}
                </div>
              ))}
            </div>
          )}

          {/* Mobile Navigation Links */}
          <div className="flex flex-col items-center text-center gap-[32px] pt-2">
            {(() => {
              const allLinks = homepage?.footerColumns?.flatMap((col: any) => col.links) || [];
              if (allLinks.length > 0) {
                return (
                  <ul className="flex flex-col gap-[12px]">
                    {allLinks.map((link: any, lidx: number) => (
                      <li key={lidx}>
                        <Link href={link.href || '#'} className="font-sans text-[14px] leading-[18px] text-white hover:opacity-80 transition-opacity">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <ul className="flex flex-col gap-[12px]">
                  <li><Link href="/sitemap" className="font-sans text-[14px] leading-[18px] text-white hover:opacity-80 transition-opacity">Site map</Link></li>
                  <li><Link href="/stays" className="font-sans text-[14px] leading-[18px] text-white hover:opacity-80 transition-opacity">Stays</Link></li>
                  <li><Link href="/locations" className="font-sans text-[14px] leading-[18px] text-white hover:opacity-80 transition-opacity">Locations</Link></li>
                  <li><Link href="/journal" className="font-sans text-[14px] leading-[18px] text-white hover:opacity-80 transition-opacity">Journal</Link></li>
                  <li><Link href="/about" className="font-sans text-[14px] leading-[18px] text-white hover:opacity-80 transition-opacity">About</Link></li>
                  <li><Link href="/owners" className="font-sans text-[14px] leading-[18px] text-white hover:opacity-80 transition-opacity">Owners</Link></li>
                  <li><Link href="/partner" className="font-sans text-[14px] leading-[18px] text-white hover:opacity-80 transition-opacity">Partner With Us</Link></li>
                </ul>
              );
            })()}
          </div>
        </div>

        {/* === DESKTOP LAYOUT === */}
        <div className="hidden md:grid grid-cols-6 gap-y-[90px] w-full">
          {/* Row 1: Partner Tags */}
          {partnerTags && partnerTags.map((tag: string, idx: number) => (
            <div key={idx} className="col-span-1 flex justify-start">
              <div className="font-sans px-[12px] py-[6px] border border-white/20 rounded-full text-[12px] font-normal leading-[130%] tracking-normal uppercase text-white/70 whitespace-nowrap">
                {tag}
              </div>
            </div>
          ))}
          {/* Fill empty columns if tags < 6 */}
          {Array.from({ length: Math.max(0, 6 - (partnerTags?.length || 0)) }).map((_, i) => (
            <div key={`empty-tag-${i}`} className="col-span-1"></div>
          ))}

          {/* Row 2: Links (Col 1-3) and Newsletter (Col 4-6) */}
          {(() => {
            const allLinks = homepage?.footerColumns?.flatMap((col: any) => col.links) || [];
            const hasLinks = allLinks.length > 0;
            const fallbackCol1 = [
              { label: 'Site map', href: '/sitemap' },
              { label: 'Stays', href: '/stays' },
              { label: 'Locations', href: '/locations' },
              { label: 'Journal', href: '/journal' },
              { label: 'About', href: '/about' }
            ];
            const fallbackCol2 = [
              { label: 'Owners', href: '/owners' },
              { label: 'Partner With Us', href: '/partner' }
            ];

            const col1 = hasLinks ? allLinks.slice(0, 5) : fallbackCol1;
            const col2 = hasLinks ? allLinks.slice(5) : fallbackCol2;

            return (
              <div className="col-span-3 flex gap-[64px] justify-start">
                {/* Link Column 1 */}
                <ul className="flex flex-col gap-[12px]">
                  {col1.map((link: any, i: number) => (
                    <li key={i}>
                      <Link href={link.href || '#'} className="font-sans text-[14px] leading-[18px] text-white hover:opacity-80 transition-opacity whitespace-nowrap">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                {/* Link Column 2 */}
                <ul className="flex flex-col gap-[12px]">
                  {col2.map((link: any, i: number) => (
                    <li key={i}>
                      <Link href={link.href || '#'} className="font-sans text-[14px] leading-[18px] text-white hover:opacity-80 transition-opacity whitespace-nowrap">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })()}

          {/* Newsletter Form */}
          <div className="col-span-3 flex flex-col gap-[14px] w-full max-w-[400px] justify-self-end text-left">
            <h3 className="text-[28px] font-serif font-normal text-white leading-[108%] m-0">
              {homepage?.newsletter?.heading?.split('\n').map((line: string, i: number) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </h3>
            <NewsletterForm />
          </div>
        </div>

      </div>
      
      {/* Bottom Row (Standalone outside grid) */}
      <div className="w-full flex justify-center pt-10 pb-4">
        <p className="font-sans text-[12px] font-normal leading-[130%] text-white/70 m-0">
          Stay with Miio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
