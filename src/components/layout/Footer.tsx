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
    <footer className="bg-[#1B1A17] text-[#FEF6EE] pt-[65px] pb-[65px]" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="max-w-[1440px] mx-auto px-4 md:px-[188px] grid grid-cols-1 md:grid-cols-2 gap-y-12 md:gap-y-[36px] w-full">
        
        {/* Partner Tags Row (Desktop: Top, Mobile: Middle) */}
        {partnerTags && partnerTags.length > 0 && (
          <div className="order-2 md:order-1 md:col-span-2 flex flex-wrap justify-center md:justify-between items-center gap-3 md:gap-4 pb-2">
            {partnerTags.map((tag: string, idx: number) => (
              <div key={idx} className="px-6 py-2 border border-[#FEF6EE]/20 rounded-full text-[11px] uppercase tracking-widest text-[#FEF6EE]">
                {tag}
              </div>
            ))}
          </div>
        )}

        {/* Navigation Links (Desktop: Left, Mobile: Bottom) */}
        <div className="order-3 md:order-2 grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-x-12 lg:gap-x-24 w-full md:w-auto text-center md:text-left pt-4">
          {homepage?.footerColumns && homepage.footerColumns.length > 0 ? (
            homepage.footerColumns.map((col, idx) => (
              <ul key={idx} className="flex flex-col space-y-4">
                {col.links.map((link: any, lidx: number) => (
                  <li key={lidx}>
                    <Link href={link.href} className="text-[13px] text-[#FEF6EE] hover:opacity-80 transition-opacity">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ))
          ) : (
            <>
              <ul className="flex flex-col space-y-4">
                <li>
                  <Link href="/sitemap" className="text-[13px] text-[#FEF6EE] hover:opacity-80 transition-opacity">Site map</Link>
                </li>
                <li>
                  <Link href="/stays" className="text-[13px] text-[#FEF6EE] hover:opacity-80 transition-opacity">Stays</Link>
                </li>
                <li>
                  <Link href="/locations" className="text-[13px] text-[#FEF6EE] hover:opacity-80 transition-opacity">Locations</Link>
                </li>
                <li>
                  <Link href="/journal" className="text-[13px] text-[#FEF6EE] hover:opacity-80 transition-opacity">Journal</Link>
                </li>
                <li>
                  <Link href="/about" className="text-[13px] text-[#FEF6EE] hover:opacity-80 transition-opacity">About</Link>
                </li>
              </ul>

              <ul className="flex flex-col space-y-4">
                <li>
                  <Link href="/owners" className="text-[13px] text-[#FEF6EE] hover:opacity-80 transition-opacity">Owners</Link>
                </li>
                <li>
                  <Link href="/partner" className="text-[13px] text-[#FEF6EE] hover:opacity-80 transition-opacity">Partner With Us</Link>
                </li>
              </ul>
            </>
          )}
        </div>
        
        {/* Newsletter Section (Desktop: Right, Mobile: Top) */}
        <div className="order-1 md:order-3 flex flex-col space-y-6 w-full md:max-w-md mx-auto md:mx-0 text-center md:text-left justify-self-end">
          <h3 className="text-[28px] md:text-[28px] font-serif text-[#FEF6EE] leading-tight">
            {homepage?.newsletter?.heading?.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                <br className="hidden md:block" />
              </span>
            ))}
          </h3>
          <NewsletterForm />
        </div>
          
        {/* Bottom Row */}
        <div className="order-4 md:col-span-2 flex flex-col items-center justify-center pt-4">
          <p className="text-[13px] text-[#FEF6EE]/80">
            &copy; Stay with Miio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
