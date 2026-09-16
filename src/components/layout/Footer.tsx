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
      <div className="max-w-[1440px] mx-auto px-5 md:px-[188px] flex flex-col md:grid md:grid-cols-2 gap-[38px] md:gap-[36px] w-full">
        
        {/* Newsletter Section (Mobile: Top, Desktop: Middle Right) */}
        <div className="md:order-3 flex flex-col gap-[14px] w-full md:max-w-md mx-auto md:mx-0 text-center md:text-left justify-self-end">
          <h3 className="text-[24px] md:text-[28px] font-serif font-normal text-white leading-[108%] m-0">
            {homepage?.newsletter?.heading?.split('\n').map((line: string, i: number) => (
              <span key={i}>
                {line}
                <br className="hidden md:block" />
              </span>
            ))}
          </h3>
          <NewsletterForm />
        </div>

        {/* Partner Tags Row (Mobile: Middle Top, Desktop: Top Row) */}
        {partnerTags && partnerTags.length > 0 && (
          <div className="md:order-1 md:col-span-2 flex flex-wrap justify-center md:justify-between items-center gap-[8px] md:gap-4">
            {partnerTags.map((tag: string, idx: number) => (
              <div key={idx} className="font-sans px-[12px] py-[6px] border border-white/20 rounded-full text-[12px] font-normal leading-[130%] tracking-normal uppercase text-white/70">
                {tag}
              </div>
            ))}
          </div>
        )}

        {/* Navigation Links (Mobile: Middle Bottom, Desktop: Middle Left) */}
        <div className="md:order-2 flex flex-col items-center md:items-start justify-start w-full md:w-auto text-center md:text-left gap-2 md:gap-6 pt-2">
          {homepage?.footerColumns && homepage.footerColumns.length > 0 ? (
            homepage.footerColumns.map((col: any, idx: number) => (
              <ul key={idx} className="flex flex-col space-y-2">
                {col.links.map((link: any, lidx: number) => (
                  <li key={lidx}>
                    <Link href={link.href || '#'} className="font-sans text-[13px] text-white hover:opacity-80 transition-opacity">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ))
          ) : (
            <>
              <ul className="flex flex-col space-y-2">
                <li><Link href="/sitemap" className="font-sans text-[13px] text-white hover:opacity-80 transition-opacity">Site map</Link></li>
                <li><Link href="/stays" className="font-sans text-[13px] text-white hover:opacity-80 transition-opacity">Stays</Link></li>
                <li><Link href="/locations" className="font-sans text-[13px] text-white hover:opacity-80 transition-opacity">Locations</Link></li>
                <li><Link href="/journal" className="font-sans text-[13px] text-white hover:opacity-80 transition-opacity">Journal</Link></li>
                <li><Link href="/about" className="font-sans text-[13px] text-white hover:opacity-80 transition-opacity">About</Link></li>
              </ul>
              <ul className="flex flex-col space-y-2">
                <li><Link href="/owners" className="font-sans text-[13px] text-white hover:opacity-80 transition-opacity">Owners</Link></li>
                <li><Link href="/partner" className="font-sans text-[13px] text-white hover:opacity-80 transition-opacity">Partner With Us</Link></li>
              </ul>
            </>
          )}
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
