'use client';

export function NewsletterForm() {
  return (
    <form className="flex w-full max-w-[400px] h-[44px] bg-[#FEF6EE] rounded-full p-[3px] pl-6 items-center" onSubmit={(e) => e.preventDefault()}>
      <div className="flex flex-col flex-1 justify-center items-start space-y-0.5 w-full">
        <label className="text-[10px] font-normal text-[#7D7975] uppercase tracking-wider leading-none text-left w-full">Email</label>
        <input 
          type="email" 
          placeholder="you@email.com"
          required
          className="bg-transparent border-none p-0 text-[14px] font-normal text-[#1B1A17] placeholder:text-[#7D7975]/70 focus:outline-none focus:ring-0 leading-none h-[14px] w-full text-left"
        />
      </div>
      <button 
        type="submit"
        className="bg-[#C3BA8D] text-[#1B1A17] w-[93px] h-[38px] rounded-full text-[14px] font-medium hover:bg-[#b0a77f] transition-colors flex items-center justify-center p-0"
      >
        Sign up
      </button>
    </form>
  );
}
