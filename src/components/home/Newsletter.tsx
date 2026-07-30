import { Container } from '@/components/ui/Container';
import { NewsletterSection } from '@/types/homepage';

export function Newsletter({ newsletter }: { newsletter: NewsletterSection }) {
  if (!newsletter) return null;

  return (
    <section className="relative w-full py-24 md:py-32 bg-gray-900 overflow-hidden">
      <Container className="relative z-10">
        <div className="mx-auto max-w-2xl text-center flex flex-col items-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
            {newsletter.heading}
          </h2>
          {newsletter.description && (
            <p className="text-lg text-gray-300 mb-10 max-w-xl">
              {newsletter.description}
            </p>
          )}
          
          <form className="w-full max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-4 py-3.5 rounded-sm bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
              required 
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-sm bg-white px-8 py-3.5 text-base font-medium text-gray-900 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 whitespace-nowrap"
            >
              {newsletter.ctaText || 'Subscribe'}
            </button>
          </form>
          <p className="mt-4 text-xs text-gray-500">
            By subscribing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </Container>
    </section>
  );
}
