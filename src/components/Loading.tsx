export default function Loading() {
  return (
    <div className="flex motion-safe:animate-pulse space-x-4">
      <div className="flex-1 space-y-6 py-1">
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-20 h-3 rounded bg-gray-200"></div>
            <div className="col-span-15 h-3 rounded bg-gray-200"></div>
            <div className="col-span-10 h-3 rounded bg-gray-200"></div>
            <div className="col-span-17 h-3 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
