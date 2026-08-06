import { EditorialStatementSection } from '@/types/homepage';
import { HOME_DEFAULTS } from '@/lib/defaults/home';

export function EditorialStatement({ statement }: { statement: EditorialStatementSection }) {
  const heading = statement?.heading || HOME_DEFAULTS.editorialStatement.heading;
  const description = statement?.description || HOME_DEFAULTS.editorialStatement.description;

  return (
    <div className="bg-[#F8F5EF] h-full p-10 md:p-16 flex flex-col justify-center items-center text-center space-y-12">
      <h2 className="text-3xl md:text-5xl font-serif text-[#1B1A17] leading-tight">
        {heading}
      </h2>
      <p className="text-lg md:text-xl font-light text-[#1B1A17]/80 leading-relaxed max-w-md mx-auto">
        {description}
      </p>
    </div>
  );
}
