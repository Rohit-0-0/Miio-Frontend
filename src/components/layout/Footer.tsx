import Link from 'next/link';
import { NAVIGATION } from '@/constants/routes';
import { getHomepage } from '@/lib/server/homepage';
import { NewsletterForm } from './NewsletterForm';

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const homepage = await getHomepage();
  const partnerLogos = homepage?.footerLogos || [];

  return (
    <footer className="bg-[#1B1A17] text-white pt-24 pb-12" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 md:gap-8 mb-24">
          
          {/* Newsletter Section */}
          <div className="flex flex-col space-y-6 md:max-w-md w-full">
            <h3 className="text-3xl font-serif">Miio Club</h3>
            <p className="text-xs font-medium tracking-widest uppercase text-white/60">
              Join the Miio Club for 10% off your first stay.
            </p>
            <NewsletterForm />
          </div>
          
          {/* Navigation Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 w-full md:w-auto">
            <div className="flex flex-col space-y-6">
              <h3 className="text-xs font-semibold text-white/40 tracking-[0.2em] uppercase">
                Explore
              </h3>
              <ul className="flex flex-col space-y-4">
                {NAVIGATION.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm font-medium tracking-widest uppercase text-white/80 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col space-y-6">
              <h3 className="text-xs font-semibold text-white/40 tracking-[0.2em] uppercase">
                Company
              </h3>
              <ul className="flex flex-col space-y-4">
                <li>
                  <Link href="/about" className="text-sm font-medium tracking-widest uppercase text-white/80 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/partner" className="text-sm font-medium tracking-widest uppercase text-white/80 hover:text-white transition-colors">
                    Partner With Us
                  </Link>
                </li>
                <li>
                  <Link href="/owners" className="text-sm font-medium tracking-widest uppercase text-white/80 hover:text-white transition-colors">
                    Owners
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col space-y-6">
              <h3 className="text-xs font-semibold text-white/40 tracking-[0.2em] uppercase">
                Connect
              </h3>
              <ul className="flex flex-col space-y-4">
                <li>
                  <a
                    href="mailto:hello@staywithmiio.com"
                    className="text-sm font-medium tracking-widest uppercase text-white/80 hover:text-white transition-colors"
                  >
                    Email Us
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium tracking-widest uppercase text-white/80 hover:text-white transition-colors"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Partner Logos */}
        {partnerLogos && partnerLogos.length > 0 && (
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 py-12 border-t border-white/10">
            {partnerLogos.map((logo: any, idx: number) => {
              const assetId = logo.asset?._ref || logo.asset?._id;
              if (!assetId) return null;
              return (
                <div key={idx} className="h-8 md:h-10 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
                  <img 
                    src={`/api/sanity/image?id=${assetId}`} 
                    alt={logo.alt || `Partner logo ${idx + 1}`}
                    className="h-full w-auto object-contain"
                  />
                </div>
              );
            })}
          </div>
        )}
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <span className="text-2xl font-serif text-white tracking-wider">MiiO</span>
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-white/40">
            &copy; {currentYear} Miio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
