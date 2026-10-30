import Link from 'next/link';
import { PortableText, type PortableTextBlock, type PortableTextComponents } from 'next-sanity';

const paragraphClass = 'font-sans text-[15px] md:text-[16px] text-[#5F4E44] font-light leading-[1.7]';

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className={`${paragraphClass} mb-5 last:mb-0`}>{children}</p>,
    h3: ({ children }) => (
      <h3 className="font-serif text-[22px] text-[#1B1A17] leading-snug tracking-tight mt-8 mb-3 first:mt-0">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-sans text-[15px] font-semibold text-[#1B1A17] uppercase tracking-wider mt-6 mb-2 first:mt-0">{children}</h4>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-5 space-y-2 mb-5 last:mb-0">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-5 space-y-2 mb-5 last:mb-0">{children}</ol>,
  },
  listItem: ({ children }) => <li className={paragraphClass}>{children}</li>,
  marks: {
    strong: ({ children }) => <strong className="font-medium text-[#1B1A17]">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const href: string = value?.href || '#';
      const className = 'text-[#99583D] underline underline-offset-4 hover:text-[#1B1A17] transition-colors';
      const targetProps = value?.blank ? { target: '_blank', rel: 'noopener noreferrer' } : {};

      if (href.startsWith('/')) {
        return (
          <Link href={href} className={className} {...targetProps}>
            {children}
          </Link>
        );
      }

      return (
        <a href={href} className={className} {...targetProps}>
          {children}
        </a>
      );
    },
  },
};

export function PortableTextBody({ value }: { value?: PortableTextBlock[] }) {
  if (!value?.length) return null;
  return <PortableText value={value} components={components} />;
}
