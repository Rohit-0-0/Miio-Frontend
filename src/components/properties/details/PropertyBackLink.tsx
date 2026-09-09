import Link from 'next/link';

export function PropertyBackLink() {
  return (
    <Link
      href="/properties"
      className="inline-flex items-center gap-2 text-[14px] text-[#1B1A17]/70 hover:text-[#1B1A17] transition-colors mb-6"
    >
      <span aria-hidden>←</span>
      Back to stays
    </Link>
  );
}