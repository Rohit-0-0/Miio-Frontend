import { TrustSection } from '@/types/homepage';
import { HOME_DEFAULTS } from '@/lib/defaults/home';

export function Trust({ trust }: { trust: TrustSection }) {
  const heading = trust?.heading || HOME_DEFAULTS.trust.heading;
  const rating = trust?.rating || HOME_DEFAULTS.trust.rating;
  const reviewCount = trust?.reviewCount || HOME_DEFAULTS.trust.reviewCount;
  const verifiedText = trust?.verifiedText || HOME_DEFAULTS.trust.verifiedText;
  const items = trust?.items?.length ? trust.items : HOME_DEFAULTS.trust.items;

  return (
    <section className="bg-white border-y border-gray-100 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 flex flex-col items-center text-center space-y-16">
        <div className="flex flex-col items-center space-y-6 max-w-2xl">
          <div className="flex items-center space-x-1 text-[#1B1A17]">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
          <h2 className="text-3xl md:text-5xl font-serif text-[#1B1A17]">{heading}</h2>
          <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-2 sm:space-y-0 text-sm md:text-base font-medium tracking-widest uppercase text-[#1B1A17]/60">
            <span>{rating} Rating</span>
            <span className="hidden sm:block">•</span>
            <span>{reviewCount} Reviews</span>
            <span className="hidden sm:block">•</span>
            <span>{verifiedText}</span>
          </div>
        </div>

        {items && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 w-full pt-12 border-t border-gray-100">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col items-center space-y-4">
                {item.icon && (
                  <div 
                    className="w-8 h-8 text-[#1B1A17]/40 mb-2"
                    dangerouslySetInnerHTML={{ __html: item.icon }} 
                  />
                )}
                <h3 className="text-lg font-medium tracking-widest uppercase text-[#1B1A17]">{item.title}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
