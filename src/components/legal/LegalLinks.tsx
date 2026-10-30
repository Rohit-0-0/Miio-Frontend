import Link from 'next/link';
import { getFooterLegalLinks, legalPageHref } from '@/lib/server/legal';

interface LegalLinksProps {
  className?: string;
  linkClassName?: string;
  openInNewTab?: boolean;
}

export async function LegalLinks({ className, linkClassName, openInNewTab = false }: LegalLinksProps) {
  const links = await getFooterLegalLinks();
  if (links.length === 0) return null;

  const targetProps = openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <nav aria-label="Legal" className={className}>
      {links.map((link) => (
        <Link key={link.slug} href={legalPageHref(link.slug)} className={linkClassName} {...targetProps}>
          {link.title}
        </Link>
      ))}
    </nav>
  );
}
