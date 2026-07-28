export function SkeletonCard() {
  return (
    <div className="group flex flex-col h-full animate-pulse">
      <div className="relative w-full aspect-[4/3] md:aspect-[3/2] overflow-hidden rounded-sm bg-gray-200 mb-6" />
      <div className="flex flex-col flex-grow space-y-4">
        <div className="h-3 w-1/4 bg-gray-200 rounded" />
        <div className="h-6 w-3/4 bg-gray-200 rounded" />
        <div className="space-y-2 flex-grow">
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-2/3 bg-gray-200 rounded" />
        </div>
        <div className="mt-auto h-4 w-24 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
