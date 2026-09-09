import { EditorialStatementSection } from '@/types/homepage';
import { HOME_DEFAULTS } from '@/lib/defaults/home';

export function EditorialStatement({ statement }: { statement: EditorialStatementSection }) {
  const heading = statement?.heading || HOME_DEFAULTS.editorialStatement.heading;
  const description = statement?.description || HOME_DEFAULTS.editorialStatement.description;

  return (
    <div className="flex flex-col justify-center items-center text-center space-y-[35px]">
      <h2 className="text-3xl md:text-[36px] font-serif text-[#1B1A17] leading-tight max-w-[800px] mx-auto">
        {heading}
      </h2>
      <p className="text-base md:text-[15px] font-light text-[#1B1A17] leading-relaxed max-w-[700px] mx-auto">
        {description}
      </p>
      
      <div className="pt-6">
        <a 
          href="/properties" 
          className="bg-[#1B1A17] text-white px-8 py-3 rounded-full font-medium text-[14px] hover:bg-black transition-colors whitespace-nowrap inline-flex items-center justify-center"
        >
          View all stays
        </a>
      </div>
    </div>
  );
}
