import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { TestimonialsSection } from '@/types/homepage';
import { AppImage } from '@/components/media/AppImage';

function StarRating({ rating }: { rating: number }) {
  const stars = Array.from({ length: 5 }).map((_, index) => {
    const filled = index < Math.round(rating);
    return (
      <svg
        key={index}
        className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    );
  });
  
  return <div className="flex space-x-1">{stars}</div>;
}

export function Testimonials({ testimonials }: { testimonials: TestimonialsSection }) {
  if (!testimonials || !testimonials.items || testimonials.items.length === 0) return null;

  return (
    <Section className="bg-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
            {testimonials.title}
          </h2>
          {testimonials.subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {testimonials.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.items.map((item, index) => {
            return (
              <div key={item.id || index} className="bg-gray-50 p-8 rounded-sm flex flex-col h-full border border-gray-100">
                <div className="mb-6">
                  <StarRating rating={item.rating ?? 5} />
                </div>
                <blockquote className="flex-1 text-gray-700 text-lg italic mb-8">
                  "{item.testimonial}"
                </blockquote>
                <div className="flex items-center space-x-4">
                  {item.avatar?.assetId ? (
                    <div className="w-12 h-12 rounded-full flex-shrink-0 relative overflow-hidden">
                      <AppImage 
                        image={item.avatar}
                        alt={item.customerName || 'Customer avatar'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold flex-shrink-0">
                      {item.customerName?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-gray-900">{item.customerName}</div>
                    {item.location && (
                      <div className="text-sm text-gray-500">{item.location}</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
