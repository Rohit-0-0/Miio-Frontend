import Link from 'next/link';
import { NAVIGATION } from '@/constants/routes';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#F8F5EF] pt-24 pb-12" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-16 md:gap-8 mb-24">
          <div className="flex flex-col space-y-8">
            <span className="text-4xl md:text-6xl font-serif text-[#1B1A17] tracking-wider">MiiO</span>
            <p className="text-sm font-medium tracking-widest uppercase text-[#1B1A17]/60 max-w-xs">
              A premium stay experience designed to connect you with the essentials of living well.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24 w-full md:w-auto">
            <div className="flex flex-col space-y-6">
              <h3 className="text-xs font-semibold text-[#1B1A17] tracking-[0.2em] uppercase">
                Explore
              </h3>
              <ul className="flex flex-col space-y-4">
                {NAVIGATION.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm font-medium tracking-widest uppercase text-[#1B1A17]/80 hover:text-[#1B1A17] transition-colors focus-visible:outline-none focus-visible:underline rounded-sm"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col space-y-6">
              <h3 className="text-xs font-semibold text-[#1B1A17] tracking-[0.2em] uppercase">
                Connect
              </h3>
              <ul className="flex flex-col space-y-4">
                <li>
                  <a
                    href="mailto:hello@staywithmiio.com"
                    className="text-sm font-medium tracking-widest uppercase text-[#1B1A17]/80 hover:text-[#1B1A17] transition-colors focus-visible:outline-none focus-visible:underline rounded-sm"
                  >
                    Email Us
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium tracking-widest uppercase text-[#1B1A17]/80 hover:text-[#1B1A17] transition-colors focus-visible:outline-none focus-visible:underline rounded-sm"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-col space-y-6 col-span-2 md:col-span-1">
              <h3 className="text-xs font-semibold text-[#1B1A17] tracking-[0.2em] uppercase">
                Legal
              </h3>
              <ul className="flex flex-col space-y-4">
                <li>
                  <Link
                    href="/terms"
                    className="text-sm font-medium tracking-widest uppercase text-[#1B1A17]/80 hover:text-[#1B1A17] transition-colors focus-visible:outline-none focus-visible:underline rounded-sm"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm font-medium tracking-widest uppercase text-[#1B1A17]/80 hover:text-[#1B1A17] transition-colors focus-visible:outline-none focus-visible:underline rounded-sm"
                  >
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-[#1B1A17]/10 pt-8 flex flex-col items-center text-center">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#1B1A17]/40">
            &copy; {currentYear} Miio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
