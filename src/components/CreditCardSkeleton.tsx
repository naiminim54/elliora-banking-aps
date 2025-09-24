import { Skeleton } from '@/components/ui/skeleton';

export function CreditCardSkeleton() {
  return (
    <div className="group">
      {/* Credit Card Skeleton */}
      <div className="relative w-full h-48 rounded-2xl bg-gradient-to-br from-gray-300 to-gray-400 p-6 shadow-2xl">
        {/* Card Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Skeleton className="w-6 h-6 bg-gray-200/50" />
            <Skeleton className="w-24 h-4 bg-gray-200/50" />
          </div>
          <Skeleton className="w-8 h-8 rounded-full bg-gray-200/50" />
        </div>

        {/* Card Number */}
        <div className="mb-6">
          <Skeleton className="w-48 h-5 bg-gray-200/50" />
        </div>

        {/* Card Bottom */}
        <div className="flex items-end justify-between">
          <div>
            <Skeleton className="w-20 h-3 bg-gray-200/50 mb-2" />
            <Skeleton className="w-32 h-6 bg-gray-200/50" />
          </div>
          <div className="text-right">
            <Skeleton className="w-12 h-3 bg-gray-200/50 mb-1" />
            <Skeleton className="w-8 h-4 bg-gray-200/50" />
          </div>
        </div>

        {/* Card Chip */}
        <div className="absolute top-6 right-6 w-8 h-6 bg-gray-200/50 rounded animate-pulse"></div>
      </div>

      {/* Action Buttons Skeleton */}
      <div className="mt-4 flex items-center space-x-3">
        <Skeleton className="flex-1 h-10" />
        <Skeleton className="flex-1 h-10" />
        <Skeleton className="w-10 h-10" />
      </div>
    </div>
  );
}
