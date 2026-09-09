'use client';

export function NewsletterForm() {
  return (
    <form className="flex w-full max-w-[400px] bg-[#FEF6EE] rounded-full p-2 pl-6 items-center" onSubmit={(e) => e.preventDefault()}>
      <div className="flex flex-col flex-1 justify-center space-y-0.5">
        <label className="text-[10px] font-medium text-[#7D7975] uppercase tracking-widest">Email</label>
        <input 
          type="email" 
          placeholder="you@email.com"
          required
          className="bg-transparent border-none p-0 text-[14px] text-[#1B1A17] placeholder:text-[#7D7975]/70 focus:outline-none focus:ring-0"
        />
      </div>
      <button 
        type="submit"
        className="bg-[#E1DBC3] text-[#1B1A17] px-8 py-3.5 rounded-full text-[14px] font-medium hover:bg-[#D5CEB5] transition-colors"
      >
        Sign up
      </button>
    </form>
  );
}
