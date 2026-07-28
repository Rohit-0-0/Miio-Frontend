import Link from 'next/link';

interface PropertyCardProps {
  id: string;
  name: string;
  location: string;
  description: string;
}

export function PropertyCard({ id, name, location, description }: PropertyCardProps) {
  return (
    <div className="group flex flex-col group h-full">
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-sm bg-gray-100 mb-6">
        <div className="absolute inset-0 bg-gray-200 w-full h-full flex items-center justify-center text-gray-400 transition-transform duration-500 group-hover:scale-105">
          <span>Placeholder Image</span>
        </div>
      </div>
      
      <div className="flex flex-col flex-grow">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
          {location}
        </span>
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">
          {name}
        </h3>
        <p className="text-sm text-gray-600 mb-6 flex-grow">
          {description}
        </p>
        
        <div className="mt-auto">
          <Link
            href={`/properties/${id}`}
            className="inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors focus-visible:outline-none focus-visible:underline rounded-sm"
          >
            View Property
            <span className="ml-2" aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
