'use client';

export function NewsletterForm() {
  return (
    <form className="flex flex-col sm:flex-row gap-3 w-full pt-2" onSubmit={(e) => e.preventDefault()}>
      <input 
        type="email" 
        placeholder="Email address"
        required
        className="bg-transparent border-b border-white/20 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors w-full sm:w-auto flex-1 text-white placeholder:text-white/50"
      />
      <button 
        type="submit"
        className="bg-[#C4A997] text-white px-8 py-3 text-sm font-medium tracking-widest uppercase transition-opacity hover:opacity-90 whitespace-nowrap"
      >
        Subscribe
      </button>
    </form>
  );
}
