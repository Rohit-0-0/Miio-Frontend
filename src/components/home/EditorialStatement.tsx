import { EditorialStatementSection } from '@/types/homepage';

export function EditorialStatement({ statement }: { statement: EditorialStatementSection }) {
  if (!statement) return null;
  return (
    <div className="bg-[#F8F5EF] h-full p-10 md:p-16 flex flex-col justify-center items-center text-center space-y-12">
      <h2 className="text-3xl md:text-5xl font-serif text-[#1B1A17] leading-tight">
        {statement.heading}
      </h2>
      <p className="text-lg md:text-xl font-light text-[#1B1A17]/80 leading-relaxed max-w-md mx-auto">
        {statement.description}
      </p>
    </div>
  );
}
