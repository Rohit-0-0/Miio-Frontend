import { TrustSection } from '@/types/homepage';
import { HOME_DEFAULTS } from '@/lib/defaults/home';

export function Trust({ trust }: { trust: TrustSection }) {
  const heading = trust?.heading || HOME_DEFAULTS.trust.heading;
  const rating = trust?.rating || HOME_DEFAULTS.trust.rating;
  const reviewCount = trust?.reviewCount || HOME_DEFAULTS.trust.reviewCount;
  const verifiedText = trust?.verifiedText || HOME_DEFAULTS.trust.verifiedText;
  const items = trust?.items?.length ? trust.items : HOME_DEFAULTS.trust.items;

  return (
    <section className="w-full bg-[#E1DBC3] border-y border-[#5F4E442E]">
      <div className="max-w-[1440px] mx-auto h-[54px] flex items-center justify-center px-4 md:px-[187.5px]">
        <div className="font-sans flex flex-row items-center justify-center gap-2 md:gap-[16px] text-[#1B1A17] flex-wrap">
          <span className="font-medium text-sm tracking-wide">Rated {rating}</span>
          
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className="w-[14px] h-[14px] fill-current" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
          
          <span className="hidden md:inline text-sm font-medium">{reviewCount}</span>
          
          <div className="flex items-center">
            <span className="text-xs bg-white/50 px-3 py-1 rounded-full border border-[#5F4E442E]">
              {verifiedText}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
