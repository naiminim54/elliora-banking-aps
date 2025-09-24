import { Skeleton } from '@/components/ui/skeleton';

export function TransactionsListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton className="w-20 h-8" /> {/* Back button */}
        </div>
        <div>
          <Skeleton className="w-32 h-6 mb-1" /> {/* Title */}
          <Skeleton className="w-24 h-4" /> {/* Subtitle */}
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="flex-1 h-11" /> {/* Search input */}
          <Skeleton className="w-40 h-11" /> {/* Select */}
          <Skeleton className="w-32 h-11" /> {/* Sort button */}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <Skeleton className="w-48 h-6" />
            <Skeleton className="w-24 h-5" />
          </div>
        </div>

        {/* Table Header */}
        <div className="px-6 py-3 bg-gray-50/50 border-b border-gray-100">
          <div className="grid grid-cols-6 gap-4">
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
          </div>
        </div>

        {/* Table Rows */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="px-6 py-4 border-b border-gray-100 last:border-b-0">
            <div className="grid grid-cols-6 gap-4 items-center">
              <Skeleton className="w-12 h-4" />
              <div className="flex items-center space-x-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div>
                  <Skeleton className="w-24 h-4 mb-1" />
                  <Skeleton className="w-20 h-3" />
                </div>
              </div>
              <Skeleton className="w-20 h-4" />
              <Skeleton className="w-16 h-4" />
              <div>
                <Skeleton className="w-16 h-4 mb-1" />
                <Skeleton className="w-12 h-3" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="w-4 h-4 rounded-full" />
                <Skeleton className="w-16 h-5 rounded-full" />
              </div>
            </div>
          </div>
        ))}

        {/* Pagination Skeleton */}
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <Skeleton className="w-32 h-8" />
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="w-8 h-8" />
              ))}
            </div>
            <Skeleton className="w-20 h-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
