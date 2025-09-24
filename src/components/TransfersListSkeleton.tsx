import { Skeleton } from '@/components/ui/skeleton';

export function TransfersListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="w-32 h-8" /> {/* Back button */}
        <Skeleton className="w-48 h-7" /> {/* Title */}
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div>
                <Skeleton className="w-24 h-4 mb-1" />
                <Skeleton className="w-16 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton className="flex-1 h-10" /> {/* Search */}
        <Skeleton className="w-40 h-10" /> {/* Status filter */}
      </div>

      {/* Table Card Skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 mb-4 pb-3 border-b border-gray-100">
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
            <Skeleton className="h-4" />
          </div>

          {/* Table Rows */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="grid grid-cols-6 gap-4 py-3 border-b border-gray-50 last:border-b-0">
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-20 h-4" />
              <Skeleton className="w-32 h-4" />
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-20 h-5 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
